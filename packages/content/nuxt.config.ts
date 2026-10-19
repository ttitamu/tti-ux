import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/mdc",
  ],

  mdc: {
    headings: {
      anchorLinks: false,
    },
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      langs: ["ts", "js", "vue", "html", "css", "json", "bash", "python", "yaml", "md"],
    },
    remarkPlugins: {
      "remark-math": {},
      "remark-md-links": {
        src: resolve(layerDir, "app/utils/remark-md-links.ts"),
      },
    },
    rehypePlugins: {
      "rehype-katex": {},
    },
  },

  css: [
    "katex/dist/katex.min.css",
  ],
});
