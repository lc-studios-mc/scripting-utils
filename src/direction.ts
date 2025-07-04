import * as mc from "@minecraft/server";
import { Vec3 } from "./vec3.js";

/**
 * Returns the cardinal direction (North, East, South, West, Up, Down) based on a rotation vector.
 *
 * @param rotation - The rotation as a Vector2 (x: pitch, y: yaw in degrees).
 * @param ignoreX - If true, ignores the X (pitch) axis for Up/Down.
 * @param ignoreY - If true, ignores the Y (yaw) axis for horizontal directions.
 * @returns The corresponding Direction value.
 */
export const getCardinalDirectionOfRotation = (
	rotation: mc.Vector2,
	ignoreX = false,
	ignoreY = false,
): mc.Direction => {
	// Handle vertical (Up/Down) direction if not ignored
	if (!ignoreX) {
		if (rotation.x > 45) {
			return mc.Direction.Down;
		}
		if (rotation.x < -45) {
			return mc.Direction.Up;
		}
	}

	// Handle horizontal (North/East/South/West) direction if not ignored
	if (!ignoreY) {
		const yaw = rotation.y;
		// Normalize yaw to (-180, 180)
		const normalizedYaw = ((yaw + 180) % 360) - 180;

		if (normalizedYaw >= -45 && normalizedYaw < 45) {
			return mc.Direction.North;
		} else if (normalizedYaw >= 45 && normalizedYaw < 135) {
			return mc.Direction.East;
		} else if (normalizedYaw >= 135 || normalizedYaw < -135) {
			return mc.Direction.South;
		} else if (normalizedYaw >= -135 && normalizedYaw < -45) {
			return mc.Direction.West;
		}
	}

	// Default fallback
	return mc.Direction.North;
};

/**
 * Reverse a cardinal direction.
 *
 * @param direction - Original direction.
 * @returns Reversed version of `direction`.
 */
export const reverseDirection = (direction: mc.Direction): mc.Direction => {
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
};

/**
 * Gets a location relative to an origin, rotated by a cardinal direction.
 *
 * @param origin - The origin vector.
 * @param relative - The relative offset vector.
 * @param cardinalDirection - The cardinal direction (default North).
 * @returns The relative location vector.
 */
export const getRelativeLocationAtDirection = (
	origin: mc.Vector3,
	relative: mc.Vector3,
	cardinalDirection = mc.Direction.North,
) => {
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
};
