import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import { designRoutes, docsRoutes } from "./app/utils/content-routes";

// Layer-rooted dir so consuming apps (TTI Code, tti-ai-studio, etc.) resolve
// our css/asset paths relative to *this* file, not their own srcDir.
// `~` in a Nuxt layer's nuxt.config maps to the *consumer's* `app/`, not
// the layer's, so anything we want to ship from the layer needs an
// absolute path.
const layerDir = dirname(fileURLToPath(import.meta.url));

// True when tti-ux itself is the project being built (style-guide dev,
// `npm run generate`, Pages deploy) — false when another app consumes
// tti-ux as a layer via `extends`. Layer configs merge into consumers, so
// docs-site-only build behavior (prerender crawling, 404 demotion) must be
// fenced behind this or it silently bleeds into every consumer's
// production build (a consumer ships a `nitro:config` hook today solely to
// undo that bleed — this makes that workaround unnecessary).
const isRootProject = process.cwd() === layerDir;

// tti-ux is a runnable Nuxt 4 style-guide for the TTI design system. The app
// itself IS the living doc: every route under /components demos a Tux* wrapper
// so visual regressions are obvious at a glance.
export default defineNuxtConfig({
  compatibilityDate: "2026-04-24",

  future: { compatibilityVersion: 4 },

  // The sub-layers by package name, not this layer's bundled packages/ copy:
  // they are dependencies of @tti/tti-ux, and npm may nest a sub-layer's own
  // dependencies under it (desk's tiptap, which clashes with @nuxt/ui's), where
  // only the installed package can see them. In this repo the workspaces link
  // each name to packages/<name>.
  extends: [
    // Feature sub-layer for Apache ECharts
    "@tti/tti-ux-charts",
    // Feature sub-layer for Mermaid Diagrams
    "@tti/tti-ux-diagrams",
    // Feature sub-layer for Shiki Code Highlighting
    "@tti/tti-ux-code",
    // Feature sub-layer for Desk Visual Web Builder & Publishing Engine. Its
    // server/ (14 REST routes, a PGlite database) is mounted only in this
    // repo's own site: extended by every consuming app, as 3.4.0 did, it put an
    // editorial API on each app's server with nothing in front of it. The Desk
    // components still reach apps through app/components/desk (the package is
    // a dependency); an app that wants Desk's server adds "@tti/tti-ux-desk"
    // to its own extends.
    ...(isRootProject ? ["@tti/tti-ux-desk"] : []),
    // Feature sub-layer for Markdown (MDC) & KaTeX Math
    "@tti/tti-ux-content",
  ],

  // `#tux` is this layer's own app/ directory, for the files of the sub-layers
  // under packages/ that use the root's composables, components and geo data.
  // `~` is the CONSUMING app's srcDir, so a layer file must never import
  // through it (3.4.0 did, 20 times, and no consumer could build). An alias
  // from an extended layer reaches the consuming app's config.
  alias: {
    "#tux": resolve(layerDir, "app"),
  },

  devtools: { enabled: isRootProject },
  telemetry: false,

  app: {
    // Transitions default to out-in for the living style guide; disabled
    // by default for layer consumers so they don't inherit navigation delays.
    pageTransition: isRootProject ? { name: "page", mode: "out-in" } : false,
    layoutTransition: isRootProject ? { name: "layout", mode: "out-in" } : false,
    head: {
      // `lang` is required for screen readers to pick the right voice
      // and for axe's `html-has-lang` rule. Sets `<html lang="en">`.
      htmlAttrs: { lang: "en" },
      title: "TUX · Texas A&M Transportation Institute Design System",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "TUX (@tti/tti-ux) — The official institutional design system, WCAG 2.2 Level AAA component library, and multi-platform UI kit for the Texas A&M Transportation Institute (TTI).",
        },
        {
          property: "og:title",
          content: "TUX · Texas A&M Transportation Institute Design System",
        },
        {
          property: "og:description",
          content:
            "Unified institutional design system, 189 WCAG 2.2 Level AAA components, and multi-framework SDKs (Vue/Nuxt, React, WordPress/Kadence, .NET, Python) for Texas A&M Transportation Institute digital systems.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://ux.tti.tamu.edu" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/svg+xml", href: "/TTI-glyph.svg" },
        { rel: "apple-touch-icon", href: "/TTI-Color.png" },
      ],
    },
  },

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
  $production: isRootProject
    ? {
        app: {
          baseURL: process.env.NUXT_APP_BASE_URL || "/",
        },
        nitro: {
          preset: process.env.NUXT_PAGES === "1" ? "github_pages" : "node-server",
          externals: {
            inline: ["unhead"],
          },
          prerender: {
            crawlLinks: true,
            routes: ["/", ...docsRoutes(layerDir), ...designRoutes(layerDir)],
            // Demo pages (breadcrumbs, footer) intentionally render
            // realistic-looking nav links to routes that don't exist in
            // the style guide (/research, /docs, /changelog, /sessions,
            // /models, /keys). Crawling finds them, hits 404s, and would
            // abort the whole build. Demote 404s to warnings so the rest
            // of the static site still ships. Real broken-link checking
            // belongs in CI/lighthouse, not the build step.
            failOnError: false,
          },
        },
      }
    : {},

  modules: [
    "@nuxt/icon",
    // @nuxt/fonts removed — fonts are now self-hosted via explicit
    // @font-face declarations in app/assets/css/fonts.css, sourced from
    // @fontsource/* npm packages via scripts/sync-fonts.mjs. The module
    // had auto-fetch-from-Google behavior that defeats air-gapped builds;
    // removing it makes the font-load surface explicit and offline-clean.
    "@nuxt/image",
    "@nuxt/ui",
    // Guardrails shipped to every consumer on purpose: a11y + lint are
    // part of the TUX contract. Dev/build-time only — no client bundle cost.
    "@nuxt/eslint",
    "@nuxt/a11y",
    "@nuxtjs/color-mode",
    // @vueuse/nuxt removed 2026-08-12 (owner-decided): registered since
    // early scaffolding with zero call sites. House utilities live in
    // app/composables/ as tux-owned equivalents (useTuxPersistedRef,
    // useTuxClipboard, …) — model new ones on VueUse's semantics when a
    // need appears, but own the ~30 lines instead of shipping the
    // dependency to every consumer.
  ],

  // @nuxt/ui auto-installs @nuxt/fonts unless `ui.fonts: false` is set.
  // Explicitly disable all providers (including `local`) as defense-in-depth
  // so @nuxt/fonts / fontless / fontaine / fontkitten never make external
  // fetch calls or run WOFF2 Brotli decompression (`woff2shell` / CVE-2026-111497)
  // if a consumer re-enables @nuxt/fonts (fonts are self-hosted in public/fonts/).
  fonts: {
    providers: {
      local: false,
      google: false,
      googleicons: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      adobe: false,
      npm: false,
    },
  },

  // Offline-clean, zero-remote icon bundling. Scans all templates/scripts
  // and serves locally installed @iconify-json/lucide icons directly
  // without external fetch dependencies.
  icon: {
    mode: "css",
    serverBundle: "local",
    clientBundle: {
      scan: {
        globInclude: ["**/*.{vue,jsx,tsx,ts,md,mdc,mdx}"],
      },
      sizeLimitKb: 0,
    },
  },

  // Components registration. Default Nuxt behavior auto-imports
  // components via compile-time template rewrites — fast, lean, but
  // INVISIBLE to `vueResolveComponent()` at runtime. That matters for
  // `@nuxtjs/mdc`, whose `MDCRenderer` resolves tags from `::tux-alert{...}`
  // markdown block syntax by calling Vue's runtime resolver. Without
  // global registration, every Tux* used in markdown logs
  // `[Vue warn]: Failed to resolve component: TuxAlert`.
  //
  // `global: true` registers each component via `app.component()` so
  // MDC's resolver finds it. Bundle-size cost: components ship in the
  // main chunk instead of being lazy-loaded — acceptable for TUX
  // because Tux* are used on virtually every page anyway. Layer-rooted
  // path so consuming apps resolve from *this* file, not their own srcDir.
  components: [
    {
      path: resolve(layerDir, "app/components"),
      global: true,
    },
  ],


  // CSS load order: fonts first (@font-face — declare faces before any
  // rules reference them), then tokens (CSS vars), then globals
  // (consumes tokens + Tailwind + Nuxt UI @imports), then tux (utility
  // layer consumed by the Tux* wrappers). Paths are layer-rooted (see
  // `layerDir` above) so consuming apps don't accidentally try to load
  // these from their own app/ when they extend us.
  //
  // Fonts are self-hosted from public/fonts/<family>/*.woff2 — sourced
  // from @fontsource/* npm packages via scripts/sync-fonts.mjs. No CDN
  // dependency at runtime or build time; air-gapped-build clean.
  css: [
    resolve(layerDir, "app/assets/css/fonts.css"),
    resolve(layerDir, "app/assets/css/tokens.css"),
    resolve(layerDir, "app/assets/css/globals.css"),
    resolve(layerDir, "app/assets/css/tux.css"),
    resolve(layerDir, "kit/css/tux-ops.css"),
    resolve(layerDir, "kit/css/tux-bridge.css"),
  ],

  colorMode: {
    preference: "tti",
    fallback: "tti",
    classSuffix: "",
    dataValue: "theme",
  },

  a11y: {
    // `enabled` intentionally omitted: the module defaults it to
    // `nuxt.options.dev`, so every consumer gets the live axe overlay while
    // developing. Forcing `true` here used to ship axe-core (~550 KB) inside
    // the production entry chunk. CI coverage stays with `npm run audit:a11y`
    // / `tux-audit`.
    defaultHighlight: false,
    logIssues: true,
  },

  ui: {
    // Prevent @nuxt/ui from registering @nuxt/fonts (which pulls in fontless ->
    // fontaine -> fontkitten's bundled WOFF2 Brotli decoder). TUX declares all
    // @font-face rules explicitly in app/assets/css/fonts.css.
    fonts: false,
    theme: {
      colors: ["primary", "secondary", "success", "info", "warning", "error", "neutral", "tip"],
    },
  },

  // Security headers for SSR/node-server and prerendered routes (S5)
  routeRules: {
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "X-XSS-Protection": "0",
      },
    },
    "/api/**": {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  },

  vite: {
    server: {
      watch: {
        ignored: ["**/templates/**", "**/packages/**", "**/dist/**", "**/.output/**", "**/reference/**"],
      },
    },
    // Cast through unknown so consuming layers' typecheck doesn't trip
    // when their `vite` resolves to a different path than ours under
    // `node_modules`. The Plugin shape is identical at runtime; only
    // nominal TS identity differs across duplicate vite installs.
    plugins: [tailwindcss()] as unknown as never[],
  },


  typescript: {
    strict: true,
    typeCheck: false,
  },

  hooks: {
    // Strip global `<link rel="prefetch">` / `<link rel="modulepreload">` bloat from the
    // build manifest for non-entry dynamic chunks (like the 180+ `global: true` MDC
    // component chunks). Without this, SSR/prerendered HTML `<head>` tags carry 160+
    // prefetch/modulepreload links before `<body>`, choking LLM web-fetchers, crawlers,
    // and social preview parsers before they ever reach the page content.
    "build:manifest"(manifest) {
      for (const item of Object.values(manifest)) {
        item.prefetch = false;
        if (!item.isEntry) {
          item.preload = false;
        }
      }
    },
    // Nuxt registers `global: true` components with async dynamic wrappers for
    // MDC runtime resolution. When components (like TuxErrorPage, TuxFooter, etc.)
    // are also statically referenced by templates or layouts, Rollup and Rolldown
    // warn that the dynamic import will not move the module into a separate chunk.
    // Filter this expected warning across both client (Rollup) and server/SSR (Rolldown) builds.
    "vite:extendConfig"(config) {
      const suppressIneffectiveDynamicImport = (warning: unknown, warn: (w: unknown) => void) => {
        const w = warning as { code?: string; message?: string } | string | undefined;
        if (
          (typeof w === "object" && w?.code === "INEFFECTIVE_DYNAMIC_IMPORT") ||
          (typeof w === "string" && w.includes("INEFFECTIVE_DYNAMIC_IMPORT"))
        ) {
          return;
        }
        warn(warning);
      };

      const buildAny = (config.build ?? {}) as Record<string, any>;

      // Vite client / Rollup
      buildAny.rollupOptions = buildAny.rollupOptions || {};
      const origRollupOnwarn = buildAny.rollupOptions.onwarn;
      buildAny.rollupOptions.onwarn = (warning: unknown, warn: (w: unknown) => void) => {
        suppressIneffectiveDynamicImport(warning, (w) => {
          if (origRollupOnwarn) {
            origRollupOnwarn(w, warn);
          } else {
            warn(w);
          }
        });
      };

      // Vite 8 / Rolldown (server/SSR)
      buildAny.rolldownOptions = buildAny.rolldownOptions || {};
      const origRolldownOnwarn = buildAny.rolldownOptions.onwarn;
      buildAny.rolldownOptions.onwarn = (warning: unknown, warn: (w: unknown) => void) => {
        suppressIneffectiveDynamicImport(warning, (w) => {
          if (origRolldownOnwarn) {
            origRolldownOnwarn(w, warn);
          } else {
            warn(w);
          }
        });
      };
    },
    // Nuxt CLI does not call process.exit(0) when the build completes, and
    // lingering worker threads or file watchers in Node 26 can prevent the
    // process from terminating naturally after "✨ Build complete!".
    // Exit cleanly once Nitro signals compilation is done.
    "nitro:init"(nitro) {
      nitro.hooks.hook("compiled", () => {
        if (
          isRootProject &&
          !process.env.VITEST &&
          (process.argv.includes("build") || process.argv.includes("generate"))
        ) {
          setTimeout(() => {
            process.exit(0);
          }, 400);
        }
      });
    },
    // Co-located `*.demo-data.ts` fixtures live beside their gallery pages
    // on purpose — but Nuxt's file router registers EVERY .ts under pages/
    // as a route. Crawling those "routes" imports a module with no default
    // component and prerender dies with the flaky
    // "Cannot read properties of undefined ('__vccOpts')" (and the page
    // being rendered at that moment silently drops from the output —
    // found 2026-07-16 in tti-ai-studio's generate). Strip them from the
    // route table; the sibling imports are untouched.
    "pages:extend"(pages) {
      // When another app consumes tti-ux as a layer, the style guide's own
      // routes (164 showcase/docs pages) leak into the consumer's route
      // table via `extends`. Strip every page whose file lives in the
      // layer, unless the consumer opts back in with TTI_UX_DEMOS=1 (handy
      // for browsing the gallery inside an app during development).
      // docs-tti previously carried this exact hook as a consumer
      // workaround — it can delete it at next pin-bump.
      const stripLayerPages = !isRootProject && process.env.TTI_UX_DEMOS !== "1";
      const layerPagesDir = resolve(layerDir, "app/pages");
      const strip = (list: (typeof pages)[number][]) => {
        for (let i = list.length - 1; i >= 0; i--) {
          const p = list[i]!;
          if (p.file?.endsWith(".demo-data.ts")) list.splice(i, 1);
          else if (stripLayerPages && p.file?.startsWith(layerPagesDir)) list.splice(i, 1);
          else if (p.children?.length) strip(p.children);
        }
      };
      strip(pages);
    },
  },
});
