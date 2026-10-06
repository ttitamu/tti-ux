import { describe, it, expect } from "vitest";
import type { JSONContent } from "@tiptap/core";
import {
  docToMdc,
  mdcToDoc,
  docToHtml,
  htmlToDoc,
} from "../../app/utils/desk/mdc-converter";

describe("MDC & TipTap Document Converter", () => {
  it("converts a document with modules and prose to clean MDC markdown", () => {
    const doc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Research Center",
              title: "Connected Corridors",
              lead: "Next-generation highway sensing.",
              actionLabel: "Read More",
              actionHref: "/research",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Overview & Objectives" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Testing " },
            { type: "text", text: "connected vehicles", marks: [{ type: "bold" }] },
            { type: "text", text: " across Texas corridors." },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "warn",
              title: "Calibration Notice",
              body: "Sensors are undergoing active test track maintenance.",
            },
          },
        },
      ],
    };

    const mdc = docToMdc(doc);
    expect(mdc).toContain("::tux-hero");
    expect(mdc).toContain("title: Connected Corridors");
    expect(mdc).toContain("eyebrow: Research Center");
    expect(mdc).toContain("## Overview & Objectives");
    expect(mdc).toContain("**connected vehicles**");
    expect(mdc).toContain("::tux-callout");
    expect(mdc).toContain("tone: warn");
  });

  it("parses MDC markdown back to a TipTap document", () => {
    const mdc = `::tux-hero
---
title: Multimodal Freight
eyebrow: Mobility
lead: Streamlining supply chain corridors.
---
::

## Freight Corridors

Real-time telemetry on **I-35** and *I-10* routes.

- Sensor arrays
- Weight-in-motion stations

> Safety is the primary consideration.

::tux-stats
---
v1: 700+
l1: Researchers
v2: $126M
l2: Budget
---
::`;

    const doc = mdcToDoc(mdc);
    expect(doc.type).toBe("doc");
    expect(doc.content).toBeDefined();

    const modules = doc.content?.filter((n) => n.type === "deskModule") || [];
    expect(modules.length).toBe(2);
    expect(modules[0].attrs?.kind).toBe("hero");
    expect(modules[0].attrs?.payload.title).toBe("Multimodal Freight");
    expect(modules[1].attrs?.kind).toBe("stats");
    expect(modules[1].attrs?.payload.v1).toBe("700+");

    const heading = doc.content?.find((n) => n.type === "heading");
    expect(heading?.attrs?.level).toBe(2);
    expect(heading?.content?.[0].text).toBe("Freight Corridors");

    const list = doc.content?.find((n) => n.type === "bulletList");
    expect(list?.content?.length).toBe(2);

    const quote = doc.content?.find((n) => n.type === "blockquote");
    expect(quote).toBeDefined();
  });

  it("handles all 7 canonical module kinds in MDC round-trip", () => {
    const kinds = ["hero", "callout", "stats", "cards", "split", "steps", "cta"] as const;
    for (const kind of kinds) {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "deskModule",
            attrs: {
              kind,
              payload: {
                title: `Test ${kind}`,
                body: "Body text",
                heading: "Heading text",
                v1: "100",
                l1: "Label",
              },
            },
          },
        ],
      };

      const mdc = docToMdc(doc);
      expect(mdc).toContain(`::tux-${kind}`);

      const parsed = mdcToDoc(mdc);
      expect(parsed.content?.[0].type).toBe("deskModule");
      expect(parsed.content?.[0].attrs?.kind).toBe(kind);
    }
  });

  it("converts between TipTap doc and HTML cleanly", () => {
    const doc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "HTML Conversion Test" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Paragraph text." }],
        },
      ],
    };

    const html = docToHtml(doc);
    expect(html).toContain("<h2>HTML Conversion Test</h2>");
    expect(html).toContain("<p>Paragraph text.</p>");

    const roundTripDoc = htmlToDoc(html);
    expect(roundTripDoc.type).toBe("doc");
    expect(roundTripDoc.content?.length).toBe(2);
  });
});
