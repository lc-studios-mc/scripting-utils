import type { Vector3 } from "@minecraft/server";
import { randf } from "./math.js";

/**
 * Utility class for 3D vector math, compatible with Minecraft's Vector3 interface.
 * Provides static and instance methods for common vector operations, including addition, subtraction, scaling, normalization, dot/cross products, and more.
 *
 * @example
 *
 * ```typescript
 * // Pure static methods
 * const example1 = Vec3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })
 * console.log(Vec3.toString(example1)); // (5, 7, 9)
 *
 * // Easily combine multiple operations with method chain
 * const example2 = new Vec3()
 *   .add({ x: 3, y: 3, z: 3 })
 *   .add({ x: -3, y: 4, z: -1 })
 * console.log(example2.toString()); // (0, 7, 2)
 * ```
 */
export class Vec3 implements Vector3 {
	static readonly one = Object.freeze({
		x: 1,
		y: 1,
		z: 1,
	});

	static readonly half = Object.freeze({
		x: 0.5,
		y: 0.5,
		z: 0.5,
	});

	static readonly zero = Object.freeze({
		x: 0,
		y: 0,
		z: 0,
	});

	static readonly up = Object.freeze({
		x: 0,
		y: 1,
		z: 0,
	});

	static readonly down = Object.freeze({
		x: 0,
		y: -1,
		z: 0,
	});

	static readonly left = Object.freeze({
		x: -1,
		y: 0,
		z: 0,
	});

	static readonly right = Object.freeze({
		x: 1,
		y: 0,
		z: 0,
	});

	static readonly forward = Object.freeze({
		x: 0,
		y: 0,
		z: 1,
	});

	static readonly backward = Object.freeze({
		x: 0,
		y: 0,
		z: -1,
	});

	/**
	 * Checks if something is a valid Vector3 object.
	 * @param value - The value to check.
	 * @returns Whether `value` is a Vector3 object.
	 */
	static isVector3(value: unknown): value is Vector3 {
		if (value == null) return false;
		if (typeof value !== "object") return false;
		if (Array.isArray(value)) return false;

		const hasXYZ =
			"x" in value &&
			typeof value.x === "number" &&
			"y" in value &&
			typeof value.y === "number" &&
			"z" in value &&
			typeof value.z === "number";

		return hasXYZ;
	}

	/**
	 * Creates a complete Vector3.
	 *
	 * It uses properties from the `primary` object first. Any missing properties
	 * are then filled from the `fallback` object. If a property is missing from both,
	 * it defaults to 0.
	 *
	 * @param primary - The partial vector whose properties take precedence.
	 * @param fallback - The partial vector used to fill in any missing properties.
	 * @returns A new, complete Vector3.
	 */
	static create(primary?: Partial<Vector3>, fallback?: Partial<Vector3>): Vector3 {
		const defaults = { x: 0, y: 0, z: 0 };

		return {
			...defaults,
			...fallback,
			...primary,
		};
	}

	/**
	 * Creates a Vector3 from a partial object, filling missing components with 0.
	 * @param value - Partial vector with optional x, y, z properties.
	 * @returns A complete Vector3 object.
	 */
	static fromPartial(value?: Partial<Vector3>): Vector3 {
		return {
			x: value?.x ?? 0,
			y: value?.y ?? 0,
			z: value?.z ?? 0,
		};
	}

	/**
	 * Clones a Vector3 object.
	 * @returns Copy of `vec`.
	 */
	static clone(vec: Vector3): Vector3 {
		return {
			x: vec.x,
			y: vec.y,
			z: vec.z,
		};
	}

	/**
	 * Adds vecB to vecA.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The resulting vector.
	 */
	static add(vecA: Vector3, vecB: Vector3): Vector3 {
		return {
			x: vecA.x + vecB.x,
			y: vecA.y + vecB.y,
			z: vecA.z + vecB.z,
		};
	}

