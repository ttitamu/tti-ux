/*
 * AggieCatalog.jsx
 *
 * One source of truth: every component family in AggieUX 1.7, grouped.
 * Each entry: { id, label, page, figma, styles, darkMode, status, blurb }
 *
 *   id       — slug used for routing + DOM ids
 *   page     — section group (Components, Navigation, Specialized, Templates, Icons, Foundations)
 *   figma    — VFS path in the mounted Figma file (for our own reference)
 *   styles   — which of (default, bold, elegant) the family supports
 *   darkMode — whether the family has an On Dark=True variant
 *   status   — 'scaffold' | 'in-progress' | 'ready'
 *   blurb    — one line describing what this component does
 *
 * Every page has a placeholder until we start filling in component variants.
 */

window.AGGIE_CATALOG = [

  /* ─── Foundations (new, not in Figma 1.7 — carried from tux) ───── */
  { id: "intro",           label: "Overview",          page: "Foundations", figma: "/Get-Started-Changelog", styles: [], darkMode: false, status: "ready",
    blurb: "What this kit is, how it relates to tux, what's here and what's next." },
  { id: "style-variants",  label: "Style variants",    page: "Foundations", figma: null, styles: ["default","bold","elegant"], darkMode: false, status: "ready",
    blurb: "The three section styles applied across common patterns. Reference for how each variant's signature (underline vs bar vs hash) plays out." },

  /* ─── Navigation — site-level chrome ────────────────────────────── */
  { id: "identities",      label: "Identities",        page: "Navigation",  figma: "/Navigation/Identities",        styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Lockup identity (logo + institution wordmark) and text identity (institution name as typography). Four navigation options pair with these." },
  { id: "menus",           label: "Menus",             page: "Navigation",  figma: "/Navigation/Menus",             styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Sidebar menu, in-page nav, dropdown (v2.0), and mega menu (v2.0). Pair with lockup or text identity for four navigation combinations." },
  { id: "navigation",      label: "Site navigation",   page: "Navigation",  figma: "/Navigation/Navigation",        styles: ["default"], darkMode: true,  status: "ready",
    blurb: "The site header: utility nav (upper strip) + identity nav (main bar). Five site types \u2014 University, Center, Department, Application w/ nav, Application only. Each in light + dark." },
  { id: "breadcrumbs",     label: "Breadcrumbs",       page: "Navigation",  figma: "/Navigation/Breadcrumbs",       styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Home icon + pipe-separated trail. Italic Work Sans on intermediate crumbs. Four page-depth variants — Landing, L2, L3, Article." },
  { id: "search",          label: "Search",            page: "Navigation",  figma: "/Navigation/Search",            styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Bordered inline search bar with attached uppercase SEARCH button. Regular (60px) and slim (51px) sizes, plus focus state." },
  { id: "search-block",    label: "Search block",      page: "Navigation",  figma: "/Navigation/Search-Block",      styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Labeled search unit — heading + bar + optional lede. For footers, sidebars, dedicated search pages." },
  { id: "footers",         label: "Footers",           page: "Navigation",  figma: "/Navigation/Footers",           styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Main footer block (logo column + 3 or 4 link columns + optional newsletter) plus compliance strip. Application-footer variant for internal tools." },
  { id: "subfooter",       label: "Subfooter",         page: "Navigation",  figma: "/Navigation/Subfooter",         styles: ["default"], darkMode: true,  status: "ready",
    blurb: "Mandatory TAMUS legal strip. Non-negotiable for every TTI site. Contains lockup, Coordinated Statewide Transportation Research Program tagline, state-agency links, © line." },

  /* ─── Components — editorial body patterns ─────────────────────── */
  { id: "page-headers",        label: "Page headers",            page: "Components", figma: "/Components/Page-Headers",                  styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Top-of-page hero w/ superhead, title, subhead, optional CTA. The signature slot for each style variant." },
  { id: "standard-page-header", label: "Standard page header",   page: "Components", figma: "/Components/Standard-Page-Header",          styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Standard editorial page header — title + eyebrow + lede. Variations 1/2/3 differ in compositional rhythm." },
  { id: "card-groups",         label: "Card groups",             page: "Components", figma: "/Components/Card-Groups",                   styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Grid of standard cards. 2/3/4-up, with or without images, linked or static." },
  { id: "card-groups-featured", label: "Card groups w/ featured", page: "Components", figma: "/Components/Card-Groups-with-Featured-Cards", styles: ["default","bold","elegant"], darkMode: true, status: "ready", blurb: "Card group with one oversized hero card + supporting cards at standard size." },
  { id: "standard-card-featured", label: "Standard card + featured", page: "Components", figma: "/Components/Standard-Card-Group-with-Standard-Featured-Card", styles: ["default","bold","elegant"], darkMode: true, status: "ready", blurb: "Featured-card layout that keeps the hero at the same dimensions as its siblings — just marked with a visual flag." },
  { id: "card-slab",           label: "Card slab",               page: "Components", figma: "/Components/Card-Slab",                     styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Full-bleed edge-to-edge card band. Media-forward, oversized title." },
  { id: "cta-feature",         label: "CTA feature",             page: "Components", figma: "/Components/CTA-Feature",                   styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Large promotional block with headline + body + primary/secondary CTA. The loudest editorial surface short of a page header." },
  { id: "cta-links",           label: "CTA links",               page: "Components", figma: "/Components/CTA-Links",                     styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Group of prominent text links with icon + description. Quick routing from a hub page." },
  { id: "callouts",            label: "Callouts",                page: "Components", figma: "/Components/Callouts",                      styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Pulled-aside editorial callout — highlight a stat, a fact, or a quote inline with body flow." },
  { id: "standalone-blockquote", label: "Standalone blockquote", page: "Components", figma: "/Components/Standalone-Blockquote",         styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Full-width featured pullquote with attribution. Italic display face, oversized quote mark." },
  { id: "testimonials",        label: "Testimonial collection",  page: "Components", figma: "/Components/Testimonial-Collection",        styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Grid or carousel of attributed testimonials with photo, quote, name, role." },
  { id: "factoids",            label: "Factoid collections",     page: "Components", figma: "/Components/Factoid-Collections",           styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Row of oversized statistics — the institutional \"by the numbers\" treatment. 3/4/5-up." },
  { id: "split-feature",       label: "Split feature",           page: "Components", figma: "/Components/Split-Feature",                 styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Two-column feature with image on one side and copy + CTA on the other. Alternates left/right." },
  { id: "media-features",      label: "Media features",          page: "Components", figma: "/Components/Media-Features",                styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Full-bleed media-forward block with overlaid or adjacent copy." },
  { id: "media-slab",          label: "Media slab",              page: "Components", figma: "/Components/Media-Slab",                    styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Edge-to-edge media band — hero image + minimal copy. The \"big photo\" moment." },
  { id: "captioned-media",     label: "Captioned media",         page: "Components", figma: "/Components/Captioned-Media",               styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Inline media asset with caption + credit. Supports 16:9, 1:1, 4:3." },
  { id: "video-embed",         label: "Video embed",             page: "Components", figma: "/Components/Video-Embed",                   styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Responsive video player wrapper — YouTube, Vimeo, or self-hosted." },
  { id: "embed",               label: "Embed",                   page: "Components", figma: "/Components/Embed",                         styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Generic iframe container for third-party content with a branded border treatment." },
  { id: "photo-grid",          label: "Photo grid",              page: "Components", figma: "/Components/Photo-Grid",                    styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Masonry/uniform grid of photographs. Optional caption row." },
  { id: "logo-grid",           label: "Logo grid",               page: "Components", figma: "/Components/Logo-Grid",                     styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Partner / sponsor / agency logo wall. Grayscale/color variants." },
  { id: "news-collection",     label: "News collection",         page: "Components", figma: "/Components/News-Collection",               styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "List of news articles with date, dek, thumbnail. Paginated." },
  { id: "contact-cards",       label: "Contact card collection", page: "Components", figma: "/Components/Contact-Card-Collections",      styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Faculty/staff directory card group — photo, name, title, contact links." },
  { id: "contact-cards-b",     label: "Contact card coll. (B)",  page: "Components", figma: "/Components/Contact-Card-Collection-Option-B", styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Alternate contact card layout — horizontal, inline with copy." },
  { id: "collection-feature",  label: "Collection feature",      page: "Components", figma: "/Components/Collection-Feature",            styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Featured group from a larger collection — e.g. \"three recent publications\" pulled onto a landing page." },
  { id: "icon-feature",        label: "Icon feature collection", page: "Components", figma: "/Components/Icon-Feature-Collection",       styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Grid of icon + headline + body — the classic \"our services\" block." },
  { id: "icon-list",           label: "Icon list collections",   page: "Components", figma: "/Components/Icon-List-Collections",         styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "List of items each prefixed by an icon. More compact than icon-feature." },
  { id: "link-list",           label: "Link list collections",   page: "Components", figma: "/Components/Link-List-Collections",         styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Resource list — arrows/caret rows, grouped and titled." },
  { id: "link-slab",           label: "Link slab",               page: "Components", figma: "/Components/Link-Slab",                     styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Full-width horizontal band of links — footer-of-section navigation." },
  { id: "button-slab",         label: "Button slab",             page: "Components", figma: "/Components/Button-Slab",                   styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Band of CTA buttons on a branded background." },
  { id: "accordion-groups",    label: "Accordion groups",        page: "Components", figma: "/Components/Accordion-Groups",              styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Expand/collapse FAQ groups with accessible disclosure patterns." },
  { id: "publication-accordion", label: "Publication accordion", page: "Components", figma: "/Components/Publication-Accordion-Groups",  styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Accordion tuned for publications — author, year, citation, abstract inside." },
  { id: "qa-collections",      label: "Q&A collections",         page: "Components", figma: "/Components/Q-A-Collections",               styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Q&A editorial pattern — question prompt above long-form answer." },
  { id: "description-list",    label: "Description list",        page: "Components", figma: "/Components/Description-List-Collection",   styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "Term/description pairs — event details, spec tables, metadata blocks." },
  { id: "tables",              label: "Tables",                  page: "Components", figma: "/Components/Tables",                        styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "Editorial data tables with caption, th-scoped headers, optional zebra striping." },
  { id: "alerts",              label: "Alerts",                  page: "Components", figma: "/Components/Alerts",                        styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Page-level status banner — info, warning, error, success. Dismissible variant." },
  { id: "buttons",             label: "Buttons",                 page: "Components", figma: "/Components/Buttons",                       styles: ["default","bold","elegant"], darkMode: true,  status: "ready", blurb: "Primary, secondary, tertiary, icon-only. Sizes: default / small. Width: auto / full. Hover + focus states." },
  { id: "sidebar-components",  label: "Sidebar components",      page: "Components", figma: "/Components/Sidebar-Components",            styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "In-page sidebar blocks — related links, contact box, in-page nav, quick facts." },
  { id: "signup-feature",      label: "Sign-up feature",         page: "Components", figma: "/Components/Sign-Up-Feature",               styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "Newsletter / mailing list sign-up block with email input + consent line." },
  { id: "social-banner",       label: "Social media banner",     page: "Components", figma: "/Components/Social-Media-Banner",           styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "Footer-adjacent follow-us strip — icons + handles per platform." },
  { id: "custom-content",      label: "Custom content",          page: "Components", figma: "/Components/Custom-Content",                styles: ["default","bold","elegant"], darkMode: true,  status: "scaffold", blurb: "Escape hatch — a styled container for bespoke layouts that don't fit any other family." },

  /* ─── Specialized — narrower patterns ─────────────────────────── */
  { id: "specialized-page-headers", label: "Specialized page headers", page: "Specialized", figma: "/Specialized/Specialized-Page-Headers", styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Page headers tuned for specific contexts — news article, event, faculty profile, publication." },
  { id: "news-story-footer",   label: "News story footer",       page: "Specialized", figma: "/Specialized/News-Story-Footer",             styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "End-of-article block — author, tags, share, next article suggestions." },
  { id: "pagination",          label: "Pagination",              page: "Specialized", figma: "/Specialized/Pagination",                    styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Page 1 of N controls — prev/next + numbered pages + page size." },
  { id: "horizontal-filters",  label: "Horizontal filters",      page: "Specialized", figma: "/Specialized/Horizontal-Filters",            styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Top-of-list filter bar — dropdowns, toggles, clear-all, result count." },
  { id: "sidebar-filtration",  label: "Sidebar filtration",      page: "Specialized", figma: "/Specialized/Sidebar-Filtration",            styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Left-rail facet filtering — grouped checkboxes, collapsible sections, applied-filter chips." },
  { id: "alpha-nav",           label: "Alpha nav",               page: "Specialized", figma: "/Specialized/Alpha-Nav",                     styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "A–Z jump-nav — glossaries, directories, index pages." },
  { id: "directory",           label: "Directory",               page: "Specialized", figma: "/Specialized/Directory",                     styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Faculty/staff directory layout — search + filters + contact-card list." },
  { id: "glossary",            label: "Glossary",                page: "Specialized", figma: "/Specialized/Glossary",                      styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Term/definition pairs, A-Z grouped, with alpha-nav jump bar." },
  { id: "calendar-event",      label: "Calendar / event widgets", page: "Specialized", figma: "/Specialized/Calendar-Event-Widgets",       styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Event card, month calendar, upcoming-events list, agenda view." },
  { id: "inline-feed-group",   label: "Inline feed group",       page: "Specialized", figma: "/Specialized/Inline-Feed-Group",             styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Embeddable social/news feed block — pulls from an RSS or API source." },
  { id: "example-forms",       label: "Example forms",           page: "Specialized", figma: "/Specialized/Example-Forms",                 styles: ["default","bold","elegant"], darkMode: true, status: "scaffold", blurb: "Form layouts for common flows — contact, registration, RFP, search. Shows label + help + error patterns." },
  { id: "code-maroon-banner",  label: "Code Maroon banner",      page: "Specialized", figma: "/Specialized/Code-Maroon-Banner",            styles: ["default"], darkMode: false, status: "scaffold", blurb: "TAMU-wide emergency alert banner. Fixed styling — this is system-wide safety messaging and doesn't style-switch." },

  /* ─── Templates / Mockups — not components, but useful references ── */
  { id: "templates",           label: "Page templates",          page: "Templates", figma: "/Templates-Mockups", styles: ["default","bold","elegant"], darkMode: false, status: "scaffold", blurb: "Whole-page assemblies showing how components compose — landing, news article, faculty profile, event." },

];
