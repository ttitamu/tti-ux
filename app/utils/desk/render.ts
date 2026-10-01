import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import sanitizeHtml from "sanitize-html";
import { isSafeHttpUrl } from "./embed";
import { deskRenderExtensions } from "./extensions";
import { isModuleKind, sanitizePayload, type ModuleKind } from "./modules";

export const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function asTipTapDoc(value: unknown): JSONContent | null {
  const doc = typeof value === "string" ? parseJsonObject(value) : value;
  if (doc && typeof doc === "object" && (doc as { type?: string }).type === "doc") {
    return sanitizeDeskDoc(doc as JSONContent);
  }
  return null;
}

function sanitizeDeskDoc(node: JSONContent): JSONContent {
  if (node.type === "deskModule") {
    const rawKind = String(node.attrs?.kind || "");
    const kind: ModuleKind = isModuleKind(rawKind) ? rawKind : "callout";
    return {
      type: "deskModule",
      attrs: {
        kind,
        payload: sanitizePayload(kind, node.attrs?.payload),
      },
    };
  }
  if (!node.content?.length) return node;
  return {
    ...node,
    content: node.content.map(sanitizeDeskDoc),
  };
}

export type DeskHtmlBlock = { type: "html"; html: string };
export type DeskModuleChunk = {
  type: "module";
  kind: ModuleKind;
  payload: Record<string, string>;
};
export type DeskBlock = DeskHtmlBlock | DeskModuleChunk;

export function splitDeskBlocks(doc: JSONContent | null | undefined): DeskBlock[] {
  const parsed = asTipTapDoc(doc);
  if (!parsed?.content?.length) return [];

  const blocks: DeskBlock[] = [];
  let chunk: JSONContent[] = [];

  const flush = () => {
    if (!chunk.length) return;
    try {
      const html = sanitizeDeskHtml(
        generateHTML({ type: "doc", content: chunk }, deskRenderExtensions)
      );
      if (html.trim()) blocks.push({ type: "html", html });
    } catch {
      // skip a malformed prose chunk rather than fail the page
    }
    chunk = [];
  };

  for (const node of parsed.content) {
    if (node.type === "deskModule") {
      const rawKind = String(node.attrs?.kind || "");
      if (isModuleKind(rawKind)) {
        flush();
        blocks.push({
          type: "module",
          kind: rawKind,
          payload: sanitizePayload(rawKind, node.attrs?.payload),
        });
        continue;
      }
    }
    chunk.push(node);
  }
  flush();
  return blocks;
}

export function isTipTapDoc(value: unknown): value is JSONContent {
  return asTipTapDoc(value) !== null;
}

function parseJsonObject(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function allowedSrc(value: string): boolean {
  return isSafeHttpUrl(value);
}

export function sanitizeDeskHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "video",
      "iframe",
      "figure",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "section",
      "aside",
      "header",
      "article",
      "dl",
      "dt",
      "dd",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height", "class"],
      video: ["src", "controls", "playsinline", "title", "poster", "class", "data-desk-video"],
      iframe: [
        "src",
        "title",
        "allow",
        "allowfullscreen",
        "loading",
        "width",
        "height",
        "class",
        "data-desk-vimeo",
      ],
      figure: ["class", "data-desk-module", "data-payload"],
      section: ["class", "data-desk-module", "data-payload"],
      aside: ["class"],
      article: ["class"],
      header: ["class"],
      dl: ["class"],
      dt: ["class"],
      dd: ["class"],
      span: ["class"],
      strong: ["class"],
      div: ["class"],
      p: ["class"],
      h1: ["class"],
      h2: ["class"],
      h3: ["class"],
      h4: ["class"],
      ol: ["class"],
      ul: ["class"],
      li: ["class"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      video: ["http", "https"],
      iframe: ["https"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        if (href.startsWith("/") || href.startsWith("mailto:")) return { tagName, attribs };
        if (!allowedSrc(href)) {
          return { tagName, attribs: { ...attribs, href: "#" } };
        }
        return { tagName, attribs };
      },
      img: (tagName, attribs) => {
        const src = attribs.src || "";
        if (src.startsWith("/api/media/")) return { tagName, attribs };
        if (!allowedSrc(src)) return { tagName: "span", attribs: {} };
        return { tagName, attribs };
      },
      video: (tagName, attribs) => {
        const src = attribs.src || "";
        if (src.startsWith("/api/media/") || allowedSrc(src)) {
          return { tagName, attribs: { ...attribs, controls: "true" } };
        }
        return { tagName, attribs: "span" };
      },
      iframe: (tagName, attribs) => {
        const src = attribs.src || "";
        const ok =
          /https:\/\/(www\.youtube-nocookie\.com|www\.youtube\.com|player\.vimeo\.com)\//.test(
            src
          );
        if (!ok) return { tagName: "span", attribs: {} };
        return { tagName, attribs };
      },
    },
  });
}

const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/i;

export function renderSimpleMarkdown(source: string): string {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let paragraph: string[] = [];

  const flushList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.join(" ")}</p>`);
    paragraph = [];
  };

  for (const line of lines) {
    if (inCode) {
      if (line.startsWith("```")) {
        html.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
        inCode = false;
        codeLines = [];
      } else {
        codeLines.push(line);
      }
      continue;
    }
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      inCode = true;
      codeLines = [];
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading?.[1] && heading[2] !== undefined) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${heading[2]}</h${level}>`);
      continue;
    }
    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return html.join("\n");
}

export function renderDeskBody(input: { bodyJson?: unknown; bodyMd?: string }): string {
  const doc = asTipTapDoc(input.bodyJson);
  if (doc) {
    try {
      return sanitizeDeskHtml(generateHTML(doc, deskRenderExtensions));
    } catch {
      return renderSimpleMarkdown(input.bodyMd || "");
    }
  }
  return renderSimpleMarkdown(input.bodyMd || "");
}

export function plainTextFromDoc(doc: JSONContent | null | undefined): string {
  if (!doc) return "";
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.text) parts.push(node.text);
    if (node.type === "deskModule") {
      const rawKind = String(node.attrs?.kind || "");
      const kind: ModuleKind = isModuleKind(rawKind) ? rawKind : "callout";
      parts.push(...Object.values(sanitizePayload(kind, node.attrs?.payload)));
    }
    for (const child of node.content ?? []) walk(child);
  };
  walk(doc);
  return parts.join(" ").trim();
}
