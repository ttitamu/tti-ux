/**
 * scripts/pbir-schema-lock.mjs — the versioning spine for every Power BI
 * artifact this repo emits.
 *
 * PBIR (Power BI Enhanced Report Format) pins a $schema URL in every file
 * it writes, and those URLs are versioned with no "latest" alias. A
 * generator that inlines them scatters version facts across the codebase
 * and rots silently: Desktop rejects the whole report with a generic
 * "There's a problem with the definition content in your Power BI
 * Project." and names no file. So every URL and format-version literal
 * lives HERE, once, and `kit/powerbi/pbir/schema-lock.json` is emitted
 * from it for consumers.
 *
 * VERIFIED 2026-08-31 against the live endpoints: every URL below
 * returned 200 and the next version up returned 404, so these are the
 * current tips — not a transcription of someone's doc.
 *
 * Re-verify with:  node scripts/build-pbir-components.mjs --verify
 */

// ---------------------------------------------------------------------------
// PBIR file schemas
// ---------------------------------------------------------------------------

const FABRIC = "https://developer.microsoft.com/json-schemas/fabric";
const REPORT_DEF = `${FABRIC}/item/report/definition`;

/**
 * NOTE the two odd ones out, both of which are common failure points:
 *  - platformProperties lives under gitIntegration/, NOT item/report/.
 *  - definitionProperties lives at item/report/, NOT under definition/.
 */
export const PBIR_SCHEMAS = {
  /** .platform */
  platformProperties: `${FABRIC}/gitIntegration/platformProperties/2.1.0/schema.json`,
  /** definition.pbir */
  definitionProperties: `${FABRIC}/item/report/definitionProperties/2.0.0/schema.json`,
  /** definition/version.json */
  versionMetadata: `${REPORT_DEF}/versionMetadata/1.0.0/schema.json`,
  /** definition/report.json */
  report: `${REPORT_DEF}/report/3.3.0/schema.json`,
  /** definition/pages/pages.json */
  pagesMetadata: `${REPORT_DEF}/pagesMetadata/1.1.0/schema.json`,
  /** definition/pages/{page}/page.json */
  page: `${REPORT_DEF}/page/2.1.0/schema.json`,
  /** definition/pages/{page}/visuals/{visual}/visual.json */
  visualContainer: `${REPORT_DEF}/visualContainer/2.9.0/schema.json`,
};

/** Content-version literals that are NOT part of the $schema URL. */
export const PBIR_FORMAT_VERSIONS = {
  /** definition.pbir  ->  "version": "4.0"  (4.0+ required) */
  definitionPbir: "4.0",
  /** definition/version.json  ->  "version": "2.0.0" */
  versionMetadata: "2.0.0",
  /** .platform  ->  config.version */
  platformConfig: "2.0",
};

// ---------------------------------------------------------------------------
// Report theme schema
// ---------------------------------------------------------------------------

/**
 * Microsoft publishes ONLY per-release versioned theme schemas in the
 * powerbi-desktop-samples repo — there is no unversioned alias
 * (reportThemeSchema.json is a 404). Verified 2026-08-31: 2.157 is the
 * tip, 2.158 does not exist. The schema is additionalProperties:false
 * with exactly 42 top-level properties and only `name` required, so an
 * unrecognised key fails the whole theme.
 */
export const THEME_SCHEMA_VERSION = "2.157";
export const THEME_SCHEMA_URL =
  "https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main" +
  `/Report%20Theme%20JSON%20Schema/reportThemeSchema-${THEME_SCHEMA_VERSION}.json`;

/**
 * Base themes come in two parallel lines since March 2026. Fluent 2 is
 * the default for NEW reports as of the August 2026 GA of modern visual
 * defaults; the Classic line continues for reports that predate it.
 *
 * Pinning matters: Fluent 2 changed canvas size, padding, corner radius,
 * and turned visual titles on by default, so a component baselined
 * against Classic renders differently under Fluent 2. A custom theme is
 * layered ON TOP of the base theme and inherits anything it does not
 * define — leaving baseTheme unpinned means inheriting whatever the
 * consuming report happens to carry.
 *
 * Verified against the 2.157 enum (38 values; these are the two tips).
 */
export const BASE_THEMES = {
  fluent2: "Fluent2-CY26SU08",
  classic: "CY26SU08",
};

/**
 * report.json themeCollection.*.reportVersionAtImport.
 *
 * BREAKING CHANGE, report schema 3.0.0 (Aug 2025): this went from a flat
 * string ("5.53") to an object of three semver strings. Microsoft's own
 * learn.microsoft.com projects-report page STILL shows the obsolete flat
 * form, so anything copied from the published example produces a
 * report.json that fails validation on 3.3.0.
 *
 * PROVENANCE: observed from a Desktop-generated August-2026 report, not
 * derived from the schema (the schema constrains the shape, not the
 * values). Re-capture from a freshly saved report before shipping report
 * scaffolds — these track Desktop's build, not the PBIR schema version.
 */
export const REPORT_VERSION_AT_IMPORT = {
  visual: "2.9.0",
  page: "2.3.1",
  report: "3.3.0",
};

/**
 * Service-enforced PBIR limits, for anything that generates at scale.
 * Exceeding these fails at publish time, not at author time.
 */
export const PBIR_LIMITS = {
  pagesPerReport: 1000,
  visualsPerPage: 1000,
  resourceFilesPerReport: 1000,
  resourcePackageBytes: 300 * 1024 * 1024,
  reportBytes: 300 * 1024 * 1024,
  /** Windows MAX_PATH. PBIR nests a folder per visual; long component
   *  folder names hit this first. Folder names are also [\w-]+ only. */
  maxPathChars: 260,
};

/**
 * Visual types that are deprecated or renamed. Emitting these produces
 * reports that open today and break later; the lint rejects them.
 * left = what older docs and generators say, right = what to emit now.
 */
export const VISUAL_TYPE_MIGRATIONS = {
  card: "cardVisual",
  table: "tableEx",
  matrix: "pivotTable",
  filledMap: "azureMap",
  map: "azureMap",
  multiRowCard: "cardVisual",
};

/** Status note surfaced in the emitted lock + README. */
export const PBIR_STATUS = {
  ga: false,
  note:
    "PBIR is still public preview as of 2026-08-31 (GA slipped past its " +
    "Q3 2026 target) but is already the default format for new reports " +
    "in the service (Jan 2026) and Desktop (Mar 2026). Microsoft has " +
    "stated it becomes the ONLY supported format at GA.",
  verifiedOn: "2026-08-31",
};
