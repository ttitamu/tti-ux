import { describe, it, expect } from "vitest";
import {
  asTipTapDoc,
  sanitizeDeskHtml,
  splitDeskBlocks,
  plainTextFromDoc,
  renderDeskBody,
} from "../../app/utils/desk/render";

describe("Tux Desk Render Engine", () => {
  it("normalizes and parses TipTap doc", () => {
    const raw = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello TTI" }] },
      ],
    };
    const doc = asTipTapDoc(raw);
    expect(doc).not.toBeNull();
    expect(doc?.type).toBe("doc");
    expect(plainTextFromDoc(doc)).toBe("Hello TTI");
  });

  it("sanitizes unsafe HTML attributes and scripts", () => {
    const malicious = '<p>Normal text</p><script>alert("xss")</script><a href="javascript:steal()">Click</a>';
    const clean = sanitizeDeskHtml(malicious);
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("javascript:steal");
    expect(clean).toContain("<p>Normal text</p>");
  });

  it("splits doc into HTML and module blocks", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Introductory paragraph." }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "important",
              title: "Required Safety Gear",
              body: "Hard hats required at all times.",
            },
          },
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Concluding paragraph." }],
        },
      ],
    };

    const blocks = splitDeskBlocks(doc);
    expect(blocks.length).toBe(3);
    expect(blocks[0].type).toBe("html");
    expect(blocks[1].type).toBe("module");
    if (blocks[1].type === "module") {
      expect(blocks[1].kind).toBe("callout");
      expect(blocks[1].payload.title).toBe("Required Safety Gear");
    }
    expect(blocks[2].type).toBe("html");
  });

  it("renders desk body gracefully", () => {
    const html = renderDeskBody({
      bodyJson: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Section 1" }] },
        ],
      },
    });
    expect(html).toContain("<h2>Section 1</h2>");
  });
});
