"use client";

import { useCollapse as useCollapsedReact } from "@collapsed/react";
import { useCollapse as useReactCollapsed } from "react-collapsed";

export function CollapsedReact() {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapsedReact();

  return (
    <div>
      <button {...getToggleProps()}>{isExpanded ? "Hide" : "Show"}</button>
      <div {...getCollapseProps()}>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
      </div>
    </div>
  );
}

export function ReactCollapsed() {
  const { getCollapseProps, getToggleProps, isExpanded } = useReactCollapsed();

  return (
    <div>
      <button {...getToggleProps()}>{isExpanded ? "Hide" : "Show"}</button>
      <div {...getCollapseProps()}>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
        <p>Hey there</p>
      </div>
    </div>
  );
}
