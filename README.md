# scripting-utils

Various utility functions for Minecraft Bedrock addon scripting.

Does not depend on Beta APIs. Requires `@minecraft/server@^2.0.0` to be installed on your side.

## Install

```sh
pnpm install github:lc-studios-mc/scripting-utils
```

## Usage example

```typescript
import { Vec3 } from "@lc-studios-mc/scripting-utils";

const vec = Vec3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
console.log(Vec3.toString(vec)); // (5, 7, 9)
```
