import * as React from "react";
import { useCollapse } from "../../src/useCollapse";

const Collapse = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function Collapse(props, ref) {
  return (
    <div {...props} ref={ref} data-testid="collapse">
      <div
        style={{
          height: 300,
          border: "2px solid red",
          backgroundColor: "lightblue",
        }}
      >
        helloooo
      </div>
    </div>
  );
});

const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true);
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded,
  });

  return (
    <div>
      <button {...getToggleProps({ onClick: () => setOpen((x) => !x) })}>
        {isExpanded ? "Close" : "Open"}
      </button>
      <Collapse {...getCollapseProps()} />
    </div>
  );
};

describe("Controlled", () => {
  it("playground", () => {
    cy.mount(<Controlled />);

    // getToggleProps
    cy.get("button").should("have.text", "Close");
    cy.get('[data-testid="collapse"]').should("be.visible");
    cy.get("button").click();
    cy.get("button").should("have.text", "Open");
    cy.get('[data-testid="collapse"]').should("not.be.visible");
  });
});
