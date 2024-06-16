import { html } from "lit";
import { SimpleDemo } from "./components";

export const Basic = () => {
  return html`
    <div>
      <styled-collapse id="basic"></styled-collapse>
    </div>
  `;
};

export const SimpleComposition = () => {
  return html`${SimpleDemo()}`;
};

export default {
  title: "Basic Usage",
};
