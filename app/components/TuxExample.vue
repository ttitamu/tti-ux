<script setup lang="ts">
import type { BundledTheme } from "shiki";
import { useTuxFramework } from "../composables/useTuxFramework";

/**
 * TuxExample — live demo + code-reveal container for the style guide.
 *
 * Renders the default slot as a framed preview, then a tab strip with:
 *   - Vue             · Canonical Vue 3 / Nuxt template source (SSR-highlighted)
 *   - React           · React JSX (@tti/tti-ux-react) syntax (SSR-highlighted)
 *   - Web Component   · Custom Elements (@tti/tti-ux-elements) syntax (SSR-highlighted)
 *   - Razor (.NET)    · ASP.NET Core Tag Helper & Blazor component syntax (SSR-highlighted)
 *   - HTML (DOM)      · Rendered DOM, auto-extracted from the preview on
 *                       mount and pretty-printed via tuxFormatHtml.
 *   - CSS             · Optional drop-in overlay / class API (tux-ops.css)
 *   - Power BI        · Optional visualStyles JSON or PBIR fragment
 *   - Source          · Optional full Tux component SFC
 *
 * Synchronized with `useTuxFramework()`: clicking a framework tab or switching
 * the framework in the shell header immediately updates all code examples across
 * the application and persists in localStorage.
 */

interface Props {
  /** The Vue template source to show in the `Vue` tab. */
  vue?: string;
  /** Optional React JSX code (auto-derived from vue if omitted). */
  react?: string;
  /** Optional Web Component code (auto-derived from vue if omitted). */
  wc?: string;
  /** Optional Razor / C# tag helper code (auto-derived from vue if omitted). */
  razor?: string;
  /** Optional Python code (auto-derived from vue if omitted). */
  python?: string;
  /** Optional PHP code (auto-derived from vue if omitted). */
  php?: string;
  /** Optional Swift code (auto-derived from vue if omitted). */
  swift?: string;
  /** Optional Kotlin code (auto-derived from vue if omitted). */
  kotlin?: string;
  /** Optional component source SFC to expose in a `Source` tab. */
  source?: string;
  /** Optional drop-in CSS (overlay class API). Shown in a `CSS` tab. */
  css?: string;
  /** Optional Power BI JSON for this visual. Shown in a `Power BI` tab. */
  powerbi?: string;
  /** Preview-pane label (small uppercase tag above the demo). */
  title?: string;
  /** Padding inside the preview area. Default "p-6". */
  previewPadding?: string;
}

const props = withDefaults(defineProps<Props>(), {
  previewPadding: "p-6",
  vue: undefined,
  react: undefined,
  wc: undefined,
  razor: undefined,
  python: undefined,
  php: undefined,
  swift: undefined,
  kotlin: undefined,
  source: undefined,
  css: undefined,
  powerbi: undefined,
  title: undefined,
});

type Tab =
  | "vue"
  | "react"
  | "wc"
  | "razor"
  | "python"
  | "php"
  | "swift"
  | "kotlin"
  | "html"
  | "css"
  | "source"
  | "powerbi";

const { framework, setFramework } = useTuxFramework();
const activeTab = ref<Tab>("vue");
const previewRef = ref<HTMLElement | null>(null);
const rendered = ref("");
const renderedHighlighted = ref<string | null>(null);
const { copied, copy: writeClipboard } = useTuxClipboard();

const colorMode = useColorMode();
const { highlight } = useTuxHighlighter();

const shikiTheme = computed<BundledTheme>(() => {
  if (colorMode.value === "tti-dark") return "github-dark";
  if (colorMode.value === "tti-hc") return "github-light-high-contrast";
  return "github-light";
});

