import { Vec3 } from "@src/index";
import { describe, expect, it } from "bun:test";

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
