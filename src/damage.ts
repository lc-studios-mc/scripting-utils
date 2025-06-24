import * as mc from "@minecraft/server";

/**
 * Calculates the final damage an entity will take after applying armor, enchantment, and resistance reductions.
 * Ensures at least 1 damage point is dealt if the raw damage is positive, preventing full invulnerability from reductions.
 *
 * Particularly useful when you want to apply damage of a cause that penetrates hit immunity (e.g. `override`), but still
 * take armor and other defensive properties into account. (Example below)
 *
 * @param entity - The entity receiving damage.
 * @param rawDamage - The initial raw damage before reductions.
 * @param damageCause - The cause of the damage (used for enchantment calculations), defaults to `none`.
 * @returns The final damage value after all reductions.
 *
 * @example
 *
 * ```typescript
 * // Deals 20 damage, ignoring hit immunity but taking armor into account
 * let damage = damageUtils.calculateFinalDamage(entity, 20);
 * entity.applyDamage(damage, {
 *   cause: EntityDamageCause.override, // This EntityDamageCause ignores hit immunity
 * });
 * ```
 */
export function calculateFinalDamage(
	entity: mc.Entity,
	rawDamage: number,
	damageCause = mc.EntityDamageCause.none,
): number {
	let finalDamage = rawDamage;

	// Handle cases where raw damage is 0 or negative (e.g., healing)
	if (finalDamage <= 0) {
		return finalDamage;
	}

	const armors = getEquippedArmorArray(entity);

	// Apply Armor Reduction
	const armorStats = getArmorStats(armors);
	const armorReductionPercentage = calculateArmorReduction(finalDamage, armorStats);
	finalDamage *= 1 - armorReductionPercentage;

	// Apply Enchantment Reduction
	const enchantmentReductionPercentage = calculateEnchantmentReduction(damageCause, armors);
	finalDamage *= 1 - enchantmentReductionPercentage;

	// Apply Resistance Effect Reduction
	const resistanceReductionPercentage = calculateResistanceReduction(entity);
	finalDamage *= 1 - resistanceReductionPercentage;

	// If the raw damage was positive, ensure at least 1 damage point (0.5 hearts) is taken.
	// This prevents true invulnerability from combined armor/enchantments alone.
	finalDamage = Math.max(1, finalDamage);

	return finalDamage;
}

interface RawArmorValue {
	readonly armor: number;
	readonly toughness: number;
}

const VANILLA_RAW_ARMOR_VALUES: ReadonlyMap<string, RawArmorValue> = new Map([
	// Helmets
	["minecraft:leather_helmet", { armor: 1, toughness: 0 }],
	["minecraft:golden_helmet", { armor: 2, toughness: 0 }],
	["minecraft:chainmail_helmet", { armor: 2, toughness: 0 }],
	["minecraft:iron_helmet", { armor: 2, toughness: 0 }],
	["minecraft:turtle_helmet", { armor: 2, toughness: 0 }],
	["minecraft:diamond_helmet", { armor: 3, toughness: 2 }],
	["minecraft:netherite_helmet", { armor: 3, toughness: 3 }],

	// Chestplates
	["minecraft:leather_chestplate", { armor: 3, toughness: 0 }],
	["minecraft:golden_chestplate", { armor: 5, toughness: 0 }],
	["minecraft:chainmail_chestplate", { armor: 5, toughness: 0 }],
	["minecraft:iron_chestplate", { armor: 6, toughness: 0 }],
	["minecraft:diamond_chestplate", { armor: 8, toughness: 2 }],
	["minecraft:netherite_chestplate", { armor: 8, toughness: 3 }],

	// Leggings
	["minecraft:leather_leggings", { armor: 2, toughness: 0 }],
	["minecraft:golden_leggings", { armor: 3, toughness: 0 }],
	["minecraft:chainmail_leggings", { armor: 4, toughness: 0 }],
	["minecraft:iron_leggings", { armor: 5, toughness: 0 }],
	["minecraft:diamond_leggings", { armor: 6, toughness: 2 }],
	["minecraft:netherite_leggings", { armor: 6, toughness: 3 }],

	// Boots
	["minecraft:leather_boots", { armor: 1, toughness: 0 }],
	["minecraft:golden_boots", { armor: 1, toughness: 0 }],
	["minecraft:chainmail_boots", { armor: 1, toughness: 0 }],
	["minecraft:iron_boots", { armor: 2, toughness: 0 }],
	["minecraft:diamond_boots", { armor: 3, toughness: 2 }],
	["minecraft:netherite_boots", { armor: 3, toughness: 3 }],
]);

