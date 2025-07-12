import * as mc from "@minecraft/server";
import { HookedItem, type HookedItemContext, type HookedItemEvents } from "./item-hook.js";

/** Defines the interface for a state machine, which manages and transitions between different states. */
export interface StateMachine<TState> {
	/** The current active state of the state machine. */
	state: TState;
	/**
	 * Transitions the state machine to a new state.
	 * @param newState The new state to transition to.
	 */
	changeState(newState: TState): void;
}

/**
 * Abstract base class for defining states within a state machine, particularly for {@link HookedItem} instances.
 * This class provides lifecycle methods that are called during state transitions and game ticks,
 * allowing subclasses to define specific behaviors for different item states.
 *
 * **NOTE: There is no predefined state machine logic in item hook, and you have to create your own.**
 *
 * @example
 * ```typescript
 * // A custom HookedItem that uses a state machine
 * class CustomHookedItem extends HookedItem implements StateMachine<CustomAbstractState> {
 *   // ...
 *   state: CustomAbstractState;
 *
 *   changeState(newState: CustomAbstractState): void {
 *     this.state.onExit();
 *     this.state = newState; // Transition to the new state
 *     this.state.onEnter();
 *   }
 *
 *   doSomething1(): void {
 *     this.state.customStateMethod();
 *   }
 *
 *   doSomething2(): void {
 *     this.changeState(new CustomConcreteState(this));
 *   }
 *   // ...
 * }
 *
 * // Abstract base class for custom states, extending HookedItemState.
 * abstract class CustomAbstractState extends HookedItemState<CustomHookedItem> {
 *   abstract customStateMethod(): void;
 * }
 *
 * // Concrete implementation of a custom state.
 * class CustomConcreteState extends CustomAbstractState {
 *   override customStateMethod(): void {
 *     this.owner.player.sendMessage("Greetings from the custom state method!");
 *   }
 * }
 * ```
 */
export abstract class HookedItemState<TOwner extends HookedItem = HookedItem>
	implements HookedItemEvents
{
	private _currentTick = 0;

	constructor(public readonly owner: TOwner) {}

	/** Gets the number of ticks this state has been active. */
	get currentTick(): number {
		return this._currentTick;
	}

	/** Custom hooked item (state machine) should call this method when the state enters. */
	onEnter(): void {}

	/** Custom hooked item (state machine) should call this method when the state exits. */
	onExit(): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onDelete()`. */
	onDelete(): void {}

	/**
	 * Dispatches the tick event and manages the internal tick count.
	 * Should be called by the state machine.
	 * @sealed
	 */
	update(currentItemStack: mc.ItemStack): void {
		this.onTick(currentItemStack);
		this._currentTick++;
	}

	/**
	 * Logic for the state to perform on each tick.
	 * Subclasses should override this method.
	 */
	onTick(currentItemStack: mc.ItemStack): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.canUse()`. */
	canUse(e: mc.ItemStartUseAfterEvent): boolean {
		return true;
	}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onStartUse()`. */
	onStartUse(e: mc.ItemStartUseAfterEvent): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onStopUse()`. */
	onStopUse(e: mc.ItemStopUseAfterEvent): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onHitEntity()`. */
	onHitEntity(e: mc.EntityHitEntityAfterEvent): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onHitBlock()`. */
	onHitBlock(e: mc.EntityHitBlockAfterEvent): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onBreakBlock()`. */
	onBreakBlock(e: mc.PlayerBreakBlockAfterEvent): void {}

	/** Custom hooked item (state machine) should call this method from within `HookedItem.onHurt()`. */
	onHurt(e: mc.EntityHurtAfterEvent): void {}
}

export abstract class StateDrivenHookedItem<TState extends HookedItemState = HookedItemState>
	extends HookedItem
	implements StateMachine<TState>
{
	constructor(ctx: HookedItemContext) {
		super(ctx);
	}

	abstract state: TState;

	changeState(newState: TState): void {
		this.state.onExit();
		this.state = newState;
		this.state.onEnter();
	}

	override onDelete(): void {
		this.state.onDelete();
	}

	override onTick(currentItemStack: mc.ItemStack): void {
		this.state.update(currentItemStack);
	}

	override canUse(e: mc.ItemStartUseAfterEvent): boolean {
		return this.state.canUse(e);
	}

	override onStartUse(e: mc.ItemStartUseAfterEvent): void {
		this.state.onStartUse(e);
	}

	override onStopUse(e: mc.ItemStopUseAfterEvent): void {
		this.state.onStopUse(e);
	}

	override onHitEntity(e: mc.EntityHitEntityAfterEvent): void {
		this.state.onHitEntity(e);
	}

	override onHitBlock(e: mc.EntityHitBlockAfterEvent): void {
		this.state.onHitBlock(e);
	}

	override onBreakBlock(e: mc.PlayerBreakBlockAfterEvent): void {
		this.state.onBreakBlock(e);
	}

	override onHurt(e: mc.EntityHurtAfterEvent): void {
		this.state.onHurt(e);
	}
}
