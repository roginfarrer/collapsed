import { uid, getAutoHeightDuration, paddingWarning } from "./utils";

type Style = Partial<CSSStyleDeclaration>;

const schedule = (cb: () => void) => {
  requestAnimationFrame(() => requestAnimationFrame(cb));
};

function setAttrs(
  target: HTMLElement,
  attrs: { style?: Record<string, string | undefined | null> } & Record<
    string,
    any
  >,
): void {
  for (let [name, value] of Object.entries(attrs)) {
    if (name === "style") {
      for (let [property, propValue] of Object.entries(
        value as Record<string, string>,
      )) {
        if (propValue) {
          target.style.setProperty(property, propValue);
        } else {
          target.style.removeProperty(property);
        }
      }
      continue;
    }

    if (value) {
      target.setAttribute(name, value as string);
    } else {
      target.removeAttribute(name);
    }
  }
}

export interface CollapseParams {
  /** If true, the collapse element will initialize expanded */
  initialExpanded?: boolean;
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number;
  /** Timing function for the transition */
  easing?: string;
  /**
   * Duration of the expand/collapse animation.
   * If 'auto', the duration will be calculated based on the height of the collapse element
   */
  duration?: number | "auto";
  /** If true, the animation will be disabled. Useful for disabling if the user prefers reduced motion */
  hasDisabledAnimation?: boolean;
  /** Unique ID used for accessibility */
  id?: string;
  /**
   * Handler called at each stage of the animation.
   */
  onTransitionStateChange?: (
    state:
      | "expandStart"
      | "expandEnd"
      | "expanding"
      | "collapseStart"
      | "collapseEnd"
      | "collapsing",
  ) => void;
  /** Function that returns a reference to the element that expands and collapses */
  getCollapseElement: () => HTMLElement | null | undefined;
  /** Function that returns a reference to the toggle for the collapse region */
  getToggleElement?: () => HTMLElement | null | undefined;
  /** Sets whether the collapse is expanded or not. */
  isExpanded?: boolean;
  /** Handler called when the expanded state changes */
  onExpandedChange?: (state: boolean) => void;
}

export class Collapse {
  options!: CollapseParams;
  initialState: boolean = false;

  private prevState: boolean;
  private internalState: boolean;
  private id!: string;
  private collapseElement: HTMLElement | null | undefined = null;
  private isMounted = false;

  constructor(params: CollapseParams) {
    this.initialState =
      params.isExpanded ?? params.initialExpanded ?? this.initialState;
    this.prevState = this.initialState;
    this.internalState = this.initialState;
    this.setOptions(params);
    this.isMounted = true;
  }

