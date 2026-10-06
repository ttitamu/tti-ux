import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2026-04-24",
  future: { compatibilityVersion: 4 },

  // Extend the TUX design system layer (auto-imports, tokens, layouts, fonts)
  extends: ["@tti/tti-ux"],

  modules: [
    "@nuxt/content",
    "@nuxthq/studio",
  ],

  content: {
    // Markdown formatting + MDC components support
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-katex"],
    },
    highlight: {
      theme: {
        default: "github-light",
        "tti-dark": "github-dark",
        "tti-hc": "github-light-high-contrast",
      },
    },
  },

  studio: {
    enabled: true,
  },
});
