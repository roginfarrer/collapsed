export type Frame = {
  id?: number
}

export function setAnimationTimeout(callback: () => void, timeout: number) {
  const startTime = performance.now()
  const frame: Frame = {}

  function call() {
    frame.id = requestAnimationFrame((now) => {
      if (now - startTime > timeout) {
        callback()
      } else {
        call()
      }
    })
  }

  call()
  return frame
}

export function clearAnimationTimeout(frame: Frame) {
  if (frame.id) cancelAnimationFrame(frame.id)
}
