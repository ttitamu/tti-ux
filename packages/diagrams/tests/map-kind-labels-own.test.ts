/**
 * A kind or a link kind named like an Object.prototype member reads as itself, not as a function.
 * The label tables are plain objects; a lookup of `constructor` used to return Object's constructor.
 */
import { describe, expect, it } from "vitest";
import { elementTypeLabel, liftLinksToView, plainElementKindLabel } from "../app/utils/tuxArchitectureMap";

describe("kind label lookups read own keys only", () => {
  it("names an element kind such as `constructor` by itself", () => {
    expect(plainElementKindLabel("constructor")).toBe("constructor");
    expect(plainElementKindLabel({ id: "x", kind: "toString" as never, name: "X" })).toBe("toString");
    expect(typeof elementTypeLabel({ id: "x", kind: "constructor" as never, name: "X" })).toBe("string");
  });

  it("labels a lifted wire whose link kind is `constructor` with the kind's own name", () => {
    const parentOf = new Map([["a", "p"], ["b", "p"]]);
    const lifted = liftLinksToView([{ from: "a", to: "b", kind: "constructor" } as never], "p", ["a", "b"], parentOf);
    expect(JSON.stringify(lifted)).not.toMatch(/function|native code/);
    expect(JSON.stringify(lifted)).toContain('"constructor"');
  });
});
