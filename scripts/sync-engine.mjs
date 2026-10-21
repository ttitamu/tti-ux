/**
 * scripts/sync-engine.mjs — Universal Multi-Language Component Synchronization Engine.
 *
 * Synchronizes design tokens and UI components bidirectionally across 11 target languages
 * and execution environments:
 *   1. Vue 3 / Nuxt 4       (app/components/Tux*.vue)
 *   2. React 19 JSX / TSX   (packages/react/src/components/Tux*.tsx)
 *   3. HTML5 Web Components (kit/elements/tux-*.js)
 *   4. CSS Design Tokens    (kit/css/tux-tokens.css)
 *   5. PHP & WordPress      (kit/php/components/Tux*.php)
 *   6. .NET Blazor / Razor  (kit/csharp/components/Tux*.razor)
 *   7. C# .NET TagHelpers   (kit/csharp/components/Tux*.cs)
 *   8. Python / Streamlit   (kit/python/components/tux_*.py)
 *   9. Vanilla JavaScript   (kit/js/components/tux-*.js)
 *  10. Swift / SwiftUI      (kit/swift/components/Tux*.swift)
 *  11. Kotlin / Compose     (kit/kotlin/components/Tux*.kt)
 *
 * DOCTRINE:
 * Any modification to a component in ANY of these languages or the addition of
 * a new component in ANY language is automatically detected, parsed into a canonical
 * ComponentSchema Intermediate Representation (IR), and synchronized across all other
 * target languages with zero visual or behavioral drift.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Directory Mappings for Supported Languages
// ---------------------------------------------------------------------------
export const TARGET_DIRS = {
  vue: path.join(ROOT, "app/components"),
  react: path.join(ROOT, "packages/react/src/components"),
  elements: path.join(ROOT, "kit/elements"),
  php: path.join(ROOT, "kit/php/components"),
  csharp: path.join(ROOT, "kit/csharp/components"),
  python: path.join(ROOT, "kit/python/components"),
  js: path.join(ROOT, "kit/js/components"),
  swift: path.join(ROOT, "kit/swift/components"),
  kotlin: path.join(ROOT, "kit/kotlin/components"),
};

export const MANIFEST_PATH = path.join(ROOT, "kit/ports/manifest.json");

// Ensure all target directories exist
for (const dir of Object.values(TARGET_DIRS)) {
  fs.mkdirSync(dir, { recursive: true });
}

// ---------------------------------------------------------------------------
// Helper Utilities
// ---------------------------------------------------------------------------
export function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function toPascalCase(str) {
  return str
    .replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
}

export function toSnakeCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

export function toCamelCase(str) {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

export function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ---------------------------------------------------------------------------
// Canonical Component Schema (IR)
// ---------------------------------------------------------------------------
/**
 * @typedef {Object} PropDefinition
 * @property {string} name
 * @property {string} type - "string" | "boolean" | "number" | "enum"
 * @property {string[]} [enumValues]
 * @property {any} [defaultValue]
 * @property {boolean} [required]
 * @property {string} [description]
 *
 * @typedef {Object} ComponentSchema
 * @property {string} name
 * @property {string} kebabName
 * @property {string} description
 * @property {PropDefinition[]} props
 * @property {string[]} slots
 * @property {string[]} events
 * @property {string} rootElement
 * @property {string} baseClass
 */

// ---------------------------------------------------------------------------
// Parsers (Ingestors from Any Language)
// ---------------------------------------------------------------------------

const VALID_HTML_TAGS = new Set([
  "div", "span", "p", "a", "button", "section", "article", "aside", "header",
  "footer", "nav", "main", "figure", "figcaption", "table", "caption", "ul",
  "ol", "li", "dl", "dt", "dd", "form", "label", "input", "textarea", "select",
  "details", "summary", "dialog", "kbd", "pre", "code", "blockquote", "hr",
  "svg", "defs", "g", "canvas", "img", "h1", "h2", "h3", "h4", "h5", "h6",
]);

const JS_RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return", "super",
  "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield",
  // reserved in strict mode, which every ES module is
  "await", "implements", "interface", "let", "package", "private", "protected", "public", "static",
  "arguments", "eval",
]);

// Index just past the string literal that opens at s[i] (', " or `).
function skipString(s, i) {
  const quote = s[i];
  for (i++; i < s.length && s[i] !== quote; i++) if (s[i] === "\\") i++;
  return i + 1;
}

// Index just past the comment that opens at s[i] (// or /*); the end of s when a /*
// never closes.
function skipComment(s, i) {
  const line = s[i + 1] === "/";
  const close = line ? s.indexOf("\n", i) : s.indexOf("*/", i + 2);
  if (close < 0) return s.length;
  return line ? close : close + 2;
}

