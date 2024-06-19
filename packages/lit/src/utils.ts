import warning from "tiny-warning";

type AnyFunction = (...args: any[]) => unknown;

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll =
  (...fns: AnyFunction[]) =>
  (...args: any[]): void =>
    fns.forEach((fn) => fn && fn(...args));

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

/**
 * generates a UID factory
 * @example
 * const uid = generateUID();
 * uid(object) = 1;
 * uid(object) = 1;
 * uid(anotherObject) = 2;
 */
export const generateUID = () => {
  let counter = 1;

  const map = new WeakMap<any, number>();

  /**
   * @borrows {uid}
   */
  const uid = (item: any, index?: number): string => {
    if (typeof item === "number" || typeof item === "string") {
      return index ? `idx-${index}` : `val-${item}`;
    }

    if (!map.has(item)) {
      map.set(item, counter++);

      return uid(item);
    }

    return "uid" + map.get(item);
  };

  return uid;
};

/**
 * @name uid
 * returns an UID associated with {item}
 * @param {Object} item - object to generate UID for
 * @param {Number} index, a fallback index
 * @example
 * uid(object) == 1;
 * uid(object) == 1;
 * uid(anotherObject) == 2;
 * uid("not object", 42) == 42
 */
export const uid = generateUID();
