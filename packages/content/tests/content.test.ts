import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { remarkMdLinks, rewriteMarkdownHref } from "../app/utils/remark-md-links";

describe("@tti/tti-ux-content link rewrites & remark AST plugin", () => {
  const rootDir = resolve(__dirname, "../../..");

  it("rewrites sibling markdown links", () => {
    const fromFile = resolve(rootDir, "design/palette.md");
    const result = rewriteMarkdownHref("components.md", fromFile, rootDir);
    expect(result).toBe("/design/components");
  });

  it("preserves URL hash anchors", () => {
    const fromFile = resolve(rootDir, "design/chart-foundations.md");
    const result = rewriteMarkdownHref("roadmap.md#charts", fromFile, rootDir);
    expect(result).toBe("/design/roadmap#charts");
  });

  it("leaves external and mailto links untouched", () => {
    const fromFile = resolve(rootDir, "design/components.md");
    expect(rewriteMarkdownHref("https://keepachangelog.com/", fromFile, rootDir)).toBe("https://keepachangelog.com/");
    expect(rewriteMarkdownHref("mailto:research@tti.tamu.edu", fromFile, rootDir)).toBe("mailto:research@tti.tamu.edu");
  });

  it("transforms AST nodes through the remark plugin", () => {
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
          ],
        },
      ],
    };

    plugin(tree, {});
    const p = tree.children[0];
    expect(p.children[0].url).toBe("/design/components");
  });
});
