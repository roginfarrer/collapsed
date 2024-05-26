import * as React from "react";
import { useCollapse } from "..";
import { Toggle, Collapse, excerpt } from "./components";

export const Uncontrolled = () => {
  const toggleRef = React.useRef();
  const collapseRef = React.useRef();
  const { isExpanded, setExpanded } = useCollapse({
    getCollapseElement: () => collapseRef.current,
    getToggleElement: () => toggleRef.current,
  });

  return (
    <div>
      <button onClick={() => setExpanded((x) => !x)}>
        {isExpanded ? "Close" : "Open"}
      </button>
      <Toggle ref={toggleRef}>{isExpanded ? "Close" : "Open"}</Toggle>
      <Collapse ref={collapseRef}>{excerpt}</Collapse>
    </div>
  );
};

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true);
  const collapseRef = React.useRef();
  const { setExpanded } = useCollapse({
    getCollapseElement: () => collapseRef.current,
    isExpanded,
    onExpandedChange: setOpen,
  });

  return (
    <div>
      <Toggle onClick={() => setExpanded((x) => !x)}>
        {isExpanded ? "Close" : "Open"}
      </Toggle>
      <Toggle onClick={() => setOpen((x) => !x)}>
        {isExpanded ? "Close" : "Open"}
      </Toggle>
      <Collapse ref={collapseRef}>{excerpt}</Collapse>
    </div>
  );
};

function useReduceMotion() {
  const [matches, setMatch] = React.useState(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setMatch(mq.matches);
    };
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);
  return matches;
}

// export const PrefersReducedMotion = () => {
//   const reduceMotion = useReduceMotion();
//   const [isExpanded, setOpen] = React.useState<boolean>(true);
//   const { getToggleProps, getCollapseProps } = useCollapse({
//     isExpanded,
//     hasDisabledAnimation: reduceMotion,
//   });

//   return (
//     <div>
//       <Toggle {...getToggleProps({ onClick: () => setOpen((old) => !old) })}>
//         {isExpanded ? "Close" : "Open"}
//       </Toggle>
//       <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
//     </div>
//   );
// };

export default {
  title: "Basic Usage",
};
