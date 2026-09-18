import { clampNumber, degToRad } from "./number.js";

/** @import { Vector2, Vector3 } from "@minecraft/server" */

/**
 * Creates a new vector.
 *
 * @param {Partial<Vector3>} [v] - Components to use; missing ones default to 0.
 * @returns {Vector3} A new vector.
 */
export function create(v) {
	return { x: v?.x ?? 0, y: v?.y ?? 0, z: v?.z ?? 0 };
}

/**
 * Creates a new vector from x, y, z.
 *
 * @param {number} x - The x component.
 * @param {number} y - The y component.
 * @param {number} z - The z component.
 * @returns {Vector3} A new vector.
 */
export function createXYZ(x, y, z) {
	return { x, y, z };
}

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
 * Calculates the dot product of `v1` and `v2`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @returns {number} The dot product of `v1` and `v2`.
 */
export function dot(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculates the cross product of `v1` and `v2`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function cross(v1, v2, out = v1) {
	const x = v1.y * v2.z - v1.z * v2.y;
	const y = v1.z * v2.x - v1.x * v2.z;
	const z = v1.x * v2.y - v1.y * v2.x;
	out.x = x;
	out.y = y;
	out.z = z;
	return out;
}

/**
 * Sets `out`'s components to the smaller of `v1`'s and `v2`'s components.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function min(v1, v2, out = v1) {
	out.x = Math.min(v1.x, v2.x);
	out.y = Math.min(v1.y, v2.y);
	out.z = Math.min(v1.z, v2.z);
	return out;
}

/**
 * Sets `out`'s components to the larger of `v1`'s and `v2`'s components.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function max(v1, v2, out = v1) {
	out.x = Math.max(v1.x, v2.x);
	out.y = Math.max(v1.y, v2.y);
	out.z = Math.max(v1.z, v2.z);
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
 * Clamps `v`'s components between the corresponding components of `min` and `max`.
 *
 * @param {Vector3} v - The vector to clamp.
 * @param {Vector3} min - Per-component minimum values.
 * @param {Vector3} max - Per-component maximum values.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function clamp(v, min, max, out = v) {
	out.x = clampNumber(v.x, min.x, max.x);
	out.y = clampNumber(v.y, min.y, max.y);
	out.z = clampNumber(v.z, min.z, max.z);
	return out;
}

/**
 * Linearly interpolates between `v1` and `v2` by `t`.
 *
 * @param {Vector3} v1 - The vector to interpolate from.
 * @param {Vector3} v2 - The vector to interpolate to.
 * @param {number} t - Interpolation factor, typically between 0 and 1.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function lerp(v1, v2, t, out = v1) {
	const x = v1.x + (v2.x - v1.x) * t;
	const y = v1.y + (v2.y - v1.y) * t;
	const z = v1.z + (v2.z - v1.z) * t;
	out.x = x;
	out.y = y;
	out.z = z;
	return out;
}

/**
 * Flips the sign of `v`'s components.
 *
 * @param {Vector3} v - The vector to negate.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function negate(v, out = v) {
	out.x = -v.x;
	out.y = -v.y;
	out.z = -v.z;
	return out;
}

/**
 * Checks whether `v1` and `v2` have exactly equal components.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @returns {boolean} Whether `v1` and `v2` are exactly equal.
 */
export function equals(v1, v2) {
	return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}

/**
 * Checks whether `v1` and `v2` are equal within `epsilon`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @param {number} [epsilon] - Maximum allowed difference per component. Defaults to `1e-6`.
 * @returns {boolean} Whether `v1` and `v2` are approximately equal.
 */
export function almostEquals(v1, v2, epsilon = 1e-6) {
	return (
		Math.abs(v1.x - v2.x) <= epsilon &&
		Math.abs(v1.y - v2.y) <= epsilon &&
		Math.abs(v1.z - v2.z) <= epsilon
	);
}

/**
 * Calculates the angle in radians between `v1` and `v2`.
 *
 * @param {Vector3} v1 - The first vector.
 * @param {Vector3} v2 - The second vector.
 * @returns {number} The angle between `v1` and `v2`, in radians.
 */
export function angleBetween(v1, v2) {
	const cos = dot(v1, v2) / (length(v1) * length(v2));
	return Math.acos(clampNumber(cos, -1, 1));
}

/**
 * Spherically interpolates between `v1` and `v2` by `t`, treating both as directions
 * from the origin.
 *
 * @param {Vector3} v1 - The vector to interpolate from.
 * @param {Vector3} v2 - The vector to interpolate to.
 * @param {number} t - Interpolation factor, typically between 0 and 1.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function slerp(v1, v2, t, out = v1) {
	const theta = angleBetween(v1, v2);
	const sinTheta = Math.sin(theta);

	if (sinTheta < 1e-6) return lerp(v1, v2, t, out);

	const a = Math.sin((1 - t) * theta) / sinTheta;
	const b = Math.sin(t * theta) / sinTheta;
	const x = v1.x * a + v2.x * b;
	const y = v1.y * a + v2.y * b;
	const z = v1.z * a + v2.z * b;
	out.x = x;
	out.y = y;
	out.z = z;
	return out;
}

/**
 * Reflects `v` off a surface with the given unit `normal`.
 *
 * @param {Vector3} v - The vector to reflect.
 * @param {Vector3} normal - The unit-length surface normal to reflect off.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v`.
 * @returns {Vector3} The mutated `out`.
 */
export function reflect(v, normal, out = v) {
	const d = 2 * dot(v, normal);
	const x = v.x - d * normal.x;
	const y = v.y - d * normal.y;
	const z = v.z - d * normal.z;
	out.x = x;
	out.y = y;
	out.z = z;
	return out;
}

/**
 * Projects `v1` onto `v2`.
 *
 * @param {Vector3} v1 - The vector to project.
 * @param {Vector3} v2 - The vector to project onto.
 * @param {Vector3} [out] - Vector to write the result to. Defaults to `v1`.
 * @returns {Vector3} The mutated `out`.
 */
export function project(v1, v2, out = v1) {
	const scalar = dot(v1, v2) / lengthSq(v2);
	const x = v2.x * scalar;
	const y = v2.y * scalar;
	const z = v2.z * scalar;
	out.x = x;
	out.y = y;
	out.z = z;
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
		const vx = v.x;
		const vy = v.y;
		const vz = v.z;
		o.x = origin.x + rx * vx + ux * vy + fx * vz;
		o.y = origin.y + uy * vy + fy * vz;
		o.z = origin.z + rz * vx + uz * vy + fz * vz;
	}

	return out;
}
