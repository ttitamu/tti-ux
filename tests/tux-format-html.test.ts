/**
 * tuxFormatHtml — behavior lock for the TuxExample HTML-tab formatter.
 * The inline version it replaces leaked one indent level per Vue
 * hydration comment marker (and per `<col>`-class void element),
 * which inflated output ~6× and could exceed V8's max string length.
 */
import { describe, expect, it } from "vitest";
import { tuxFormatHtml } from "../app/utils/tuxFormatHtml";

function finalIndent(out: string): number {
  const last = out.split("\n").at(-1) ?? "";
  return (last.match(/^ */)?.[0].length ?? 0) / 2;
}

describe("tuxFormatHtml", () => {
  it("drops Vue hydration comment markers without leaking depth", () => {
    const html = `<div><!--[--><span>a</span><!--]--><!----><span>b</span></div>`;
    const out = tuxFormatHtml(html);
    expect(out).not.toContain("<!--");
    // both spans sit at the same depth; the close returns to column 0
    const lines = out.split("\n");
    expect(lines.at(-1)).toBe("</div>");
    expect(lines.filter((l) => l.includes("<span>")).every((l) => l.startsWith("  <span>"))).toBe(true);
  });

  it("treats the full void-element set as self-closing (col leaked before)", () => {
    const html = `<table><colgroup><col><col></colgroup><tbody></tbody></table>`;
    const out = tuxFormatHtml(html);
    expect(out.split("\n").at(-1)).toBe("</table>");
    expect(finalIndent(out)).toBe(0);
  });

  it("indents balanced nesting by depth", () => {
    const out = tuxFormatHtml(`<ul><li>one</li><li>two</li></ul>`);
    expect(out).toBe(`<ul>\n  <li>\n    one\n  </li>\n  <li>\n    two\n  </li>\n</ul>`);
  });

  it("does not split comments containing '>' (tokenizer order)", () => {
    const out = tuxFormatHtml(`<div><!-- a > b --><em>x</em></div>`);
    expect(out).toContain("<em>");
    expect(out.split("\n").at(-1)).toBe("</div>");
  });

  it("hard-caps pathological input with a visible truncation notice", () => {
    const huge = "<div>" + "<span>x</span>".repeat(40_000) + "</div>";
    const out = tuxFormatHtml(huge);
    expect(out.length).toBeLessThan(1_000_000);
    expect(out).toContain("output truncated");
  });

  it("stays linear on a marker-heavy real-world shape (the RangeError class)", () => {
    // 200 markers around 200 elements — the old formatter leaked +200
    // depth and inflated output ~6×; this must stay ~proportional.
    const html = "<div>" + "<!--[--><p>row</p><!--]-->".repeat(200) + "</div>";
    const out = tuxFormatHtml(html);
    expect(out.length).toBeLessThan(html.length);
    expect(out.split("\n").at(-1)).toBe("</div>");
  });
});
