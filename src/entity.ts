import * as mc from "@minecraft/server";

/**
 * Checks if the given entity is alive (i.e., has health greater than 0 and is valid).
 * @param entity - The entity to check.
 * @returns {boolean} True if the entity is valid and its current health is greater than 0, otherwise false.
 */
export function isAlive(entity: mc.Entity): boolean {
	if (!entity.isValid) return false;
	const health = entity.getComponent("health");
	return health !== undefined && health.currentValue > 0;
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
 * @returns {mc.RawText} A RawText object with the translation key for the entity name.
 */
function getTranslatableTypeId(typeId: string): mc.RawText {
	const namespace = typeId.split(":")[0];
	const entityTypeId = namespace === "minecraft" ? typeId.replace("minecraft:", "") : typeId;
	return { rawtext: [{ translate: `entity.${entityTypeId}.name` }] };
}
