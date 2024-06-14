import { html } from "lit";
import "./components";

export const Basic = () => {
  return html`
    <div>
      <styled-collapse id="basic"></styled-collapse>
    </div>
  `;
};

export default {
  title: "Basic Usage",
};
