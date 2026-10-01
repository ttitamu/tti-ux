/**
 * mdc-converter.ts — Bidirectional converter between TipTap Document JSON AST
 * and Markdown / Nuxt Content MDC component format.
 */
import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import { deskRenderExtensions } from "./extensions";
import { isModuleKind, sanitizePayload, type ModuleKind } from "./modules";
import { sanitizeDeskHtml } from "./render";

function parseInlineMarks(text: string): JSONContent[] {
  if (!text) return [];

  // Regex to match markdown links, bold, italic, code
  // Priority: links [text](href), code `code`, bold **text**, italic *text*
  const pattern = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(pattern);
  const result: JSONContent[] = [];

  for (const part of parts) {
    if (!part) continue;

    // Link: [label](href)
    const linkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(part);
    if (linkMatch) {
      result.push({
        type: "text",
        text: linkMatch[1],
        marks: [{ type: "link", attrs: { href: linkMatch[2] } }],
      });
      continue;
    }

    // Bold: **text**
    const boldMatch = /^\*\*(.*?)\*\*$/.exec(part);
    if (boldMatch) {
      result.push({
        type: "text",
        text: boldMatch[1],
        marks: [{ type: "bold" }],
      });
      continue;
    }

    // Italic: *text*
    const italicMatch = /^\*(.*?)\*$/.exec(part);
    if (italicMatch) {
      result.push({
        type: "text",
        text: italicMatch[1],
        marks: [{ type: "italic" }],
      });
      continue;
    }

    // Code: `text`
    const codeMatch = /^`(.*?)`$/.exec(part);
    if (codeMatch) {
      result.push({
        type: "text",
        text: codeMatch[1],
        marks: [{ type: "code" }],
      });
      continue;
    }

    // Plain text
    result.push({
      type: "text",
      text: part,
    });
  }

  return result;
}

function inlineToMarkdown(nodes?: JSONContent[]): string {
  if (!nodes || !nodes.length) return "";
  let out = "";
  for (const node of nodes) {
    let t = node.text || "";
    if (node.marks?.length) {
      for (const mark of node.marks) {
        if (mark.type === "bold") t = `**${t}**`;
        else if (mark.type === "italic") t = `*${t}*`;
        else if (mark.type === "code") t = `\`${t}\``;
        else if (mark.type === "link") t = `[${t}](${mark.attrs?.href || "#"})`;
      }
    }
    out += t;
  }
  return out;
}

/**
 * Convert TipTap JSON document to clean Markdown / MDC format
 */
export function docToMdc(doc: JSONContent | null | undefined): string {
  if (!doc?.content?.length) return "";

  const blocks: string[] = [];

  for (const node of doc.content) {
    if (node.type === "deskModule") {
      const rawKind = String(node.attrs?.kind || "callout");
      const kind: ModuleKind = isModuleKind(rawKind) ? rawKind : "callout";
      const payload = sanitizePayload(kind, node.attrs?.payload);

      const lines = [`::tux-${kind}`, "---"];
      for (const [k, v] of Object.entries(payload)) {
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          const val = String(v).replaceAll("\n", " ");
          lines.push(`${k}: ${val}`);
        }
      }
      lines.push("---", "::");
      blocks.push(lines.join("\n"));
      continue;
    }

    if (node.type === "heading") {
      const level = Math.min(Math.max(node.attrs?.level || 2, 1), 6);
      const hashes = "#".repeat(level);
      const text = inlineToMarkdown(node.content);
      blocks.push(`${hashes} ${text}`);
      continue;
    }

    if (node.type === "paragraph") {
      const text = inlineToMarkdown(node.content);
      blocks.push(text);
      continue;
    }

    if (node.type === "blockquote") {
      const inner = node.content?.map((p) => `> ${inlineToMarkdown(p.content)}`).join("\n>\n") || "> ";
      blocks.push(inner);
      continue;
    }

    if (node.type === "bulletList") {
      const items = node.content?.map((li) => {
        const p = li.content?.[0];
        return `- ${inlineToMarkdown(p?.content)}`;
      }) || [];
      blocks.push(items.join("\n"));
      continue;
    }

    if (node.type === "orderedList") {
      const items = node.content?.map((li, idx) => {
        const p = li.content?.[0];
        return `${idx + 1}. ${inlineToMarkdown(p?.content)}`;
      }) || [];
      blocks.push(items.join("\n"));
      continue;
    }

    if (node.type === "codeBlock") {
      const lang = node.attrs?.language || "";
      const text = node.content?.map((n) => n.text || "").join("") || "";
      blocks.push(`\`\`\`${lang}\n${text}\n\`\`\``);
      continue;
    }

    if (node.type === "deskVideo") {
      blocks.push(`::tux-video{src="${node.attrs?.src || ''}" title="${node.attrs?.title || ''}"}\n::`);
      continue;
    }

    if (node.type === "deskVimeo") {
      blocks.push(`::tux-vimeo{src="${node.attrs?.src || ''}"}\n::`);
      continue;
    }

    if (node.type === "image") {
      blocks.push(`![${node.attrs?.alt || ''}](${node.attrs?.src || ''})`);
      continue;
    }
  }

  return blocks.join("\n\n");
}