// Hash for stable cache keys.
function hashCode(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function pascal(name: string): string {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

/** Extract all unique Tux component names in both PascalCase and kebab-case. */
function extractTuxComponents(template: string): string[] {
  if (!template) return [];
  const names = new Set<string>();
  const pascalMatches = template.matchAll(/<Tux([A-Za-z0-9]+)/g);
  for (const m of pascalMatches) {
    names.add(`Tux${m[1]}`);
  }
  const kebabMatches = template.matchAll(/<tux-([a-z0-9-]+)/g);
  for (const m of kebabMatches) {
    names.add(pascal(`tux-${m[1]}`));
  }
  return Array.from(names).sort();
}

function toCamelAttr(attr: string): string {
  if (attr.startsWith("aria-") || attr.startsWith("data-")) return attr;
  return attr.replace(/-([a-zA-Z0-9])/g, (_, ch: string) => ch.toUpperCase());
}

function toReactEventProp(eventName: string): string {
  const clean = eventName.split(".")[0] ?? eventName;
  if (clean === "update:modelValue" || clean === "update:model-value") {
    return "onChange";
  }
  const normalized = clean.replace(/:/g, "-");
  return `on${pascal(normalized)}`;
}

function deriveReact(vue: string): string {
  if (!vue) return "";
  const components = extractTuxComponents(vue);
  const compImport =
    components.length > 0
      ? `import { ${components.join(", ")} } from "@tti/tti-ux-react";\n\n`
      : "";

  let jsx = vue
    .replace(/<tux-([a-z0-9-]+)/g, (_, name) => `<${pascal(`tux-${name}`)}`)
    .replace(/<\/tux-([a-z0-9-]+)>/g, (_, name) => `</${pascal(`tux-${name}`)}>`);

  // Hoist named Vue slots (<template #slotName>...</template>) onto the enclosing Tux component as JSX props
  const slotPropsToHoist: Array<{ propName: string; content: string }> = [];
  jsx = jsx.replace(
    /\n?\s*<template\s+(?:#|v-slot:)([a-zA-Z0-9_-]+)>([\s\S]*?)<\/template>\n?/g,
    (_, rawSlotName: string, slotInner: string) => {
      const propName = toCamelAttr(rawSlotName);
      const trimmed = slotInner
        .trim()
        .replace(/\bclass="/g, 'className="')
        .replace(/{{\s*([^}]+)\s*}}/g, "{$1}");
      if (propName === "default") {
        return `\n  ${trimmed}\n`;
      }
      slotPropsToHoist.push({ propName, content: trimmed });
      return "\n";
    },
  );

  if (slotPropsToHoist.length > 0) {
    const propEntries = slotPropsToHoist
      .map(({ propName, content }) => {
        const indented = content
          .split("\n")
          .map((line) => `    ${line}`)
          .join("\n");
        return `  ${propName}={(\n${indented}\n  )}`;
      })
      .join("\n");
    jsx = jsx.replace(/^(<Tux[A-Za-z0-9]+[\s\S]*?)(>)/, `$1\n${propEntries}\n$2`);
  }

  jsx = jsx
    // v-model bindings
    .replace(/\bv-model:([a-zA-Z0-9_-]+)="([^"]+)"/g, (_, name: string, expr: string) => `${toCamelAttr(name)}={${expr}}`)
    .replace(/\bv-model="([^"]+)"/g, "value={$1} onChange={(e) => setValue(e.target.value)}")
    // Vue @event and v-on:event listeners -> React onEvent={handler}
    .replace(/(?:@|v-on:)([a-zA-Z0-9_:.-]+)="([^"]+)"/g, (_, evt: string, handler: string) => {
      const reactProp = toReactEventProp(evt);
      const trimmedHandler = handler.trim();
      const isSimpleRefOrArrow =
        /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(trimmedHandler) ||
        trimmedHandler.startsWith("(") ||
        trimmedHandler.includes("=>");
      return `${reactProp}={${isSimpleRefOrArrow ? trimmedHandler : `() => { ${trimmedHandler}; }`}}`;
    })
    // Bound boolean and expression props (:kebab-prop="...")
    .replace(/:([a-zA-Z0-9_-]+)="true"/g, (_, name: string) => toCamelAttr(name))
    .replace(/:([a-zA-Z0-9_-]+)="false"/g, (_, name: string) => `${toCamelAttr(name)}={false}`)
    .replace(/:([a-zA-Z0-9_-]+)="([^"]+)"/g, (_, name: string, expr: string) => `${toCamelAttr(name)}={${expr}}`)
    // Static kebab-case attributes on JSX elements (preserving aria-* and data-*)
    .replace(/\s([a-z]+(?:-[a-z0-9]+)+)=("/g, (match, name: string) => {
      if (name.startsWith("aria-") || name.startsWith("data-")) return match;
      return ` ${toCamelAttr(name)}="`;
    })
    .replace(/\bclass="/g, 'className="')
    .replace(/{{\s*([^}]+)\s*}}/g, "{$1}");

  return `${compImport}${jsx.trim()}`;
}

