// @ts-nocheck
import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CollapsedDisclosure } from "./collapsed-disclosure";

let id = 0;

@customElement("collapsed-toggle")
export class CollapsedToggle extends LitElement {
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

    [aria-expanded="false"] slot[name="show"] {
      display: none;
    }
    [aria-expanded="true"] slot[name="hide"] {
      display: none;
    }
  `;

  @query("button")
  button!: HTMLButtonElement;

  @property({ attribute: false })
  observer?: MutationObserver;

  @property({ type: String, attribute: true })
  controls?: string;

  firstUpdated(): void {
    const panel = this.closest("collapsed-group")?.querySelector(
      "collapsed-disclosure",
    );
  }

  // protected updated(_changedProperties: PropertyValueMap<typeof this>): void {
  //   if (
  //     _changedProperties.has("controls") &&
  //     _changedProperties.get("controls") !== this.controls
  //   ) {
  //     this.button.setAttribute("aria-controls", this.controls!);
  //   }
  // }

  handleClick() {
    const panel = this.closest("collapsed-group")?.querySelector(
      "collapsed-disclosure",
    );
    if (!panel) return;
    if (panel.hasAttribute("open")) {
      panel.removeAttribute("open");
      this.button.setAttribute("aria-expanded", "false");
    } else {
      panel.setAttribute("open", "");
      this.button.setAttribute("aria-expanded", "true");
    }
  }

  render() {
    return html`<button type="button" @click=${this.handleClick}>
      <slot></slot>
      <slot name="show" part="show-text"></slot>
      <slot name="hide" part="hidden-text"></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "collapsed-toggle": CollapsedToggle;
  }
}
