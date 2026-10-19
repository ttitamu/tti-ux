/**
 * scripts/gen-cem.mjs — extracts Custom Elements Manifest (CEM v1) from Tux*.vue
 * Single source of truth: app/components/Tux*.vue
 *
 * Emits dist/custom-elements.json conforming to the Custom Elements Manifest schema.
 * Powers automated React wrapper generation, IDE intellisense, and documentation tabs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "app", "components");
const OUT_FILE = path.join(ROOT, "dist", "custom-elements.json");

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function resolveVueCode(filePath) {
  let code = fs.readFileSync(filePath, "utf-8");
  const reExportMatch =
    code.match(/export\s+\{\s*default\s*\}\s+from\s+["']([^"']+\.vue)["']/) ||
    code.match(/import\s+\w+\s+from\s+["']([^"']+\.vue)["']/);
  if (reExportMatch && !code.includes("defineProps")) {
    const targetPath = path.resolve(path.dirname(filePath), reExportMatch[1]);
    if (fs.existsSync(targetPath)) {
      code = fs.readFileSync(targetPath, "utf-8");
    }
  }
  return code;
}

function parseComponent(filePath, fileName) {
  const code = resolveVueCode(filePath);
  const compName = path.basename(fileName, ".vue");
  const tagName = kebabCase(compName);

  // Extract top doc comment
  let description = "";
  const docMatch = code.match(/<script[^>]*>[\s\n]*\/\*\*?([\s\S]*?)\*\//);
  if (docMatch) {
    description = docMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(" ");
  }

  // Extract Props from interface Props { ... } or defineProps<{ ... }>()
  const props = [];
  const interfaceMatch = code.match(/interface\s+Props\s*\{([\s\S]*?)\n\}/);
  const inlinePropsMatch = code.match(/defineProps<\{([\s\S]*?)\}>\(\)/);
  const propsBlock = interfaceMatch ? interfaceMatch[1] : (inlinePropsMatch ? inlinePropsMatch[1] : "");

  if (propsBlock) {
    // Match each prop line like:
    // /** doc */ prop?: type;
    const propLines = propsBlock.split(";").map((p) => p.trim()).filter(Boolean);
    for (const rawLine of propLines) {
      const cleanLine = rawLine.replace(/\/\*[\s\S]*?\*\//g, "").trim();
      const match = cleanLine.match(/^(?:readonly\s+)?([a-zA-Z0-9_$]+)(\??)\s*:\s*([\s\S]+)$/);
      if (match) {
        const [, name, optional, type] = match;
        const isOptional = optional === "?" || type.includes("undefined") || type.includes("null");
        props.push({
          name: name.trim(),
          type: type.trim().replace(/\s+/g, " "),
          optional: isOptional,
          attribute: kebabCase(name.trim()),
        });
      }
    }
  }

  // Extract Slots
  const slots = [];
  const slotMatches = code.matchAll(/<slot\s*(?:name=["']([^"']+)["'])?/g);
  const seenSlots = new Set();
  for (const m of slotMatches) {
    const slotName = m[1] || "default";
    if (!seenSlots.has(slotName)) {
      seenSlots.add(slotName);
      slots.push({ name: slotName });
    }
  }

  // Extract Events
  const events = [];
  const seenEvents = new Set();
  for (const m of code.matchAll(/defineEmits<\{([\s\S]*?)\}>\(\)/g)) {
    const block = m[1];
    for (const callMatch of block.matchAll(/\(e:\s*([^,)]+)/g)) {
      for (const lit of callMatch[1].matchAll(/["']([^"']+)["']/g)) {
        const ev = lit[1];
        if (ev && !seenEvents.has(ev)) {
          seenEvents.add(ev);
          events.push({ name: ev });
        }
      }
    }
    for (const propMatch of block.matchAll(/(?:^|[;\n])\s*(?:["']([^"']+)["']|([a-zA-Z_$][a-zA-Z0-9_$:-]*))\s*:\s*\[/g)) {
      const ev = propMatch[1] || propMatch[2];
      if (ev && !seenEvents.has(ev)) {
        seenEvents.add(ev);
        events.push({ name: ev });
      }
    }
  }

  return {
    name: compName,
    tagName,
    description,
    props,
    slots,
    events,
  };
}

export function generateCEM() {
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter((f) => f.startsWith("Tux") && f.endsWith(".vue"))
    .sort();

  const declarations = [];

  for (const f of files) {
    const parsed = parseComponent(path.join(COMPONENTS_DIR, f), f);
    declarations.push({
      kind: "class",
      name: parsed.name,
      tagName: parsed.tagName,
      customElement: true,
      description: parsed.description,
      members: parsed.props.map((p) => ({
        kind: "field",
        name: p.name,
        type: { text: p.type },
        attribute: p.attribute,
        optional: p.optional,
      })),
      slots: parsed.slots,
      events: parsed.events,
    });
  }

  const manifest = {
    schemaVersion: "1.0.0",
    readme: "Custom Elements Manifest for TUX Design System (@tti/tti-ux)",
    modules: [
      {
        kind: "javascript-module",
        path: "packages/elements/dist/tux-elements.js",
        declarations,
        exports: declarations.map((d) => ({
          kind: "custom-element-definition",
          name: d.tagName,
          declaration: { name: d.name },
        })),
      },
    ],
  };

  return manifest;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const manifest = generateCEM();
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote Custom Elements Manifest with ${manifest.modules[0].declarations.length} components to ${path.relative(ROOT, OUT_FILE)}`);
}
