import { html } from "lit";
import "./components";

export const Nested = () => {
  return html`
    <div>
      <styled-collapse id="outer"
        ><styled-collapse id="inner"></styled-collapse
      ></styled-collapse>
    </div>
  `;
};

export default {
  title: "Nested",
};
