import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { rewriteMarkdownHref, remarkMdLinks } from "../app/utils/remark-md-links";

describe("remarkMdLinks & rewriteMarkdownHref", () => {
  const rootDir = resolve(__dirname, "..");

  it("rewrites sibling markdown links within design/", () => {
    const fromFile = resolve(rootDir, "design/palette.md");
    const result = rewriteMarkdownHref("components.md", fromFile, rootDir);
    expect(result).toBe("/design/components");
  });

  it("rewrites sibling markdown links with ./ prefix", () => {
    const fromFile = resolve(rootDir, "design/chart-foundations.md");
    const result = rewriteMarkdownHref("./roadmap.md", fromFile, rootDir);
    expect(result).toBe("/design/roadmap");
  });

  it("preserves URL hash anchors", () => {
    const fromFile = resolve(rootDir, "design/chart-foundations.md");
    const result = rewriteMarkdownHref("roadmap.md#charts--data-viz", fromFile, rootDir);
    expect(result).toBe("/design/roadmap#charts--data-viz");
  });

  it("rewrites cross-directory links to docs/adr/", () => {
    const fromFile = resolve(rootDir, "design/components.md");
    const result = rewriteMarkdownHref("../docs/adr/0012-cross-framework-distribution-via-web-components.md", fromFile, rootDir);
    expect(result).toBe("/docs/adr/0012-cross-framework-distribution-via-web-components");
  });

  it("rewrites root CHANGELOG.md link", () => {
    const fromFile = resolve(rootDir, "design/roadmap.md");
    const result = rewriteMarkdownHref("../CHANGELOG.md", fromFile, rootDir);
    expect(result).toBe("/changelog");
  });

  it("rewrites docs/adr/README.md to /docs/adr", () => {
    const fromFile = resolve(rootDir, "docs/adr/0001-nuxt-4-and-nuxt-ui.md");
    const result = rewriteMarkdownHref("./README.md", fromFile, rootDir);
    expect(result).toBe("/docs/adr");
  });

  it("leaves external, mailto, and anchor links untouched", () => {
    const fromFile = resolve(rootDir, "design/components.md");
    expect(rewriteMarkdownHref("https://keepachangelog.com/", fromFile, rootDir)).toBe("https://keepachangelog.com/");
    expect(rewriteMarkdownHref("mailto:research@tti.tamu.edu", fromFile, rootDir)).toBe("mailto:research@tti.tamu.edu");
    expect(rewriteMarkdownHref("#heading-1", fromFile, rootDir)).toBe("#heading-1");
  });

  it("runs as a remark AST plugin", () => {
    const plugin = remarkMdLinks({ rootDir, currentPath: "design/palette.md" });
    const tree = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "components.md",
              children: [{ type: "text", value: "Components" }],
            },
            {
              type: "link",
              url: "https://example.com",
              children: [{ type: "text", value: "External" }],
            },
          ],
        },
      ],
    };

    plugin(tree, {});
    const p = tree.children[0];
    expect(p.children[0].url).toBe("/design/components");
    expect(p.children[1].url).toBe("https://example.com");
  });
});
