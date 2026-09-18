# @lc-studios-mc/scripting-utils

A collection of small utilities for Minecraft Bedrock scripting, such as:

- Math (including Vector3 manipulation)
- Random number generation

Requires `@minecraft/server` version `2.10.0` or above.

## Usage

Look inside [src/](./src/) and copy anything you want. It's all written in
JavaScript, so no compile step is necessary.

But if you have a bundler configured, you can install this repo using a package
manager (like npm):

```bash
# Install
npm install github:lc-studios-mc/scripting-utils --save-dev --allow-git=all

# Update
npm update @lc-studios-mc/scripting-utils --allow-git=all
```

Then in code:

```js
import { randomFloat, Vec3 } from "@lc-studios-mc/scripting-utils";

randomFloat(6, 9);
Vec3.multiply(Vec3.create(), Vec3.HALF);
```
