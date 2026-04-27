import tailwindcss from "@tailwindcss/vite";

// tti-ux is a runnable Nuxt 4 style-guide for the TTI design system. The app
// itself IS the living doc: every route under /components demos a Tux* wrapper
// so visual regressions are obvious at a glance.
export default defineNuxtConfig({
  compatibilityDate: "2026-04-24",

  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },

  // GitHub Pages deploy.
  //
  // The site pre-renders fully at build time — no SSR worker on
  // Pages. `app.baseURL` only kicks in when an explicit env var is
  // set (the Actions workflow sets `NUXT_APP_BASE_URL=/tti-ux/`); in
  // local dev and SSR-server builds the baseURL stays `/` so nothing
  // changes for the development workflow.
  //
  // The github_pages Nitro preset emits a fully-prerendered
  // `.output/public/` directory with a `.nojekyll` marker. The
  // workflow only switches to that preset when building for Pages —
  // again via env var — so `npm run dev` and `npm run build` (a
  // server build) keep their default behavior.
  $production: {
    app: {
      baseURL: process.env.NUXT_APP_BASE_URL || "/",
    },
    nitro: {
      preset: process.env.NUXT_PAGES === "1" ? "github_pages" : undefined,
      prerender: {
        crawlLinks: true,
        routes: ["/"],
      },
    },
  },

  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/a11y",
    "@nuxtjs/color-mode",
    "@nuxtjs/mdc",
    "@vueuse/nuxt",
  ],

  // MDC — markdown rendering with Vue components. Lets consumers
  // (tti-docs, blog posts, marcom WordPress migration) author content
  // in markdown with Tux* components inline. Tux components are
  // already auto-imported by Nuxt; MDC picks them up via the same
  // resolver. See `app/pages/markdown.vue` for the demo + full syntax
  // crib sheet.
  mdc: {
    highlight: {
      // Reuse the Shiki themes the rest of the system uses.
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      langs: ["ts", "js", "vue", "html", "css", "json", "bash", "python", "yaml", "md"],
    },
  },

  // CSS load order: tokens first (CSS vars), then globals (consumes tokens +
  // Tailwind + Nuxt UI @imports), then tux (utility layer consumed by the
  // Tux* wrappers).
  css: ["~/assets/css/tokens.css", "~/assets/css/globals.css", "~/assets/css/tux.css"],

  // @nuxt/fonts auto-detects which of these are actually referenced in
  // source (font-family declarations in CSS / Vue files) and only fetches
  // the ones it sees. So adding the full AggieUX stack here doesn't bloat
  // the bundle — it makes them available when a component reaches for
  // AggieUX parity. Default stack is still Public Sans + JetBrains Mono.
  fonts: {
    families: [
      { name: "Public Sans", weights: [400, 500, 600, 700], provider: "google" },
      { name: "JetBrains Mono", weights: [400, 500], provider: "google" },
      // AggieUX parity — load on demand when a component opts in.
      { name: "Open Sans", weights: [300, 400, 500, 600, 700, 800], provider: "google" },
      { name: "Oswald", weights: [200, 300, 400, 500, 600, 700], provider: "google" },
      { name: "Work Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], provider: "google" },
      // Georgia is a system font — no fetch needed, listed so the intent is
      // explicit for designers reading the config.
    ],
  },

  colorMode: {
    preference: "tti",
    fallback: "tti",
    classSuffix: "",
    dataValue: "theme",
  },

  a11y: {
    enabled: true,
    defaultHighlight: false,
    logIssues: true,
  },

  ui: {
    theme: {
      colors: ["primary", "secondary", "success", "info", "warning", "error", "neutral", "tip"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "tti-ux",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Living style guide for the TTI design system — Nuxt 4 + Nuxt UI, themed for Texas A&M Transportation Institute.",
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
});
