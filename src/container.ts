import type * as mc from "@minecraft/server";

/**
 * Attempts to add an array of ItemStacks to a container. If the container is not defined
 * or if it's full, any remaining items are dropped in the specified dimension at the given location.
 *
 * @param options - The options object for the function.
 */
export const addItemsToContainerOrDrop = (options: {
	itemStacks: mc.ItemStack[];
	dropDimension: mc.Dimension;
	dropLocation: mc.Vector3;
	container?: mc.Container;
}): void => {
	let itemsToDrop: mc.ItemStack[] = [];

	if (options.container) {
		const container = options.container;

		for (const itemStack of options.itemStacks) {
			const leftoverItemStack = container.addItem(itemStack);

			if (leftoverItemStack) {
				itemsToDrop.push(leftoverItemStack);
			}
		}
	} else {
		// If no container is provided, all items should be dropped.
		itemsToDrop = options.itemStacks;
	}

	for (const itemToDrop of itemsToDrop) {
		options.dropDimension.spawnItem(itemToDrop, options.dropLocation);
	}
};

/**
 * Finds the first item stack in the given `container` that matches the specified predicate condition.
 *
 * Iterates through all item stacks in the `container` sequentially and returns the first stack
 * where the `predicate` function returns `true`. If no matching item stack is found, returns `undefined`.
 *
 * @param container - The `container` to search through
 * @param predicate - A function that tests each item stack and returns `true` for a match.
 * @returns The first matching item stack, or `undefined` if no match is found
 */
export const findItemStack = (
	container: mc.Container,
	predicate: (itemStack: mc.ItemStack, index: number) => boolean | undefined,
): mc.ItemStack | undefined => {
	for (let i = 0; i < container.size; i++) {
		const itemStack = container.getItem(i);

		if (itemStack && predicate(itemStack, i)) {
			return itemStack;
		}
	}

	return undefined;
};

/**
 * Finds the first container slot that matches the specified predicate condition.
 *
 * Iterates through all slots in the `container` sequentially and returns the first slot
 * where the `predicate` function returns `true`. If no matching slot is found, returns `undefined`.
 *
 * @param container - The `container` to search through
 * @param predicate - A function that tests each slot and returns `true` for a match.
 * @returns The first matching container slot, or `undefined` if no match is found
 */
export const findContainerSlot = (
	container: mc.Container,
	predicate: (slot: mc.ContainerSlot, index: number) => boolean | undefined,
): mc.ContainerSlot | undefined => {
	for (let i = 0; i < container.size; i++) {
		const slot = container.getSlot(i);

		if (predicate(slot, i)) {
			return slot;
		}
	}

	return undefined;
};
