/**
 * tuxFormatHtml — pretty-print serialized DOM for TuxExample's HTML
 * tab. Not a full formatter: strips whitespace between tags, then
 * re-indents one tag per line by nesting depth. "Look at what my
 * component emits" quality, deliberately.
 *
 * History (2026-08-12): TuxExample's inline version treated Vue's
 * hydration comment markers (`<!--[-->` / `<!--]-->` / `<!---->`) as
 * open tags — every marker leaked one indent level forever (a
 * rich-data-grid preview leaked +190), inflating output ~6× and, on
 * big churning previews, blowing past V8's max string length
 * ("RangeError: Invalid string length"). This version tokenizes
 * comments explicitly and drops them (they're framework plumbing, not
 * component output), completes the HTML void-element list (`<col>`
 * et al. also leaked), and hard-caps input so no preview subtree can
 * ever OOM the tab.
 */

const VOID_ELEMENTS = /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i;

/** Inputs beyond this are truncated with a visible notice — generous
 *  for any sane preview, small enough that quadratic worst cases die. */
const MAX_INPUT = 150_000;

export function tuxFormatHtml(html: string): string {
  let truncatedBy = 0;
  let input = html;
  if (input.length > MAX_INPUT) {
    truncatedBy = input.length - MAX_INPUT;
    input = input.slice(0, MAX_INPUT);
  }

  const stripped = input.replace(/>\s+</g, "><").trim();
  let depth = 0;
  const lines: string[] = [];
  // Comments must tokenize as single units FIRST — `<[^>]+>` would
  // split `<!-- a > b -->` at the inner `>` and corrupt the stream.
  const tokens = stripped.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
  for (const token of tokens) {
    if (token.startsWith("<!--")) continue; // framework plumbing — drop
    if (token.startsWith("<")) {
      const isClose = token.startsWith("</");
      const isSelfClose = token.endsWith("/>") || VOID_ELEMENTS.test(token);
      if (isClose) depth = Math.max(0, depth - 1);
      lines.push("  ".repeat(depth) + token);
      if (!isClose && !isSelfClose) depth++;
    } else if (token.trim()) {
      lines.push("  ".repeat(depth) + token.trim());
    }
  }
  if (truncatedBy > 0) {
    lines.push("", `<!-- output truncated — ${truncatedBy.toLocaleString()} more characters in the live DOM -->`);
  }
  return lines.join("\n");
}