/**
 * Parse Markdown / MDC string into a canonical TipTap JSON document
 */
export function mdcToDoc(mdcText: string): JSONContent {
  const content: JSONContent[] = [];
  const lines = mdcText.replaceAll("\r\n", "\n").split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Check for MDC block: ::tux-[kind] or ::tux-[kind]{...}
    const mdcOpenMatch = /^::tux-([a-zA-Z0-9_-]+)(?:\{(.*?)\})?/.exec(line.trim());
    if (mdcOpenMatch) {
      const rawKind = mdcOpenMatch[1].toLowerCase();
      // Map alias 'alert' -> 'callout'
      const kindStr = rawKind === "alert" ? "callout" : rawKind;
      const kind: ModuleKind = isModuleKind(kindStr) ? kindStr : "callout";

      const payload: Record<string, string> = {};

      // Parse inline attributes if present: {key="val" key2="val2"}
      if (mdcOpenMatch[2]) {
        const attrRegex = /([a-zA-Z0-9_]+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
        let match: RegExpExecArray | null;
        while ((match = attrRegex.exec(mdcOpenMatch[2])) !== null) {
          payload[match[1]] = match[2] ?? match[3] ?? match[4] ?? "";
        }
      }

      i++; // advance past ::tux-kind line

      // Check if next lines contain frontmatter `---`
      let inFrontmatter = false;
      const bodyLines: string[] = [];

      while (i < lines.length) {
        const curLine = lines[i];
        if (curLine.trim() === "::") {
          i++; // past closing ::
          break;
        }

        if (curLine.trim() === "---") {
          inFrontmatter = !inFrontmatter;
          i++;
          continue;
        }

        if (inFrontmatter) {
          const colonIdx = curLine.indexOf(":");
          if (colonIdx > 0) {
            const key = curLine.slice(0, colonIdx).trim();
            const val = curLine.slice(colonIdx + 1).trim();
            payload[key] = val;
          }
        } else {
          bodyLines.push(curLine);
        }
        i++;
      }

      if (bodyLines.length && !payload.body) {
        payload.body = bodyLines.join("\n").trim();
      }

      content.push({
        type: "deskModule",
        attrs: {
          kind,
          payload: sanitizePayload(kind, payload),
        },
      });
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // past closing ```
      content.push({
        type: "codeBlock",
        attrs: { language: lang },
        content: [{ type: "text", text: codeLines.join("\n") }],
      });
      continue;
    }

    // Headings: #, ##, ###
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      content.push({
        type: "heading",
        attrs: { level },
        content: parseInlineMarks(headingMatch[2].trim()),
      });
      i++;
      continue;
    }

    // Blockquote: > text
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      content.push({
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: parseInlineMarks(quoteLines.join(" ").trim()),
          },
        ],
      });
      continue;
    }

    // Bullet List: - or *
    if (/^[-*]\s+/.test(line)) {
      const listItems: JSONContent[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*]\s+/, "").trim();
        listItems.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: parseInlineMarks(itemText),
            },
          ],
        });
        i++;
      }
      content.push({
        type: "bulletList",
        content: listItems,
      });
      continue;
    }

    // Ordered List: 1.
    if (/^\d+\.\s+/.test(line)) {
      const listItems: JSONContent[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\.\s+/, "").trim();
        listItems.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: parseInlineMarks(itemText),
            },
          ],
        });
        i++;
      }
      content.push({
        type: "orderedList",
        content: listItems,
      });
      continue;
    }

    // Image: ![alt](src)
    const imgMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(line.trim());
    if (imgMatch) {
      content.push({
        type: "image",
        attrs: { alt: imgMatch[1], src: imgMatch[2] },
      });
      i++;
      continue;
    }

    // Regular paragraph: gather consecutive lines
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("::") &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^!\[.*?\]\(.*?\)$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i].trim());
      i++;
    }

    if (pLines.length) {
      content.push({
        type: "paragraph",
        content: parseInlineMarks(pLines.join(" ")),
      });
    }
  }

  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }],
  };
}

/**
 * Convert TipTap JSON to clean HTML representation
 */
export function docToHtml(doc: JSONContent | null | undefined): string {
  if (!doc?.content?.length) return "";
  try {
    return sanitizeDeskHtml(generateHTML(doc, deskRenderExtensions));
  } catch (err) {
    console.error("Failed to generate HTML from doc", err);
    return "";
  }
}

/**
 * Convert HTML to TipTap JSON document
 */
export function htmlToDoc(html: string): JSONContent {
  if (!html?.trim()) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }
  try {
    const clean = sanitizeDeskHtml(html);
    return generateJSON(clean, deskRenderExtensions);
  } catch (err) {
    console.error("Failed to generate JSON from HTML", err);
    return { type: "doc", content: [{ type: "paragraph" }] };
  }
}
