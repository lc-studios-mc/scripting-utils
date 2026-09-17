// Copyright (c) 2026 LuckedCoronet
// SPDX-License-Identifier: MIT

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} The clamped value.
 */
export function clampNumber(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * Converts an angle from degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} The angle in radians.
 */
export function degToRad(degrees) {
	return (degrees * Math.PI) / 180;
}

/**
 * Converts an angle from radians to degrees.
 *
 * @param {number} radians
 * @returns {number} The angle in degrees.
 */
export function radToDeg(radians) {
	return (radians * 180) / Math.PI;
}

/**
 * Returns a random integer between min and max, inclusive.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number} A random integer in the range [min, max].
 */
export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random floating-point number between min (inclusive) and max (exclusive).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number} A random float in the range [min, max).
 */
export function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
