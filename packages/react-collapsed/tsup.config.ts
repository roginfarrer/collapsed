import { getTsupConfig, getPackageInfo } from "@collapsed-internal/build";

let { name: packageName, version: packageVersion } = getPackageInfo(__dirname);
let cfg = getTsupConfig("src/index.ts", {
  packageName,
  packageVersion,
});
export default cfg;
