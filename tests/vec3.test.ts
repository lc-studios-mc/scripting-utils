import { Vec3 } from "@src/index";
import { describe, expect, it } from "bun:test";

describe("create", () => {
	it("creates a vector from the given components", () => {
		expect(Vec3.create({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
	});

	it("defaults missing components to 0", () => {
		expect(Vec3.create({ x: 5 })).toEqual({ x: 5, y: 0, z: 0 });
	});

	it("defaults all components to 0 when no argument is given", () => {
		expect(Vec3.create()).toEqual({ x: 0, y: 0, z: 0 });
	});
});

describe("createXYZ", () => {
	it("creates a vector from x, y, z", () => {
		expect(Vec3.createXYZ(1, 2, 3)).toEqual({ x: 1, y: 2, z: 3 });
	});
});

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

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1, y: 2, z: 3 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.addXYZ(v, 10, 20, 30, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 11, y: 22, z: 33 });
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
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

	it("writes the result to out and leaves v1 unmutated when out is given", () => {
		const v1 = { x: 11, y: 22, z: 33 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.subtract(v1, { x: 1, y: 2, z: 3 }, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 10, y: 20, z: 30 });
		expect(v1).toEqual({ x: 11, y: 22, z: 33 });
	});
});

describe("subtractXYZ", () => {
	it("subtracts x, y, z from v's components and mutates v", () => {
		const v = { x: 11, y: 22, z: 33 };
		const result = Vec3.subtractXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 11, y: 22, z: 33 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.subtractXYZ(v, 10, 20, 30, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: 2, z: 3 });
		expect(v).toEqual({ x: 11, y: 22, z: 33 });
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

	it("writes the result to out and leaves v1 unmutated when out is given", () => {
		const v1 = { x: 1, y: 2, z: 3 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.multiply(v1, { x: 10, y: 20, z: 30 }, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 10, y: 40, z: 90 });
		expect(v1).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("multiplyXYZ", () => {
	it("multiplies v's components by x, y, z and mutates v", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.multiplyXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 10, y: 40, z: 90 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1, y: 2, z: 3 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.multiplyXYZ(v, 10, 20, 30, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 10, y: 40, z: 90 });
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});
});

describe("multiplyScalar", () => {
	it("multiplies v's components by a scalar and mutates v", () => {
		const v = { x: 1, y: 2, z: 3 };
		const result = Vec3.multiplyScalar(v, 10);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 10, y: 20, z: 30 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1, y: 2, z: 3 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.multiplyScalar(v, 10, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 10, y: 20, z: 30 });
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
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

	it("writes the result to out and leaves v1 unmutated when out is given", () => {
		const v1 = { x: 10, y: 40, z: 90 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.divide(v1, { x: 10, y: 20, z: 30 }, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: 2, z: 3 });
		expect(v1).toEqual({ x: 10, y: 40, z: 90 });
	});
});

describe("divideXYZ", () => {
	it("divides v's components by x, y, z and mutates v", () => {
		const v = { x: 10, y: 40, z: 90 };
		const result = Vec3.divideXYZ(v, 10, 20, 30);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 10, y: 40, z: 90 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.divideXYZ(v, 10, 20, 30, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: 2, z: 3 });
		expect(v).toEqual({ x: 10, y: 40, z: 90 });
	});
});

describe("divideScalar", () => {
	it("divides v's components by a scalar and mutates v", () => {
		const v = { x: 10, y: 20, z: 30 };
		const result = Vec3.divideScalar(v, 10);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: 2, z: 3 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 10, y: 20, z: 30 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.divideScalar(v, 10, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: 2, z: 3 });
		expect(v).toEqual({ x: 10, y: 20, z: 30 });
	});
});

describe("dot", () => {
	it("returns 0 for orthogonal vectors", () => {
		expect(Vec3.dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(0);
	});

	it("returns the product of magnitudes for parallel vectors", () => {
		expect(Vec3.dot({ x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 })).toBe(6);
	});

	it("returns a negative value for opposing vectors", () => {
		expect(Vec3.dot({ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 })).toBe(-1);
	});

	it("computes the dot product for arbitrary vectors", () => {
		expect(Vec3.dot({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBe(32);
	});
});

describe("cross", () => {
	it("returns the unit z axis for the cross product of unit x and unit y", () => {
		const v1 = { x: 1, y: 0, z: 0 };
		const result = Vec3.cross(v1, { x: 0, y: 1, z: 0 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 0, y: 0, z: 1 });
	});

	it("returns the zero vector for parallel vectors", () => {
		const v1 = { x: 2, y: 0, z: 0 };
		Vec3.cross(v1, { x: 4, y: 0, z: 0 });
		expect(v1).toEqual({ x: 0, y: 0, z: 0 });
	});

	it("writes the result to out and leaves v1 unmutated when out is given", () => {
		const v1 = { x: 1, y: 0, z: 0 };
		const v2 = { x: 0, y: 1, z: 0 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.cross(v1, v2, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 0, y: 0, z: 1 });
		expect(v1).toEqual({ x: 1, y: 0, z: 0 });
		expect(v2).toEqual({ x: 0, y: 1, z: 0 });
	});

	it("is safe when out aliases v1 or v2", () => {
		const v1 = { x: 1, y: 0, z: 0 };
		const v2 = { x: 0, y: 1, z: 0 };
		Vec3.cross(v1, v2, v2);
		expect(v2).toEqual({ x: 0, y: 0, z: 1 });
	});
});

describe("min", () => {
	it("sets v1 to the component-wise minimum and mutates v1", () => {
		const v1 = { x: 1, y: 5, z: -3 };
		const result = Vec3.min(v1, { x: 4, y: 2, z: -1 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 1, y: 2, z: -3 });
	});

	it("writes the result to out and leaves inputs unmutated when out is given", () => {
		const v1 = { x: 1, y: 5, z: -3 };
		const v2 = { x: 4, y: 2, z: -1 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.min(v1, v2, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: 2, z: -3 });
		expect(v1).toEqual({ x: 1, y: 5, z: -3 });
		expect(v2).toEqual({ x: 4, y: 2, z: -1 });
	});
});

describe("max", () => {
	it("sets v1 to the component-wise maximum and mutates v1", () => {
		const v1 = { x: 1, y: 5, z: -3 };
		const result = Vec3.max(v1, { x: 4, y: 2, z: -1 });
		expect(result).toBe(v1);
		expect(v1).toEqual({ x: 4, y: 5, z: -1 });
	});

	it("writes the result to out and leaves inputs unmutated when out is given", () => {
		const v1 = { x: 1, y: 5, z: -3 };
		const v2 = { x: 4, y: 2, z: -1 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.max(v1, v2, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 4, y: 5, z: -1 });
		expect(v1).toEqual({ x: 1, y: 5, z: -3 });
		expect(v2).toEqual({ x: 4, y: 2, z: -1 });
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

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 3, y: 0, z: 4 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.normalize(v, out);
		expect(result).toBe(out);
		expect(out.x).toBeCloseTo(0.6);
		expect(out.y).toBeCloseTo(0);
		expect(out.z).toBeCloseTo(0.8);
		expect(v).toEqual({ x: 3, y: 0, z: 4 });
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

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1.9, y: -1.1, z: 2.5 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.floor(v, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: -2, z: 2 });
		expect(v).toEqual({ x: 1.9, y: -1.1, z: 2.5 });
	});
});

describe("round", () => {
	it("rounds v's components to the nearest integer and mutates v", () => {
		const v = { x: 1.4, y: -1.5, z: 2.5 };
		const result = Vec3.round(v);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 1, y: -1, z: 3 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1.4, y: -1.5, z: 2.5 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.round(v, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 1, y: -1, z: 3 });
		expect(v).toEqual({ x: 1.4, y: -1.5, z: 2.5 });
	});
});

describe("ceil", () => {
	it("rounds v's components up to the nearest integer and mutates v", () => {
		const v = { x: 1.1, y: -1.9, z: 2.5 };
		const result = Vec3.ceil(v);
		expect(result).toBe(v);
		expect(v).toEqual({ x: 2, y: -1, z: 3 });
	});

	it("writes the result to out and leaves v unmutated when out is given", () => {
		const v = { x: 1.1, y: -1.9, z: 2.5 };
		const out = { x: 0, y: 0, z: 0 };
		const result = Vec3.ceil(v, out);
		expect(result).toBe(out);
		expect(out).toEqual({ x: 2, y: -1, z: 3 });
		expect(v).toEqual({ x: 1.1, y: -1.9, z: 2.5 });
	});
});

describe("resolveLocalOffsets", () => {
	it("maps local axes onto world axes when rotation is zero", () => {
		const origin = { x: 0, y: 0, z: 0 };
		const out = [{ x: 0, y: 0, z: 0 }];
		Vec3.resolveLocalOffsets(origin, { x: 0, y: 0 }, [{ x: 1, y: 2, z: 3 }], out);
		const point = out[0]!;
		expect(point.x).toBeCloseTo(1);
		expect(point.y).toBeCloseTo(2);
		expect(point.z).toBeCloseTo(3);
	});

	it("does not mutate origin or localOffsets, mutates out in place, and returns out", () => {
		const origin = { x: 5, y: 5, z: 5 };
		const localOffsets = [{ x: 1, y: 0, z: 0 }];
		const out = [{ x: 0, y: 0, z: 0 }];
		const outFirst = out[0];
		const result = Vec3.resolveLocalOffsets(origin, { x: 0, y: 0 }, localOffsets, out);
		expect(origin).toEqual({ x: 5, y: 5, z: 5 });
		expect(localOffsets).toEqual([{ x: 1, y: 0, z: 0 }]);
		expect(result).toBe(out);
		expect(out[0]).toBe(outFirst);
	});

	it("rotates the forward offset with yaw", () => {
		const origin = { x: 0, y: 0, z: 0 };
		const out = [{ x: 0, y: 0, z: 0 }];
		Vec3.resolveLocalOffsets(origin, { x: 0, y: 90 }, [{ x: 0, y: 0, z: 1 }], out);
		const point = out[0]!;
		expect(point.x).toBeCloseTo(-1);
		expect(point.y).toBeCloseTo(0);
		expect(point.z).toBeCloseTo(0);
	});

	it("does not throw or produce NaN when pitch is vertical", () => {
		const origin = { x: 0, y: 0, z: 0 };
		const out = [{ x: 0, y: 0, z: 0 }];
		Vec3.resolveLocalOffsets(origin, { x: 90, y: 0 }, [{ x: 1, y: 0, z: 0 }], out);
		const point = out[0]!;
		expect(Number.isNaN(point.x)).toBe(false);
		expect(Number.isNaN(point.y)).toBe(false);
		expect(Number.isNaN(point.z)).toBe(false);
	});

	it("computes independent results for multiple entries, in input order", () => {
		const origin = { x: 0, y: 0, z: 0 };
		const out = [
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
		];
		Vec3.resolveLocalOffsets(
			origin,
			{ x: 0, y: 0 },
			[
				{ x: 1, y: 0, z: 0 },
				{ x: 0, y: 1, z: 0 },
				{ x: 0, y: 0, z: 1 },
			],
			out,
		);
		expect(out[0]).toEqual({ x: 1, y: 0, z: 0 });
		expect(out[1]).toEqual({ x: 0, y: 1, z: 0 });
		expect(out[2]).toEqual({ x: 0, y: 0, z: 1 });
	});

	it("resolves multiple entries against a non-axis-aligned rotation", () => {
		const origin = { x: 2, y: 3, z: -1 };
		const out = [
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
		];
		Vec3.resolveLocalOffsets(
			origin,
			{ x: 25, y: 35 },
			[
				{ x: 1, y: 0, z: 0 },
				{ x: 0, y: 1, z: 0 },
				{ x: 0, y: 0, z: 1 },
				{ x: 1, y: 2, z: 3 },
			],
			out,
		);

		// Computed independently from a right/up/forward basis derived from
		// pitch/yaw (not copied from the implementation).
		const expected = [
			{ x: 2.819152044288992, y: 3, z: -0.42642356364895395 },
			{ x: 1.757596123493896, y: 3.90630778703665, z: -0.6538113869412459 },
			{ x: 1.4801632092743155, y: 2.5773817382593007, z: -0.25759612349389593 },
			{ x: 0.7748339190997304, y: 3.544760788851202, z: 2.4931652919868665 },
		];

		for (let i = 0; i < expected.length; i++) {
			expect(out[i]!.x).toBeCloseTo(expected[i]!.x);
			expect(out[i]!.y).toBeCloseTo(expected[i]!.y);
			expect(out[i]!.z).toBeCloseTo(expected[i]!.z);
		}
	});
});
