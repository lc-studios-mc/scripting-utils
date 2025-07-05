import * as mc from "@minecraft/server";
import { addItemsToContainerOrDrop } from "./container.js";

/**
 * Checks if the given entity is alive (i.e., has health greater than 0 and is valid).
 *
 * @param entity - The entity to check.
 * @returns True if the entity is valid and its current health is greater than 0, otherwise false.
 */
export const isEntityAlive = (entity: mc.Entity): boolean => {
	if (!entity.isValid) return false;
	const health = entity.getComponent("health");
	return health !== undefined && health.currentValue > 0;
};

/**
 * Mimics the behavior of applyImpulse using applyKnockback as a fallback.
 * Calculates horizontal and vertical strengths to simulate an impulse effect.
 *
 * @param entity - The entity to apply the impulse to.
 * @param vector - The impulse vector to apply.
 */
const mimicApplyImpulseWithKnockback = (entity: mc.Entity, vector: mc.Vector3): void => {
	const { x, y, z } = vector;
	const previousVelocity = entity.getVelocity();

	// Calculate the norm (magnitude) of the horizontal components (x and z)
	const horizontalNorm = Math.sqrt(x * x + z * z);

	// Calculate directionX and directionZ as normalized values
	let directionX = 0;
	let directionZ = 0;
	if (horizontalNorm !== 0) {
		directionX = x / horizontalNorm;
		directionZ = z / horizontalNorm;
	}

	// The horizontalStrength is the horizontal norm of the input vector
	// multiplied by 2.5 based on experimentation
	const horizontalStrength = horizontalNorm * 2.5;

	// The vertical component is directly taken as verticalStrength
	// The previous velocity is also taken into account, because normal impulse retains
	// the previous velocity and knockback does not
	const verticalStrength = y + previousVelocity.y * 0.9;

	// Apply the knockback
	entity.applyKnockback(
		{
			x: directionX * horizontalStrength,
			z: directionZ * horizontalStrength,
		},
		verticalStrength,
	);
};

/**
 * Safely applies an impulse to an entity. Falls back to knockback if applyImpulse fails.
 *
 * @param entity - The entity to apply the impulse to.
 * @param vector - The impulse vector to apply.
 */
export const applyEntityImpulseSafe = (entity: mc.Entity, vector: mc.Vector3): void => {
	try {
		entity.applyImpulse(vector);
	} catch {
		try {
			mimicApplyImpulseWithKnockback(entity, vector);
		} catch {}
	}
};

/**
 * Mimics the behavior of clearVelocity using applyKnockback as a fallback.
 * Applies a knockback in the opposite direction of current velocity to nullify it.
 *
 * @param entity - The entity whose velocity should be cleared.
 */
const mimicClearVelocityWithKnockback = (entity: mc.Entity) => {
	const { x, z } = entity.getVelocity();

	// Calculate the norm (magnitude) of the horizontal components (x and z)
	const horizontalNorm = Math.sqrt(x * x + z * z);

	// Calculate directionX and directionZ as normalized values
	let directionX = 0;
	let directionZ = 0;
	if (horizontalNorm !== 0) {
		directionX = -x / horizontalNorm;
		directionZ = -z / horizontalNorm;
	}

	// Apply the knockback
	entity.applyKnockback(
		{
			x: directionX * horizontalNorm,
			z: directionZ * horizontalNorm,
		},
		0,
	);
};

/**
 * Safely clears the velocity of an entity. Falls back to knockback if clearVelocity fails.
 *
 * @param entity - The entity whose velocity should be cleared.
 */
export const clearVelocitySafe = (entity: mc.Entity): void => {
	try {
		entity.clearVelocity();
	} catch {
		try {
			mimicClearVelocityWithKnockback(entity);
		} catch {}
	}
};

/**
 * Gives one or more ItemStacks to an entity. Attempts to add items to the entity's inventory container;
 * if the inventory is full or missing, items are dropped at the entity's location in its dimension.
 *
 * @param entity - The entity to receive the items.
 * @param itemStacks - One or more ItemStack objects to give to the entity.
 */
export const giveItemsToEntity = (entity: mc.Entity, ...itemStacks: mc.ItemStack[]): void => {
	const container = entity.getComponent("inventory")?.container;

	addItemsToContainerOrDrop({
		itemStacks,
		container,
		dropDimension: entity.dimension,
		dropLocation: entity.location,
	});
};

/**
 * Returns a RawText object with the translated name for a given entity type ID.
 *
 * @param typeId - The entity type ID (e.g., "minecraft:zombie").
 * @returns A RawText object with the translation key for the entity name.
 */
const getEntityNameRawTextFromTypeId = (typeId: string): mc.RawText => {
	const namespace = typeId.split(":")[0];
	const entityTypeId = namespace === "minecraft" ? typeId.replace("minecraft:", "") : typeId;
	return { rawtext: [{ translate: `entity.${entityTypeId}.name` }] };
};

/**
 * Gets a display name for the entity in the following order:
 * 1. Player name (if entity is a Player)
 * 2. Name tag (if set)
 * 3. Translated type ID (fallback)
 *
 * @param entity - The entity instance or a type ID string.
 * @returns A RawText object representing the entity's name.
 */
export const getEntityNameRawText = (entity: mc.Entity | string): mc.RawText => {
	// If a type ID string is provided, return its translated name
	if (typeof entity === "string") {
		return getEntityNameRawTextFromTypeId(entity);
	}

	try {
		// If entity is a Player, return the player's name
		if (entity instanceof mc.Player) {
			return { rawtext: [{ text: entity.name }] };
		}
		// If entity has a non-empty nameTag, return it
		if (entity.nameTag && entity.nameTag.trim() !== "") {
			return { rawtext: [{ text: entity.nameTag }] };
		}
		// Fallback to translated type ID
		return getEntityNameRawTextFromTypeId(entity.typeId);
	} catch {
		// In case of any error, return 'Unknown'
		return { rawtext: [{ text: "Unknown" }] };
	}
};
