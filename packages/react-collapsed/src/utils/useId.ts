import * as React from 'react'

const __useId: () => string | undefined =
  (React as any)['useId'.toString()] || (() => undefined)

export function useReactId() {
  const id = __useId()
  return id ?? ''
}

/**
 * Taken from Reach
 * https://github.com/reach/reach-ui/blob/d2b88c50caf52f473a7d20a4493e39e3c5e95b7b/packages/auto-id
 *
 * Autogenerate IDs to facilitate WAI-ARIA and server rendering.
 *
 * Note: The returned ID will initially be `null` and will update after a
 * component mounts. Users may need to supply their own ID if they need
 * consistent values for SSR.
 *
 * @see Docs https://reach.tech/auto-id
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
let serverHandoffComplete = false
let id = 0
const genId = () => ++id
export function useUniqueId(idFromProps?: string | null) {
  /*
   * If this instance isn't part of the initial render, we don't have to do the
   * double render/patch-up dance. We can just generate the ID and return it.
   */
  const initialId = idFromProps || (serverHandoffComplete ? genId() : null)

  const [id, setId] = React.useState(initialId)

  useIsomorphicLayoutEffect(() => {
    if (id === null) {
      /*
       * Patch the ID after render. We do this in `useLayoutEffect` to avoid any
       * rendering flicker, though it'll make the first render slower (unlikely
       * to matter, but you're welcome to measure your app and let us know if
       * it's a problem).
       */
      setId(genId())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (serverHandoffComplete === false) {
      /*
       * Flag all future uses of `useId` to skip the update dance. This is in
       * `useEffect` because it goes after `useLayoutEffect`, ensuring we don't
       * accidentally bail out of the patch-up dance prematurely.
       */
      serverHandoffComplete = true
    }
  }, [])
  return id != null ? String(id) : undefined
}

export function useId(idOverride?: string): string | undefined {
  const reactId = useReactId()
  const uniqueId = useUniqueId(idOverride)

  if (typeof idOverride === 'string') {
    return idOverride
  }

  if (typeof reactId === 'string') {
    return reactId
  }

  return uniqueId
}
