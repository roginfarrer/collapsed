import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { Collapse } from "@collapsed/core";

let id = 0;

const transitionStateChangeEvent = (
  payload:
    | "expandStart"
    | "expanding"
    | "expandEnd"
    | "collapseStart"
    | "collapsing"
    | "collapseEnd",
) =>
  new CustomEvent("transitionStateChange", {
    detail: payload,
    bubbles: true,
    composed: true,
  });

const openStateChange = (payload: boolean) =>
  new CustomEvent("openStateChange", {
    detail: payload,
    bubbles: true,
    composed: true,
  });

@customElement("collapsed-disclosure")
export class CollapsedDisclosure extends LitElement {
  static styles = css`
    :host {
      box-sizing: border-box;
      /* To avoid jankiness with margin collapse */
      display: flex;
    }
    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }
  `;

  private readonly attrId = ++id;
  private readonly componentId = `collapsed-disclosure-${this.attrId}`;
  private passedFirstUpdate = false;
  private collapse: Collapse;

  @query(":first-child")
  private collapseEl?: HTMLDivElement;

  @state()
  private isAnimating = false;

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: Number, attribute: "collapsed-height", reflect: true })
  collapsedHeight: number = 0;

  @property()
  duration: "auto" | number = "auto";

  @property()
  easing: string = "cubic-bezier(0.4, 0, 0.2, 1)";

  constructor() {
    super();

    this.id = this.id.length > 0 ? this.id : this.componentId;

    if (this.hasAttribute("open")) {
      this.open = true;
    }

    this.collapse = new Collapse({
      onExpandedChange: (state) => {
        this.dispatchEvent(openStateChange(state));
      },
      onTransitionStateChange: (state) => {
        switch (state) {
          case "expandStart":
          case "collapseStart":
            this.isAnimating = true;
            break;
          case "expandEnd":
          case "collapseEnd":
            this.isAnimating = false;
        }
        this.dispatchEvent(transitionStateChangeEvent(state));
      },
      easing: this.easing,
      collapsedHeight: this.collapsedHeight,
      duration: this.duration,
      getDisclosureElement: () => this.collapseEl!,
    });
  }

  protected updated(props: PropertyValueMap<typeof this>) {
    this.collapse.setOptions({
      easing: this.easing,
      collapsedHeight: this.collapsedHeight,
      duration: this.duration,
    });

    if (
      props.has("collapsedHeight") &&
      this.collapsedHeight > 0 &&
      !this.open
    ) {
      this.collapseEl?.style.removeProperty("display");
      this.collapseEl?.style.setProperty("height", `${this.collapsedHeight}px`);
    }

    if (
      // So we don't animate on first update
      this.passedFirstUpdate &&
      props.has("open") &&
      this.open !== props.get("open")
    ) {
      if (this.open) {
        this.collapse.open();
      } else {
        this.collapse.close();
      }
    }

    this.passedFirstUpdate = true;
  }

  render() {
    return html`<div
      part="root"
      style=${styleMap(
        !this.isAnimating && !this.open
          ? this.collapse.getCollapsedStyles()
          : {},
      )}
    >
      <slot></slot>
    </div>`;
  }
}
