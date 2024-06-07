import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { CollapseAnimation } from "./collapsed";

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

  @state()
  hasMounted = false;

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: Number })
  collapsedHeight: number = 0;

  @property()
  duration: "auto" | number = "auto";

  @property({ attribute: false })
  easing: string = "cubic-bezier(0.4, 0, 0.2, 1)";

  observer?: MutationObserver;
  collapse: CollapseAnimation;

  constructor() {
    super();

    this.id = this.id.length > 0 ? this.id : this.componentId;

    this.collapse = new CollapseAnimation({
      onStateChange: (state) => {
        this.dispatchEvent(openStateChange(state));
      },
      onTransitionStateChange: (state) => {
        this.dispatchEvent(transitionStateChangeEvent(state));
      },
      easing: this.easing,
      collapsedHeight: this.collapsedHeight,
      getDisclosureElement: () =>
        this.renderRoot.querySelector(":first-child")!,
    });

    if (this.hasAttribute("open")) {
      this.open = true;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  async firstUpdated() {
    this.collapse.setup();

    this.observer = new MutationObserver(async (changes) => {
      for (let change of changes) {
        if (change.type === "attributes" && change.attributeName === "open") {
          if (this.open) {
            this.collapse.open();
          } else {
            this.collapse.close();
          }
        }
      }
    });

    this.observer.observe(this, { attributes: true });

    // In the template, we apply collapsed styles on the first render if the disclosure isn't open
    // After we've mounted, we remove those styles from subsequent renders, and reapply it
    // manually if needed
    this.hasMounted = true;
    await this.updateComplete;
    if (!this.open) {
      this.collapse.setCollapsedStyles();
    }
  }

  disconnectedCallback(): void {
    this.collapse.cleanup();
    this.observer?.disconnect();
  }

  public toggle = () => {
    this.open = !this.open;
  };

  render() {
    return html`<div
      part="root"
      style=${styleMap(
        !this.hasMounted && !this.open
          ? this.collapse.getCollapsedStyles()
          : {},
      )}
    >
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "collapsed-disclosure": CollapsedDisclosure;
  }
}
