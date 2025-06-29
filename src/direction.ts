import * as mc from "@minecraft/server";
import { Vec3 } from "./vec3.js";

/**
 * Reverse a cardinal direction.
 *
 * @param direction - Original direction.
 * @returns Reversed version of `direction`.
 */
export function reverseDirection(direction: mc.Direction): mc.Direction {
	switch (direction) {
		case mc.Direction.Up:
			return mc.Direction.Down;
		case mc.Direction.Down:
			return mc.Direction.Up;
		case mc.Direction.North:
			return mc.Direction.South;
		case mc.Direction.South:
			return mc.Direction.North;
		case mc.Direction.West:
			return mc.Direction.East;
		case mc.Direction.East:
			return mc.Direction.West;
	}
}

/**
 * Gets a location relative to an origin, rotated by a cardinal direction.
 *
 * @param origin - The origin vector.
 * @param relative - The relative offset vector.
 * @param cardinalDirection - The cardinal direction (default North).
 * @returns The relative location vector.
 */
export function getRelativeLocationAtDirection(
	origin: mc.Vector3,
	relative: mc.Vector3,
	cardinalDirection = mc.Direction.North,
) {
	switch (cardinalDirection) {
		default:
		case mc.Direction.North:
			return Vec3.add(origin, relative);
		case mc.Direction.South:
			return Vec3.add(origin, Vec3.rotateDeg(relative, Vec3.up, 180));
		case mc.Direction.West:
			return Vec3.add(origin, Vec3.rotateDeg(relative, Vec3.up, 90));
		case mc.Direction.East:
			return Vec3.add(origin, Vec3.rotateDeg(relative, Vec3.up, -90));
	}
}
