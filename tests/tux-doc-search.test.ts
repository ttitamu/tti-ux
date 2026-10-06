import { describe, it, expect } from "vitest";

describe("TuxDocSearch search logic", () => {
  const items = [
    { title: "Components Doctrine", to: "/design/components", section: "Design", description: "Standard component census and rules" },
    { title: "Palette & Visual Identity", to: "/design/palette", section: "Design", description: "Colors, tints, and accessible combinations" },
    { title: "Installation Hub", to: "/install", section: "Install", description: "Install guides for Nuxt, React, .NET, WordPress" },
    { title: "React Integration", to: "/install/react", section: "Install", description: "Using TUX in React applications" },
  ];

  function search(query: string, limit = 8) {
    const needle = query.trim().toLowerCase();
    if (needle.length < 1) return [];

    return items
      .filter((item) => {
        const haystack = `${item.title} ${item.to} ${item.section || ""} ${item.description || ""}`.toLowerCase();
        return haystack.includes(needle);
      })
      .slice(0, limit);
  }

  it("filters items matching title substring", () => {
    const res = search("palette");
    expect(res.length).toBe(1);
    expect(res[0].title).toBe("Palette & Visual Identity");
  });

  it("filters items matching section or description", () => {
    const res = search("React");
    expect(res.length).toBe(2); // Install Hub (description has React) + React Integration
    expect(res.some((r) => r.to === "/install/react")).toBe(true);
  });

  it("returns empty array when query is blank", () => {
    expect(search("   ")).toEqual([]);
  });

  it("caps results at max limit", () => {
    const res = search("install", 1);
    expect(res.length).toBe(1);
  });
});
