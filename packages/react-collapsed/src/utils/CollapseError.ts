import warning from 'tiny-warning'

export class CollapseError extends Error {
  constructor(message: string) {
    super(`react-collapsed: ${message}`)
  }
}

const collapseWarning = (...args: Parameters<typeof warning>) => {
  return warning(args[0], `[react-collapsed] -- ${args[1]}`)
}

export { collapseWarning as warning }
