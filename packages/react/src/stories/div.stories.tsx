import { useCollapse } from "../useCollapse";
import { Toggle, Collapse, excerpt } from "./components";

export default {
  title: "Using divs",
};

export const Div = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  });

  return (
    <div>
      <Toggle as="div" {...getToggleProps()}>
        {isExpanded ? "Close" : "Open"}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};
