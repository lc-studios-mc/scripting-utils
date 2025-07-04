import * as mc from "@minecraft/server";
import { console } from "./index.js";

/**
 * Context provided to hooked item factories for per-player, per-item state and utilities.
 */
export interface HookedItemContext {
	readonly player: mc.Player;
	readonly playerEquippable: mc.EntityEquippableComponent;
	readonly playerHealth: mc.EntityHealthComponent;
	readonly playerInventory: mc.EntityInventoryComponent;
	readonly itemType: string;
	readonly initialItemStack: mc.ItemStack;
	readonly initialSlotIndex: number;

	getCurrentTick: () => number;
	getUsing: () => boolean;
	getDeleteOnNextTick: () => boolean;
	setDeleteOnNextTick: (value: boolean) => void;
}

/**
 * Factory function type for creating HookedItem instances.
 */
type HookedItemFactory = (args: HookedItemContext) => HookedItem;

/**
 * Registry interface for managing item hook factories by item type.
 */
interface ItemHookRegistry {
	register(itemType: string, factory: HookedItemFactory): void;
	unregister(itemType: string): void;
	unregisterAll(): void;
}

/**
 * Main registry for item hook factories.
 */
const mainItemHookRegistry = {
	factoriesByItemType: new Map<string, HookedItemFactory>(),

	register(itemType: string, factory: HookedItemFactory): void {
		if (this.factoriesByItemType.has(itemType)) {
			throw new Error(`Item hook is already registered for ${itemType}.`);
		}

		this.factoriesByItemType.set(itemType, factory);
	},

	unregister(itemType: string): boolean {
		return this.factoriesByItemType.delete(itemType);
	},

	unregisterAll(): void {
		this.factoriesByItemType.clear();
	},
} as const;

/**
 * Exposed registry for registering and managing item hooks.
 */
export const ItemHookRegistry: ItemHookRegistry = mainItemHookRegistry;

/**
 * Base class for custom hooked item logic. Extend to implement item behavior.
 */
export abstract class HookedItem {
	private readonly context: HookedItemContext;

	constructor(context: HookedItemContext) {
		this.context = context;
	}

	get player(): mc.Player {
		return this.context.player;
	}

	get dimension(): mc.Dimension {
		return this.context.player.dimension;
	}

	get equippable(): mc.EntityEquippableComponent {
		return this.context.playerEquippable;
	}

	get health(): mc.EntityHealthComponent {
		return this.context.playerHealth;
	}

	get inventory(): mc.EntityInventoryComponent {
		return this.context.playerInventory;
	}

	get itemType(): string {
		return this.context.itemType;
	}

	get initialItemStack(): mc.ItemStack {
		return this.context.initialItemStack;
	}

	get initialSlotIndex(): number {
		return this.context.initialSlotIndex;
	}

	get currentTick(): number {
		return this.context.getCurrentTick();
	}

	get isUsing(): boolean {
		return this.context.getUsing();
	}

	get deleteOnNextTick(): boolean {
		return this.context.getDeleteOnNextTick();
	}

	set deleteOnNextTick(value: boolean) {
		this.context.setDeleteOnNextTick(value);
	}

	onDelete(): void {}

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

/**
 * Internal shared fields for HookedItemWrapper.
 */
interface HookedItemInternalSharedFields {
	currentTick: number;
	isUsing: boolean;
	deleteOnNextTick: boolean;
}

/**
 * Internal wrapper for managing per-player hooked item state.
 */
interface HookedItemWrapper {
	shared: HookedItemInternalSharedFields;
	context: HookedItemContext;
	factory: HookedItemFactory;
	instance: HookedItem;
}

const PLAYER_ENTITY_TYPE = "minecraft:player";
const hookedItemWrappersByPlayer = new Map<mc.Player, HookedItemWrapper>();

// Periodic cleanup to handle missed player disconnect events
let cleanupCounter = 0;
const CLEANUP_INTERVAL = 200; // Every 200 ticks (10 seconds)

// Call onTickPlayer() for each player in the world every tick
mc.world.afterEvents.worldLoad.subscribe(() => {
	mc.system.runInterval(() => {
		if (mainItemHookRegistry.factoriesByItemType.size <= 0) return;

		const players = mc.world.getPlayers();

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			if (player) {
				onTickPlayer(player);
			}
		}

		// Periodic cleanup for stale entries
		cleanupCounter++;
		if (cleanupCounter >= CLEANUP_INTERVAL) {
			cleanupCounter = 0;
			performPeriodicCleanup();
		}
	}, 1);
});

/**
 * Periodically cleans up stale player hooks.
 */
