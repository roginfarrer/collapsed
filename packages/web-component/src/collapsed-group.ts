// @ts-nocheck
import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { CollapsedToggle } from "./collapsed-toggle";
import { CollapsedDisclosure } from "./collapsed-disclosure";

@customElement("collapsed-group")
export class CollapsedGroup extends LitElement {
  static styles = css`
    :host {
      box-sizing: border-box;
      display: contents;
    }
    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }
  `;
  private mutationObserver?: MutationObserver;

  connectedCallback(): void {
    super.connectedCallback();

    this.mutationObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => !["controls"].includes(m.attributeName!))) {
        this.setAriaLabels();
      }
    });

    this.updateComplete.then(() => {
      this.mutationObserver?.observe(this, {
        attributes: true,
        subtree: true,
        childList: true,
      });

      this.setAriaLabels();
    });
  }

  getToggle() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="toggle"]',
    );
    return slot?.assignedElements()[0];
  }

  getDisclosure() {
    return this.shadowRoot?.querySelector<CollapsedDisclosure>(
      "collapsed-disclosure",
    )!;
  }

  setAriaLabels() {
    const toggle = this.getToggle();
    const disclosure = this.getDisclosure();
    console.log(toggle, disclosure);
    if (toggle && disclosure) {
      toggle.setAttribute("controls", disclosure.getAttribute("id")!);
    }
  }

  render() {
    return html`<slot name="toggle"></slot
      ><collapsed-disclosure><slot></slot></collapsed-disclosure>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "collapsed-group": CollapsedGroup;
  }
}
