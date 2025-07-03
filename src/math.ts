/**
 * Clamps a number to ensure it falls within the specified range.
 *
 * @param value - The number to clamp.
 * @param min - The minimum allowable value.
 * @param max - The maximum allowable value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (inclusive).
 * @returns A random integer between min and max.
 */
export function randi(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random floating-point number between the specified minimum and maximum values.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 * @returns A random floating-point number between min and max.
 */
export function randf(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

/** Represents a numeric range with minimum and maximum values. */
export type Range = { min: number; max: number };

/**
 * Resolves a float value from a number or a Range.
 * If a number is provided, returns it as-is.
 * If a Range is provided, returns a random float between min and max.
 *
 * @param range - A number or a Range object
 * @returns A float value
 */
export function resolveRangeFloat(range: number | Range): number {
	if (typeof range === "number") return range;
	return randf(range.min, range.max);
}

/**
 * Resolves an integer value from a number or a Range.
 * If a number is provided, returns its floored value.
 * If a Range is provided, returns a random integer between min and max.
 *
 * @param range - A number or a Range object
 * @returns An integer value
 */
export function resolveRangeInt(range: number | Range): number {
	if (typeof range === "number") return Math.floor(range);
	return randi(range.min, range.max);
}
