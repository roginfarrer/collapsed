import { CSSProperties, TransitionEvent, MouseEvent } from 'react';

declare var __DEV__: boolean;

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
export type StateSetter = Dispatch<SetStateAction<boolean>>;

type ButtonType = 'submit' | 'reset' | 'button';
type AriaBoolean = boolean | 'true' | 'false';

export interface CollapseConfig {
  isOpen?: boolean;
  defaultOpen?: boolean;
  collapsedHeight?: number;
  expandStyles?: {};
  collapseStyles?: {};
  transitionTimingFunction?: string | { expand?: string; collapse?: string };
  transitionDuration?: number | string;
}

export interface GetTogglePropsAPI {
  disabled: boolean;
  type: ButtonType;
  role: string;
  id: string;
  'aria-controls': string;
  'aria-expanded': AriaBoolean;
  tabIndex: number;
  onClick: (e: MouseEvent) => void;
}

export interface GetTogglePropsShape {
  [key: string]: unknown;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export interface GetCollapsePropsAPI {
  id: string;
  onTransitionEnd: (e: TransitionEvent) => void;
  style: CSSProperties;
  'aria-hidden': AriaBoolean;
}

export interface GetCollapsePropsShape {
  [key: string]: unknown;
  style?: CSSProperties;
  onTransitionEnd?: (e: TransitionEvent) => void;
  refKey?: string;
}

export interface CollapseAPI {
  getCollapseProps: (config?: GetCollapsePropsShape) => GetCollapsePropsAPI;
  getToggleProps: (config?: GetTogglePropsShape) => GetTogglePropsAPI;
  isOpen: boolean;
  mountChildren: boolean;
  toggleOpen: () => void;
}
