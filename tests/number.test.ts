import { clampNumber, degToRad, radToDeg, randomFloat, randomInt } from "@src/number";
import { describe, expect, it } from "bun:test";

describe("clampNumber", () => {
	it("returns value when within range", () => {
		expect(clampNumber(5, 0, 10)).toBe(5);
	});

	it("clamps to min when below range", () => {
		expect(clampNumber(-5, 0, 10)).toBe(0);
	});

	it("clamps to max when above range", () => {
		expect(clampNumber(15, 0, 10)).toBe(10);
	});
});

describe("degToRad", () => {
	it("converts degrees to radians", () => {
		expect(degToRad(180)).toBe(Math.PI);
		expect(degToRad(90)).toBe(Math.PI / 2);
		expect(degToRad(0)).toBe(0);
	});
});

describe("radToDeg", () => {
	it("converts radians to degrees", () => {
		expect(radToDeg(Math.PI)).toBe(180);
		expect(radToDeg(Math.PI / 2)).toBe(90);
		expect(radToDeg(0)).toBe(0);
	});
});

describe("randomInt", () => {
	it("returns a value within the inclusive range", () => {
		for (let i = 0; i < 100; i++) {
			const result = randomInt(1, 6);
			expect(result).toBeGreaterThanOrEqual(1);
			expect(result).toBeLessThanOrEqual(6);
			expect(Number.isInteger(result)).toBe(true);
		}
	});

	it("returns the only possible value when min equals max", () => {
		expect(randomInt(5, 5)).toBe(5);
	});
});

describe("randomFloat", () => {
	it("returns a value within the range [min, max)", () => {
		for (let i = 0; i < 100; i++) {
			const result = randomFloat(1, 6);
			expect(result).toBeGreaterThanOrEqual(1);
			expect(result).toBeLessThan(6);
		}
	});
});
