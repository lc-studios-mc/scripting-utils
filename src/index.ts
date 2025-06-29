import * as block from "./block.js";
import * as console from "./console.js";
import * as damage from "./damage.js";
import * as direction from "./direction.js";
import * as entity from "./entity.js";
import { EventEmitter } from "./event-emitter.js";
import * as math from "./math.js";
import * as misc from "./misc.js";
import * as player from "./player.js";
import { Timeline } from "./timeline.js";
import { Vec3 } from "./vec3.js";

const utils = {
	...block,
	...damage,
	...direction,
	...entity,
	...math,
	...misc,
	...player,
};

export {
	/**
	 * A type-safe wrapper for the global `console` object.
	 * This module provides functions that map directly to the `console` methods,
	 * allowing them to be used in environments where the `console` type definition
	 * may not be available at compile time.
	 */
	console,
	EventEmitter,
	Timeline,
	/** This module provides many utility functions. */
	utils,
	Vec3,
};
