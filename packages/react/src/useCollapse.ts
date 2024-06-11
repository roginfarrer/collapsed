import * as React from "react";
import { Collapse, CollapseOptions } from "@collapsed/core";
import { AssignableRef, mergeRefs, useControlledState } from "./utils";

export interface UseCollapseParams
  extends Omit<CollapseOptions, "getDisclosureElement"> {
  /**
   * If true, the disclosure is expanded.
   */
  isExpanded?: boolean;
  /** Handler called when the disclosure expands or collapses */
  onExpandedChange?: (state: boolean) => void;
  /**
   * If true, the disclosure is expanded when it initially mounts.
   * @default false
   */
  initialExpanded?: boolean;
}

export function useCollapse({
  isExpanded: propExpanded,
  initialExpanded: propDefaultExpanded = false,
  onExpandedChange,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  duration = "auto",
  collapsedHeight = 0,
  onTransitionStateChange = () => {},
}: UseCollapseParams = {}) {
  const id = React.useId();
  const [isExpanded, setExpanded] = useControlledState(
    propExpanded,
    propDefaultExpanded,
    onExpandedChange,
  );
  let prevState = React.useRef(isExpanded);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [toggleEl, setToggleEl] = React.useState<HTMLElement | null>(null);
  const collapseElRef = React.useRef<HTMLElement | null>(null);

  const resolvedOptions: CollapseOptions = {
    easing,
    duration,
    collapsedHeight,
    getDisclosureElement: () => collapseElRef.current!,
    onExpandedChange(state) {
      setExpanded(state);
      onExpandedChange?.(state);
    },
    onTransitionStateChange(state) {
      switch (state) {
        case "collapseEnd":
        case "expandEnd":
          setIsAnimating(false);
          break;
      }
      onTransitionStateChange?.(state);
    },
  };

  const [collapse] = React.useState(() => new Collapse(resolvedOptions));
  collapse.setOptions(resolvedOptions);

  React.useLayoutEffect(() => {
    if (isExpanded === prevState.current) return;
    prevState.current = isExpanded;

    setIsAnimating(true);
    if (isExpanded) {
      collapse.open();
    } else {
      collapse.close();
    }
  }, [collapse, isExpanded]);

  const disclosureId = `collapsed-disclosure-${id}`;

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
      const { refKey, style } = { refKey: "ref", style: {}, ...args };
      const theirRef: any = args?.[refKey || "ref"];
      return {
        id: disclosureId,
        ...args,
        style: {
          boxSizing: "border-box",
          ...(!isAnimating && !isExpanded ? collapse.getCollapsedStyles() : {}),
          ...style,
        },
        [refKey || "ref"]: mergeRefs(collapseElRef, theirRef),
      } as any;
    },
  };
}
