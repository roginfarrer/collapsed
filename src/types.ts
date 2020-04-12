import { CSSProperties, TransitionEvent, MouseEvent } from 'react';

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
export type StateSetter = Dispatch<SetStateAction<boolean>>;

type ButtonType = 'submit' | 'reset' | 'button';
type AriaBoolean = boolean | 'true' | 'false';

export interface UseCollapseInput {
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  collapsedHeight?: number;
  expandStyles?: {};
  collapseStyles?: {};
  easing?: string;
  duration?: number;
}

export interface GetTogglePropsOutput {
  disabled: boolean;
  type: ButtonType;
  role: string;
  id: string;
  'aria-controls': string;
  'aria-expanded': AriaBoolean;
  tabIndex: number;
  onClick: (e: MouseEvent) => void;
}

export interface GetTogglePropsInput {
  [key: string]: unknown;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export interface GetCollapsePropsOutput {
  id: string;
  onTransitionEnd: (e: TransitionEvent) => void;
  style: CSSProperties;
  'aria-hidden': AriaBoolean;
}

export interface GetCollapsePropsInput {
  [key: string]: unknown;
  style?: CSSProperties;
  onTransitionEnd?: (e: TransitionEvent) => void;
  refKey?: string;
}

export interface UseCollapseOutput {
  getCollapseProps: (config?: GetCollapsePropsInput) => GetCollapsePropsOutput;
  getToggleProps: (config?: GetTogglePropsInput) => GetTogglePropsOutput;
  isExpanded: boolean;
  mountChildren: boolean;
  toggleExpanded: () => void;
}
