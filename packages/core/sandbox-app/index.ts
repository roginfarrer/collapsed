import { Collapse } from "../src";

const btn = document.querySelector("button") as HTMLButtonElement;
const collapse = document.querySelector(".collapse") as HTMLDivElement;
let isExpanded = true;

let instance = new Collapse({
  getCollapseElement: () => collapse,
  getToggleElement: () => btn,
  isExpanded,
  onExpandedChange(state) {
    isExpanded = state;
    instance.setOptions((prev) => ({ ...prev, isExpanded: state }));
  },
});
