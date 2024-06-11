import warning from "tiny-warning";

// https://github.com/mui-org/material-ui/blob/da362266f7c137bf671d7e8c44c84ad5cfc0e9e2/packages/material-ui/src/styles/transitions.js#L89-L98
export function getAutoHeightDuration(height: number | string): number {
  if (!height || typeof height === "string") {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function paddingWarning(element: HTMLElement): void {
  if (process.env.NODE_ENV !== "production") {
    if (window && "getComputedStyle" in window) {
      const { paddingTop, paddingBottom } = window.getComputedStyle(element);
      const hasPadding =
        (paddingTop && paddingTop !== "0px") ||
        (paddingBottom && paddingBottom !== "0px");

      warning(
        !hasPadding,
        "Collapse: Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element.",
      );
    }
  }
}

export type Frame = {
  id?: number;
};

export function setAnimationTimeout(callback: () => void, timeout: number) {
  const startTime = performance.now();
  const frame: Frame = {};

  function call() {
    frame.id = requestAnimationFrame((now) => {
      if (now - startTime > timeout) {
        callback();
      } else {
        call();
      }
    });
  }

  call();
  return frame;
}

export function clearAnimationTimeout(frame: Frame) {
  if (frame.id) cancelAnimationFrame(frame.id);
}
