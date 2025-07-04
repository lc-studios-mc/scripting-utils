import { console } from "./index.js";

/**
 * Type definitions for event handlers
 */
export type EventHandler<T = any, R = void> = (data: T) => R | Promise<R>;
export type EventMap = Record<string, any>;
export type EventReturnTypeMap<E extends EventMap> = Record<keyof E, any>;

/**
 * Options for event subscription
 */
export interface EventEmitterSubscribeOptions {
	/** Run the handler only once, then automatically unsubscribe */
	once?: boolean;
	/** Priority of the handler (higher numbers execute first) */
	priority?: number;
}

/**
 * Subscription object returned when subscribing to an event
 */
export interface EventSubscription {
	/** Unsubscribe from the event */
	unsubscribe: () => void;
	/** Pause the subscription temporarily */
	pause: () => void;
	/** Resume a paused subscription */
	resume: () => void;
	/** Check if subscription is currently active */
	isActive: () => boolean;
}

/**
 * Information about a handler error
 */
export interface EventEmissionError {
	/** The error that occurred */
	error: unknown;
	/** Index of the handler that failed */
	handlerIndex: number;
}

/**
 * Result of an async emission
 */
export interface AsyncEventEmissionResult<T> {
	/** Results from successful handlers */
	successful: T[];
	/** Information about failed handlers */
	failed: EventEmissionError[];
}

/**
 * Internal representation of a subscriber
 */
interface InternalSubscriber<T = any, R = any> {
	handler: EventHandler<T, R>;
	once: boolean;
	priority: number;
	active: boolean;
	id: number;
}

/**
 * A flexible and type-safe event emitter supporting synchronous and asynchronous event handling,
 * handler priorities, one-time subscriptions, and subscription management (pause/resume/unsubscribe).
 *
 * @example
 * // Define your event map
 * interface MyEvents {
 *   'user:login': { username: string };
 *   'user:logout': void;
 * }
 * interface MyReturns {
 *   'user:login': boolean;
 *   'user:logout': void;
 * }
 *
 * // Create an emitter instance
 * const emitter = new EventEmitter<MyEvents, MyReturns>();
 *
 * // Subscribe to an event
 * const sub = emitter.on('user:login', (data) => {
 *   console.log(`${data.username} logged in`);
 *   return true;
 * });
 *
 * // Emit an event synchronously
 * const results = emitter.emit('user:login', { username: 'alice' });
 * // results: [true]
 *
 * // Subscribe to an event only once
 * emitter.once('user:logout', () => {
 *   console.log('User logged out');
 * });
 *
 * // Emit asynchronously (supports async handlers)
 * await emitter.emitAsync('user:logout', undefined);
 *
 * // Pause and resume a subscription
 * sub.pause();
 * sub.resume();
 *
 * // Unsubscribe
 * sub.unsubscribe();
 */
export class EventEmitter<
	Events extends EventMap = Record<string, any>,
	EventReturns extends EventReturnTypeMap<Events> = Record<keyof Events, void>,
