import * as mc from "@minecraft/server";
import { HookedItem, type HookedItemEvents } from "./item-hook.js";

/**
 * @example
 * ```typescript
 * class ExampleHookedItem extends HookedItem implements StateDrivenHookedItem<ExampleHookedItem, ExampleAbstractState> {
 *   // ...
 *   state: ExampleAbstractState;
 *   changeState(newState: ExampleAbstractState): void {
 *     this.state.onExit();
 *     this.state = newState;
 *     this.state.onEnter();
 *
 *     // Just an example of calling a custom state method; you should not do it here.
 *     this.state.customStateMethod();
 *   }
 *   // ...
 * }
 *
 * abstract class ExampleAbstractState extends AbstractHookedItemState<ExampleHookedItem> {
 *   abstract customStateMethod(): void;
 * }
 *
 * class ExampleState1 extends ExampleAbstractState {
 *   override customStateMethod(): void {
 *     // ...
 *   }
 * }
 * ```
 */
export interface StateDrivenHookedItem<T1 extends HookedItem, T2 = AbstractHookedItemState<T1>> {
	state: T2;
	changeState(newState: T2): void;
}

export abstract class AbstractHookedItemState<T extends HookedItem> implements HookedItemEvents {
	private _currentTick = 0;

	constructor(public readonly sm: T) {}

	get currentTick(): number {
		return this._currentTick;
	}

	onEnter(): void {}

	onExit(): void {}

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

	canUse(e: mc.ItemStartUseAfterEvent): boolean {
		return true;
	}

	onStartUse(e: mc.ItemStartUseAfterEvent): void {}

	onStopUse(e: mc.ItemStopUseAfterEvent): void {}

	onHitEntity(e: mc.EntityHitEntityAfterEvent): void {}

	onHitBlock(e: mc.EntityHitBlockAfterEvent): void {}

	onBreakBlock(e: mc.PlayerBreakBlockAfterEvent): void {}

	onHurt(e: mc.EntityHurtAfterEvent): void {}
}
