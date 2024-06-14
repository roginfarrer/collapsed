import {
  Frame,
  clearAnimationTimeout,
  setAnimationTimeout,
  getAutoHeightDuration,
  paddingWarning,
} from "./utils";

let durationMap = new Map<string | number, number>();
function calcDuration(height: number): number {
  if (!durationMap.has(height)) {
    durationMap.set(height, getAutoHeightDuration(height));
  }
  return durationMap.get(height)!;
}

export interface CollapseOptions {
  /** Handler called when the expanded state changes */
  onExpandedChange?: (open: boolean) => void;
  /**
   * Handler called at each stage of the animation.
   */
  onTransitionStateChange?: (
    state:
      | "expandStart"
      | "expanding"
      | "expandEnd"
      | "collapseStart"
      | "collapsing"
      | "collapseEnd",
  ) => void;
  getDisclosureElement: () => HTMLElement;
  /** Timing function for the transition */
  easing?: string;
  /**
   * Duration of the expand/collapse animation.
   * If 'auto', the duration will be calculated based on the height of the collapse element
   */
  duration?: "auto" | number;
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number;
}

export class Collapse {
  #options: Required<CollapseOptions>;

  frameId?: number;
  endFrameId?: Frame;

  constructor(options: CollapseOptions) {
    this.#options = {
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: "auto",
      collapsedHeight: 0,
      onExpandedChange() {},
      onTransitionStateChange() {},
      ...options,
    };
  }

  setOptions(opts: Partial<CollapseOptions>): void {
    this.#options = { ...this.#options, ...opts };
  }

  #getElement(): HTMLElement {
    return this.#options.getDisclosureElement();
  }

  #getDuration(height: number): number {
    let num =
      this.#options.duration === "auto"
        ? calcDuration(height)
        : this.#options.duration;
    return num;
  }

  #setTransitionEndTimeout = (duration: number): void => {
    const endTransition = () => {
      let target = this.#getElement();
      target.style.removeProperty("transition");
      if (target.style.height === `${this.#options.collapsedHeight}px`) {
        // Closed
        this.setCollapsedStyles();
        this.frameId = requestAnimationFrame(() => {
          this.#options.onTransitionStateChange("collapseEnd");
        });
      } else {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("display");
        this.frameId = requestAnimationFrame(() => {
          this.#options.onTransitionStateChange("expandEnd");
        });
      }
    };
    if (this.endFrameId) {
      clearAnimationTimeout(this.endFrameId);
    }
    this.endFrameId = setAnimationTimeout(endTransition, duration);
  };

  public getCollapsedStyles(): Record<string, string> {
    let styles: Record<string, string> = {
      height: `${this.#options.collapsedHeight}px`,
      overflow: "hidden",
      display: this.#options.collapsedHeight === 0 ? "none" : "block",
    };
    return styles;
  }

  public setCollapsedStyles(): void {
    let target = this.#getElement();
    for (let [property, value] of Object.entries(this.getCollapsedStyles())) {
      target.style.setProperty(property, value);
    }
  }

  public unsetCollapsedStyles(): void {
    let target = this.#getElement();
    for (let property of Object.keys(this.getCollapsedStyles())) {
      target.style.removeProperty(property);
    }
  }

  public open(): void {
    const target = this.#getElement();
    this.#options.onExpandedChange(true);

    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.endFrameId) clearAnimationTimeout(this.endFrameId);

    if (prefersReducedMotion()) {
      target.style.removeProperty("display");
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      return;
    }

    paddingWarning(target);
    this.frameId = requestAnimationFrame(() => {
      this.#options.onTransitionStateChange("expandStart");
      target.style.setProperty("display", "block");
      target.style.setProperty("overflow", "hidden");
      target.style.setProperty("height", `${this.#options.collapsedHeight}px`);

      this.frameId = requestAnimationFrame(() => {
        this.#options.onTransitionStateChange("expanding");
        const height = target.scrollHeight;
        const duration = this.#getDuration(height);
        this.#setTransitionEndTimeout(duration);
        target.style.transition = `height ${duration}ms ${this.#options.easing}`;
        target.style.height = `${height}px`;
      });
    });
  }

  public close(): void {
    this.#options.onExpandedChange(false);

    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.endFrameId) clearAnimationTimeout(this.endFrameId);

    if (prefersReducedMotion()) {
      this.setCollapsedStyles();
      return;
    }

    this.#options.onTransitionStateChange("collapseStart");
    this.frameId = requestAnimationFrame(() => {
      const target = this.#getElement();

      const height = target.scrollHeight;
      const duration = this.#getDuration(height);
      this.#setTransitionEndTimeout(duration);
      target.style.transition = `height ${duration}ms ${this.#options.easing}`;
      target.style.height = `${height}px`;

      this.frameId = requestAnimationFrame(() => {
        this.#options.onTransitionStateChange("collapsing");
        target.style.overflow = "hidden";
        target.style.height = `${this.#options.collapsedHeight}px`;
      });
    });
  }
}

/** Tells if the user has enabled the "reduced motion" setting in their browser or OS. */
export function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
