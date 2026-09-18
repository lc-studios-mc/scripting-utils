import { Vec3 } from "@src/index";
import { describe, expect, it } from "bun:test";

describe("clone", () => {
	it("creates a new vector with the same components", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.clone(v);
		expect(result).not.toBe(v);
		expect(result).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("add", () => {
	it("adds another vector's components and mutates v1", () => {
		const v1 = { x: 1, y: 2, z: 3 };
		const result = Vec3.add(v1, { x: 10, y: 20, z: 30 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 11, y: 22, z: 33 });
	});

	it("treats missing components as 0", () => {
		const v1 = { x: 1, y: 2, z: 3 };
		Vec3.add(v1, { x: 5 });
		expect(v1).toEqual({ x: 6, y: 2, z: 3 });
	});
});

describe("addXYZ", () => {
	it("adds x, y, z to v's components and mutates v", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.addXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 11, y: 22, z: 33 });
	});
});

describe("subtract", () => {
	it("subtracts another vector's components and mutates v1", () => {
		const v1 = { x: 11, y: 22, z: 33 };
		const result = Vec3.subtract(v1, { x: 1, y: 2, z: 3 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 10, y: 20, z: 30 });
	});

	it("treats missing components as 0", () => {
		const v1 = { x: 6, y: 2, z: 3 };
		Vec3.subtract(v1, { x: 5 });
		expect(v1).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("subtractXYZ", () => {
	it("subtracts x, y, z from v's components and mutates v", () => {
		const v = { x: 11, y: 22, z: 33 };
		const result = Vec3.subtractXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("multiply", () => {
	it("multiplies v1's components by another vector's components and mutates v1", () => {
		const v1 = { x: 1, y: 2, z: 3 };
		const result = Vec3.multiply(v1, { x: 10, y: 20, z: 30 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 10, y: 40, z: 90 });
	});

	it("treats missing components as 1", () => {
		const v1 = { x: 1, y: 2, z: 3 };
		Vec3.multiply(v1, { x: 5 });
		expect(v1).toEqual({ x: 5, y: 2, z: 3 });
	});
});

describe("multiplyXYZ", () => {
	it("multiplies v's components by x, y, z and mutates v", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.multiplyXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 10, y: 40, z: 90 });
	});
});

describe("multiplyScalar", () => {
	it("multiplies v's components by a scalar and mutates v", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.multiplyScalar(v, 10);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 10, y: 20, z: 30 });
	});
});

describe("divide", () => {
	it("divides v1's components by another vector's components and mutates v1", () => {
		const v1 = { x: 10, y: 40, z: 90 };
		const result = Vec3.divide(v1, { x: 10, y: 20, z: 30 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 1, y: 2, z: 3 });
	});

	it("treats missing components as 1", () => {
		const v1 = { x: 5, y: 2, z: 3 };
		Vec3.divide(v1, { x: 5 });
		expect(v1).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("divideXYZ", () => {
	it("divides v's components by x, y, z and mutates v", () => {
		const v = { x: 10, y: 40, z: 90 };
		const result = Vec3.divideXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("divideScalar", () => {
	it("divides v's components by a scalar and mutates v", () => {
		const v = { x: 10, y: 20, z: 30 };
		const result = Vec3.divideScalar(v, 10);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("normalize", () => {
	it("normalizes v in place to a unit vector", () => {
		const v = { x: 3, y: 0, z: 4 };
		const result = Vec3.normalize(v);
		expect(result).toBe(v);
		expect(v.x).toBeCloseTo(0.6);
		expect(v.y).toBeCloseTo(0);
		expect(v.z).toBeCloseTo(0.8);
	});
});

describe("length", () => {
	it("calculates the length of a vector", () => {
		expect(Vec3.length({ x: 3, y: 0, z: 4 })).toBe(5);
	});
});

describe("lengthSq", () => {
	it("calculates the squared length of a vector", () => {
		expect(Vec3.lengthSq({ x: 3, y: 0, z: 4 })).toBe(25);
	});
});

describe("distance", () => {
	it("calculates the distance between two vectors", () => {
		const v1 = { x: 0, y: 0, z: 0 };
		const v2 = { x: 3, y: 0, z: 4 };
		expect(Vec3.distance(v1, v2)).toBe(5);
	});
});

describe("distanceSq", () => {
	it("calculates the squared distance between two vectors", () => {
		const v1 = { x: 0, y: 0, z: 0 };
		const v2 = { x: 3, y: 0, z: 4 };
		expect(Vec3.distanceSq(v1, v2)).toBe(25);
	});
});

describe("floor", () => {
	it("rounds v's components down to the nearest integer and mutates v", () => {
		const v = { x: 1.9, y: -1.1, z: 2.5 };
		const result = Vec3.floor(v);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: -2, z: 2 });
	});
});

describe("round", () => {
	it("rounds v's components to the nearest integer and mutates v", () => {
		const v = { x: 1.4, y: -1.5, z: 2.5 };
		const result = Vec3.round(v);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: -1, z: 3 });
	});
});

describe("ceil", () => {
	it("rounds v's components up to the nearest integer and mutates v", () => {
		const v = { x: 1.1, y: -1.9, z: 2.5 };
		const result = Vec3.ceil(v);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 2, y: -1, z: 3 });
	});
});