function deriveWebComponent(vue: string): string {
  if (!vue) return "";
  const wc = vue
    .replace(/<Tux([A-Za-z0-9]+)/g, (_, name) => `<tux-${kebab(name)}`)
    .replace(/<\/Tux([A-Za-z0-9]+)>/g, (_, name) => `</tux-${kebab(name)}>`)
    .replace(/<template\s+(?:#|v-slot:)([a-zA-Z0-9_-]+)>([\s\S]*?)<\/template>/g, '<div slot="$1">$2</div>')
    .replace(/(?:@|v-on:)([a-zA-Z0-9_:.-]+)="([^"]+)"/g, (_, evt: string, fn: string) => `on-${kebab(evt.replace(/:/g, "-"))}="${fn}"`)
    .replace(/:([a-zA-Z0-9_-]+)="true"/g, "$1")
    .replace(/:([a-zA-Z0-9_-]+)="false"/g, "")
    .replace(/:([a-zA-Z0-9_-]+)="'(.*?)'"/g, '$1="$2"')
    .replace(/:([a-zA-Z0-9_-]+)="([^"]+)"/g, '$1="$2"')
    .replace(/{{\s*([^}]+)\s*}}/g, "$1");

  return `<!-- Web Component (@tti/tti-ux-elements) -->\n${wc.trim()}`;
}

function deriveRazor(vue: string): string {
  if (!vue) return "";

  // 1. Generate ASP.NET Core Tag Helper syntax
  const tagHelper = vue
    .replace(/<Tux([A-Za-z0-9]+)/g, (_, name) => `<tux-${kebab(name)}`)
    .replace(/<\/Tux([A-Za-z0-9]+)>/g, (_, name) => `</tux-${kebab(name)}>`)
    .replace(/<template\s+(?:#|v-slot:)([a-zA-Z0-9_-]+)>([\s\S]*?)<\/template>/g, '<div slot="$1">$2</div>')
    .replace(/(?:@|v-on:)([a-zA-Z0-9_:.-]+)="([^"]+)"/g, (_, evt: string, fn: string) => `asp-on-${kebab(evt.replace(/:/g, "-"))}="@${fn}"`)
    .replace(/:([a-zA-Z0-9_-]+)="false"/g, '$1="@false"')
    .replace(/:([a-zA-Z0-9_-]+)="true"/g, '$1="@true"')
    .replace(/:([a-zA-Z0-9_-]+)="([^"]+)"/g, '$1="@($2)"')
    .replace(/{{\s*([^}]+)\s*}}/g, "@($1)");

  // 2. Generate Blazor component syntax with PascalCase parameters
  const blazor = vue
    .replace(/<tux-([a-z0-9-]+)/g, (_, name) => `<${pascal(`tux-${name}`)}`)
    .replace(/<\/tux-([a-z0-9-]+)>/g, (_, name) => `</${pascal(`tux-${name}`)}>`)
    .replace(
      /<template\s+(?:#|v-slot:)([a-zA-Z0-9_-]+)>([\s\S]*?)<\/template>/g,
      (_, slotName: string, inner: string) => `<${pascal(slotName)}>${inner}</${pascal(slotName)}>`,
    )
    .replace(/(?:@|v-on:)([a-zA-Z0-9_:.-]+)="([^"]+)"/g, (_, evt: string, fn: string) => `On${pascal(evt.replace(/:/g, "-"))}="@${fn}"`)
    .replace(/:([a-zA-Z0-9_-]+)="true"/g, (_, name) => `${pascal(name)}="@true"`)
    .replace(/:([a-zA-Z0-9_-]+)="false"/g, (_, name) => `${pascal(name)}="@false"`)
    .replace(/:([a-zA-Z0-9_-]+)="([^"]+)"/g, (_, name, val) => `${pascal(name)}="@(${val})"`)
    .replace(/\b([a-z][a-zA-Z0-9_-]*)=/g, (match, name) => {
      if (name === "class" || name === "style" || name === "id" || name.startsWith("aria-") || name.startsWith("data-")) return match;
      return `${pascal(name)}=`;
    })
    .replace(/{{\s*([^}]+)\s*}}/g, "@($1)");

  return `@* 1. ASP.NET Core Tag Helper *@
@addTagHelper *, Tti.Tux.AspNetCore

${tagHelper.trim()}

@* 2. Or Blazor Component *@
@using Tti.Tux.Blazor

${blazor.trim()}`;
}

