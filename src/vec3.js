/** @import { Vector3 } from "@minecraft/server" */

/**
 * Creates a new vector with the same components as `v`.
 *
 * @param {Vector3} v - The vector to copy.
 * @returns {Vector3} A new vector with `v`'s components.
 */
export function clone(v) {
	return { x: v.x, y: v.y, z: v.z };
}

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

/**
 * Subtracts another vector's components from `v1`, mutating it in place.
 *
 * @param {Vector3} v1 - The vector to mutate.
 * @param {Partial<Vector3>} v2 - Components to subtract; missing ones default to 0.
 * @returns {Vector3} The mutated `v1`.
 */
export function subtract(v1, v2) {
	v1.x -= v2.x ?? 0;
	v1.y -= v2.y ?? 0;
	v1.z -= v2.z ?? 0;
	return v1;
}

/**
 * Subtracts x, y, z from `v`'s components, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} x - Value to subtract from `v.x`.
 * @param {number} y - Value to subtract from `v.y`.
 * @param {number} z - Value to subtract from `v.z`.
 * @returns {Vector3} The mutated `v`.
 */
export function subtractXYZ(v, x, y, z) {
	v.x -= x;
	v.y -= y;
	v.z -= z;
	return v;
}

/**
 * Multiplies `v1`'s components by another vector's components, mutating it in place.
 *
 * @param {Vector3} v1 - The vector to mutate.
 * @param {Partial<Vector3>} v2 - Components to multiply by; missing ones default to 1.
 * @returns {Vector3} The mutated `v1`.
 */
export function multiply(v1, v2) {
	v1.x *= v2.x ?? 1;
	v1.y *= v2.y ?? 1;
	v1.z *= v2.z ?? 1;
	return v1;
}

/**
 * Multiplies `v`'s components by x, y, z, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} x - Value to multiply `v.x` by.
 * @param {number} y - Value to multiply `v.y` by.
 * @param {number} z - Value to multiply `v.z` by.
 * @returns {Vector3} The mutated `v`.
 */
export function multiplyXYZ(v, x, y, z) {
	v.x *= x;
	v.y *= y;
	v.z *= z;
	return v;
}

/**
 * Multiplies `v`'s components by a scalar, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} scalar - Value to multiply each component by.
 * @returns {Vector3} The mutated `v`.
 */
export function multiplyScalar(v, scalar) {
	v.x *= scalar;
	v.y *= scalar;
	v.z *= scalar;
	return v;
}

/**
 * Divides `v1`'s components by another vector's components, mutating it in place.
 *
 * @param {Vector3} v1 - The vector to mutate.
 * @param {Partial<Vector3>} v2 - Components to divide by; missing ones default to 1.
 * @returns {Vector3} The mutated `v1`.
 */
export function divide(v1, v2) {
	v1.x /= v2.x ?? 1;
	v1.y /= v2.y ?? 1;
	v1.z /= v2.z ?? 1;
	return v1;
}

/**
 * Divides `v`'s components by x, y, z, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} x - Value to divide `v.x` by.
 * @param {number} y - Value to divide `v.y` by.
 * @param {number} z - Value to divide `v.z` by.
 * @returns {Vector3} The mutated `v`.
 */
export function divideXYZ(v, x, y, z) {
	v.x /= x;
	v.y /= y;
	v.z /= z;
	return v;
}

/**
 * Divides `v`'s components by a scalar, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @param {number} scalar - Value to divide each component by.
 * @returns {Vector3} The mutated `v`.
 */
export function divideScalar(v, scalar) {
	v.x /= scalar;
	v.y /= scalar;
	v.z /= scalar;
	return v;
}

/**
 * Normalizes `v` in place, making it a unit vector.
 *
 * @param {Vector3} v - The vector to mutate.
 * @returns {Vector3} The mutated `v`.
 */
export function normalize(v) {
	const len = length(v);
	v.x /= len;
	v.y /= len;
	v.z /= len;
	return v;
}

/**
 * Calculates the length (magnitude) of `v`.
 *
 * @param {Vector3} v - The vector to measure.
 * @returns {number} The length of `v`.
 */
export function length(v) {
	return Math.sqrt(lengthSq(v));
}

/**
 * Calculates the squared length of `v`.
 *
 * @param {Vector3} v - The vector to measure.
 * @returns {number} The squared length of `v`.
 */
export function lengthSq(v) {
	return v.x * v.x + v.y * v.y + v.z * v.z;
}

/**
 * Calculates the distance between `v1` and `v2`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @returns {number} The distance between `v1` and `v2`.
 */
export function distance(v1, v2) {
	return Math.sqrt(distanceSq(v1, v2));
}

/**
 * Calculates the squared distance between `v1` and `v2`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @returns {number} The squared distance between `v1` and `v2`.
 */
export function distanceSq(v1, v2) {
	const dx = v1.x - v2.x;
	const dy = v1.y - v2.y;
	const dz = v1.z - v2.z;
	return dx * dx + dy * dy + dz * dz;
}

/**
 * Rounds `v`'s components down to the nearest integer, mutating it in place.
 *
 * @param {Vector3} v - The vector to mutate.
 * @returns {Vector3} The mutated `v`.
 */
export function floor(v) {
	v.x = Math.floor(v.x);
	v.y = Math.floor(v.y);
	v.z = Math.floor(v.z);
	return v;
}
