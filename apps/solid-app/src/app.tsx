import { createSignal, createUniqueId } from "solid-js";
import { createCollapse } from "@collapsed/solid";
import "./app.css";

function Collapse() {
  const id = createUniqueId();
  const [collapseHeight, setCollapseHeight] = createSignal(60);
  const collapse = createCollapse({
    id,
    get collapsedHeight() {
      return Number.isNaN(collapseHeight()) ? 0 : collapseHeight();
    },
  });

  return (
    <div>
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
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Collapse />
    </main>
  );
}
