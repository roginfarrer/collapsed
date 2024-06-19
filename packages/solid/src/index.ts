import { Collapse, CollapseOptions } from "@collapsed/core";
import {
  createEffect,
  createSignal,
  on,
  mergeProps,
  createComputed,
  JSX,
} from "solid-js";

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
  /**
   * Unique identifier used to for associating elements appropriately for accessibility.
   */
  id?: string;
}

let id = 0;

export function createCollapse(options: UseCollapseParams) {
  const [isExpanded, setExpanded] = createSignal(false);
  const [isAnimating, setAnimating] = createSignal(false);
  let [collapseEl, setCollapseEl] = createSignal<HTMLElement>();
  let [toggleEl, setToggleEl] = createSignal<HTMLElement>();

  const resolvedOptions: CollapseOptions = mergeProps(
    {
      getDisclosureElement: () => collapseEl()!,
      onExpandedChange(state) {
        setExpanded(state);
        options.onExpandedChange?.(state);
      },
      onTransitionStateChange(state) {
        switch (state) {
          case "collapseEnd":
          case "expandEnd":
            setAnimating(false);
            break;
        }
        options.onTransitionStateChange?.(state);
      },
    } satisfies CollapseOptions,
    options,
  );

  const collapse = new Collapse(resolvedOptions);

  let [collapseStyles, setCollapsedStyles] = createSignal(
    collapse.getCollapsedStyles(),
  );

  createEffect(
    on(
      isExpanded,
      (current) => {
        setAnimating(true);
        if (current) {
          collapse.open();
        } else {
          collapse.close();
        }
      },
      { defer: true },
    ),
  );

  createComputed(() => {
    collapse.setOptions(resolvedOptions);
    setCollapsedStyles(collapse.getCollapsedStyles());
  });

  const disclosureId = options.id ?? `collapsed-disclosure-${++id}`;

  const getToggleProps = <T extends HTMLElement>(
    args?: JSX.HTMLAttributes<T>,
  ): JSX.HTMLAttributes<T> => {
    const toggleProps = mergeProps({ disabled: false }, args);

    const isButton = toggleEl ? toggleEl()?.tagName === "BUTTON" : undefined;

    const handleClick: JSX.EventHandlerUnion<T, MouseEvent> = (evt) => {
      if (toggleProps?.disabled) return;
      callHandler(evt, toggleProps.onClick);
      setExpanded((n) => !n);
    };

    const props = {
      "aria-controls": disclosureId,
      "aria-expanded": isExpanded(),
      ref: setToggleEl,
      onClick: handleClick,
    } satisfies JSX.HTMLAttributes<any>;

    const buttonProps = {
      type: "button",
      disabled: toggleProps?.disabled ? true : undefined,
    } satisfies JSX.ButtonHTMLAttributes<any>;

    const fakeButtonProps = {
      "aria-disabled": toggleProps?.disabled ? true : undefined,
      role: "button",
      tabIndex: toggleProps?.disabled ? -1 : 0,
    } satisfies JSX.HTMLAttributes<any>;

    if (isButton === false) {
      return mergeProps(props, fakeButtonProps, toggleProps, {
        onClick: handleClick,
      });
    } else if (isButton === true) {
      return mergeProps(props, buttonProps, toggleProps, {
        onClick: handleClick,
      });
    } else {
      return mergeProps(props, fakeButtonProps, buttonProps, toggleProps, {
        onClick: handleClick,
      });
    }
  };

  function getCollapseProps<T extends HTMLElement>(
    args?: JSX.HTMLAttributes<T>,
  ): JSX.HTMLAttributes<T> {
    return mergeProps(
      {
        id: disclosureId,
      },
      args,
      {
        ref: setCollapseEl,
        style: {
          boxSizing: "border-box",
          ...(!isAnimating() && !isExpanded() ? collapseStyles() : {}),
        },
      },
    );
  }

  return {
    get isExpanded() {
      return isExpanded();
    },
    setExpanded,
    getToggleProps,
    getCollapseProps,
  };
}

/** Call a JSX.EventHandlerUnion with the event. */
export function callHandler<T, E extends Event>(
  event: E & { currentTarget: T; target: Element },
  handler: JSX.EventHandlerUnion<T, E> | undefined,
) {
  if (handler) {
    if (typeof handler === "function") {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }
}
