import type { defineConfig } from 'tsup'

export type TsupConfig = ReturnType<typeof defineConfig>

export function getTsupConfig(
  entry: string | string[],
  args: {
    packageName: string
    packageVersion: string
    external?: string[]
    define?: Record<string, string>
  }
): TsupConfig

export function getPackageInfo(packageRoot: string): {
  version: string
  name: string
}