function performPeriodicCleanup(): void {
	const activePlayers = mc.world.getPlayers();
	const playersToRemove: mc.Player[] = [];

	for (const [player] of hookedItemWrappersByPlayer) {
		if (!player.isValid || !activePlayers.includes(player)) {
			playersToRemove.push(player);
		}
	}

	for (const player of playersToRemove) {
		console.warn(`Cleaning up stale hook for player: ${player.name || "unknown"}`);
		deleteWrapper(player);
	}
}

function getItemStackSafely(player: mc.Player): mc.ItemStack | undefined {
	try {
		const equippable = player.getComponent("equippable");
		if (!equippable) return undefined;

		const mainhandSlot = equippable.getEquipmentSlot(mc.EquipmentSlot.Mainhand);
		return mainhandSlot.getItem();
	} catch (error) {
		console.warn(`Error getting item stack for player ${player.name}: ${error}`);
		return undefined;
	}
}

function areItemsEquivalent(
	item1: mc.ItemStack | undefined,
	item2: mc.ItemStack | undefined,
): boolean {
	if (!item1 || !item2) return item1 === item2;

	return item1.typeId === item2.typeId;
}

/**
 * Handles per-tick logic for a player, including hook creation and deletion.
 */
function onTickPlayer(player: mc.Player): void {
	if (!player.isValid) {
		deleteWrapper(player);
		return;
	}

	const lastWrapper = hookedItemWrappersByPlayer.get(player);
	let wrapperForThisTick = lastWrapper;

	// Validate all required components
	const equippable = player.getComponent("equippable");
	if (!equippable) {
		console.warn(`Could not find equippable component for player ${player.name}.`);
		deleteWrapper(player, lastWrapper);
		return;
	}

	const health = player.getComponent("health");
	if (!health) {
		console.warn(`Could not find health component for player ${player.name}.`);
		deleteWrapper(player, lastWrapper);
		return;
	}

	const inventory = player.getComponent("inventory");
	if (!inventory) {
		console.warn(`Could not find inventory component for player ${player.name}.`);
		deleteWrapper(player, lastWrapper);
		return;
	}

	const isAlive = health.currentValue > 0;
	if (!isAlive) {
		deleteWrapper(player, lastWrapper);
		return;
	}

	const itemStack = getItemStackSafely(player);

	// More robust item equivalence check
	const isHoldingSameItem =
		lastWrapper &&
		lastWrapper.context.itemType === itemStack?.typeId &&
		lastWrapper.context.initialSlotIndex === player.selectedSlotIndex &&
		areItemsEquivalent(lastWrapper.context.initialItemStack, itemStack);

	const hookFactoryForCurrentItem = isHoldingSameItem
		? lastWrapper.factory
		: itemStack === undefined
			? undefined
			: mainItemHookRegistry.factoriesByItemType.get(itemStack.typeId);

	const shouldDeleteWrapper =
		lastWrapper &&
		(!isHoldingSameItem ||
			!itemStack ||
			hookFactoryForCurrentItem === undefined ||
			lastWrapper.shared.deleteOnNextTick);

	if (shouldDeleteWrapper) {
		wrapperForThisTick = undefined;
		deleteWrapper(player, lastWrapper);
	}

	const shouldCreateNewHook =
		!isHoldingSameItem && itemStack && hookFactoryForCurrentItem !== undefined;

	if (shouldCreateNewHook) {
		try {
			const shared: HookedItemInternalSharedFields = {
				currentTick: 0,
				isUsing: false,
				deleteOnNextTick: false,
			};

			const ctx: HookedItemContext = {
				player,
				playerEquippable: equippable,
				playerHealth: health,
				playerInventory: inventory,
				itemType: itemStack.typeId,
				initialItemStack: itemStack,
				initialSlotIndex: player.selectedSlotIndex,

				getCurrentTick: () => shared.currentTick,
				getUsing: () => shared.isUsing,
				getDeleteOnNextTick: () => shared.deleteOnNextTick,
				setDeleteOnNextTick: (value) => (shared.deleteOnNextTick = value),
			};

			const newHook = hookFactoryForCurrentItem(ctx);

			const newWrapper: HookedItemWrapper = {
				shared,
				context: ctx,
				factory: hookFactoryForCurrentItem,
				instance: newHook,
			};

			hookedItemWrappersByPlayer.set(player, newWrapper);
			wrapperForThisTick = newWrapper;
		} catch (error) {
			console.error(
				`Error creating hook for item ${itemStack.typeId} for player ${player.name}: ${error}`,
			);
			return;
		}
	}

	// Safe tick execution
	if (wrapperForThisTick && itemStack) {
		try {
			wrapperForThisTick.instance.onTick(itemStack);
			wrapperForThisTick.shared.currentTick++;
		} catch (error) {
			console.error(
				`Error occurred while ticking hooked item (ID: ${itemStack.typeId}) for player ${player.name}: ${error}`,
			);
			// Mark for deletion to prevent repeated errors
			wrapperForThisTick.shared.deleteOnNextTick = true;
		}
	}
}