	/**
	 * Subtracts vecB from vecA.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The resulting vector.
	 */
	static sub(vecA: Vector3, vecB: Vector3): Vector3 {
		return {
			x: vecA.x - vecB.x,
			y: vecA.y - vecB.y,
			z: vecA.z - vecB.z,
		};
	}

	/**
	 * Scales a vector by a scalar or another vector.
	 * @param vec - The vector to scale.
	 * @param scalar - The scalar or vector to scale by.
	 * @returns The scaled vector.
	 */
	static scale(vec: Vector3, scalar: Vector3 | number): Vector3 {
		if (typeof scalar === "number") {
			return {
				x: vec.x * scalar,
				y: vec.y * scalar,
				z: vec.z * scalar,
			};
		}
		if (this.isVector3(scalar)) {
			return {
				x: vec.x * scalar.x,
				y: vec.y * scalar.y,
				z: vec.z * scalar.z,
			};
		}
		return vec;
	}

	/**
	 * Divides a vector by a scalar or another vector.
	 * @param vec - The vector to divide.
	 * @param divisor - The scalar or vector to divide by.
	 * @returns The divided vector.
	 */
	static divide(vec: Vector3, divisor: Vector3 | number): Vector3 {
		if (typeof divisor === "number") {
			if (divisor === 0) return { x: 0, y: 0, z: 0 };
			return {
				x: vec.x / divisor,
				y: vec.y / divisor,
				z: vec.z / divisor,
			};
		}
		if (this.isVector3(divisor)) {
			return {
				x: vec.x / divisor.x,
				y: vec.y / divisor.y,
				z: vec.z / divisor.z,
			};
		}
		return vec;
	}

	/**
	 * Calculates the Euclidean distance between two vectors.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The distance.
	 */
	static distance(vecA: Vector3, vecB: Vector3): number {
		return Math.sqrt((vecA.x - vecB.x) ** 2 + (vecA.y - vecB.y) ** 2 + (vecA.z - vecB.z) ** 2);
	}

	/**
	 * Calculates the squared distance between two vectors.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The squared distance.
	 */
	static sqrDistance(vecA: Vector3, vecB: Vector3): number {
		return (vecA.x - vecB.x) ** 2 + (vecA.y - vecB.y) ** 2 + (vecA.z - vecB.z) ** 2;
	}

	/**
	 * Normalizes a vector to length 1.
	 * @param vec - The vector to normalize.
	 * @returns The normalized vector.
	 */
	static normalize(vec: Vector3): Vector3 {
		const length = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
		if (length === 0) return { x: 0, y: 0, z: 0 };
		return {
			x: vec.x / length,
			y: vec.y / length,
			z: vec.z / length,
		};
	}

	/**
	 * Linearly interpolates between two vectors.
	 * @param vecA - The start vector.
	 * @param vecB - The end vector.
	 * @param t - The interpolation factor (0-1).
	 * @returns The interpolated vector.
	 */
	static lerp(vecA: Vector3, vecB: Vector3, t: number): Vector3 {
		return {
			x: vecA.x + (vecB.x - vecA.x) * t,
			y: vecA.y + (vecB.y - vecA.y) * t,
			z: vecA.z + (vecB.z - vecA.z) * t,
		};
	}

	/**
	 * Calculates the dot product of two vectors.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The dot product.
	 */
	static dot(vecA: Vector3, vecB: Vector3): number {
		return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
	}

	/**
	 * Reflects a vector off a surface with the given normal.
	 * @param vec - The vector to reflect.
	 * @param normal - The normal vector.
	 * @returns The reflected vector.
	 */
	static reflect(vec: Vector3, normal: Vector3): Vector3 {
		const dotProduct = this.dot(vec, normal);
		const scaledNormal = this.scale(normal, 2 * dotProduct);
		return this.sub(vec, scaledNormal);
	}

	/**
	 * Calculates the cross product of two vectors.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The cross product vector.
	 */
	static cross(vecA: Vector3, vecB: Vector3): Vector3 {
		return {
			x: vecA.y * vecB.z - vecA.z * vecB.y,
			y: vecA.z * vecB.x - vecA.x * vecB.z,
			z: vecA.x * vecB.y - vecA.y * vecB.x,
		};
	}

