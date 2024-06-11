"use client";

import { useCollapse } from "@collapsed/react";

export function Collapse() {
  const { getCollapseProps, getToggleProps } = useCollapse();

  return (
    <div>
      <button {...getToggleProps()}>Toggle</button>
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
