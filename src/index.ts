import * as block from "./block.js";
import * as console from "./console.js";
import * as damage from "./damage.js";
import * as direction from "./direction.js";
import * as entity from "./entity.js";
import * as eventEmitter from "./event-emitter.js";
import * as math from "./math.js";
import * as misc from "./misc.js";
import * as player from "./player.js";
import * as timeline from "./timeline.js";
import * as vec3 from "./vec3.js";

const utils = {
	...block,
	...damage,
	...direction,
	...entity,
	...eventEmitter,
	...math,
	...misc,
	...player,
	...timeline,
	...vec3,
};

export { utils, console };