	/**
	 * Calculates the length (magnitude) of a vector.
	 * @param vec - The vector.
	 * @returns The length.
	 */
	static length(vec: Vector3): number {
		return Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
	}

	/**
	 * Calculates the squared length of a vector.
	 * @param vec - The vector.
	 * @returns The squared length.
	 */
	static sqrLength(vec: Vector3): number {
		return vec.x ** 2 + vec.y ** 2 + vec.z ** 2;
	}

	/**
	 * Calculates the angle between two vectors in radians.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The angle in radians.
	 */
	static angle(vecA: Vector3, vecB: Vector3): number {
		return Math.acos(this.dot(this.normalize(vecA), this.normalize(vecB)));
	}

	/**
	 * Calculates the midpoint between two vectors.
	 * @param vecA - The first vector.
	 * @param vecB - The second vector.
	 * @returns The midpoint vector.
	 */
	static midpoint(vecA: Vector3, vecB: Vector3): Vector3 {
		return {
			x: (vecA.x + vecB.x) / 2,
			y: (vecA.y + vecB.y) / 2,
			z: (vecA.z + vecB.z) / 2,
		};
	}

	/**
	 * Clamps each component of a vector between min and max values.
	 * @param vec - The vector to clamp.
	 * @param min - The minimum value or vector.
	 * @param max - The maximum value or vector.
	 * @returns The clamped vector.
	 */
	static clamp(vec: Vector3, min: Vector3 | number, max: Vector3 | number): Vector3 {
		return {
			x: Math.max(
				typeof min === "number" ? min : min.x,
				Math.min(typeof max === "number" ? max : max.x, vec.x),
			),
			y: Math.max(
				typeof min === "number" ? min : min.y,
				Math.min(typeof max === "number" ? max : max.y, vec.y),
			),
			z: Math.max(
				typeof min === "number" ? min : min.z,
				Math.min(typeof max === "number" ? max : max.z, vec.z),
			),
		};
	}

	/**
	 * Applies Math.floor to each component of a vector.
	 * @param vec - The vector.
	 * @returns The floored vector.
	 */
	static floor(vec: Vector3): Vector3 {
		return { x: Math.floor(vec.x), y: Math.floor(vec.y), z: Math.floor(vec.z) };
	}

	/**
	 * Applies Math.round to each component of a vector.
	 * @param vec - The vector.
	 * @returns The rounded vector.
	 */
	static round(vec: Vector3): Vector3 {
		return { x: Math.round(vec.x), y: Math.round(vec.y), z: Math.round(vec.z) };
	}

	/**
	 * Applies Math.ceil to each component of a vector.
	 * @param vec - The vector.
	 * @returns The ceiled vector.
	 */
	static ceil(vec: Vector3): Vector3 {
		return { x: Math.ceil(vec.x), y: Math.ceil(vec.y), z: Math.ceil(vec.z) };
	}

	/**
	 * Generates a random vector with each component in [min, max].
	 * @param min - The minimum value (default 0).
	 * @param max - The maximum value (default 1).
	 * @returns The random vector.
	 */
	static random(min = 0, max = 1): Vector3 {
		return { x: randf(min, max), y: randf(min, max), z: randf(min, max) };
	}

	/**
	 * Generates a random unit vector direction.
	 * @returns The random direction vector.
	 */
	static randomDirection(): Vector3 {
		const theta = Math.random() * 2 * Math.PI;
		const phi = Math.acos(2 * Math.random() - 1);
		return {
			x: Math.sin(phi) * Math.cos(theta),
			y: Math.sin(phi) * Math.sin(theta),
			z: Math.cos(phi),
		};
	}

	/**
	 * Generates a random location inside a sphere of given radius.
	 * @param sphereRadius - The radius of the sphere.
	 * @returns The random location vector.
	 */
	static randomLocationInSphere(sphereRadius: number): Vector3 {
		const direction = this.randomDirection();
		const randomRadius = Math.cbrt(Math.random()) * sphereRadius;
		return this.scale(direction, randomRadius);
	}

