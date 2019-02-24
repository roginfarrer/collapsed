// @flow

export type TransitionProps = {
  duration:
    | number
    | {
        in: number,
        out: number,
      },
  easing:
    | string
    | {
        in: string,
        out: string,
      },
  delay:
    | number
    | {
        in: number,
        out: number,
      },
};
