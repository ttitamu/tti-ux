/**
 * scripts/build-elements.mjs — builds @tti/tti-ux-elements custom-elements bundle
 * Implements ADR-0012: Single-source Web Components via Vue defineCustomElement
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "app", "components");
const ELEMENTS_PKG = path.join(ROOT, "packages", "elements");
const SRC_DIR = path.join(ELEMENTS_PKG, "src");
const DIST_DIR = path.join(ELEMENTS_PKG, "dist");

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export function generateElementsEntry() {
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter((f) => f.startsWith("Tux") && f.endsWith(".vue"))
    .sort();

  const imports = [];
  const definitions = [];

  for (const f of files) {
    const name = path.basename(f, ".vue");
    const tag = kebabCase(name);
    imports.push(`import ${name} from "../../../app/components/${f}";`);
    definitions.push(`
export const ${name}Element = defineCustomElement(${name}, {
  shadowRoot: false,
  configureApp(app) {
    app.use(uiPlugin);
  }
});
if (typeof customElements !== "undefined" && !customElements.get("${tag}")) {
  customElements.define("${tag}", ${name}Element);
}`);
  }

  const content = `/**
 * GENERATED FILE — do not edit. Source: app/components/Tux*.vue
 * Emitted by scripts/build-elements.mjs
 */

import { defineCustomElement } from "vue";
import uiPlugin from "@nuxt/ui/vue-plugin";

${imports.join("\n")}

${definitions.join("\n")}
`;

  fs.mkdirSync(SRC_DIR, { recursive: true });
  fs.writeFileSync(path.join(SRC_DIR, "index.ts"), content, "utf-8");

  // Also write d.ts for typescript consumers
  const dtsLines = [
    `declare global {`,
    `  interface HTMLElementTagNameMap {`,
  ];
  for (const f of files) {
    const name = path.basename(f, ".vue");
    const tag = kebabCase(name);
    dtsLines.push(`    "${tag}": HTMLElement;`);
  }
  dtsLines.push(`  }`);
  dtsLines.push(`}`);
  dtsLines.push(`export {};`);

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, "tux-elements.d.ts"), dtsLines.join("\n") + "\n", "utf-8");
  
  return files.length;
}

export async function bundleElements() {
  const { build } = await import("vite");
  const vue = (await import("@vitejs/plugin-vue")).default;

  await build({
    logLevel: "warn",
    resolve: {
      alias: {
        "~": path.resolve(ROOT, "app"),
        "@": path.resolve(ROOT, "app"),
      },
    },
    plugins: [vue()],
    build: {
      lib: {
        entry: path.join(SRC_DIR, "index.ts"),
        name: "TuxElements",
        fileName: () => "tux-elements.js",
        formats: ["es"],
      },
      outDir: DIST_DIR,
      emptyOutDir: false,
      rollupOptions: {
        external: ["vue", "@nuxt/ui/vue-plugin"],
      },
    },
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const count = generateElementsEntry();
  console.log(`Generated Web Components entry with ${count} components in packages/elements/src/index.ts`);
  await bundleElements();
  console.log(`Compiled custom elements bundle in packages/elements/dist/tux-elements.js`);
}
