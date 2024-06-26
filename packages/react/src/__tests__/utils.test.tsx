import React from "react";
import { render, act } from "@testing-library/react";
import { useControlledState, callAll } from "../utils";

describe("callAll", () => {
  it("it calls the two functions passed into it", () => {
    const functionOne = vi.fn();
    const functionTwo = vi.fn();
    const theFunk = callAll(functionOne, functionTwo);
    theFunk();
    expect(functionOne).toHaveBeenCalled();
    expect(functionTwo).toHaveBeenCalled();
  });
});

describe("useControlledState", () => {
  let hookReturn: [boolean, React.Dispatch<React.SetStateAction<boolean>>];

  function UseControlledState({
    defaultExpanded = false,
    isExpanded,
  }: {
    defaultExpanded?: boolean;
    isExpanded?: boolean;
  }) {
    const result = useControlledState(isExpanded, defaultExpanded);

    hookReturn = result;

    return null;
  }

  it("returns a boolean and a function", () => {
    render(<UseControlledState />);

    expect(hookReturn[0]).toBe(false);
    expect(typeof hookReturn[1]).toBe("function");
  });

  it("returns the defaultValue value", () => {
    render(<UseControlledState defaultExpanded />);

    expect(hookReturn[0]).toBe(true);
  });

  it("setter toggles the value", () => {
    render(<UseControlledState defaultExpanded />);

    expect(hookReturn[0]).toBe(true);

    act(() => {
      hookReturn[1]((n) => !n);
    });

    expect(hookReturn[0]).toBe(false);
  });

  describe("dev feedback", () => {
    let consoleOutput: string[] = [];

    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation((...msgs) => {
        consoleOutput.push(...msgs);
      });
    });
    afterEach(() => {
      vi.restoreAllMocks();
      consoleOutput = [];
    });

    function Foo({ isExpanded }: { isExpanded?: boolean }) {
      useControlledState(isExpanded, undefined);
      return <div />;
    }

    it("warns about changing from uncontrolled to controlled", () => {
      const { rerender } = render(<Foo />);
      rerender(<Foo isExpanded />);

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isExpanded\` prop."`,
      );
      expect(consoleOutput.length).toBe(1);
    });

    it("warns about changing from controlled to uncontrolled", () => {
      // Initially control the value
      const { rerender } = render(<Foo isExpanded />);
      // Then re-render without controlling it
      rerender(<Foo isExpanded={undefined} />);

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isExpanded\` prop."`,
      );
      expect(consoleOutput.length).toBe(1);
    });
  });
});