/**
 * Deletes the HookedItemWrapper for a player and calls onDelete.
 */
function deleteWrapper(player: mc.Player, wrapper?: HookedItemWrapper): void {
	if (!wrapper) {
		wrapper = hookedItemWrappersByPlayer.get(player);
	}

	if (wrapper) {
		hookedItemWrappersByPlayer.delete(player);
		try {
			wrapper.instance.onDelete?.();
		} catch (error) {
			console.error(`Error in onDelete for player ${player.name}: ${error}`);
		}
	}
}

mc.world.beforeEvents.playerLeave.subscribe(({ player }) => {
	deleteWrapper(player);
});

mc.system.beforeEvents.shutdown.subscribe(() => {
	const playersToCleanup = Array.from(hookedItemWrappersByPlayer.keys());
	for (const player of playersToCleanup) {
		deleteWrapper(player);
	}
});

mc.world.afterEvents.itemStartUse.subscribe((e) => {
	if (!e.source || !e.itemStack) return;

	const wrapper = hookedItemWrappersByPlayer.get(e.source);
	if (!wrapper) return;

	if (wrapper.context.itemType !== e.itemStack.typeId) return;
	if (wrapper.context.initialSlotIndex !== e.source.selectedSlotIndex) return;
	if (wrapper.shared.isUsing) return;

	try {
		if (!wrapper.instance.canUse(e)) return;

		wrapper.shared.isUsing = true;
		wrapper.instance.onStartUse(e);
	} catch (error) {
		console.error(`Error in onStartUse for player ${e.source.name}: ${error}`);
		wrapper.shared.isUsing = false;
	}
});

mc.world.afterEvents.itemStopUse.subscribe((e) => {
	if (!e.source) return;

	const wrapper = hookedItemWrappersByPlayer.get(e.source);
	if (!wrapper) return;

	if (e.itemStack) {
		if (wrapper.context.itemType !== e.itemStack.typeId) return;
	}

	if (wrapper.context.initialSlotIndex !== e.source.selectedSlotIndex) return;
	if (!wrapper.shared.isUsing) return;

	try {
		wrapper.shared.isUsing = false;
		wrapper.instance.onStopUse(e);
	} catch (error) {
		console.error(`Error in onStopUse for player ${e.source.name}: ${error}`);
		wrapper.shared.isUsing = false;
	}
});

mc.world.afterEvents.entityHitEntity.subscribe(
	(e) => {
		if (!(e.damagingEntity instanceof mc.Player)) return;

		const wrapper = hookedItemWrappersByPlayer.get(e.damagingEntity);
		if (!wrapper) return;

		try {
			wrapper.instance.onHitEntity(e);
		} catch (error) {
			console.error(`Error in onHitEntity for player ${e.damagingEntity.name}: ${error}`);
		}
	},
	{
		entityTypes: [PLAYER_ENTITY_TYPE],
	},
);

mc.world.afterEvents.entityHitBlock.subscribe(
	(e) => {
		if (!(e.damagingEntity instanceof mc.Player)) return;

		const wrapper = hookedItemWrappersByPlayer.get(e.damagingEntity);
		if (!wrapper) return;

		try {
			wrapper.instance.onHitBlock(e);
		} catch (error) {
			console.error(`Error in onHitBlock for player ${e.damagingEntity.name}: ${error}`);
		}
	},
	{
		entityTypes: [PLAYER_ENTITY_TYPE],
	},
);

mc.world.afterEvents.playerBreakBlock.subscribe((e) => {
	if (!e.player) return;

	const wrapper = hookedItemWrappersByPlayer.get(e.player);
	if (!wrapper) return;

	try {
		wrapper.instance.onBreakBlock(e);
	} catch (error) {
		console.error(`Error in onBreakBlock for player ${e.player.name}: ${error}`);
	}
});

mc.world.afterEvents.entityHurt.subscribe((e) => {
	if (!(e.hurtEntity instanceof mc.Player)) return;

	const wrapper = hookedItemWrappersByPlayer.get(e.hurtEntity);
	if (!wrapper) return;

	try {
		wrapper.instance.onHurt(e);
	} catch (error) {
		console.error(`Error in onHurt for player ${e.hurtEntity.name}: ${error}`);
	}
});
