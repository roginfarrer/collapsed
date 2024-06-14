import { createSignal } from "solid-js";
import { createCollapse } from "../../solid/src";
import "./app.css";

export default function App() {
  const [collapseHeight, setCollapseHeight] = createSignal(60);
  const collapse = createCollapse({
    get collapsedHeight() {
      return Number.isNaN(collapseHeight()) ? 0 : collapseHeight();
    },
  });

  return (
    <main>
      <h1>Hello world!</h1>
      <input
        type="number"
        value={collapseHeight()}
        oninput={(e) => setCollapseHeight(e.target.valueAsNumber || 0)}
      />
      <button {...collapse.getToggleProps()}>Toggle</button>
      <div {...collapse.getCollapseProps()}>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
        <p>Hello there</p>
      </div>
    </main>
  );
}