  sync = () => {
    const newState = this.getState();
    const hasChanged = this.prevState !== newState;
    const collapseElement = this.options.getCollapseElement();

    if (this.collapseElement !== collapseElement) {
      this.collapseElement = collapseElement;
      if (!newState) {
        this.#setStyles(this.#getCollapsedStyles());
      }
    } else if (hasChanged) {
      if (newState) {
        this.open();
      } else {
        this.close();
      }
    }

    const collapseEl = this.options.getCollapseElement();
    const toggleEl = this.options.getToggleElement?.();

    if (collapseEl) {
      setAttrs(collapseEl, {
        id: this.id,
        role: "region",
        "aria-hidden": this.getState() ? undefined : "true",
        style: { boxSizing: "border-box" },
        "aria-labelledby": toggleEl ? `${this.id}-toggle` : undefined,
      });
    }

    if (toggleEl) {
      const isDisabled =
        toggleEl.hasAttribute("disabled") ||
        toggleEl.hasAttribute("aria-disabled");
      setAttrs(toggleEl, {
        id: `${this.id}-toggle`,
        "aria-expanded": this.getState().toString(),
        "aria-controls": this.id,
      });

      if (toggleEl.tagName === "BUTTON") {
        setAttrs(toggleEl, { type: "button" });
      } else {
        setAttrs(toggleEl, {
          role: "button",
          tabIndex: "0",
        });
      }

      if (!isDisabled) {
        toggleEl.addEventListener("click", this.toggle);
      }
    }

    collapseEl?.addEventListener("transitionend", this.#handleTransitionEnd);

    this.prevState = newState;
  };

  getState = () => this.options.isExpanded ?? this.internalState;

  cleanup = () => {
    this.options
      .getCollapseElement()
      ?.removeEventListener("transitionend", this.#handleTransitionEnd);
    this.options
      .getToggleElement?.()
      ?.removeEventListener("click", this.toggle);
  };

  refresh = () => {
    this.cleanup();
    this.sync();
  };

  #getCollapsedStyles = (): Style => {
    return {
      display: this.options.collapsedHeight === 0 ? "none" : "block",
      height: `${this.options.collapsedHeight}px`,
      overflow: "hidden",
    };
  };

  setOptions = (
    update: CollapseParams | ((prev: CollapseParams) => CollapseParams),
  ) => {
    const opts = typeof update === "function" ? update(this.options) : update;

    Object.entries(opts).forEach(([key, value]) => {
      if (typeof value === "undefined") delete (opts as any)[key];
    });

    this.options = {
      duration: "auto",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      hasDisabledAnimation: false,
      collapsedHeight: 0,
      initialExpanded: false,
      ...opts,
    };

    this.id = this.options.id ?? `collapse-${uid(this)}`;

    this.refresh();
  };

  #setStyles = (styles: Style) => {
    const target = this.options.getCollapseElement();
    if (!target) {
      return;
    }
    for (const property in styles) {
      const value = styles[property];
      if (value) {
        target.style.setProperty(property, value);
      } else {
        target.style.removeProperty(property);
      }
    }
  };

  #getTransitionStyles = (height: number | string) => {
    if (this.options.hasDisabledAnimation) {
      return "";
    }
    const duration =
      this.options.duration === "auto"
        ? getAutoHeightDuration(height)
        : this.options.duration;
    return `height ${duration}ms ${this.options.easing}`;
  };

  #handleTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== "height") {
      return;
    }

    if (this.getState()) {
      this.#setStyles({
        height: "",
        overflow: "",
        transition: "",
        display: "",
      });
      this.options.onTransitionStateChange?.("expandEnd");
    } else {
      this.#setStyles({
        ...this.#getCollapsedStyles(),
        transition: "",
      });
      this.options.onTransitionStateChange?.("collapseEnd");
    }
  };

  #setState = (updater: boolean | ((prev: boolean) => boolean)) => {
    updater = updater ?? this.getState();
    const value =
      typeof updater === "function" ? updater(this.getState()) : updater;

    this.internalState = value;
    this.options.onExpandedChange?.(value);
  };

  open = (): void => {
    const target = this.options.getCollapseElement();
    if (!target) {
      return;
    }

    this.options.onTransitionStateChange?.("expandStart");
    paddingWarning(target);
    schedule(() => {
      this.#setStyles({
        display: "block",
        overflow: "hidden",
        height: `${this.options.collapsedHeight}px`,
      });
      schedule(() => {
        const height = target.scrollHeight;

        // Order important! So setting properties directly
        target.style.setProperty(
          "transition",
          this.#getTransitionStyles(height),
        );
        target.style.setProperty("height", `${height}px`);
        this.options.onTransitionStateChange?.("expanding");
      });
    });
  };

  close = () => {
    const target = this.options.getCollapseElement();
    if (!target) {
      return;
    }

    if (!this.isMounted) {
      this.sync();
      return;
    }

    this.options.onTransitionStateChange?.("collapseStart");
    schedule(() => {
      const height = target.scrollHeight;
      this.#setStyles({
        transition: this.#getTransitionStyles(height),
        height: `${height}px`,
      });
      schedule(() => {
        this.options.onTransitionStateChange?.("collapsing");
        this.#setStyles({
          height: `${this.options.collapsedHeight}px`,
          overflow: "hidden",
        });
      });
    });
  };

  toggle = () => {
    this.#setState((prev) => !prev);
    this.refresh();
  };
}
