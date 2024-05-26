import * as React from "react";
import { Collapse, CollapseParams } from "@collapsed/core";
import {
  callAll,
  mergeRefs,
  useControlledState,
  useLayoutEffect,
} from "./utils";

export interface UseCollapseParams extends CollapseParams {
  isExpanded?: boolean;
  onExpandedChange: (state: boolean) => void;
}

export function useCollapse(options: UseCollapseParams) {
  const {
    isExpanded: propExpanded,
    initialExpanded: propDefaultExpanded,
    onExpandedChange,
    ...opts
  } = options;

  const id = React.useId();

  const resolvedOptions: CollapseParams = {
    id,
    isExpanded: propExpanded,
    initialExpanded: propExpanded ?? propDefaultExpanded,
    ...opts,
  };

  const [instance] = React.useState(() => new Collapse(resolvedOptions));
  const [state, setState] = React.useState(() => instance.initialState);

  useLayoutEffect(() => {
    instance.setOptions((prev) => ({
      ...prev,
      isExpanded: propExpanded ?? state,
      onExpandedChange(state) {
        setState(state);
        resolvedOptions.onExpandedChange?.(state);
      },
    }));
  });

  return {
    isExpanded: state,
    setExpanded: setState,
  };
}
