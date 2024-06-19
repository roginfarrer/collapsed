import * as fs from "node:fs";
import * as path from "node:path";
import { defineConfig } from "tsup";

let packageJson = fs.readFileSync(path.join(__dirname, "package.json"), "utf8");
let { version, name } = JSON.parse(packageJson);

/**
 * @param {string} packageName
 * @param {string} version
 */
let banner = `/**
  * ${name} v${version}
  *
  * Copyright (c) 2019-${new Date().getFullYear()}, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */
`;

export default defineConfig([
  {
    entry: ["./src/Collapse.ts"],
    format: ["esm", "cjs"],
    clean: true,
    minify: true,
    banner: { js: banner },
    dts: { banner },
  },
]);
