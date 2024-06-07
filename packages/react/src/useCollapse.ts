import * as React from "react";
import {
  CollapseAnimation,
  CollapseOptions,
} from "../../web-component/src/collapsed";
//import { Collapse, CollapseParams } from "@collapsed/core";
import { AssignableRef, mergeRefs, useControlledState } from "./utils";

export interface UseCollapseParams
  extends Omit<CollapseOptions, "getDisclosureElement"> {
  isExpanded?: boolean;
  onExpandedChange?: (state: boolean) => void;
  initialExpanded?: boolean;
}

export function useCollapse({
  isExpanded: propExpanded,
  initialExpanded: propDefaultExpanded = false,
  onExpandedChange,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  duration = "auto",
  collapsedHeight = 0,
  onStateChange = () => {},
  onTransitionStateChange = () => {},
  disableAnimation = false,
}: UseCollapseParams = {}) {
  const id = React.useId();
  const [isExpanded, setExpanded] = useControlledState(
    propExpanded,
    propDefaultExpanded,
    onExpandedChange,
  );
  let prevState = React.useRef(isExpanded);
  const [hasMounted, setHasMounted] = React.useState(false);
  const [toggleEl, setToggleEl] = React.useState<HTMLElement | null>(null);
  const collapseElRef = React.useRef<HTMLElement | null>(null);
  // const instance = React.useRef<CollapseAnimation>();
  const [instance] = React.useState(
    () =>
      new CollapseAnimation({
        easing,
        duration,
        collapsedHeight,
        getDisclosureElement: () => collapseElRef.current!,
        onStateChange: setExpanded,
      }),
  );

  instance.setOptions({
    easing,
    duration,
    collapsedHeight,
    getDisclosureElement: () => collapseElRef.current!,
    onStateChange: setExpanded,
  });

  const assignCollapseRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (node !== collapseElRef.current) {
        instance.cleanup();
      }
      if (node) {
        console.log("setup", node, collapseElRef.current);
        collapseElRef.current = node;
        instance.setup();
      }
    },
    [instance],
  );

  React.useEffect(() => {
    if (isExpanded !== prevState.current) {
      if (isExpanded) {
        instance.open();
      } else {
        instance.close();
      }
      prevState.current = isExpanded;
    }
  }, [instance, isExpanded]);

  const disclosureId = `collapsed-disclosure-${id}`;

  // const resolvedOptions: CollapseParams = {
  //   id,
  //   isExpanded: propExpanded,
  //   initialExpanded: propExpanded ?? propDefaultExpanded,
  //   ...opts,
  // };

  // const [instance] = React.useState(() => new Collapse(resolvedOptions));
  // const [state, setState] = React.useState(() => instance.initialState);

  // useLayoutEffect(() => {
  //   instance.setOptions((prev) => ({
  //     ...prev,
  //     isExpanded: propExpanded ?? state,
  //     onExpandedChange(state) {
  //       setState(state);
  //       resolvedOptions.onExpandedChange?.(state);
  //     },
  //   }));
  // });

  return {
    isExpanded: isExpanded,
    setExpanded: setExpanded,
    getToggleProps<
      Args extends React.ComponentPropsWithoutRef<"button"> & {
        [k: string]: unknown;
      },
      RefKey extends string | undefined = "ref",
    >(
      args?: Args & {
        /**
         * Sets the key of the prop that the component uses for ref assignment
         * @default 'ref'
         */
        refKey?: RefKey;
      },
    ): {
      [K in RefKey extends string ? RefKey : "ref"]: AssignableRef<any>;
    } & React.ComponentPropsWithoutRef<"button"> {
      const { disabled, onClick, refKey, ...rest } = {
        refKey: "ref",
        onClick() {},
        disabled: false,
        ...args,
      };

      const isButton = toggleEl ? toggleEl.tagName === "BUTTON" : undefined;

      const theirRef: any = args?.[refKey || "ref"];

      const props: any = {
        "aria-controls": `react-collapsed-panel-${id}`,
        "aria-expanded": isExpanded,
        onClick(evt: any) {
          if (disabled) return;
          onClick?.(evt);
          setExpanded((n) => !n);
        },
        [refKey || "ref"]: mergeRefs(theirRef, setToggleEl),
      };

      const buttonProps = {
        type: "button",
        disabled: disabled ? true : undefined,
      };
      const fakeButtonProps = {
        "aria-disabled": disabled ? true : undefined,
        role: "button",
        tabIndex: disabled ? -1 : 0,
      };

      if (isButton === false) {
        return { ...props, ...fakeButtonProps, ...rest };
      } else if (isButton === true) {
        return { ...props, ...buttonProps, ...rest };
      } else {
        return {
          ...props,
          ...buttonProps,
          ...fakeButtonProps,
          ...rest,
        };
      }
    },

    getCollapseProps<
      Args extends { style?: React.CSSProperties; [k: string]: unknown },
      RefKey extends string | undefined = "ref",
    >(
      args?: Args & {
        /**
         * Sets the key of the prop that the component uses for ref assignment
         * @default 'ref'
         */
        refKey?: RefKey;
      },
    ): {
      [K in RefKey extends string ? RefKey : "ref"]: AssignableRef<any>;
    } & {
      id: string;
    } {
      const { refKey } = { refKey: "ref", ...args };
      const theirRef: any = args?.[refKey || "ref"];
      console.log({ hasMounted, isExpanded });
      return {
        id: disclosureId,
        ...args,
        style: !hasMounted && !isExpanded ? { display: "none" } : undefined,
        [refKey || "ref"]: mergeRefs(assignCollapseRef, theirRef),
      } as any;
    },
  };
}