> {
	private subscribers: Map<keyof Events, InternalSubscriber[]> = new Map();
	private idCounter: number = 0;
	private isEmitting: Set<keyof Events> = new Set();
	private emissionStack: (keyof Events)[] = [];
	private maxEmissionDepth: number = 100;

	constructor(private onError: (error: unknown) => void = (e) => console.error(e)) {}

	/**
	 * Subscribe to an event
	 * @param eventName - Name of the event to subscribe to
	 * @param handler - Handler function to be called when the event is emitted
	 * @param options - Subscription options
	 * @returns Subscription object for controlling the subscription
	 */
	public on<K extends keyof Events>(
		eventName: K,
		handler: EventHandler<Events[K], EventReturns[K]>,
		options: EventEmitterSubscribeOptions = {},
	): EventSubscription {
		const { once = false, priority = 0 } = options;
		const id = this.idCounter++;

		const subscriber: InternalSubscriber<Events[K], EventReturns[K]> = {
			handler,
			once,
			priority,
			active: true,
			id,
		};

		if (!this.subscribers.has(eventName)) {
			this.subscribers.set(eventName, []);
		}

		const eventSubscribers = this.subscribers.get(eventName)!;

		// Use binary search for better performance with many subscribers
		if (eventSubscribers.length === 0) {
			eventSubscribers.push(subscriber);
		} else if (priority <= eventSubscribers[eventSubscribers.length - 1]!.priority) {
			// Common case: insert at end
			eventSubscribers.push(subscriber);
		} else if (priority > eventSubscribers[0]!.priority) {
			// Insert at beginning
			eventSubscribers.unshift(subscriber);
		} else {
			// Binary search for insertion point
			let left = 0;
			let right = eventSubscribers.length - 1;

			while (left <= right) {
				const mid = Math.floor((left + right) / 2);
				if (eventSubscribers[mid]!.priority >= priority) {
					left = mid + 1;
				} else {
					right = mid - 1;
				}
			}

			eventSubscribers.splice(left, 0, subscriber);
		}

		return {
			unsubscribe: () => this.off(eventName, id),
			pause: () => this.pauseSubscription(eventName, id),
			resume: () => this.resumeSubscription(eventName, id),
			isActive: () => this.isSubscriptionActive(eventName, id),
		};
	}

	/**
	 * Subscribe to an event and automatically unsubscribe after the first emission
	 * @param eventName - Name of the event to subscribe to
	 * @param handler - Handler function to be called when the event is emitted
	 * @param priority - Priority of the handler (higher numbers execute first)
	 * @returns Subscription object for controlling the subscription
	 */
	public once<K extends keyof Events>(
		eventName: K,
		handler: EventHandler<Events[K], EventReturns[K]>,
		priority = 0,
	): EventSubscription {
		return this.on(eventName, handler, { once: true, priority });
	}

	/**
	 * Emit an event synchronously and collect results.
	 *
	 * Note: If any registered handlers are `async` or return a `Promise`, the returned array
	 * will contain `Promise` objects for those handlers instead of their resolved values.
	 * For robust handling of async logic, use `emitAsync`.
	 *
	 * @param eventName - Name of the event to emit
	 * @param data - Data to pass to handlers
	 * @returns Array of results from all handlers.
	 */
	public emit<K extends keyof Events>(eventName: K, data: Events[K]): EventReturns[K][] {
		const subscribers = this.subscribers.get(eventName);
		if (!subscribers || subscribers.length === 0) {
			return [];
		}

		// Prevent direct and indirect recursive emissions
		if (this.isEmitting.has(eventName)) {
			this.safeOnError(
				new Error(`Direct recursive emission detected for event: ${String(eventName)}`),
			);
			return [];
		}

		// Check for indirect recursion (cyclical emissions)
		if (this.emissionStack.length >= this.maxEmissionDepth) {
			this.safeOnError(
				new Error(
					`Maximum emission depth exceeded. Possible cyclical emission involving: ${this.emissionStack.map(String).join(" -> ")}`,
				),
			);
			return [];
		}

		this.isEmitting.add(eventName);
		this.emissionStack.push(eventName);
		const toRemove: number[] = [];
		const results: EventReturns[K][] = [];

		try {
			// Create a snapshot to prevent modification during iteration
			const activeSubscribers = subscribers.filter((sub) => sub.active);

			for (const subscriber of activeSubscribers) {
				try {
					const result = subscriber.handler(data) as EventReturns[K];
					results.push(result);
				} catch (error) {
					this.safeOnError(error);
				}

				if (subscriber.once) {
					toRemove.push(subscriber.id);
				}
			}

			// Clean up 'once' subscribers
			this.cleanupOnceSubscribers(eventName, toRemove);
		} finally {
			this.isEmitting.delete(eventName);
			this.emissionStack.pop();
		}

		return results;
	}

	/**
	 * Emit an event with data and collect results, including from async handlers.
	 * This method ensures all handlers are executed, even if some fail.
	 * @param eventName - Name of the event to emit
	 * @param data - Data to pass to handlers
	 * @returns Promise that resolves with detailed results from all handlers.
	 */
	public async emitAsync<K extends keyof Events>(
		eventName: K,
		data: Events[K],
	): Promise<AsyncEventEmissionResult<EventReturns[K]>> {
		const subscribers = this.subscribers.get(eventName);
		if (!subscribers || subscribers.length === 0) {
			return { successful: [], failed: [] };
		}

		// Prevent direct and indirect recursive emissions
		if (this.isEmitting.has(eventName)) {
			this.safeOnError(
				new Error(`Direct recursive emission detected for event: ${String(eventName)}`),
			);
			return { successful: [], failed: [] };
		}

		// Check for indirect recursion (cyclical emissions)
		if (this.emissionStack.length >= this.maxEmissionDepth) {
			this.safeOnError(
				new Error(
					`Maximum emission depth exceeded. Possible cyclical emission involving: ${this.emissionStack.map(String).join(" -> ")}`,
				),
			);
			return { successful: [], failed: [] };
		}

		this.isEmitting.add(eventName);
		this.emissionStack.push(eventName);
		const handlerPromises: Array<Promise<EventReturns[K]>> = [];
		const toRemove: number[] = [];

		try {
			// Create a snapshot to prevent modification during iteration
			const activeSubscribers = subscribers.filter((sub) => sub.active);

			for (const subscriber of activeSubscribers) {
				if (subscriber.once) {
					toRemove.push(subscriber.id);
				}

				// Wrap handler execution in async function for unified error handling
				const handlerPromise = (async () => {
					return await subscriber.handler(data);
				})();

				handlerPromises.push(handlerPromise);
			}

			// Clean up 'once' subscribers before awaiting
			this.cleanupOnceSubscribers(eventName, toRemove);

			const settledResults = await Promise.allSettled(handlerPromises);
			const successful: EventReturns[K][] = [];
			const failed: EventEmissionError[] = [];

			for (let i = 0; i < settledResults.length; i++) {
				const result = settledResults[i]!;
				if (result.status === "fulfilled") {
					successful.push(result.value);
				} else {
					// A handler's promise was rejected.
					const error: EventEmissionError = {
						error: result.reason,
						handlerIndex: i,
					};
					failed.push(error);
					this.safeOnError(result.reason);
				}
			}

			return { successful, failed };
		} finally {
			this.isEmitting.delete(eventName);
			this.emissionStack.pop();
		}
	}

	/**
	 * Remove a specific subscriber by ID or all subscribers for an event
	 * @param eventName - Name of the event
	 * @param handlerId - Optional ID of the handler to remove
	 */
	public off<K extends keyof Events>(eventName: K, handlerId?: number): void {
		if (!this.subscribers.has(eventName)) {
			return;
		}

		if (handlerId === undefined) {
			// Remove all subscribers for this event
			this.subscribers.delete(eventName);
		} else {
			// Remove specific subscriber
			const eventSubscribers = this.subscribers.get(eventName)!;
			const filteredSubscribers = eventSubscribers.filter((sub) => sub.id !== handlerId);

			if (filteredSubscribers.length === 0) {
				this.subscribers.delete(eventName);
			} else {
				this.subscribers.set(eventName, filteredSubscribers);
			}
		}
	}

	/**
	 * Remove all event subscriptions
	 */
	public removeAllListeners(): void {
		this.subscribers.clear();
		this.isEmitting.clear();
		this.emissionStack.length = 0;
	}

	/**
	 * Get the number of subscribers for a specific event
	 * @param eventName - Name of the event
	 * @returns Number of subscribers
	 */
	public listenerCount<K extends keyof Events>(eventName: K): number {
		const subscribers = this.subscribers.get(eventName);
		return subscribers ? subscribers.length : 0;
	}

	/**
	 * Get the number of active subscribers for a specific event
	 * @param eventName - Name of the event
	 * @returns Number of active subscribers
	 */
	public activeListenerCount<K extends keyof Events>(eventName: K): number {
		const subscribers = this.subscribers.get(eventName);
		return subscribers ? subscribers.filter((sub) => sub.active).length : 0;
	}

	/**
	 * Check if an event has any subscribers
	 * @param eventName - Name of the event
	 * @returns True if the event has subscribers
	 */
	public hasListeners<K extends keyof Events>(eventName: K): boolean {
		return this.listenerCount(eventName) > 0;
	}

	/**
	 * Check if an event has any active subscribers
	 * @param eventName - Name of the event
	 * @returns True if the event has active subscribers
	 */
	public hasActiveListeners<K extends keyof Events>(eventName: K): boolean {
		return this.activeListenerCount(eventName) > 0;
	}

	/**
	 * Get all event names that have subscribers
	 * @returns Array of event names
	 */
	public eventNames(): (keyof Events)[] {
		return Array.from(this.subscribers.keys());
	}

	/**
	 * Get the current emission stack depth
	 * @returns Current emission depth
	 */
	public getEmissionDepth(): number {
		return this.emissionStack.length;
	}

	/**
	 * Get the current emission stack
	 * @returns Array of currently emitting events
	 */
	public getEmissionStack(): (keyof Events)[] {
		return [...this.emissionStack];
	}

	/**
	 * Set the maximum allowed emission depth
	 * @param depth - Maximum emission depth (default: 100)
	 */
	public setMaxEmissionDepth(depth: number): void {
		this.maxEmissionDepth = Math.max(1, depth);
	}

	/**
	 * Pause a subscription
	 * @param eventName - Name of the event
	 * @param handlerId - ID of the handler to pause
	 */
	private pauseSubscription<K extends keyof Events>(eventName: K, handlerId: number): void {
		this.setSubscriptionState(eventName, handlerId, false);
	}

	/**
	 * Resume a paused subscription
	 * @param eventName - Name of the event
	 * @param handlerId - ID of the handler to resume
	 */
	private resumeSubscription<K extends keyof Events>(eventName: K, handlerId: number): void {
		this.setSubscriptionState(eventName, handlerId, true);
	}

	/**
	 * Check if a subscription is active
	 * @param eventName - Name of the event
	 * @param handlerId - ID of the handler to check
	 * @returns True if the subscription is active
	 */
	private isSubscriptionActive<K extends keyof Events>(eventName: K, handlerId: number): boolean {
		const subscriber = this.subscribers.get(eventName)?.find((sub) => sub.id === handlerId);
		return subscriber ? subscriber.active : false;
	}

	/**
	 * Set the active state of a subscription
	 * @param eventName - Name of the event
	 * @param handlerId - ID of the handler
	 * @param active - Active state to set
	 */
	private setSubscriptionState<K extends keyof Events>(
		eventName: K,
		handlerId: number,
		active: boolean,
	): boolean {
		const eventSubscribers = this.subscribers.get(eventName);
		if (!eventSubscribers) {
			return false;
		}

		const subscriber = eventSubscribers.find((sub) => sub.id === handlerId);

		if (subscriber) {
			subscriber.active = active;
			return true;
		}
		return false;
	}

	/**
	 * Safely call the error handler with error boundary protection
	 * @param error - The error to handle
	 */
	private safeOnError(error: unknown): void {
		try {
			this.onError(error);
		} catch (handlerError) {
			// Fallback to console if the error handler itself throws
			console.error("Error in error handler:", handlerError);
			console.error("Original error:", error);
		}
	}

	/**
	 * Clean up once-only subscribers after emission
	 * @param eventName - Name of the event
	 * @param toRemove - Array of subscriber IDs to remove
	 */
	private cleanupOnceSubscribers<K extends keyof Events>(eventName: K, toRemove: number[]): void {
		if (toRemove.length === 0) {
			return;
		}

		const subscribers = this.subscribers.get(eventName);
		if (!subscribers) {
			return;
		}

		const filteredSubscribers = subscribers.filter((sub) => !toRemove.includes(sub.id));

		if (filteredSubscribers.length === 0) {
			this.subscribers.delete(eventName);
		} else {
			this.subscribers.set(eventName, filteredSubscribers);
		}
	}
}
