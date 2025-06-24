import * as mc from "@minecraft/server";

/**
 * Checks if the given entity is alive (i.e., has health greater than 0 and is valid).
 * @param entity - The entity to check.
 * @returns True if the entity is valid and its current health is greater than 0, otherwise false.
 */
export function isAlive(entity: mc.Entity): boolean {
	if (!entity.isValid) return false;
	const health = entity.getComponent("health");
	return health !== undefined && health.currentValue > 0;
}

/**
 * Safely applies an impulse to an entity. This function exists because calling `applyImpulse` directly on a Player will result in an error.
 * For players, a custom method is used to simulate vanilla impulse behavior.
 * @param entity - The entity to apply the impulse to.
 * @param vector - The impulse vector to apply.
 */
export function applyImpulseSafe(entity: mc.Entity, vector: mc.Vector3): void {
	try {
		if (entity instanceof mc.Player) {
			applyImpulseToPlayer(entity, vector);
			return;
		}

		entity.applyImpulse(vector);
	} catch {}
}

/**
 * Simulates applying an impulse to a player by using knockback to closely match vanilla impulse behavior.
 * This function exists because calling `applyImpulse` directly on a Player will result in an error.
 * @param player - The player entity to apply the impulse to.
 * @param vector - The impulse vector to apply.
 */
export function applyImpulseToPlayer(player: mc.Player, vector: mc.Vector3): void {
	const { x, y, z } = vector;
	const previousVelocity = player.getVelocity();

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
	player.applyKnockback(
		{
			x: directionX * horizontalStrength,
			z: directionZ * horizontalStrength,
		},
		verticalStrength,
	);
}

/**
 * Safely clears the velocity of an entity. This function exists because calling `clearVelocity` directly on a Player will result in an error.
 * For players, a custom method is used to simulate velocity clearing.
 * @param entity - The entity to clear the velocity of.
 */
export function clearVelocitySafe(entity: mc.Entity): void {
	try {
		if (entity instanceof mc.Player) {
			clearVelocityOfPlayer(entity);
			return;
		}

		entity.clearVelocity();
	} catch {}
}

/**
 * Simulates clearing the velocity of a player by applying a knockback in the opposite direction of current velocity.
 * This function exists because calling `clearVelocity` directly on a Player will result in an error.
 * @param player - The player entity to clear the velocity of.
 */
export function clearVelocityOfPlayer(player: mc.Player) {
	const { x, z } = player.getVelocity();

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
	player.applyKnockback(
		{
			x: directionX * horizontalNorm,
			z: directionZ * horizontalNorm,
		},
		0,
	);
}

/**
 * Gets a display name for the entity in the following order:
 * 1. Player name (if entity is a Player)
 * 2. Name tag (if set)
 * 3. Translated type ID (fallback)
 *
 * @param entity - The entity instance or a type ID string.
 * @returns A RawText object representing the entity's name.
 */
export function getNameRawText(entity: mc.Entity | string): mc.RawText {
	// If a type ID string is provided, return its translated name
	if (typeof entity === "string") {
		return getTranslatableTypeId(entity);
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
		return getTranslatableTypeId(entity.typeId);
	} catch {
		// In case of any error, return 'Unknown'
		return { rawtext: [{ text: "Unknown" }] };
	}
}

/**
 * Returns a RawText object with the translated name for a given entity type ID.
 * @param typeId - The entity type ID (e.g., "minecraft:zombie").
 * @returns A RawText object with the translation key for the entity name.
 */
function getTranslatableTypeId(typeId: string): mc.RawText {
	const namespace = typeId.split(":")[0];
	const entityTypeId = namespace === "minecraft" ? typeId.replace("minecraft:", "") : typeId;
	return { rawtext: [{ translate: `entity.${entityTypeId}.name` }] };
}
