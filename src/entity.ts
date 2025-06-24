import * as mc from "@minecraft/server";

/**
 * @returns Whether current health of `entity` is greater than 0.
 */
export function isEntityAlive(entity: mc.Entity): boolean {
	if (!entity.isValid) return false;
	const health = entity.getComponent("health")!;
	return health.currentValue > 0;
}
