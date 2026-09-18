import { degToRad } from "./number.js";

/** @import { Vector2, Vector3 } from "@minecraft/server" */

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
 * Adds `v2`'s components to `v1`.
 *
 * @param {Vector3} v1 - The vector to add to.
 * @param {Partial<Vector3>} v2 - Components to add; missing ones default to 0.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function add(v1, v2, out = v1) {
	out.x += v2.x ?? 0;
	out.y += v2.y ?? 0;
	out.z += v2.z ?? 0;
	return out;
}

/**
 * Adds x, y, z to `v`'s components.
 *
 * @param {Vector3} v - The vector to add to.
 * @param {number} x - Value to add to `v.x`.
 * @param {number} y - Value to add to `v.y`.
 * @param {number} z - Value to add to `v.z`.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function addXYZ(v, x, y, z, out = v) {
	out.x = v.x + x;
	out.y = v.y + y;
	out.z = v.z + z;
	return out;
}

/**
 * Subtracts `v2`'s components from `v1`.
 *
 * @param {Vector3} v1 - The vector to subtract from.
 * @param {Partial<Vector3>} v2 - Components to subtract; missing ones default to 0.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function subtract(v1, v2, out = v1) {
	out.x = v1.x - (v2.x ?? 0);
	out.y = v1.y - (v2.y ?? 0);
	out.z = v1.z - (v2.z ?? 0);
	return out;
}

/**
 * Subtracts x, y, z from `v`'s components.
 *
 * @param {Vector3} v - The vector to subtract from.
 * @param {number} x - Value to subtract from `v.x`.
 * @param {number} y - Value to subtract from `v.y`.
 * @param {number} z - Value to subtract from `v.z`.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function subtractXYZ(v, x, y, z, out = v) {
	out.x = v.x - x;
	out.y = v.y - y;
	out.z = v.z - z;
	return out;
}

/**
 * Multiplies `v1`'s components by `v2`'s components.
 *
 * @param {Vector3} v1 - The vector to multiply.
 * @param {Partial<Vector3>} v2 - Components to multiply by; missing ones default to 1.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function multiply(v1, v2, out = v1) {
	out.x = v1.x * (v2.x ?? 1);
	out.y = v1.y * (v2.y ?? 1);
	out.z = v1.z * (v2.z ?? 1);
	return out;
}

/**
 * Multiplies `v`'s components by x, y, z.
 *
 * @param {Vector3} v - The vector to multiply.
 * @param {number} x - Value to multiply `v.x` by.
 * @param {number} y - Value to multiply `v.y` by.
 * @param {number} z - Value to multiply `v.z` by.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function multiplyXYZ(v, x, y, z, out = v) {
	out.x = v.x * x;
	out.y = v.y * y;
	out.z = v.z * z;
	return out;
}

/**
 * Multiplies `v`'s components by a scalar.
 *
 * @param {Vector3} v - The vector to multiply.
 * @param {number} scalar - Value to multiply each component by.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function multiplyScalar(v, scalar, out = v) {
	out.x = v.x * scalar;
	out.y = v.y * scalar;
	out.z = v.z * scalar;
	return out;
}

/**
 * Divides `v1`'s components by `v2`'s components.
 *
 * @param {Vector3} v1 - The vector to divide.
 * @param {Partial<Vector3>} v2 - Components to divide by; missing ones default to 1.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function divide(v1, v2, out = v1) {
	out.x = v1.x / (v2.x ?? 1);
	out.y = v1.y / (v2.y ?? 1);
	out.z = v1.z / (v2.z ?? 1);
	return out;
}

/**
 * Divides `v`'s components by x, y, z.
 *
 * @param {Vector3} v - The vector to divide.
 * @param {number} x - Value to divide `v.x` by.
 * @param {number} y - Value to divide `v.y` by.
 * @param {number} z - Value to divide `v.z` by.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function divideXYZ(v, x, y, z, out = v) {
	out.x = v.x / x;
	out.y = v.y / y;
	out.z = v.z / z;
	return out;
}

/**
 * Divides `v`'s components by a scalar.
 *
 * @param {Vector3} v - The vector to divide.
 * @param {number} scalar - Value to divide each component by.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function divideScalar(v, scalar, out = v) {
	out.x = v.x / scalar;
	out.y = v.y / scalar;
	out.z = v.z / scalar;
	return out;
}

/**
 * Normalizes `v`, making it a unit vector.
 *
 * @param {Vector3} v - The vector to normalize.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function normalize(v, out = v) {
	const len = length(v);
	out.x = v.x / len;
	out.y = v.y / len;
	out.z = v.z / len;
	return out;
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
 * Rounds `v`'s components down to the nearest integer.
 *
 * @param {Vector3} v - The vector to round.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function floor(v, out = v) {
	out.x = Math.floor(v.x);
	out.y = Math.floor(v.y);
	out.z = Math.floor(v.z);
	return out;
}

/**
 * Rounds `v`'s components to the nearest integer.
 *
 * @param {Vector3} v - The vector to round.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function round(v, out = v) {
	out.x = Math.round(v.x);
	out.y = Math.round(v.y);
	out.z = Math.round(v.z);
	return out;
}

/**
 * Rounds `v`'s components up to the nearest integer.
 *
 * @param {Vector3} v - The vector to round.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function ceil(v, out = v) {
	out.x = Math.ceil(v.x);
	out.y = Math.ceil(v.y);
	out.z = Math.ceil(v.z);
	return out;
}

/**
 * Converts local right/up/forward offsets into world-space points.
 *
 * @param {Vector3} origin - The world-space origin point.
 * @param {Vector2} rotation - Pitch (`x`) and yaw (`y`) in degrees, e.g. from `entity.getRotation()`.
 * @param {Vector3[]} localOffsets - Offsets in local space (x=right, y=up, z=forward).
 * @param {Vector3[]} out - Output array, mutated in place; length must be >= `localOffsets.length`.
 * @returns {Vector3[]} The mutated `out`.
 * @throws {Error} If a `localOffsets` or `out` entry is missing at the same index.
 */
export function resolveLocalOffsets(origin, rotation, localOffsets, out) {
	const pitch = degToRad(rotation.x);
	const yaw = degToRad(rotation.y);

	const sinP = Math.sin(pitch);
	const cosP = Math.cos(pitch);
	const sinY = Math.sin(yaw);
	const cosY = Math.cos(yaw);

	const fx = -cosP * sinY;
	const fy = -sinP;
	const fz = cosP * cosY;
	const rx = cosY;
	const rz = sinY;
	const ux = -sinP * sinY;
	const uy = cosP;
	const uz = sinP * cosY;

	for (let i = 0; i < localOffsets.length; i++) {
		const v = localOffsets[i];
		const o = out[i];
		if (!v || !o) throw new Error(`Missing vector at index ${i}`);
		o.x = origin.x + rx * v.x + ux * v.y + fx * v.z;
		o.y = origin.y + uy * v.y + fy * v.z;
		o.z = origin.z + rz * v.x + uz * v.y + fz * v.z;
	}

	return out;
}
