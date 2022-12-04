import type { defineConfig } from 'tsup'
import { getTsupConfig, getPackageInfo } from '@collapsed-internal/build'

type TsupConfig = ReturnType<typeof defineConfig>

let { name: packageName, version: packageVersion } = getPackageInfo(__dirname)
let cfg: TsupConfig = getTsupConfig('src/index.ts', {
  packageName,
  packageVersion,
})
export default cfg
