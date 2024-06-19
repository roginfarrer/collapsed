import { Collapse } from "../src/Collapse";
import { expect, test } from "vitest";

test("Collapse has expected properties", () => {
  const collapse = new Collapse({
    // @ts-expect-error Element doesn't matter here
    getDisclosureElement: () => {},
  });

  expect(typeof collapse.close).toBe("function");
  expect(typeof collapse.open).toBe("function");
  expect(typeof collapse.setCollapsedStyles).toBe("function");
  expect(typeof collapse.setOptions).toBe("function");
  expect(typeof collapse.unsetCollapsedStyles).toBe("function");
  expect(collapse.getCollapsedStyles()).toMatchObject(
    expect.objectContaining({ height: expect.stringMatching("") }),
  );
});