// Index just past the regex literal that opens at s[i], flags included (a / inside a
// [class] doesn't close it).
function skipRegex(s, i) {
  let inClass = false;
  for (i++; i < s.length && s[i] !== "\n"; i++) {
    if (s[i] === "\\") i++;
    else if (s[i] === "[") inClass = true;
    else if (s[i] === "]") inClass = false;
    else if (s[i] === "/" && !inClass) break;
  }
  for (i++; i < s.length && /[a-z]/i.test(s[i]); i++);
  return i;
}

// Index just past the string, comment or regex literal that opens at s[i]; i itself
// when none does. A `/` opens a regex where an operand is expected, else it divides.
function skipNonCode(s, i) {
  const c = s[i];
  if (c === "'" || c === '"' || c === "`") return skipString(s, i);
  if (c !== "/") return i;
  if (s[i + 1] === "/" || s[i + 1] === "*") return skipComment(s, i);
  return /^$|[(,=:[!&|?{};>]$/.test(s.slice(0, i).trimEnd().slice(-1)) ? skipRegex(s, i) : i;
}

// Index of the first character of `stops` at bracket depth 0 from s[i], stepping
// over strings, comments, regex literals and bracketed groups (with `angles`, <…>
// too, as in a type argument; the > of => doesn't close one); `end` when there is
// none before it.
function scanTo(s, i, stops, end = s.length, angles = false) {
  const close = { "(": ")", "[": "]", "{": "}", ...(angles ? { "<": ">" } : {}) };
  const stack = [];
  while (i < end && (stack.length || !stops.includes(s[i]))) {
    const next = skipNonCode(s, i);
    if (next !== i) { i = next; continue; }
    const c = s[i];
    if (close[c]) stack.push(close[c]);
    else if (c === stack[stack.length - 1] && !(c === ">" && s[i - 1] === "=")) stack.pop();
    i++;
  }
  return Math.min(i, end);
}

// Index of the first call `name(` in code (not in a string or comment), or -1.
function findCall(s, name) {
  const call = new RegExp(`^${name}\\s*\\(`);
  for (let i = 0; i < s.length; ) {
    const next = skipNonCode(s, i);
    if (next !== i) i = next;
    else if (call.test(s.slice(i, i + name.length + 64)) && !/[\w$]/.test(s[i - 1] ?? "")) return i;
    else i++;
  }
  return -1;
}

// The text with its comments replaced by a space; strings and regex literals kept.
function stripComments(s) {
  let out = "";
  for (let i = 0; i < s.length; ) {
    const next = skipNonCode(s, i);
    if (next === i) out += s[i++];
    else {
      out += s[i] === "/" && (s[i + 1] === "/" || s[i + 1] === "*") ? " " : s.slice(i, next);
      i = next;
    }
  }
  return out;
}

/**
 * The object withDefaults(defineProps<…>(), { … }) passes, as a map of prop name to
 * the source text of its default. A balanced scan rather than a regex: a default
 * can hold spaces, commas and quotes ("Emergency alert"), nest braces
 * (() => ({})) or contain another prop's key (a `title:` inside a factory), and
 * the first argument can be an inline type literal with braces of its own. Only
 * <script setup> is scanned: template text can hold an apostrophe or a stray /*.
 */
export function withDefaultsSource(content) {
  const entries = new Map();
  const script = content.match(/<script\b[^>]*\bsetup\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? content;
  const call = findCall(script, "withDefaults");
  if (call < 0) return entries;
  const firstArgEnd = scanTo(script, script.indexOf("(", call) + 1, ",)", script.length, true);
  const open = firstArgEnd + 1 + script.slice(firstArgEnd + 1).search(/\S/);
  if (script[firstArgEnd] !== "," || script[open] !== "{") return entries;
  const close = scanTo(script, open + 1, "}");
  for (let i = open + 1; i < close; ) {
    const end = scanTo(script, i, ",", close);
    const entry = stripComments(script.slice(i, end)).trim();
    const m = entry.match(/^(?:(\w+)|(['"])(\w+)\2)\s*:\s*([\s\S]+)$/);
    if (m) entries.set(m[1] ?? m[3], m[4].trim());
    i = end + 1;
  }
  return entries;
}

const JS_ESCAPES = { b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v", 0: "\0" };
// A JS number literal: decimal (1, .5, 1e3, 1_000) or hex, octal or binary.
const JS_NUMBER = /^-?(?:(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d[\d_]*)?|0[xX][\da-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+)$/;

// A quoted string's decoded contents, a number's or keyword's text, or undefined.
function literalText(text) {
  if (/^(?:true|false|null|undefined)$/.test(text) || JS_NUMBER.test(text)) return text;
  const quote = text[0];
  if (!`'"\``.includes(quote) || skipString(text, 0) !== text.length) return undefined;
  if (quote === "`" && text.includes("${")) return undefined;
  return text.slice(1, -1).replace(/\\(?:u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|\r?\n|([\s\S]))/g,
    (_, cp, u4, x2, ch) => cp ? String.fromCodePoint(parseInt(cp, 16))
      : u4 || x2 ? String.fromCharCode(parseInt(u4 || x2, 16))
        : ch === undefined ? "" : JS_ESCAPES[ch] ?? ch);
}

/**
 * A default's source text as the schema's value: a quoted string's contents, or the
 * text of a number or of true/false/null/undefined, also when a type assertion
 * follows it ("md" as const, 3 satisfies Size). Anything else (a factory such as
 * () => [], an expression such as 50 * 1024 * 1024) has no literal value, so it is
 * undefined and the prop is left without a default.
 */
export function literalSource(text) {
  const literal = literalText(text);
  if (literal !== undefined) return literal;
  for (const m of text.matchAll(/\s+(?:as|satisfies)\s/g)) {
    const head = literalText(text.slice(0, m.index));
    if (head !== undefined) return head;
  }
  return undefined;
}

export function parseVue(content, componentName) {
  const props = [];
  const seenProps = new Set(["children", "className"]);
  const descriptionMatch = content.match(/\/\*\*\s*([\s\S]*?)\*\//);
  const description = descriptionMatch
    ? descriptionMatch[1].replace(/^\s*\*\s?/gm, "").trim().split("\n")[0]
    : `${componentName} component.`;

  // Parse TypeScript interface Props { ... } or defineProps<{ ... }>()
  const propsBlock = content.match(/(?:interface\s+Props|defineProps<\{)([\s\S]*?)(?:\}|>\(\))/);
  if (propsBlock) {
    const lines = propsBlock[1].split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([a-zA-Z0-9_]+)(\??)\s*:\s*([^;,\n]+)/);
      if (match) {
        const [, propName, optional, rawType] = match;
        if (seenProps.has(propName)) continue;
        seenProps.add(propName);
        const typeStr = rawType.trim();
        let type = "string";
        let enumValues = undefined;

        if (typeStr.includes("|")) {
          const parts = typeStr
            .split("|")
            .map((v) => v.trim())
            .filter((v) => v && v !== "null" && v !== "undefined");
          const allStringLiterals = parts.length > 0 && parts.every((v) => /^['"].*['"]$/.test(v));
          if (allStringLiterals) {
            type = "enum";
            enumValues = parts.map((v) => v.replace(/^['"]|['"]$/g, ""));
          } else if (parts.every((v) => v === "number" || /^\d+$/.test(v))) {
            type = "number";
          } else if (parts.every((v) => v === "boolean")) {
            type = "boolean";
          } else {
            type = "string";
          }
        } else if (typeStr === "boolean") {
          type = "boolean";
        } else if (typeStr === "number") {
          type = "number";
        }

        props.push({
          name: propName,
          type,
          enumValues,
          required: !optional,
          defaultValue: type === "boolean" ? false : undefined,
        });
      }
    }
  }

  // Parse default values from withDefaults
  const defaults = withDefaultsSource(content);
  for (const p of props) {
    const value = defaults.has(p.name) ? literalSource(defaults.get(p.name)) : undefined;
    // undefined, null, and a factory or expression (no literal value) leave no default
    if (value === undefined || value === "undefined" || value === "null") continue;
    if (p.type === "boolean") {
      p.defaultValue = value === "true";
    } else if (p.type === "number") {
      const num = Number(value.replace(/_/g, ""));
      if (value !== "" && !Number.isNaN(num)) p.defaultValue = num;
    } else if (p.type === "enum" && p.enumValues) {
      if (p.enumValues.includes(value)) p.defaultValue = value;
    } else {
      p.defaultValue = value;
    }
  }

  // Detect root element from template (must be a valid intrinsic HTML/SVG element)
  const rootTagMatch = content.match(/<template>\s*(?:<!--[\s\S]*?-->\s*)*<([a-zA-Z0-9-]+)/);
  const rawRoot = rootTagMatch ? rootTagMatch[1] : "div";
  const rootElement = VALID_HTML_TAGS.has(rawRoot) ? rawRoot : "div";

  return {
    name: componentName,
    kebabName: toKebabCase(componentName),
    description,
    props,
    slots: ["default"],
    events: [],
    rootElement,
    baseClass: toKebabCase(componentName),
  };
}

export function parseReact(content, componentName) {
  const props = [];
  const interfaceMatch = content.match(/interface\s+Props\s*\{([\s\S]*?)\}/);
  if (interfaceMatch) {
    const lines = interfaceMatch[1].split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([a-zA-Z0-9_]+)(\??)\s*:\s*([^;,\n]+)/);
      if (match) {
        const [, propName, optional, rawType] = match;
        const typeStr = rawType.trim();
        let type = "string";
        let enumValues = undefined;
        if (typeStr.includes("|")) {
          type = "enum";
          enumValues = typeStr.split("|").map((v) => v.trim().replace(/^['"]|['"]$/g, ""));
        } else if (typeStr === "boolean") {
          type = "boolean";
        } else if (typeStr === "number") {
          type = "number";
        }
        props.push({
          name: propName,
          type,
          enumValues,
          required: !optional,
        });
      }
    }
  }

  return {
    name: componentName,
    kebabName: toKebabCase(componentName),
    description: `${componentName} component.`,
    props,
    slots: ["default"],
    events: [],
    rootElement: "div",
    baseClass: toKebabCase(componentName),
  };
}

export function parseSwift(content, componentName) {
  const props = [];
  const structMatch = content.match(/public\s+struct\s+(\w+)\s*:\s*View\s*\{([\s\S]*?)(?:public\s+var\s+body)/);
  if (structMatch) {
    const body = structMatch[2];
    const lines = body.split("\n");
    for (const line of lines) {
      const match = line.match(/public\s+(?:var|let)\s+(\w+)\s*:\s*([^\s=]+)(?:\s*=\s*(.+))?/);
      if (match) {
        const [, propName, rawType, defVal] = match;
        let type = "string";
        if (rawType.toLowerCase().includes("bool")) type = "boolean";
        else if (rawType.toLowerCase().includes("int") || rawType.toLowerCase().includes("double")) type = "number";
        props.push({
          name: propName,
          type,
          defaultValue: defVal ? defVal.replace(/^"|"$/g, "").trim() : undefined,
          required: !defVal,
        });
      }
    }
  }

  return {
    name: componentName,
    kebabName: toKebabCase(componentName),
    description: `${componentName} component.`,
    props,
    slots: ["default"],
    events: [],
    rootElement: "div",
    baseClass: toKebabCase(componentName),
  };
}

export function parseKotlin(content, componentName) {
  const props = [];
  const funMatch = content.match(/fun\s+(\w+)\s*\(([\s\S]*?)\)/);
  if (funMatch) {
    const params = funMatch[2].split(",");
    for (const param of params) {
      const match = param.match(/(\w+)\s*:\s*([^=]+)(?:\s*=\s*(.+))?/);
      if (match) {
        const [, propName, rawType, defVal] = match;
        const typeStr = rawType.trim();
        let type = "string";
        if (typeStr.toLowerCase().includes("boolean")) type = "boolean";
        else if (typeStr.toLowerCase().includes("int")) type = "number";
        props.push({
          name: propName,
          type,
          defaultValue: defVal ? defVal.replace(/^"|"$/g, "").trim() : undefined,
          required: !defVal,
        });
      }
    }
  }

  return {
    name: componentName,
    kebabName: toKebabCase(componentName),
    description: `${componentName} component.`,
    props,
    slots: ["default"],
    events: [],
    rootElement: "div",
    baseClass: toKebabCase(componentName),
  };
}

// ---------------------------------------------------------------------------
// Default literals: one reading of a prop's default, rendered per language
// ---------------------------------------------------------------------------

/**
 * A prop's default as the emitters read it: { kind: "none" } when there is none
 * to write (missing, null or undefined, or a number prop whose default is not a
 * number), else { kind: "boolean" | "number" | "string", value }. The schema
 * carries JS values and raw withDefaults text, so `true`/`false`, `null`/
 * `undefined` and an unquoted enum member (`error`, `md`) written raw are
 * undefined names or type errors in every target but JS; each emitter renders
 * this instead.
 */
export function defaultLiteral(p) {
  const v = p.defaultValue;
  if (v === undefined || v === null || v === "undefined" || v === "null") return { kind: "none" };
  if (p.type === "boolean") return { kind: "boolean", value: v === true || v === "true" };
  if (p.type === "number") {
    const n = typeof v === "number" ? v : String(v).trim() === "" ? NaN : Number(v);
    return Number.isFinite(n) ? { kind: "number", value: String(n) } : { kind: "none" };
  }
  return { kind: "string", value: String(v) };
}

// A prop's type in a typed target, from that language's names. A number prop's
// default picks it: a fractional or exponent-form one (0.5, 1e-7) takes the float
// type, and an integer past 32 bits the long one where the language's int is 32-bit.
function typeIn(names, p, d = defaultLiteral(p)) {
  if (p.type === "boolean") return names.bool;
  if (p.type !== "number") return names.string;
  if (d.kind !== "number") return names.int;
  if (!/^-?\d+$/.test(d.value) || !Number.isSafeInteger(Number(d.value))) return names.float;
  return Math.abs(Number(d.value)) > 2147483647 ? names.long ?? names.int : names.int;
}

// A double-quoted string literal in a C-family target: \ and " (and the
// language's `extra` characters) take a backslash, \n \r \t are spelled by
// letter, and any other control or line-separator character by `unicode`.
function cString(s, unicode, extra = "") {
  let out = "";
  for (const ch of s) {
    if (ch === "\\" || ch === '"' || extra.includes(ch)) out += `\\${ch}`;
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\t") out += "\\t";
    else if (/[\x00-\x1f\x7f-\x9f\u2028\u2029]/.test(ch)) out += unicode(ch.codePointAt(0).toString(16));
    else out += ch;
  }
  return `"${out}"`;
}

// The same name with a trailing underscore when the generated code already declares
// it (SwiftUI's `body`, the Compose `content` slot, Blazor's ChildContent).
const avoiding = (taken, name) => (taken.includes(name) ? `${name}_` : name);

/** A prop's default as a JS/TS literal, or undefined when it has none to write. */
export function jsDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return undefined;
  return d.kind === "string" ? JSON.stringify(d.value) : String(d.value);
}

// A PHP string literal: single-quoted (only \ and ' are special) unless it holds a
// control character, which only a double-quoted string can spell; that form also
// interpolates $, so $ is escaped there.
function phpString(s) {
  if (!/[\x00-\x1f\x7f]/.test(s)) return `'${s.replace(/[\\']/g, "\\$&")}'`;
  return cString(s, (hex) => `\\u{${hex}}`, "$");
}

/** A prop's default as a PHP literal; a $-prefixed property needs no reserved-word escape. */
export function phpDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return "null";
  return d.kind === "string" ? phpString(d.value) : String(d.value);
}

/**
 * A prop's default as a C# initializer, or null when it has none: the property is
 * then nullable and starts out null. C#'s keywords are all lower case, so the
 * PascalCase property names never need an @ escape.
 */
export function csharpDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return null;
  return d.kind === "string" ? cString(d.value, (hex) => `\\u${hex.padStart(4, "0")}`) : String(d.value);
}

// A C# auto-property for a prop, with no `;` after the accessor block unless an
// initializer follows it (a bare `{ get; set; };` is error CS1597).
function csharpProperty(p, taken) {
  const def = csharpDefault(p);
  const type = typeIn({ bool: "bool", int: "int", long: "long", float: "double", string: "string" }, p);
  return `public ${type}${def === null ? "?" : ""} ${avoiding(taken, toPascalCase(p.name))} { get; set; }${def === null ? "" : ` = ${def};`}`;
}

// Swift's keywords, which a property name can only use in backticks.
const SWIFT_KEYWORDS = new Set(["associatedtype", "class", "deinit", "enum", "extension", "fileprivate", "func",
  "import", "init", "inout", "internal", "let", "open", "operator", "private", "precedencegroup", "protocol", "public",
  "rethrows", "static", "struct", "subscript", "typealias", "var", "break", "case", "catch", "continue", "default",
  "defer", "do", "else", "fallthrough", "for", "guard", "if", "in", "repeat", "return", "throw", "switch", "where",
  "while", "Any", "as", "await", "false", "is", "nil", "self", "Self", "super", "throws", "true", "try"]);

export function swiftName(propName) {
  const name = avoiding(["body", "content"], toCamelCase(propName));
  return SWIFT_KEYWORDS.has(name) ? `\`${name}\`` : name;
}

/** A prop's default as a Swift literal; with none, the property is Optional and nil. */
export function swiftDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return "nil";
  return d.kind === "string" ? cString(d.value, (hex) => `\\u{${hex}}`) : String(d.value);
}

// Kotlin's hard keywords, which a parameter name can only use in backticks.
const KOTLIN_KEYWORDS = new Set(["as", "break", "class", "continue", "do", "else", "false", "for", "fun", "if", "in",
  "interface", "is", "null", "object", "package", "return", "super", "this", "throw", "true", "try", "typealias",
  "typeof", "val", "var", "when", "while"]);

export function kotlinName(propName) {
  const name = avoiding(["content"], toCamelCase(propName));
  return KOTLIN_KEYWORDS.has(name) ? `\`${name}\`` : name;
}

/** A prop's default as a Kotlin literal ($ escaped: it opens a string template). */
export function kotlinDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return "null";
  return d.kind === "string" ? cString(d.value, (hex) => `\\u${hex.padStart(4, "0")}`, "$") : String(d.value);
}

// ---------------------------------------------------------------------------
// Emitters (Code Generation Across All 11 Languages)
// ---------------------------------------------------------------------------

export function emitVue(schema) {
  const propTypes = schema.props
    .map((p) => {
      let typeStr = "string";
      if (p.type === "enum" && p.enumValues) {
        typeStr = p.enumValues.map((v) => `"${v}"`).join(" | ");
      } else if (p.type === "boolean") {
        typeStr = "boolean";
      } else if (p.type === "number") {
        typeStr = "number";
      }
      return `  ${p.name}${p.required ? "" : "?"}: ${typeStr};`;
    })
    .join("\n");

  const defaults = schema.props
    .filter((p) => jsDefault(p) !== undefined)
    .map((p) => `  ${p.name}: ${jsDefault(p)},`)
    .join("\n");

  return `<script setup lang="ts">
/**
 * ${schema.name} — ${schema.description}
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
interface Props {
${propTypes || "  // No required props"}
}

${
  defaults
    ? `const props = withDefaults(defineProps<Props>(), {\n${defaults}\n});`
    : `const props = defineProps<Props>();`
}
</script>

<template>
  <${schema.rootElement} class="${schema.baseClass}">
    <slot />
  </${schema.rootElement}>
</template>

<style scoped>
.${schema.baseClass} {
  display: inline-flex;
  align-items: center;
  gap: var(--rhythm-2, 0.5rem);
  font-family: var(--font-body);
  color: var(--text-primary);
}
</style>
`;
}

export function emitReact(schema) {
  const propTypes = schema.props
    .map((p) => {
      let typeStr = "string";
      if (p.type === "enum" && p.enumValues) {
        typeStr = p.enumValues.map((v) => `"${v}"`).join(" | ");
      } else if (p.type === "boolean") {
        typeStr = "boolean";
      } else if (p.type === "number") {
        typeStr = "number";
      }
      return `  ${p.name}${p.required ? "" : "?"}: ${typeStr};`;
    })
    .join("\n");

  const defaultDestructuring = schema.props
    .filter((p) => !JS_RESERVED.has(p.name))
    .map((p) => {
      const val = jsDefault(p);
      return val === undefined ? p.name : `${p.name} = ${val}`;
    })
    .concat(["children", "className = ''", "style"])
    .join(", ");

  const VOID_TAGS = new Set(["input", "img", "br", "hr", "meta", "link"]);
  const Tag = VALID_HTML_TAGS.has(schema.rootElement) && !VOID_TAGS.has(schema.rootElement)
    ? schema.rootElement
    : "div";

  const propNames = new Set(schema.props.filter((p) => !JS_RESERVED.has(p.name)).map((p) => p.name));
  const dataAttrs = ["variant", "status", "tone", "mode", "size"]
    .filter((k) => propNames.has(k))
    .map((k) => `data-${k}={${k}}`)
    .join(" ");

  const eyebrowProp = ["eyebrow", "kicker"].find((k) => propNames.has(k));
  const headingProp = ["title", "heading", "label", "name"].find((k) => propNames.has(k));
  const bodyProp = ["description", "subtitle", "summary", "caption", "message"].find((k) => propNames.has(k));
  const valueProp = ["value", "count"].find((k) => propNames.has(k));

  const fallbackRenderLines = [];
  if (eyebrowProp) {
    fallbackRenderLines.push(
      `      {${eyebrowProp} !== undefined && String(${eyebrowProp}) !== "" && <div className="${schema.baseClass}__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(${eyebrowProp})}</div>}`
    );
  }
  if (headingProp) {
    fallbackRenderLines.push(
      `      {${headingProp} !== undefined && String(${headingProp}) !== "" && <div className="${schema.baseClass}__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(${headingProp})}</div>}`
    );
  }
  if (valueProp) {
    fallbackRenderLines.push(
      `      {${valueProp} !== undefined && String(${valueProp}) !== "" && <div className="${schema.baseClass}__value" style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "var(--brand-primary, #500000)" }}>{String(${valueProp})}</div>}`
    );
  }
  if (bodyProp) {
    fallbackRenderLines.push(
      `      {${bodyProp} !== undefined && String(${bodyProp}) !== "" && <div className="${schema.baseClass}__description" style={{ fontSize: "0.875rem", color: "var(--text-secondary, #44403c)" }}>{String(${bodyProp})}</div>}`
    );
  }
  fallbackRenderLines.push(`      {children}`);

  return `/**
 * ${schema.name} — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface ${schema.name}Props {
${propTypes ? `${propTypes}\n` : ""}  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ${schema.name}: React.FC<${schema.name}Props> = ({
  ${defaultDestructuring}
}) => {
  return (
    <${Tag} className={\`${schema.baseClass} \${className}\`.trim()}${dataAttrs ? ` ${dataAttrs}` : ""} style={style}>
${fallbackRenderLines.join("\n")}
    </${Tag}>
  );
};

export default ${schema.name};
`;
}

export function emitWebComponent(schema) {
  const observed = schema.props.map((p) => `"${toKebabCase(p.name)}"`).join(", ");
  return `/**
 * <${schema.kebabName}> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class ${schema.name}Element extends HTMLElement {
  static get observedAttributes() {
    return [${observed}];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body, system-ui);
        }
      </style>
      <${schema.rootElement} class="${schema.baseClass}">
        <slot></slot>
      </${schema.rootElement}>
    \`;
  }
}

if (!customElements.get('${schema.kebabName}')) {
  customElements.define('${schema.kebabName}', ${schema.name}Element);
}
`;
}

export function emitPhp(schema) {
  const fields = schema.props
    .map((p) => {
      const type = typeIn({ bool: "bool", int: "int", float: "float", string: "string" }, p);
      const def = phpDefault(p);
      return `    public ${def === "null" ? "?" : ""}${type} $${toCamelCase(p.name)} = ${def};`;
    })
    .join("\n");

  return `<?php
/**
 * ${schema.name} — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\\Tux\\Components;

final class ${schema.name}
{
${fields}

    public function __construct(array $attributes = [])
    {
        foreach ($attributes as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function render(string $content = ''): string
    {
        return sprintf(
            '<${schema.rootElement} class="${schema.baseClass}">%s</${schema.rootElement}>',
            $content
        );
    }
}
`;
}

export function emitRazor(schema) {
  const params = schema.props
    .map((p) => `    [Parameter] ${csharpProperty(p, ["ChildContent", schema.name])}`)
    .join("\n");

  return `@*
 * ${schema.name}.razor — ASP.NET Blazor Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 *@

<${schema.rootElement} class="${schema.baseClass}">
    @ChildContent
</${schema.rootElement}>

@code {
    [Parameter] public RenderFragment? ChildContent { get; set; }
${params}
}
`;
}

export function emitCSharp(schema) {
  const props = schema.props
    .map((p) => `    ${csharpProperty(p, ["Process", `${schema.name}TagHelper`])}`)
    .join("\n");

  return `// ${schema.name}.cs — .NET TagHelper / Control Class.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Tti.Tux.Components;

[HtmlTargetElement("${schema.kebabName}")]
public class ${schema.name}TagHelper : TagHelper
{
${props}

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "${schema.rootElement}";
        output.Attributes.SetAttribute("class", "${schema.baseClass}");
    }
}
`;
}

/**
 * A prop's default as a Python literal (see defaultLiteral): written raw, a JS
 * value or enum member is an undefined name, a NameError the moment the module
 * is imported.
 */
export function pythonDefault(p) {
  const d = defaultLiteral(p);
  if (d.kind === "none") return "None";
  if (d.kind === "boolean") return d.value ? "True" : "False";
  return d.kind === "number" ? d.value : JSON.stringify(d.value);
}

// Python's hard keywords: a prop named `for` or `as` is a syntax error as a field
// name, so it gets PEP 8's trailing underscore (`for_`, `as_`).
const PYTHON_KEYWORDS = new Set(["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class",
  "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"]);

export function pythonName(propName) {
  const name = toSnakeCase(propName);
  return PYTHON_KEYWORDS.has(name) ? `${name}_` : name;
}

export function emitPython(schema) {
  const fields = schema.props
    .map((p) => {
      const type = typeIn({ bool: "bool", int: "int", float: "float", string: "str" }, p);
      const def = pythonDefault(p);
      return `    ${pythonName(p.name)}: ${def === "None" ? `Optional[${type}]` : type} = ${def}`;
    })
    .join("\n");

  return `"""
${schema.name} — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
${fields.includes("Optional[") ? "from typing import Optional\n" : ""}
@dataclass
class ${schema.name}:
${fields || "    pass"}

    def render_html(self, content: str = "") -> str:
        return f'<${schema.rootElement} class="${schema.baseClass}">{content}</${schema.rootElement}>'
`;
}

export function emitJavaScript(schema) {
  return `/**
 * ${schema.name} — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function create${schema.name}(props = {}, children = '') {
  const el = document.createElement('${schema.rootElement}');
  el.className = '${schema.baseClass}';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default create${schema.name};
`;
}

export function emitSwift(schema) {
  const properties = schema.props
    .map((p) => {
      const type = typeIn({ bool: "Bool", int: "Int", float: "Double", string: "String" }, p);
      const def = swiftDefault(p);
      return `    public var ${swiftName(p.name)}: ${type}${def === "nil" ? "?" : ""} = ${def}`;
    })
    .join("\n");

  return `// ${schema.name}.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct ${schema.name}<Content: View>: View {
${properties}
    private let content: Content

    public init(
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
    }

    public var body: some View {
        HStack {
            content
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
    }
}
`;
}

export function emitKotlin(schema) {
  const params = schema.props
    .map((p) => {
      const type = typeIn({ bool: "Boolean", int: "Int", long: "Long", float: "Double", string: "String" }, p);
      const def = kotlinDefault(p);
      return `    ${kotlinName(p.name)}: ${type}${def === "null" ? "?" : ""} = ${def},`;
    })
    .concat(["    content: @Composable () -> Unit = {}"])
    .join("\n");

  return `// ${schema.name}.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ${schema.name}(
${params}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
`;
}

// ---------------------------------------------------------------------------
// Synchronization Orchestrator
// ---------------------------------------------------------------------------

// A workspace package's file from a bare specifier (@tti/tti-ux-code/app/… →
// packages/code/app/…): sub-layer stubs re-export their component by package name.
function workspaceFile(specifier) {
  const m = specifier.match(/^(@[^/]+\/[^/]+)\/(.+)$/);
  const packagesDir = path.join(ROOT, "packages");
  if (!m || !fs.existsSync(packagesDir)) return null;
  for (const dir of fs.readdirSync(packagesDir)) {
    const manifest = path.join(packagesDir, dir, "package.json");
    let name;
    try { name = JSON.parse(fs.readFileSync(manifest, "utf8")).name; } catch { continue; }
    if (name === m[1]) return path.join(packagesDir, dir, m[2]);
  }
  return null;
}

function resolveSourceContent(sourceFile) {
  const content = fs.readFileSync(sourceFile, "utf8");
  if (sourceFile.endsWith(".vue")) {
    const reExportMatch =
      content.match(/export\s+\{\s*default\s*\}\s+from\s+["']([^"']+\.vue)["']/) ||
      content.match(/import\s+\w+\s+from\s+["']([^"']+\.vue)["']/);
    if (reExportMatch && !content.includes("defineProps")) {
      const targetPath = reExportMatch[1].startsWith(".")
        ? path.resolve(path.dirname(sourceFile), reExportMatch[1])
        : workspaceFile(reExportMatch[1]);
      if (targetPath && fs.existsSync(targetPath)) {
        return fs.readFileSync(targetPath, "utf8");
      }
      console.warn(`sync-engine: ${path.relative(ROOT, sourceFile)} re-exports ${reExportMatch[1]}, which doesn't resolve; its ports get no props`);
    }
  }
  return content;
}

export function syncComponent(sourceFile, targetLangHint = null) {
  const ext = path.extname(sourceFile);
  const base = path.basename(sourceFile, ext);
  const componentName = toPascalCase(base);
  const content = resolveSourceContent(sourceFile);

  let schema;
  if (ext === ".vue") {
    schema = parseVue(content, componentName);
  } else if (ext === ".tsx" || ext === ".jsx") {
    schema = parseReact(content, componentName);
  } else if (ext === ".swift") {
    schema = parseSwift(content, componentName);
  } else if (ext === ".kt") {
    schema = parseKotlin(content, componentName);
  } else {
    schema = parseVue(content, componentName);
  }

  const generated = {
    vue: { path: path.join(TARGET_DIRS.vue, `${componentName}.vue`), content: emitVue(schema) },
    react: { path: path.join(TARGET_DIRS.react, `${componentName}.tsx`), content: emitReact(schema) },
    elements: { path: path.join(TARGET_DIRS.elements, `${toKebabCase(componentName)}.js`), content: emitWebComponent(schema) },
    php: { path: path.join(TARGET_DIRS.php, `${componentName}.php`), content: emitPhp(schema) },
    csharp: { path: path.join(TARGET_DIRS.csharp, `${componentName}.razor`), content: emitRazor(schema) },
    python: { path: path.join(TARGET_DIRS.python, `${toSnakeCase(componentName)}.py`), content: emitPython(schema) },
    js: { path: path.join(TARGET_DIRS.js, `${toKebabCase(componentName)}.js`), content: emitJavaScript(schema) },
    swift: { path: path.join(TARGET_DIRS.swift, `${componentName}.swift`), content: emitSwift(schema) },
    kotlin: { path: path.join(TARGET_DIRS.kotlin, `${componentName}.kt`), content: emitKotlin(schema) },
  };

  // Write all targets except the original source file (to preserve hand-crafted refinements)
  for (const [lang, target] of Object.entries(generated)) {
    if (path.resolve(target.path) === path.resolve(sourceFile)) continue;
    fs.mkdirSync(path.dirname(target.path), { recursive: true });
    // Write only if missing or if generated target is managed (preserve handcrafted files in packages/react)
    const isHandcraftedReact =
      lang === "react" &&
      fs.existsSync(target.path) &&
      !fs.readFileSync(target.path, "utf8").includes("Synchronized via Universal Component Sync Engine");
    if (!fs.existsSync(target.path) || (ext === ".vue" && !isHandcraftedReact)) {
      fs.writeFileSync(target.path, target.content, "utf8");
    }
  }

  return { componentName, schema, generated };
}

export function syncAll() {
  const vueFiles = fs.readdirSync(TARGET_DIRS.vue).filter((f) => f.startsWith("Tux") && f.endsWith(".vue"));
  console.log(`Syncing ${vueFiles.length} components across all 11 languages...`);

  let count = 0;
  for (const f of vueFiles) {
    const fullPath = path.join(TARGET_DIRS.vue, f);
    syncComponent(fullPath);
    count++;
  }

  console.log(`✓ Synchronized ${count} components across Vue, React, Elements, PHP, .NET, Python, JS, Swift, and Kotlin.`);
}

// ---------------------------------------------------------------------------
// CLI Execution
// ---------------------------------------------------------------------------
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mode = process.argv[2] || "--sync";
  if (mode === "--sync") {
    syncAll();
  } else if (mode === "--watch") {
    console.log("Watching for component modifications across all target languages...");
    syncAll();
    for (const [lang, dir] of Object.entries(TARGET_DIRS)) {
      if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, (eventType, filename) => {
          if (!filename || filename.startsWith(".")) return;
          console.log(`[${lang}] Detected change in ${filename}, synchronizing across all languages...`);
          const fullPath = path.join(dir, filename);
          if (fs.existsSync(fullPath)) {
            syncComponent(fullPath, lang);
          }
        });
      }
    }
  }
}
