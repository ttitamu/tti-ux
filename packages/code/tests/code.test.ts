import { describe, expect, it } from "vitest";
import { useTuxHighlighter } from "../app/composables/useTuxHighlighter";

describe("@tti/tti-ux-code composables and utilities", () => {
  it("provides useTuxHighlighter with highlight method", () => {
    const { highlight } = useTuxHighlighter();
    expect(typeof highlight).toBe("function");
  });

  it("handles plain text language without invoking oniguruma parser", async () => {
    const { highlight } = useTuxHighlighter();
    const raw = "const x = <div className=\"test\">&amp;</div>;";
    const html = await highlight(raw, { lang: "text", theme: "github-light" });

    expect(html).toContain("<pre><code>");
    expect(html).toContain("&lt;div");
    expect(html).toContain("&amp;amp;");
  });

  it("highlights TypeScript snippets with Shiki core tokenization", async () => {
    const { highlight } = useTuxHighlighter();
    const tsCode = "export const answer: number = 42;";
    const html = await highlight(tsCode, { lang: "ts", theme: "github-light" });

    expect(html).toContain("<pre class=\"shiki");
    expect(html).toContain("export");
    expect(html).toContain("answer");
    expect(html).toContain("42");
  });
});
