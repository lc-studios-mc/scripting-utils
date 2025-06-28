/**
 * Custom error class for timeline-related errors
 */
class TimelineError extends Error {
	constructor(
		message: string,
		public readonly context?: Record<string, any>,
	) {
		super(message);
		this.name = "TimelineError";
	}
}

/**
 * Record mapping percentages (0-1) to event functions
 */
type TimelineRecord<TArgs = any> = Record<number, (args: TArgs) => void>;

interface ProcessedEvent<T = any> {
	tick: number;
	func: (args: T) => void;
	executed: boolean;
	percentage: number; // Store original percentage
}

/**
 * Manages a timeline of events triggered at specific percentages of completion.
 *
 * @template TArgs - Type of arguments passed to timeline events
 *
 * @example
 * ```typescript
 * interface ExampleTimelineArgs {
 *   player: Player
 * }
 *
 * const timelineRecord: TimelineRecord<ExampleTimelineArgs> = {
 *   0.0: (args) => args.player.sendMessage("Start"),
 *   0.5: (args) => args.player.sendMessage("Halfway"),
 *   1.0: (args) => args.player.sendMessage("Complete"),
 * };
 *
 * const duration = 20; // 20 ticks equals 1 second
 * const timeline = new Timeline(duration, timelineRecord);
 * const player = world.getPlayers()[0]
 *
 * timeline.process(17, { player });
 * // Output:
 * // "Start"
 * // "Halfway"
 *
 * timeline.process(20, { player });
 * // Output:
 * // "Complete"
 * ```
 */
class Timeline<TArgs = any> {
	private readonly duration: number;
	private readonly sortedEvents: ProcessedEvent<TArgs>[];
	private lastProcessedTick: number = -1;

	/**
	 * Creates a new Timeline instance
	 *
	 * @param duration - Timeline duration in ticks
	 * @param timelineRecord - Map of percentages (0-1) to event functions
	 * @throws {TimelineError} When validation fails
	 */
	constructor(duration: number, timelineRecord: TimelineRecord<TArgs>) {
		if (!Number.isFinite(duration) || duration <= 0) {
			throw new TimelineError("Timeline duration must be a positive finite number", { duration });
		}

		if (!timelineRecord || Object.keys(timelineRecord).length === 0) {
			throw new TimelineError("Timeline record cannot be empty or null");
		}

		this.duration = duration;

		// Check for duplicate percentages
		const seenPercentages = new Set<number>();

		// Convert percentages to absolute ticks and sort for efficient processing
		this.sortedEvents = Object.entries(timelineRecord)
			.map(([percentageStr, func]) => {
				const percentage = parseFloat(percentageStr);

				if (!Number.isFinite(percentage)) {
					throw new TimelineError(
						`Invalid percentage key: "${percentageStr}" is not a valid number`,
						{
							invalidKey: percentageStr,
						},
					);
				}

				if (percentage < 0 || percentage > 1) {
					throw new TimelineError(
						`Percentage out of range: ${percentage}. Must be between 0 and 1`,
						{
							percentage,
							validRange: "0 to 1",
						},
					);
				}

				if (seenPercentages.has(percentage)) {
					throw new TimelineError(
						`Duplicate percentage found: ${percentage}. Each percentage must be unique`,
						{
							percentage,
						},
					);
				}
				seenPercentages.add(percentage);

				if (typeof func !== "function") {
					throw new TimelineError(`Event handler must be a function for percentage ${percentage}`, {
						percentage,
						receivedType: typeof func,
					});
				}

				return {
					tick: Math.floor(percentage * this.duration),
					func,
					executed: false,
					percentage,
				};
			})
			.sort((a, b) => {
				// Sort by tick first, then by percentage if ticks are equal
				const tickDiff = a.tick - b.tick;
				return tickDiff !== 0 ? tickDiff : a.percentage - b.percentage;
			});
	}

	/**
	 * Advances the timeline and executes events that should trigger.
	 *
	 * @param tick - Current time position in ticks
	 * @param args - Arguments to pass to event functions
	 * @throws {TimelineError} When tick is invalid or event execution fails
	 */
	process(tick: number, args: TArgs): void {
		if (!Number.isFinite(tick)) {
			throw new TimelineError("Tick must be a finite number", {
				tick,
				tickType: typeof tick,
			});
		}

		const currentTick = Math.max(0, Math.min(tick, this.duration));

		// Handle tick regression (moving backwards)
		if (currentTick < this.lastProcessedTick) {
			// Reset and reprocess
			this.reset();
		}

		// Process events sequentially
		for (const event of this.sortedEvents) {
			// Skip events that haven't reached their time yet
			if (event.tick > currentTick) {
				break;
			}

			// Execute unexecuted events that are past the last processed tick
			if (!event.executed && event.tick > this.lastProcessedTick) {
				try {
					event.func(args);
					event.executed = true;
				} catch (error) {
					throw new TimelineError(
						`Timeline event failed at ${(event.percentage * 100).toFixed(2)}% (tick ${event.tick})`,
						{
							percentage: event.percentage,
							tick: event.tick,
							currentTick,
							originalError: error instanceof Error ? error.message : String(error),
						},
					);
				}
			}
		}

		this.lastProcessedTick = currentTick;
	}

	/**
	 * Resets the timeline to its initial state.
	 * All events will be marked as unexecuted and ready to trigger again.
	 */
	reset(): void {
		this.lastProcessedTick = -1;
		for (const event of this.sortedEvents) {
			event.executed = false;
		}
	}

	/**
	 * Gets the current progress as a percentage (0-1)
	 *
	 * @param tick - Current tick position
	 * @returns Progress percentage between 0 and 1
	 */
	getCurrentProgress(tick: number): number {
		if (!Number.isFinite(tick)) {
			return 0;
		}
		const clampedTick = Math.max(0, Math.min(tick, this.duration));
		return clampedTick / this.duration;
	}

	/**
	 * Checks if the timeline has completed
	 *
	 * @param tick - Current tick position
	 * @returns True if timeline is complete
	 */
	isComplete(tick: number): boolean {
		return Number.isFinite(tick) && tick >= this.duration;
	}

	/**
	 * Gets the timeline duration
	 *
	 * @returns Duration in ticks
	 */
	getDuration(): number {
		return this.duration;
	}

	/**
	 * Gets information about pending events (for debugging)
	 *
	 * @param currentTick - Current tick position
	 * @returns Array of pending events
	 */
	getPendingEvents(currentTick: number): ReadonlyArray<{ percentage: number; tick: number }> {
		return this.sortedEvents
			.filter((event) => !event.executed && event.tick <= currentTick)
			.map((event) => ({ percentage: event.percentage, tick: event.tick }));
	}

	/**
	 * Gets information about all events (for debugging)
	 *
	 * @returns Array of all events with their status
	 */
	getAllEvents(): ReadonlyArray<{ percentage: number; tick: number; executed: boolean }> {
		return this.sortedEvents.map((event) => ({
			percentage: event.percentage,
			tick: event.tick,
			executed: event.executed,
		}));
	}
}

export { Timeline, TimelineError, type TimelineRecord };
