import * as fsp from "node:fs/promises";
import * as path from "node:path";

export async function postbuild() {
  let fileNameBase = "index";
  let cjsEntry = `"use strict";

if (process.env.NODE_ENV === "production") {
	module.exports = require("./${fileNameBase}.cjs.prod.js");
} else {
	module.exports = require("./${fileNameBase}.cjs.dev.js");
}
`;

  await fsp.writeFile(
    path.join(process.cwd(), "dist", `${fileNameBase}.cjs.js`),
    cjsEntry,
  );

  await fsp.writeFile(path.join(process.cwd(), "LICENSE"), getLicenseContent());
  console.log("🛠 Done building");
}

function getLicenseContent() {
  return `The MIT License (MIT)

Copyright (c) 2019-${new Date().getFullYear()}, Rogin Farrer

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;
}
