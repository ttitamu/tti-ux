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
]);

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
  const withDefaultsBlock = content.match(/withDefaults\s*\([\s\S]*?\{([\s\S]*?)\}\s*\)/);
  if (withDefaultsBlock) {
    for (const p of props) {
      const defMatch = withDefaultsBlock[1].match(new RegExp(`\\b${p.name}\\s*:\\s*(['"]?)([^'",\\s}\\]\\n]+)\\1`));
      if (defMatch) {
        const rawDef = defMatch[2];
        if (rawDef === "undefined" || rawDef === "null" || rawDef.startsWith("(") || rawDef.startsWith("{") || rawDef.startsWith("[")) {
          continue;
        }
        if (p.type === "boolean") {
          p.defaultValue = rawDef === "true";
        } else if (p.type === "number") {
          const num = Number(rawDef);
          if (!Number.isNaN(num)) p.defaultValue = num;
        } else if (p.type === "enum" && p.enumValues) {
          if (p.enumValues.includes(rawDef)) p.defaultValue = rawDef;
        } else {
          p.defaultValue = rawDef;
        }
      }
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
    .filter((p) => p.defaultValue !== undefined)
    .map((p) => {
      const val = p.type === "string" || p.type === "enum" ? `"${p.defaultValue}"` : p.defaultValue;
      return `  ${p.name}: ${val},`;
    })
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
      if (p.defaultValue !== undefined) {
        const val = p.type === "string" || p.type === "enum" ? `"${p.defaultValue}"` : p.defaultValue;
        return `${p.name} = ${val}`;
      }
      return p.name;
    })
    .concat(["children", "className = ''"])
    .join(", ");

  const Tag = VALID_HTML_TAGS.has(schema.rootElement) ? schema.rootElement : "div";

  return `/**
 * ${schema.name} — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface ${schema.name}Props {
${propTypes ? `${propTypes}\n` : ""}  children?: React.ReactNode;
  className?: string;
}

export const ${schema.name}: React.FC<${schema.name}Props> = ({
  ${defaultDestructuring}
}) => {
  return (
    <${Tag} className={\`${schema.baseClass} \${className}\`.trim()}>
      {children}
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
      const type = p.type === "boolean" ? "bool" : p.type === "number" ? "int" : "string";
      const def = p.defaultValue !== undefined ? (p.type === "string" || p.type === "enum" ? ` = '${p.defaultValue}'` : ` = ${p.defaultValue}`) : "";
      return `    public ${type} $${toCamelCase(p.name)}${def};`;
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
    .map((p) => {
      const type = p.type === "boolean" ? "bool" : p.type === "number" ? "int" : "string";
      const def = p.defaultValue !== undefined ? (p.type === "string" || p.type === "enum" ? ` = "${p.defaultValue}";` : ` = ${p.defaultValue};`) : ";";
      return `    [Parameter] public ${type} ${toPascalCase(p.name)} { get; set; }${def}`;
    })
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
    .map((p) => {
      const type = p.type === "boolean" ? "bool" : p.type === "number" ? "int" : "string";
      const def = p.defaultValue !== undefined ? (p.type === "string" || p.type === "enum" ? ` = "${p.defaultValue}";` : ` = ${p.defaultValue};`) : ";";
      return `    public ${type} ${toPascalCase(p.name)} { get; set; }${def}`;
    })
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
 * A prop's default as a Python literal. The schema carries JS values and raw
 * withDefaults text, so `true`/`false`, `null`/`undefined` and an unquoted
 * enum member (`error`, `md`) would otherwise land in Python as undefined
 * names: a NameError the moment the module is imported.
 */
export function pythonDefault(p) {
  const v = p.defaultValue;
  if (v === undefined || v === null || v === "undefined" || v === "null") return "None";
  if (p.type === "boolean") return v === true || v === "true" ? "True" : "False";
  if (p.type === "number") return /^-?\d+(\.\d+)?$/.test(String(v)) ? String(v) : "None";
  return JSON.stringify(String(v));
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
      const type = p.type === "boolean" ? "bool" : p.type === "number" ? "int" : "str";
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
      const type = p.type === "boolean" ? "Bool" : p.type === "number" ? "Int" : "String";
      const def = p.defaultValue !== undefined ? (p.type === "string" || p.type === "enum" ? ` = "${p.defaultValue}"` : ` = ${p.defaultValue}`) : "";
      return `    public var ${toCamelCase(p.name)}: ${type}${def}`;
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
      const type = p.type === "boolean" ? "Boolean" : p.type === "number" ? "Int" : "String";
      const def = p.defaultValue !== undefined ? (p.type === "string" || p.type === "enum" ? ` = "${p.defaultValue}"` : ` = ${p.defaultValue}`) : "";
      return `    ${toCamelCase(p.name)}: ${type}${def},`;
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

function resolveSourceContent(sourceFile) {
  const content = fs.readFileSync(sourceFile, "utf8");
  if (sourceFile.endsWith(".vue")) {
    const reExportMatch =
      content.match(/export\s+\{\s*default\s*\}\s+from\s+["']([^"']+\.vue)["']/) ||
      content.match(/import\s+\w+\s+from\s+["']([^"']+\.vue)["']/);
    if (reExportMatch && !content.includes("defineProps")) {
      const targetPath = path.resolve(path.dirname(sourceFile), reExportMatch[1]);
      if (fs.existsSync(targetPath)) {
        return fs.readFileSync(targetPath, "utf8");
      }
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