function getRawArmorValue(itemStack: mc.ItemStack): RawArmorValue {
	// Check for vanilla armor values first
	if (itemStack.typeId.startsWith("minecraft:")) {
		const vanillaValue = VANILLA_RAW_ARMOR_VALUES.get(itemStack.typeId);
		if (vanillaValue !== undefined) return vanillaValue;
	}

	let armor = 0;
	let toughness = 0;

	const tags = itemStack.getTags();

	// Parse custom armor and toughness from tags
	for (const tag of tags) {
		if (tag.startsWith("armor:")) {
			const [, value] = tag.split(":");
			armor = Number(value);
			continue;
		}
		if (tag.startsWith("toughness:")) {
			const [, value] = tag.split(":");
			toughness = Number(value);
		}
	}

	return { armor, toughness };
}

function getEquippedArmorArray(entity: mc.Entity): mc.ItemStack[] {
	const equippable = entity.getComponent("equippable")!;

	if (!equippable) return [];

	const armors: mc.ItemStack[] = [];

	const head = equippable.getEquipment(mc.EquipmentSlot.Head);
	const chest = equippable.getEquipment(mc.EquipmentSlot.Chest);
	const legs = equippable.getEquipment(mc.EquipmentSlot.Legs);
	const feet = equippable.getEquipment(mc.EquipmentSlot.Feet);

	head !== undefined ? armors.push(head) : null;
	chest !== undefined ? armors.push(chest) : null;
	legs !== undefined ? armors.push(legs) : null;
	feet !== undefined ? armors.push(feet) : null;

	return armors;
}

interface ArmorStats {
	readonly totalArmorPoints: number;
	readonly totalToughness: number;
}

function getArmorStats(armors: mc.ItemStack[]): ArmorStats {
	let totalArmorPoints = 0;
	let totalToughness = 0;

	for (const itemStack of armors) {
		const { armor, toughness } = getRawArmorValue(itemStack);
		totalArmorPoints += armor;
		totalToughness += toughness;
	}

	return { totalArmorPoints, totalToughness };
}

function calculateArmorReduction(rawDamage: number, armorStats: ArmorStats): number {
	if (armorStats.totalArmorPoints === 0) return 0;

	const penetrationFactor = armorStats.totalToughness / 4 + 2;

	// Clamp effective armor points to prevent negative or excessively high values
	const effectiveArmorPoints = Math.max(
		0,
		armorStats.totalArmorPoints - rawDamage / penetrationFactor,
	);

	// Damage reduction percentage from armor: 4% per effective armor point
	// Capped at 80% (implied by max armor points)
	let armorReductionPercentage = effectiveArmorPoints * 0.04;

	armorReductionPercentage = Math.max(armorReductionPercentage, 0.008); // 0.8% minimum resistance

	return armorReductionPercentage;
}

function calculateEnchantmentReduction(
	damageCause: mc.EntityDamageCause,
	armors: mc.ItemStack[],
): number {
	let totalEnchantmentReduction = 0;

	const isSpecializedProtection = (
		enchantmentId: string,
		damageCause: mc.EntityDamageCause,
	): boolean => {
		switch (enchantmentId) {
			case "blast_protection":
				return (
					damageCause === mc.EntityDamageCause.blockExplosion ||
					damageCause === mc.EntityDamageCause.entityExplosion
				);
			case "fire_protection":
				return (
					damageCause === mc.EntityDamageCause.fire ||
					damageCause === mc.EntityDamageCause.fireTick ||
					damageCause === mc.EntityDamageCause.lava
				);
			case "projectile_protection":
				return damageCause === mc.EntityDamageCause.projectile;
			case "feather_falling":
				return damageCause === mc.EntityDamageCause.fall;
			default:
				return false;
		}
	};

	for (const armor of armors) {
		const enchantable = armor.getComponent("enchantable");
		if (!enchantable) continue;

		const enchantments = enchantable.getEnchantments();
		for (const enchantment of enchantments) {
			const id = enchantment.type.id;
			if (id === "protection") {
				totalEnchantmentReduction += enchantment.level * 0.05;
				continue;
			}

			if (isSpecializedProtection(id, damageCause)) {
				// Specialized Protection: 8% per level per armor piece
				totalEnchantmentReduction += enchantment.level * 0.08;
			}
		}
	}

	// Cap the total enchantment reduction at 80%
	return Math.min(totalEnchantmentReduction, 0.8);
}

function calculateResistanceReduction(entity: mc.Entity): number {
	let highestResistanceLevel = 0;

	const resistanceEffect = entity.getEffect("resistance");
	if (resistanceEffect) {
		highestResistanceLevel = Math.max(highestResistanceLevel, resistanceEffect.amplifier);
	}

	switch (highestResistanceLevel) {
		case 0:
			return 0;
		case 1:
			return 0.2; // Resistance I (Amplifier 0)
		case 2:
			return 0.4; // Resistance II (Amplifier 1)
		case 3:
			return 0.6; // Resistance III (Amplifier 2)
		case 4:
			return 0.8; // Resistance IV (Amplifier 3)
		case 5:
		default:
			return 1.0; // Levels 4+ give full reduction
	}
}
