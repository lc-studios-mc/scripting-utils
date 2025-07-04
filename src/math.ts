/** Represents a numeric range with minimum and maximum values. */
export type Range = { min: number; max: number };

/**
 * Clamps a number to ensure it falls within the specified range.
 *
 * @param value - The number to clamp.
 * @param min - The minimum allowable value.
 * @param max - The maximum allowable value.
 * @returns The clamped value.
 */
export const clamp = (value: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, value));

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (inclusive).
 * @returns A random integer between min and max.
 */
export const randi = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a random floating-point number between the specified minimum and maximum values.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 * @returns A random floating-point number between min and max.
 */
export const randf = (min: number, max: number): number => Math.random() * (max - min) + min;

/**
 * Resolves a float value from a number, a Range, or undefined.
 * If a number is provided, returns it as-is.
 * If a Range is provided, returns a random float between min and max.
 * If undefined, returns the fallback value.
 *
 * @param range - A number, a Range object, or undefined
 * @param fallback - Value to return if range is undefined (default: 0)
 * @returns A float value
 */
export const resolveRangeFloat = (range?: number | Range, fallback = 0): number => {
	if (range === undefined) return fallback;
	if (typeof range === "number") return range;
	return randf(range.min, range.max);
};

/**
 * Resolves an integer value from a number, a Range, or undefined.
 * If a number is provided, returns its floored value.
 * If a Range is provided, returns a random integer between min and max.
 * If undefined, returns the fallback value.
 *
 * @param range - A number, a Range object, or undefined
 * @param fallback - Value to return if range is undefined (default: 0)
 * @returns An integer value
 */
export const resolveRangeInt = (range?: number | Range, fallback = 0): number => {
	if (range === undefined) return fallback;
	if (typeof range === "number") return Math.floor(range);
	return randi(range.min, range.max);
};
