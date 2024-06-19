import { Window as HappyWindow, PropertySymbol } from "happy-dom";
import { CollapsedDisclosure } from "../src/collapsed-disclosure.js";
import { vi, test, expect, suite, afterEach, beforeEach } from "vitest";

// @ts-expect-error block is from docs
const browserWindow = global.document[PropertySymbol.ownerWindow];
global.setTimeout = browserWindow.setTimeout;
global.clearTimeout = browserWindow.clearTimeout;
global.setInterval = browserWindow.setInterval;
global.clearInterval = browserWindow.clearInterval;
global.requestAnimationFrame = browserWindow.requestAnimationFrame;
global.cancelAnimationFrame = browserWindow.cancelAnimationFrame;
global.queueMicrotask = browserWindow.queueMicrotask;

declare global {
  interface Window extends HappyWindow {}
}

suite("collapsed-disclosure", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "cancelAnimationFrame",
        "clearTimeout",
        "requestAnimationFrame",
      ],
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("is defined", () => {
    customElements.whenDefined("collapsed-disclosure").then(() => {
      expect(customElements.get("collapsed-disclosure")).toBe(
        CollapsedDisclosure,
      );
    });
  });

  test("renders collapsed by default", async () => {
    // const el = document.createElement("collapsed-disclosure");
    // el.innerText = "Hello there";
    document.body.innerHTML =
      "<collapsed-disclosure>Hello there</collapsed-disclosure>";
    await window.happyDOM.waitUntilComplete();
    const el = document
      .querySelector("collapsed-disclosure")
      ?.shadowRoot!.querySelector("div") as HTMLDivElement;
    expect(el.style.height).toBe("0px");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.display).toBe("none");
  });

  test("has no styles if open", async () => {
    document.body.innerHTML =
      "<collapsed-disclosure open>Hello there</collapsed-disclosure>";
    await window.happyDOM.waitUntilComplete();
    const el = document
      .querySelector("collapsed-disclosure")
      ?.shadowRoot!.querySelector("div") as HTMLDivElement;
    expect(el.style.height).toBe("");
    expect(el.style.overflow).toBe("");
    expect(el.style.display).toBe("");
  });

  test("removes styles after opening", async () => {
    document.body.innerHTML =
      "<collapsed-disclosure>Hello there</collapsed-disclosure>";
    await window.happyDOM.waitUntilComplete();
    const el = document
      .querySelector("collapsed-disclosure")
      ?.shadowRoot!.querySelector("div") as HTMLDivElement;
    expect(el.style.height).toBe("0px");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.display).toBe("none");

    document.querySelector("collapsed-disclosure")?.setAttribute("open", "");
    await vi.runAllTimersAsync();

    expect(el.style.height).toBe("");
    expect(el.style.overflow).toBe("");
    expect(el.style.display).toBe("");
  });

  test("adds styles after closing", async () => {
    document.body.innerHTML =
      "<collapsed-disclosure open>Hello there</collapsed-disclosure>";
    await window.happyDOM.waitUntilComplete();
    const el = document
      .querySelector("collapsed-disclosure")
      ?.shadowRoot!.querySelector("div") as HTMLDivElement;
    expect(el.style.height).toBe("");
    expect(el.style.overflow).toBe("");
    expect(el.style.display).toBe("");

    document.querySelector("collapsed-disclosure")?.removeAttribute("open");
    await vi.runAllTimersAsync();

    expect(el.style.height).toBe("0px");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.display).toBe("none");
  });

  test("collapsedHeight > 0 sets appropriate styles", async () => {
    document.body.innerHTML =
      '<collapsed-disclosure collapsed-height="20">Hello there</collapsed-disclosure>';
    await window.happyDOM.waitUntilComplete();

    const el = document
      .querySelector("collapsed-disclosure")
      ?.shadowRoot!.querySelector("div") as HTMLDivElement;
    expect(el.style.height).toBe("20px");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.display).toBe("");
  });
});