	/**
	 * Generates vectors evenly distributed on a circle on the XY plane.
	 * @param radius - The circle radius.
	 * @param numberOfPoints - The total number of points to generate on the circle's circumference.
	 * @returns Array of vectors on the circle.
	 */
	static generateOnCircle(radius: number, numberOfPoints: number): Vector3[] {
		const vectors: Vector3[] = [];
		if (numberOfPoints <= 0) return vectors;

		for (let i = 0; i < numberOfPoints; i++) {
			const angle = (i / numberOfPoints) * 2 * Math.PI;
			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);
			vectors.push({ x, y, z: 0 });
		}

		return vectors;
	}

	/**
	 * Rotates a vector around an axis by a given angle in radians.
	 * @param vec - The vector to rotate.
	 * @param axis - The axis to rotate around.
	 * @param radians - The angle in radians.
	 * @returns The rotated vector.
	 */
	static rotateRad(vec: Vector3, axis: Vector3, radians: number): Vector3 {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		const dot = axis.x * vec.x + axis.y * vec.y + axis.z * vec.z;
		const crossX = axis.y * vec.z - axis.z * vec.y;
		const crossY = axis.z * vec.x - axis.x * vec.z;
		const crossZ = axis.x * vec.y - axis.y * vec.x;

		const x = vec.x * cos + crossX * sin + axis.x * dot * (1 - cos);
		const y = vec.y * cos + crossY * sin + axis.y * dot * (1 - cos);
		const z = vec.z * cos + crossZ * sin + axis.z * dot * (1 - cos);

		return { x, y, z };
	}

	/**
	 * Rotates a vector around an axis by a given angle in degrees.
	 * @param vec - The vector to rotate.
	 * @param axis - The axis to rotate around.
	 * @param degrees - The angle in degrees.
	 * @returns The rotated vector.
	 */
	static rotateDeg(vec: Vector3, axis: Vector3, degrees: number): Vector3 {
		return this.rotateRad(vec, axis, (Math.PI / 180) * degrees);
	}

	/**
	 * Changes the direction of a vector to match another vector's direction, preserving magnitude.
	 * @param vec - The original vector.
	 * @param dir - The direction vector.
	 * @returns The vector with changed direction.
	 */
	static changeDir(vec: Vector3, dir: Vector3): Vector3 {
		const magnitude = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

		if (magnitude === 0) {
			return { x: 0, y: 0, z: 0 };
		}

		const dirMagnitude = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);

		if (dirMagnitude === 0) {
			return { x: vec.x, y: vec.y, z: vec.z };
		}

		return {
			x: (dir.x / dirMagnitude) * magnitude,
			y: (dir.y / dirMagnitude) * magnitude,
			z: (dir.z / dirMagnitude) * magnitude,
		};
	}

	/**
	 * Gets a location relative to the head, based on view direction and movement.
	 * @param headLocation - The head location vector.
	 * @param viewDirection - The view direction vector.
	 * @param move - The movement vector (partial).
	 * @returns The new relative position vector.
	 */
	static getRelativeToHead(
		headLocation: Vector3,
		viewDirection: Vector3,
		move: Partial<Vector3>,
	): Vector3 {
		const forward = viewDirection;
		const up = { x: 0, y: 1, z: 0 };
		const crossProduct = this.cross(forward, up);
		const right = this.sqrLength(crossProduct) < 0.0001 ? this.right : this.normalize(crossProduct);

		// Set the amount of movement in each direction
		const rightMove = move?.x ?? 0;
		const upMove = move?.y ?? 0;
		const forwardMove = move?.z ?? 0;

		// Calculate the scaled vectors
		const rightVec = this.scale(right, rightMove);
		const upVec = this.scale(up, upMove);
		const forwardVec = this.scale(forward, forwardMove);

		// Combine all the vectors
		const moveVec = this.add(this.add(rightVec, upVec), forwardVec);

		// Add the movement vector to the player's position
		const newPosition = this.add(headLocation, moveVec);

		return newPosition;
	}

	/**
	 * Converts a Vector3 object into a string.
	 *
	 * @param value - The Vector3 object.
	 * @param format - Format of the string.
	 * - `0`: "`(x, y, z)`"
	 * - `1`: "`x y z`"
	 * - `2`: "`x=x y=y z=z`"
	 *
	 * @returns String representation of the specified Vector3 object.
	 */
	static stringify(value?: Partial<Vector3>, format: 0 | 1 | 2 = 0): string {
		const vec = Vec3.create(value);

		switch (format) {
			default:
			case 0:
				return `(${vec.x}, ${vec.y}, ${vec.z})`;
			case 1:
				return `${vec.x} ${vec.y} ${vec.z}`;
			case 2:
				return `x=${vec.x},y=${vec.y},z=${vec.z}`;
		}
	}

	/** @deprecated Use `stringify()` instead. */
	static toString<T extends Vector3>(vec: T): `(${T["x"]}, ${T["y"]}, ${T["z"]})` {
		return `(${vec.x}, ${vec.y}, ${vec.z})`;
	}

	/** @deprecated Use `stringify()` instead. */
	static toString2<T extends Vector3>(vec: T): `${T["x"]} ${T["y"]} ${T["z"]}` {
		return `${vec.x} ${vec.y} ${vec.z}`;
	}

	/** @deprecated Use `stringify()` instead. */
	static toString3<T extends Vector3>(vec: T): `x=${T["x"]},y=${T["y"]},z=${T["z"]}` {
		return `x=${vec.x},y=${vec.y},z=${vec.z}`;
	}

	private _vec: Vector3;

	get vec(): Vector3 {
		return Vec3.clone(this._vec);
	}

	/** Gets the x component of this vector. */
	get x(): number {
		return this._vec.x;
	}

	/** Sets the x component of this vector. */
	set x(value: number) {
		this._vec.x = value;
	}

	/** Gets the y component of this vector. */
	get y(): number {
		return this._vec.y;
	}

	/** Sets the y component of this vector. */
	set y(value: number) {
		this._vec.y = value;
	}

	/** Gets the z component of this vector. */
	get z(): number {
		return this._vec.z;
	}

	/** Sets the z component of this vector. */
	set z(value: number) {
		this._vec.z = value;
	}

	/** Creates a new Vec3 instance. */
	constructor(primary?: Partial<Vector3>, fallback?: Partial<Vector3>) {
		this._vec = Vec3.create(primary, fallback);
	}

	/**
	 * Adds a vector to this vector.
	 * @param vec - The vector to add.
	 * @returns This Vec3 instance.
	 */
	add(vec: Vector3): Vec3 {
		this._vec = Vec3.add(this._vec, vec);
		return this;
	}

	/**
	 * Subtracts a vector from this vector.
	 * @param vec - The vector to subtract.
	 * @returns This Vec3 instance.
	 */
	sub(vec: Vector3): Vec3 {
		this._vec = Vec3.sub(this._vec, vec);
		return this;
	}

	/**
	 * Scales this vector by a scalar or another vector.
	 * @param scalar - The scalar or vector to scale by.
	 * @returns This Vec3 instance.
	 */
	scale(scalar: Vector3 | number): Vec3 {
		this._vec = Vec3.scale(this._vec, scalar);
		return this;
	}

	/**
	 * Divides this vector by a scalar or another vector.
	 * @param divisor - The scalar or vector to divide by.
	 * @returns This Vec3 instance.
	 */
	divide(divisor: Vector3 | number): Vec3 {
		this._vec = Vec3.divide(this._vec, divisor);
		return this;
	}

	/**
	 * Normalizes this vector to length 1.
	 * @returns This Vec3 instance.
	 */
	normalize(): Vec3 {
		this._vec = Vec3.normalize(this._vec);
		return this;
	}

	/**
	 * Linearly interpolates this vector towards another vector.
	 * @param vec - The target vector.
	 * @param t - The interpolation factor (0-1).
	 * @returns This Vec3 instance.
	 */
	lerp(vec: Vector3, t: number): Vec3 {
		this._vec = Vec3.lerp(this._vec, vec, t);
		return this;
	}

	/**
	 * Calculates the dot product with another vector.
	 * @param vec - The other vector.
	 * @returns The dot product.
	 */
	dot(vec: Vector3): number {
		return Vec3.dot(this._vec, vec);
	}

	/**
	 * Sets this vector to the cross product with another vector.
	 * @param vec - The other vector.
	 * @returns This Vec3 instance.
	 */
	cross(vec: Vector3): Vec3 {
		this._vec = Vec3.cross(this._vec, vec);
		return this;
	}

	/**
	 * Clamps each component of this vector between min and max values.
	 * @param min - The minimum value or vector.
	 * @param max - The maximum value or vector.
	 * @returns This Vec3 instance.
	 */
	clamp(min: Vector3 | number, max: Vector3 | number): Vec3 {
		this._vec = Vec3.clamp(this._vec, min, max);
		return this;
	}

	/**
	 * Applies Math.floor to each component of this vector.
	 * @returns This Vec3 instance.
	 */
	floor(): Vec3 {
		this._vec = Vec3.floor(this._vec);
		return this;
	}

	/**
	 * Applies Math.round to each component of this vector.
	 * @returns This Vec3 instance.
	 */
	round(): Vec3 {
		this._vec = Vec3.round(this._vec);
		return this;
	}

	/**
	 * Applies Math.ceil to each component of this vector.
	 * @returns This Vec3 instance.
	 */
	ceil(): Vec3 {
		this._vec = Vec3.ceil(this._vec);
		return this;
	}

	/**
	 * Reflects this vector off a surface with the given normal.
	 * @param normal - The normal vector.
	 * @returns This Vec3 instance.
	 */
	reflect(normal: Vector3): Vec3 {
		this._vec = Vec3.reflect(this._vec, normal);
		return this;
	}

	/**
	 * Sets this vector to the midpoint between this and another vector.
	 * @param vec - The other vector.
	 * @returns This Vec3 instance.
	 */
	midpoint(vec: Vector3): Vec3 {
		this._vec = Vec3.midpoint(this._vec, vec);
		return this;
	}

	/**
	 * Changes the direction of this vector to match another vector's direction, preserving magnitude.
	 * @param dir - The direction vector.
	 * @returns This Vec3 instance.
	 */
	changeDir(dir: Vector3): Vec3 {
		this._vec = Vec3.changeDir(this._vec, dir);
		return this;
	}

	/**
	 * Rotates this vector around an axis by a given angle in radians.
	 * @param axis - The axis to rotate around.
	 * @param radians - The angle in radians.
	 * @returns This Vec3 instance.
	 */
	rotateRad(axis: Vector3, radians: number): Vec3 {
		this._vec = Vec3.rotateRad(this._vec, axis, radians);
		return this;
	}

	/**
	 * Rotates this vector around an axis by a given angle in degrees.
	 * @param axis - The axis to rotate around.
	 * @param degrees - The angle in degrees.
	 * @returns This Vec3 instance.
	 */
	rotateDeg(axis: Vector3, degrees: number): Vec3 {
		this._vec = Vec3.rotateDeg(this._vec, axis, degrees);
		return this;
	}

	/**
	 * Converts this vector into a string.
	 *
	 * @param format - Format of the string.
	 * - `0`: "`(x, y, z)`"
	 * - `1`: "`x y z`"
	 * - `2`: "`x=x y=y z=z`"
	 *
	 * @returns String representation of this vector.
	 */
	toString(format: 0 | 1 | 2 = 0): string {
		return Vec3.stringify(this._vec, format);
	}

	/** @deprecated Use `toString()` with `format` arg set to `1` instead. */
	toString2(): string {
		return Vec3.toString2(this._vec);
	}

	/** @deprecated Use `toString()` with `format` arg set to `2` instead. */
	toString3(): string {
		return Vec3.toString3(this._vec);
	}
}
