import { getAutoHeightDuration } from "./utils";

let durationMap = new Map<string | number, string>();
function calcDuration(height: number) {
  if (!durationMap.has(height)) {
    durationMap.set(height, `${getAutoHeightDuration(height)}ms`);
  }
  return durationMap.get(height)!;
}

export interface CollapseOptions {
  onStateChange?: (open: boolean) => void;
  onTransitionStateChange?: (
    payload:
      | "expandStart"
      | "expanding"
      | "expandEnd"
      | "collapseStart"
      | "collapsing"
      | "collapseEnd",
  ) => void;
  getDisclosureElement: () => HTMLElement;
  easing?: string;
  duration?: "auto" | number;
  collapsedHeight?: number;
  disableAnimation?: boolean;
}

export class CollapseAnimation {
  #options: Required<CollapseOptions>;

  constructor(options: CollapseOptions) {
    this.#options = {
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: "auto",
      collapsedHeight: 0,
      onStateChange() {},
      onTransitionStateChange() {},
      disableAnimation: false,
      ...options,
    };
  }

  setOptions(opts: CollapseOptions) {
    this.#options = { ...this.#options, ...opts };
  }

  #getElement() {
    return this.#options.getDisclosureElement();
  }

  #getDuration(height: number): string {
    let num =
      this.#options.duration === "auto"
        ? calcDuration(height)
        : `${this.#options.duration}ms`;
    return num;
  }

  public setup() {
    this.#getElement()?.addEventListener(
      "transitionend",
      this.#onTransitionEnd,
    );
  }

  public cleanup() {
    this.#getElement()?.removeEventListener(
      "transitionend",
      this.#onTransitionEnd,
    );
  }

  public getCollapsedStyles() {
    let styles: Record<string, string> = {
      height: `${this.#options.collapsedHeight}px`,
      overflow: "hidden",
    };
    if (this.#options.collapsedHeight === 0) {
      styles.display = "none";
    }
    return styles;
  }

  public setCollapsedStyles() {
    let target = this.#getElement();
    for (let [property, value] of Object.entries(this.getCollapsedStyles())) {
      target.style.setProperty(property, value);
    }
  }

  public unsetCollapsedStyles() {
    let target = this.#getElement();
    for (let property of Object.keys(this.getCollapsedStyles())) {
      target.style.removeProperty(property);
    }
  }

  public open() {
    const target = this.#getElement();
    this.#options.onStateChange(true);

    if (prefersReducedMotion()) {
      target.style.removeProperty("display");
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      return;
    }

    this.#options.onTransitionStateChange("expandStart");

    if (target.style.display === "none") {
      target.style.removeProperty("display");
    }

    requestAnimationFrame(() => {
      const height = target.scrollHeight;

      this.#options.onTransitionStateChange("expanding");
      target.style.transition = `height ${this.#getDuration(height)} ${this.#options.easing}`;
      target.style.height = `${height}px`;
    });
  }

  public close(): void {
    this.#options.onStateChange(false);

    if (prefersReducedMotion()) {
      this.setCollapsedStyles();
      return;
    }

    const target = this.#getElement();
    this.#options.onTransitionStateChange("collapseStart");

    const height = target.scrollHeight;
    console.log(`height ${this.#getDuration(height)} ${this.#options.easing}`);
    target.style.transition = `height ${this.#getDuration(height)} ${this.#options.easing}`;
    target.style.height = `${height}px`;
    requestAnimationFrame(() => {
      this.#options.onTransitionStateChange("collapsing");
      target.style.overflow = "hidden";
      target.style.height = `${this.#options.collapsedHeight}px`;
    });
  }

  #onTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== "height") return;
    const target = e.target as HTMLElement;

    requestAnimationFrame(() => {
      target.style.removeProperty("transition");
      if (target.style.height === `${this.#options.collapsedHeight}px`) {
        // Closed
        this.setCollapsedStyles();
        this.#options.onTransitionStateChange("collapseEnd");
      } else {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("display");
        this.#options.onTransitionStateChange("expandEnd");
      }
    });
  };
}

/** Tells if the user has enabled the "reduced motion" setting in their browser or OS. */
export function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
