/** @import { Vector3 } from "@minecraft/server" */

/**
 * Adds another vector's components to `v1`, mutating it in place.
 *
 * @param {Vector3} v1 - The vector to mutate.
 * @param {Partial<Vector3>} v2 - Components to add; missing ones default to 0.
 * @returns {Vector3} The mutated `v1`.
 */
export function add(v1, v2) {
	v1.x += v2.x ?? 0;
	v1.y += v2.y ?? 0;
	v1.z += v2.z ?? 0;
	return v1;
}

/**
 * Adds x, y, z to `v`'s components, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} x - Value to add to `v.x`.
 * @param {number} y - Value to add to `v.y`.
 * @param {number} z - Value to add to `v.z`.
 * @returns {Vector3} The mutated `v`.
 */
export function addXYZ(v, x, y, z) {
	v.x += x;
	v.y += y;
	v.z += z;
	return v;
}
