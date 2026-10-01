import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { designRoutes, docsRoutes, markdownRoutes } from "../app/utils/content-routes";

describe("content-routes crawler", () => {
  const rootDir = resolve(__dirname, "..");

  it("discovers all design/*.md routes", () => {
    const routes = designRoutes(rootDir);
    expect(routes).toContain("/design/components");
    expect(routes).toContain("/design/palette");
    expect(routes).toContain("/design/roadmap");
    expect(routes.length).toBeGreaterThanOrEqual(10);
  });

  it("discovers docs routes including ADRs and guides", () => {
    const routes = docsRoutes(rootDir);
    expect(routes).toContain("/docs/adr");
    expect(routes).toContain("/docs/adr/0012-cross-framework-distribution-via-web-components");
    expect(routes).toContain("/docs/guides/nuxt-studio");
  });

  it("crawls markdownRoutes with clean exclusions", () => {
    const routes = markdownRoutes(rootDir);
    expect(routes).toContain("/changelog");
    expect(routes).toContain("/design/components");
    expect(routes).toContain("/docs/guides/nuxt-studio");
    // Excluded directories must not leak
    expect(routes.some((r) => r.includes("node_modules"))).toBe(false);
    expect(routes.some((r) => r.includes(".nuxt"))).toBe(false);
  });
});