function deriveSwift(vue: string): string {
  if (!vue) return "";
  const components = extractTuxComponents(vue);
  const mainComp = components[0] || "TuxComponent";

  const attrs: string[] = [];
  const attrMatches = vue.matchAll(/([:@]?)([a-zA-Z0-9_-]+)="([^"]*)"/g);
  for (const m of attrMatches) {
    const isBound = m[1] === ":";
    const name = m[2] ?? "";
    const val = m[3] ?? "";
    if (!name || name === "class" || name === "style") continue;
    const camel = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    if (isBound) {
      if (val === "true" || val === "false") {
        attrs.push(`${camel}: ${val}`);
      } else if (!isNaN(Number(val))) {
        attrs.push(`${camel}: ${val}`);
      } else {
        attrs.push(`${camel}: .${val.replace(/['"]/g, "")}`);
      }
    } else {
      attrs.push(`${camel}: "${val}"`);
    }
  }

  const textMatch = vue.match(/>([^<]+)<\//);
  const innerText = textMatch?.[1]?.trim() ?? "";
  const attrStr = attrs.length > 0 ? `(\n    ${attrs.join(",\n    ")}\n)` : "()";

  const body = innerText
    ? `${mainComp}${attrStr} {\n    Text("${innerText}")\n}`
    : `${mainComp}${attrStr}`;

  return `// SwiftUI · TtiUxSwift
import SwiftUI
import TtiUxSwift

struct DemoView: View {
    var body: some View {
        ${body.split("\n").join("\n        ")}
    }
}`;
}

function deriveKotlin(vue: string): string {
  if (!vue) return "";
  const components = extractTuxComponents(vue);
  const mainComp = components[0] || "TuxComponent";

  const attrs: string[] = [];
  const attrMatches = vue.matchAll(/([:@]?)([a-zA-Z0-9_-]+)="([^"]*)"/g);
  for (const m of attrMatches) {
    const isBound = m[1] === ":";
    const name = m[2] ?? "";
    const val = m[3] ?? "";
    if (!name || name === "class" || name === "style") continue;
    const camel = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    if (isBound) {
      if (val === "true" || val === "false") {
        attrs.push(`${camel} = ${val}`);
      } else if (!isNaN(Number(val))) {
        attrs.push(`${camel} = ${val}`);
      } else {
        attrs.push(`${camel} = "${val.replace(/['"]/g, "")}"`);
      }
    } else {
      attrs.push(`${camel} = "${val}"`);
    }
  }

  const textMatch = vue.match(/>([^<]+)<\//);
  const innerText = textMatch?.[1]?.trim() ?? "";
  const attrStr = attrs.length > 0 ? `(\n    ${attrs.join(",\n    ")}\n)` : "()";

  const body = innerText
    ? `${mainComp}${attrStr} {\n    Text("${innerText}")\n}`
    : `${mainComp}${attrStr}`;

  return `// Jetpack Compose · edu.tamu.tti.ux
import androidx.compose.runtime.Composable
import androidx.compose.material3.Text
import edu.tamu.tti.ux.components.${mainComp}

@Composable
fun DemoScreen() {
    ${body.split("\n").join("\n    ")}
}`;
}

