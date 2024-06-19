import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CollapsedDisclosure } from "../src/collapsed-disclosure.js";

export function SimpleDemo() {
  function handleClick(event: MouseEvent) {
    const collapse = document.querySelector(
      "#disclosure",
    ) as CollapsedDisclosure;
    const btn = event.target as HTMLButtonElement;
    collapse.toggleAttribute("open");
    btn.setAttribute("aria-expanded", collapse.hasAttribute("open").toString());
  }

  return html`<div>
    <button
      aria-controls="disclosure"
      aria-expanded="false"
      @click="${handleClick}"
    >
      Toggle
    </button>
    <collapsed-disclosure id="disclosure">
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
      <p>Oh, hello</p>
    </collapsed-disclosure>
  </div>`;
}

@customElement("styled-collapse")
export class StyledCollapse extends LitElement {
  static styles = css`
    .toggle {
      box-sizing: border-box;
      background: white;
      display: inline-block;
      text-align: center;
      box-shadow: 5px 5px 0 black;
      border: 1px solid black;
      color: black;
      cursor: pointer;
      padding: 12px 24px;
      font-family: Helvetica;
      font-size: 16px;
      transition-timing-function: ease;
      transition-duration: 150ms;
      transition-property: all;
      min-width: 150px;
      width: 100%;

      @media (min-width: 640px) {
        width: auto;
      }

      &:hover,
      &:focus {
        background: rgba(225, 225, 225, 0.8);
      }
      &:active {
        background: black;
        color: white;
        box-shadow: none;
      }
    }

    .content {
      display: block;
      box-sizing: border-box;
      border: 2px solid black;
      color: #212121;
      font-family: Helvetica;
      padding: 12px;
      font-size: 16px;
      line-height: 1.5;
    }

    .collapse-container {
      margin-top: 8px;
    }
  `;

  @property({ type: String, reflect: true })
  controls?: string;

  @query("button")
  button!: HTMLButtonElement;

  private disclosure!: CollapsedDisclosure;

  constructor() {
    super();
    this.controls = this.getAttribute("controls")!;
    if (!customElements.get("collapsed-disclosure")) {
      customElements.define("collapsed-disclosure", CollapsedDisclosure);
    }
  }

  firstUpdated() {
    customElements.whenDefined("collapsed-disclosure").then(() => {
      this.disclosure = this.renderRoot.querySelector("collapsed-disclosure")!;
      this.updateButton(this.disclosure.hasAttribute("open"));
    });
  }

  updateButton(open: boolean) {
    this.button.setAttribute("aria-expanded", open.toString());
    this.button.innerText = open ? "Close" : "Open";
  }

  handleClick = () => {
    if (!this.disclosure) return;
    this.disclosure.toggleAttribute("open");
  };

  listen = (event: CustomEvent): void => {
    this.updateButton(event.detail);
  };

  render() {
    return html`<button
        class="toggle"
        aria-controls="${this.id}"
        @click="${this.handleClick}"
      ></button>
      <div class="collapse-container">
        <collapsed-disclosure id="${this.id}" @openStateChange="${this.listen}">
          <div class="content">
            In the morning I walked down the Boulevard to the rue Soufflot for
            coffee and brioche. It was a fine morning. The horse-chestnut trees
            in the Luxembourg gardens were in bloom. There was the pleasant
            early-morning feeling of a hot day. I read the papers with the
            coffee and then smoked a cigarette. The flower-women were coming up
            from the market and arranging their daily stock. Students went by
            going up to the law school, or down to the Sorbonne. The Boulevard
            was busy with trams and people going to work.
          </div>
          <slot></slot>
        </collapsed-disclosure>
      </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "styled-collapse": StyledCollapse;
  }
}