function derivePython(vue: string): string {
  if (!vue) return "";
  const components = extractTuxComponents(vue);
  const mainComp = components[0] || "TuxComponent";
  const pyFunc = mainComp.replace(/^Tux/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

  const kwargs: string[] = [];
  const attrMatches = vue.matchAll(/([:@]?)([a-zA-Z0-9_-]+)="([^"]*)"/g);
  for (const m of attrMatches) {
    const isBound = m[1] === ":";
    const name = m[2] ?? "";
    const val = m[3] ?? "";
    if (!name || name === "class" || name === "style") continue;
    const snake = name.replace(/-([a-z0-9])/g, (_, c) => `_${c}`).toLowerCase();
    if (isBound) {
      if (val === "true") kwargs.push(`${snake}=True`);
      else if (val === "false") kwargs.push(`${snake}=False`);
      else if (!isNaN(Number(val))) kwargs.push(`${snake}=${val}`);
      else kwargs.push(`${snake}="${val.replace(/['"]/g, "")}"`);
    } else {
      kwargs.push(`${snake}="${val}"`);
    }
  }

  const textMatch = vue.match(/>([^<]+)<\//);
  const innerText = textMatch?.[1]?.trim() ?? "";
  if (innerText) {
    kwargs.unshift(`"${innerText}"`);
  }

  const kwargStr = kwargs.length > 0 ? `\n    ${kwargs.join(",\n    ")}\n` : "";

  return `# Python 3.10+ · Streamlit / Dash / TTI-UX
import tux

tux.${pyFunc}(${kwargStr})`;
}

function derivePhp(vue: string): string {
  if (!vue) return "";
  const components = extractTuxComponents(vue);
  const mainComp = components[0] || "TuxComponent";

  const args: string[] = [];
  const attrMatches = vue.matchAll(/([:@]?)([a-zA-Z0-9_-]+)="([^"]*)"/g);
  for (const m of attrMatches) {
    const isBound = m[1] === ":";
    const name = m[2] ?? "";
    const val = m[3] ?? "";
    if (!name || name === "class" || name === "style") continue;
    if (isBound) {
      if (val === "true") args.push(`'${name}' => true`);
      else if (val === "false") args.push(`'${name}' => false`);
      else if (!isNaN(Number(val))) args.push(`'${name}' => ${val}`);
      else args.push(`'${name}' => '${val.replace(/['"]/g, "")}'`);
    } else {
      args.push(`'${name}' => '${val}'`);
    }
  }

  const textMatch = vue.match(/>([^<]+)<\//);
  const innerText = textMatch?.[1]?.trim() ?? "";
  if (innerText) {
    args.push(`'content' => '${innerText}'`);
  }

  const argStr = args.length > 0 ? `[\n    ${args.join(",\n    ")},\n]` : "[]";

  return `<?php
// PHP 8.2+ · WordPress Block / TTI-UX
use Tti\\Ux\\Components\\${mainComp};

echo ${mainComp}::render(${argStr});`;
}

const activeReactCode = computed(() => props.react ?? deriveReact(props.vue ?? ""));
const activeWcCode = computed(() => props.wc ?? deriveWebComponent(props.vue ?? ""));
const activeRazorCode = computed(() => props.razor ?? deriveRazor(props.vue ?? ""));
const activeSwiftCode = computed(() => props.swift ?? deriveSwift(props.vue ?? ""));
const activeKotlinCode = computed(() => props.kotlin ?? deriveKotlin(props.vue ?? ""));
const activePythonCode = computed(() => props.python ?? derivePython(props.vue ?? ""));
const activePhpCode = computed(() => props.php ?? derivePhp(props.vue ?? ""));

// Pre-highlight static framework tabs at SSR time
const { data: vueHighlighted } = await useAsyncData(
  () => `tux-example-vue:${shikiTheme.value}:${hashCode(props.vue ?? "")}`,
  () =>
    props.vue
      ? highlight(props.vue, { lang: "vue", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => props.vue, shikiTheme] },
);

const { data: reactHighlighted } = await useAsyncData(
  () => `tux-example-react:${shikiTheme.value}:${hashCode(activeReactCode.value)}`,
  () =>
    activeReactCode.value
      ? highlight(activeReactCode.value, { lang: "tsx", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activeReactCode.value, shikiTheme] },
);

const { data: wcHighlighted } = await useAsyncData(
  () => `tux-example-wc:${shikiTheme.value}:${hashCode(activeWcCode.value)}`,
  () =>
    activeWcCode.value
      ? highlight(activeWcCode.value, { lang: "html", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activeWcCode.value, shikiTheme] },
);

const { data: razorHighlighted } = await useAsyncData(
  () => `tux-example-razor:${shikiTheme.value}:${hashCode(activeRazorCode.value)}`,
  () =>
    activeRazorCode.value
      ? highlight(activeRazorCode.value, { lang: "razor", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activeRazorCode.value, shikiTheme] },
);

const { data: swiftHighlighted } = await useAsyncData(
  () => `tux-example-swift:${shikiTheme.value}:${hashCode(activeSwiftCode.value)}`,
  () =>
    activeSwiftCode.value
      ? highlight(activeSwiftCode.value, { lang: "swift", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activeSwiftCode.value, shikiTheme] },
);

const { data: kotlinHighlighted } = await useAsyncData(
  () => `tux-example-kotlin:${shikiTheme.value}:${hashCode(activeKotlinCode.value)}`,
  () =>
    activeKotlinCode.value
      ? highlight(activeKotlinCode.value, { lang: "kotlin", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activeKotlinCode.value, shikiTheme] },
);

const { data: pythonHighlighted } = await useAsyncData(
  () => `tux-example-python:${shikiTheme.value}:${hashCode(activePythonCode.value)}`,
  () =>
    activePythonCode.value
      ? highlight(activePythonCode.value, { lang: "python", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activePythonCode.value, shikiTheme] },
);

const { data: phpHighlighted } = await useAsyncData(
  () => `tux-example-php:${shikiTheme.value}:${hashCode(activePhpCode.value)}`,
  () =>
    activePhpCode.value
      ? highlight(activePhpCode.value, { lang: "php", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => activePhpCode.value, shikiTheme] },
);

const { data: sourceHighlighted } = await useAsyncData(
  () => `tux-example-src:${shikiTheme.value}:${hashCode(props.source ?? "")}`,
  () =>
    props.source
      ? highlight(props.source, { lang: "vue", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => props.source, shikiTheme] },
);

const { data: powerbiHighlighted } = await useAsyncData(
  () => `tux-example-pbi:${shikiTheme.value}:${hashCode(props.powerbi ?? "")}`,
  () =>
    props.powerbi
      ? highlight(props.powerbi, { lang: "json", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => props.powerbi, shikiTheme] },
);

const { data: cssHighlighted } = await useAsyncData(
  () => `tux-example-css:${shikiTheme.value}:${hashCode(props.css ?? "")}`,
  () =>
    props.css
      ? highlight(props.css, { lang: "css", theme: shikiTheme.value })
      : Promise.resolve(""),
  { watch: [() => props.css, shikiTheme] },
);

const tabs = computed(() => {
  const t: { id: Tab; label: string }[] = [{ id: "vue", label: "Vue" }];
  if (activeReactCode.value) t.push({ id: "react", label: "React" });
  if (activeWcCode.value) t.push({ id: "wc", label: "Web Component" });
  if (activeRazorCode.value) t.push({ id: "razor", label: "Razor (.NET)" });
  if (activePythonCode.value) t.push({ id: "python", label: "Python" });
  if (activePhpCode.value) t.push({ id: "php", label: "PHP" });
  if (activeSwiftCode.value) t.push({ id: "swift", label: "Swift" });
  if (activeKotlinCode.value) t.push({ id: "kotlin", label: "Kotlin" });
  t.push({ id: "html", label: "HTML (DOM)" });
  if (props.css) t.push({ id: "css", label: "CSS" });
  if (props.powerbi) t.push({ id: "powerbi", label: "Power BI" });
  if (props.source) t.push({ id: "source", label: "Source" });
  return t;
});

// Reactively synchronize activeTab with global framework preference
watch(
  framework,
  (fw) => {
    if (tabs.value.some((t) => t.id === fw)) {
      activeTab.value = fw;
    }
  },
  { immediate: true },
);

function onSelectTab(tabId: Tab) {
  activeTab.value = tabId;
  // If user clicked one of the supported frameworks, synchronize globally
  if (
    tabId === "vue" ||
    tabId === "react" ||
    tabId === "wc" ||
    tabId === "razor" ||
    tabId === "python" ||
    tabId === "php" ||
    tabId === "swift" ||
    tabId === "kotlin"
  ) {
    setFramework(tabId, { notify: false });
  }
}

onMounted(() => {
  captureHTML();
  attachObserver();
  rehighlightHtmlTab();
});

watch([rendered, shikiTheme], () => rehighlightHtmlTab());

watch([activeTab, shikiTheme], async ([tab, theme]) => {
  if (tab === "html") {
    await rehighlightHtmlTab();
  } else if (tab === "razor" && activeRazorCode.value) {
    razorHighlighted.value = await highlight(activeRazorCode.value, { lang: "razor", theme });
  } else if (tab === "react" && activeReactCode.value) {
    reactHighlighted.value = await highlight(activeReactCode.value, { lang: "tsx", theme });
  } else if (tab === "wc" && activeWcCode.value) {
    wcHighlighted.value = await highlight(activeWcCode.value, { lang: "html", theme });
  } else if (tab === "swift" && activeSwiftCode.value) {
    swiftHighlighted.value = await highlight(activeSwiftCode.value, { lang: "swift", theme });
  } else if (tab === "kotlin" && activeKotlinCode.value) {
    kotlinHighlighted.value = await highlight(activeKotlinCode.value, { lang: "kotlin", theme });
  } else if (tab === "python" && activePythonCode.value) {
    pythonHighlighted.value = await highlight(activePythonCode.value, { lang: "python", theme });
  } else if (tab === "php" && activePhpCode.value) {
    phpHighlighted.value = await highlight(activePhpCode.value, { lang: "php", theme });
  }
});

async function rehighlightHtmlTab() {
  if (!rendered.value) {
    renderedHighlighted.value = null;
    return;
  }
  renderedHighlighted.value = await highlight(rendered.value, {
    lang: "html",
    theme: shikiTheme.value,
  });
}

let observer: MutationObserver | null = null;

function attachObserver() {
  if (!previewRef.value) return;
  observer = new MutationObserver(() => captureHTML());
  observer.observe(previewRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
}

onBeforeUnmount(() => {
  observer?.disconnect();
});

function captureHTML() {
  if (previewRef.value) {
    rendered.value = tuxFormatHtml(previewRef.value.innerHTML);
  }
}

const activeCode = computed(() => {
  if (activeTab.value === "vue") return props.vue ?? "";
  if (activeTab.value === "react") return activeReactCode.value;
  if (activeTab.value === "wc") return activeWcCode.value;
  if (activeTab.value === "html") return rendered.value;
  if (activeTab.value === "razor") return activeRazorCode.value;
  if (activeTab.value === "swift") return activeSwiftCode.value;
  if (activeTab.value === "kotlin") return activeKotlinCode.value;
  if (activeTab.value === "python") return activePythonCode.value;
  if (activeTab.value === "php") return activePhpCode.value;
  if (activeTab.value === "css") return props.css ?? "";
  if (activeTab.value === "powerbi") return props.powerbi ?? "";
  return props.source ?? "";
});

const highlightedCode = computed<string | null>(() => {
  if (activeTab.value === "vue") return vueHighlighted.value || null;
  if (activeTab.value === "react") return reactHighlighted.value || null;
  if (activeTab.value === "wc") return wcHighlighted.value || null;
  if (activeTab.value === "html") return renderedHighlighted.value;
  if (activeTab.value === "razor") return razorHighlighted.value || null;
  if (activeTab.value === "swift") return swiftHighlighted.value || null;
  if (activeTab.value === "kotlin") return kotlinHighlighted.value || null;
  if (activeTab.value === "python") return pythonHighlighted.value || null;
  if (activeTab.value === "php") return phpHighlighted.value || null;
  if (activeTab.value === "source") return sourceHighlighted.value || null;
  if (activeTab.value === "css") return cssHighlighted.value || null;
  if (activeTab.value === "powerbi") return powerbiHighlighted.value || null;
  return renderedHighlighted.value;
});

async function copyActive() {
  if (!activeCode.value) return;
  await writeClipboard(activeCode.value);
}

const xrayOpen = ref(false);

const detectedPrimitives = computed<string[]>(() => {
  return extractTuxComponents(props.vue ?? "");
});

const XRAY_TOKEN_SPECS = [
  { token: "--brand-primary", role: "Institutional Primary (Aggie Maroon)", isColor: true },
  { token: "--brand-accent", role: "Institutional Accent (Aggie Gold)", isColor: true },
  { token: "--surface-page", role: "Canvas / Page Well", isColor: true },
  { token: "--surface-raised", role: "Elevated Preview Surface", isColor: true },
  { token: "--surface-border", role: "Structural Keyline Border", isColor: true },
  { token: "--text-primary", role: "Primary Body & Heading Ink", isColor: true },
  { token: "--font-display", role: "Display & Metric Stack", isColor: false },
  { token: "--font-body", role: "Body & UI Copy Stack", isColor: false },
] as const;

const resolvedTokens = computed(() => {
  if (!xrayOpen.value || typeof window === "undefined") {
    return XRAY_TOKEN_SPECS.map((spec) => ({
      ...spec,
      value: `var(${spec.token})`,
    }));
  }
  const target = previewRef.value ?? document.documentElement;
  const styles = window.getComputedStyle(target);
  return XRAY_TOKEN_SPECS.map((spec) => {
    const raw = styles.getPropertyValue(spec.token).trim();
    return {
      ...spec,
      value: raw || `var(${spec.token})`,
    };
  });
});
</script>

<template>
  <div class="tux-example rounded-md border border-surface-border overflow-hidden min-w-0 max-w-full">
    <div
      v-if="title"
      class="px-4 py-2 bg-surface-sunken border-b border-surface-border text-xs font-semibold uppercase text-text-secondary"
      style="letter-spacing: var(--tracking-wider)"
    >
      {{ title }}
    </div>

    <div
      ref="previewRef"
      :class="['tux-example__preview bg-surface-raised min-w-0 max-w-full overflow-x-auto', previewPadding]"
    >
      <slot />
    </div>

    <div class="flex items-center border-t border-surface-border bg-surface-sunken overflow-x-auto min-w-0 max-w-full">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer"
        :class="
          activeTab === t.id
            ? 'text-text-brand border-brand-primary bg-surface-raised'
            : 'text-text-muted hover:text-text-secondary border-transparent'
        "
        @click="onSelectTab(t.id)"
      >
        {{ t.label }}
      </button>
      <div class="flex-1" />
      <button
        type="button"
        data-testid="tux-example-xray-toggle"
        class="flex items-center gap-1 px-3 py-2 text-xs whitespace-nowrap cursor-pointer transition-colors"
        :class="
          xrayOpen
            ? 'text-text-brand font-semibold bg-surface-raised'
            : 'text-text-muted hover:text-text-brand'
        "
        :aria-pressed="xrayOpen"
        @click="xrayOpen = !xrayOpen"
      >
        <UIcon name="lucide:scan-eye" class="w-3.5 h-3.5" />
        <span>Token X-Ray</span>
      </button>
      <button
        type="button"
        class="flex items-center gap-1 px-3 py-2 text-xs text-text-muted hover:text-text-brand whitespace-nowrap cursor-pointer"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copyActive"
      >
        <UIcon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="w-3.5 h-3.5"
        />
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </div>

    <div
      v-if="xrayOpen"
      data-testid="tux-example-xray"
      class="tux-example__xray px-4 py-3 bg-surface-raised border-t border-surface-border text-xs space-y-3"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="font-bold uppercase tracking-wider text-text-secondary">Primitives:</span>
          <template v-if="detectedPrimitives.length">
            <code
              v-for="comp in detectedPrimitives"
              :key="comp"
              class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border font-mono text-[11px] text-text-brand"
            >
              &lt;{{ comp }}&gt;
            </code>
          </template>
          <span v-else class="text-text-muted italic">Slot / Custom Composition</span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="px-2 py-0.5 rounded bg-surface-sunken border border-surface-border font-mono text-[11px] text-text-secondary">
            Theme: {{ colorMode.value || "tti" }}
          </span>
          <span class="px-2 py-0.5 rounded bg-surface-sunken border border-surface-border font-semibold text-[11px] text-text-brand">
            WCAG 2.2 AAA · TX §2054.459
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div
          v-for="item in resolvedTokens"
          :key="item.token"
          data-testid="tux-example-xray-token"
          class="p-2 rounded bg-surface-sunken border border-surface-border flex flex-col gap-0.5 min-w-0"
        >
          <div class="flex items-center gap-1.5">
            <span
              v-if="item.isColor"
              class="w-3 h-3 rounded-sm border border-surface-border shrink-0"
              :style="{ backgroundColor: `var(${item.token})` }"
              aria-hidden="true"
            />
            <code class="font-mono font-semibold text-[11px] text-text-primary truncate">{{ item.token }}</code>
          </div>
          <span class="text-[10px] text-text-muted truncate">{{ item.role }}</span>
          <code class="font-mono text-[10px] text-text-secondary truncate">{{ item.value }}</code>
        </div>
      </div>
    </div>

    <div class="tux-example__code bg-surface-sunken min-w-0 max-w-full overflow-hidden">
      <ClientOnly v-if="activeTab === 'html'">
        <!-- v-html is safe: `highlightedCode` is Shiki SSR output of
             code samples authored in the repo, not user input. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="highlightedCode" class="shiki-wrap min-w-0 max-w-full overflow-x-auto" v-html="highlightedCode" />
        <pre v-else class="m-0 p-4 text-xs font-mono overflow-auto max-h-96 max-w-full"><code>{{ rendered || "(awaiting mount)" }}</code></pre>
        <template #fallback>
          <pre class="m-0 p-4 text-xs font-mono text-text-muted">Loading rendered HTML…</pre>
        </template>
      </ClientOnly>
      <div v-else class="min-w-0 max-w-full overflow-hidden">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="highlightedCode" class="shiki-wrap min-w-0 max-w-full overflow-x-auto" v-html="highlightedCode" />
        <pre v-else class="m-0 p-4 text-xs font-mono overflow-auto max-h-96 max-w-full"><code>{{ activeCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style>
/* Shiki emits `<pre class="shiki shiki-themes ..." style="background-color:..">`.
   We let it keep its color scheme (that's the whole point), but pin sizing
   and scroll behavior to match the rest of the style guide. */
.tux-example__code .shiki-wrap {
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
}
.tux-example__code .shiki-wrap pre.shiki {
  margin: 0;
  padding: 1rem;
  font-size: 0.75rem;
  line-height: 1.6;
  max-height: 24rem;
  overflow: auto;
  max-width: 100%;
}
</style>
