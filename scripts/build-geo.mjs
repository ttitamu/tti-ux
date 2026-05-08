/**
 * scripts/build-geo.mjs — pre-project real GeoJSON / TopoJSON into
 * static SVG path strings for `TuxChartGeographic`.
 *
 * Sources:
 *   - us-atlas (npm) — TIGER/Line 1:10m TopoJSON for US states +
 *     counties. MIT-licensed; treated as a build-time data
 *     package, not a runtime dep.
 *   - data/source/txdot-districts.geojson — fetched from the
 *     official TxDOT Boundaries map service:
 *     https://maps.dot.state.tx.us/arcgis/rest/services/Boundaries/MapServer/0
 *     (queried with f=geojson, outSR=4326). Public-domain
 *     government data.
 *
 * Pipeline:
 *   1. Load + filter source data (us-atlas Texas state, Texas
 *      counties via FIPS state-code 48, TxDOT districts).
 *   2. Convert TxDOT GeoJSON → TopoJSON, run presimplify +
 *      simplify (Visvalingam) to drop vertex count by ~95% so
 *      the final bundle stays in the tens-of-kilobytes range.
 *      us-atlas counties / states are already simplified at 10m.
 *   3. Project with `d3-geoAlbers` for Texas-only views (centered
 *      on TX with parallels 27°N and 35°N), and `d3-geoAlbersUsa`
 *      for the national context view (handles AK / HI insets).
 *      Both fit to a fixed viewBox so consumers get consistent
 *      pixel coordinates.
 *   4. Generate SVG path strings via `d3-geoPath`. Compute
 *      centroids in pixel space for badge / label placement.
 *      Project the Texas state outline as a flat polygon in
 *      pixel space — used at runtime for hex-grid masking via
 *      point-in-polygon (no projection at runtime).
 *   5. Write four TS modules under `app/assets/geo/`. Counties
 *      live in their own file because they're the largest payload.
 *
 * Run via `npm run build:geo`. Outputs are checked into the repo
 * — re-run only when source data changes (TxDOT redraws its
 * districts, or us-atlas cuts a new release).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature as topoFeature } from "topojson-client";
import { topology } from "topojson-server";
import { presimplify, simplify } from "topojson-simplify";
import {
  geoAlbers,
  geoAlbersUsa,
  geoPath,
} from "d3-geo";

// ─── Paths ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "data/source");
const OUT = path.join(ROOT, "app/assets/geo");

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// ─── ViewBoxes ────────────────────────────────────────────────
// Texas-only canvas. Width:height ≈ 3:2 matches the state's bounding
// rectangle (TX is wider east-west than north-south).
const TX_VIEWBOX = [600, 400];
// US-context canvas. AlbersUsa fits both AK and HI as insets; 8:5
// aspect is the d3 community standard.
const US_VIEWBOX = [960, 600];

// ─── FIPS state-code → USPS abbreviation (50 + DC) ────────────
// us-atlas tags features with two-digit FIPS state codes; we want
// USPS for human-readable consumption.
const FIPS_TO_USPS = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
  "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
  "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
  "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

// ─── Texas metro lat/lng — projected at build time ───────────
const TX_METROS_LATLNG = [
  { code: "DFW", name: "Dallas–Fort Worth", lat: 32.776, lng: -96.797 },
  { code: "HOU", name: "Houston",           lat: 29.760, lng: -95.370 },
  { code: "SAT", name: "San Antonio",       lat: 29.424, lng: -98.494 },
  { code: "AUS", name: "Austin",            lat: 30.267, lng: -97.743 },
  { code: "ELP", name: "El Paso",           lat: 31.760, lng: -106.487 },
  { code: "MCA", name: "McAllen",           lat: 26.203, lng: -98.230 },
  { code: "LBB", name: "Lubbock",           lat: 33.578, lng: -101.855 },
];

// ─── Helpers ─────────────────────────────────────────────────
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/**
 * Round all numbers in an SVG path string to `decimals` places.
 * Real geo paths have 12-digit floats; one or two decimals is
 * enough for our 600-pixel canvas and shrinks the output by ~70%.
 */
function roundPath(d, decimals = 1) {
  if (!d) return d;
  const factor = Math.pow(10, decimals);
  return d.replace(/-?\d+\.\d+/g, (n) => {
    return String(Math.round(parseFloat(n) * factor) / factor);
  });
}

/** Simplify a GeoJSON FeatureCollection by topology, keeping
 *  shared boundaries between neighbors. Returns a new
 *  FeatureCollection. `weight` is the Visvalingam threshold
 *  (smaller = less aggressive). */
function simplifyFC(fc, weight) {
  const topo = topology({ x: fc });
  const presimp = presimplify(topo);
  const simp = simplify(presimp, weight);
  const out = topoFeature(simp, simp.objects.x);
  return out;
}

/** Round all numbers in geometry coordinates so JSON serializes
 *  more compactly (and bundles smaller). Mutates in place. */
function roundCoords(geom, decimals = 4) {
  const f = Math.pow(10, decimals);
  const round = (n) => Math.round(n * f) / f;
  const walk = (a) => {
    if (typeof a[0] === "number") return [round(a[0]), round(a[1])];
    return a.map(walk);
  };
  geom.coordinates = walk(geom.coordinates);
}

/** Extract the largest outer ring from a (multi)polygon as a
 *  flat array of [x, y] pairs. Used for runtime point-in-polygon
 *  testing on the Texas outline. */
function extractLargestRing(geom) {
  const rings = geom.type === "Polygon"
    ? [geom.coordinates[0]]
    : geom.coordinates.map((poly) => poly[0]);
  rings.sort((a, b) => b.length - a.length);
  return rings[0];
}

/** Project a single feature's largest outer ring into pixel
 *  coords using the supplied projection. */
function projectRing(feature, projection) {
  const ring = extractLargestRing(feature.geometry);
  return ring
    .map((coord) => {
      const p = projection(coord);
      if (!p) return null;
      return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
    })
    .filter((p) => p !== null);
}

// ════════════════════════════════════════════════════════════════
// Load sources
// ════════════════════════════════════════════════════════════════
console.log("→ loading sources");
const usStatesTopo = readJson(path.join(ROOT, "node_modules/us-atlas/states-10m.json"));
const usCountiesTopo = readJson(path.join(ROOT, "node_modules/us-atlas/counties-10m.json"));
const txdotRaw = readJson(path.join(SOURCE, "txdot-districts.geojson"));

// Decode TopoJSON
const allStates = topoFeature(usStatesTopo, usStatesTopo.objects.states);
const allCounties = topoFeature(usCountiesTopo, usCountiesTopo.objects.counties);

// Filter to Texas
const texasFeature = allStates.features.find((f) => f.id === "48");
const texasCountyFeatures = allCounties.features.filter((f) =>
  String(f.id).startsWith("48"),
);

if (!texasFeature) throw new Error("Could not find Texas state feature (FIPS 48)");
console.log(`  texas counties: ${texasCountyFeatures.length}`);
console.log(`  txdot districts: ${txdotRaw.features.length}`);
console.log(`  us states: ${allStates.features.length}`);

// ════════════════════════════════════════════════════════════════
// Simplify TxDOT districts
// ════════════════════════════════════════════════════════════════
// us-atlas is already at 1:10m; TxDOT's raw geometry has ~13MB of
// vertices. At 600px viewBox width, sub-pixel detail is wasted —
// we're already losing it on render. Visvalingam weight 0.05
// drops vertex count by ~95% while keeping every visually-
// distinguishable bend (panhandle corners, El Paso wedge,
// Big Bend dip, gulf curve).
console.log("→ simplifying TxDOT districts");
const txdotSimplified = simplifyFC(txdotRaw, 0.05);

// ════════════════════════════════════════════════════════════════
// Texas-only Albers projection
// ════════════════════════════════════════════════════════════════
// Center on roughly the geographic center of Texas (~31°N, -100°E
// after rotation). Standard parallels at 27° and 35° give minimal
// distortion across the state. fitSize uses the state outline as
// the reference geometry so all derived layers share the same
// projection.
console.log("→ projecting Texas-only layers");
const txProjection = geoAlbers()
  .rotate([100, 0])
  .center([0, 31])
  .parallels([27, 35])
  .fitSize(TX_VIEWBOX, texasFeature);
const txPath = geoPath(txProjection);

const texasOutlinePath = roundPath(txPath(texasFeature), 1);
const texasOutlinePolygon = projectRing(texasFeature, txProjection);

const texasCountyPaths = texasCountyFeatures.map((f) => ({
  fips: String(f.id),
  name: f.properties.name,
  path: roundPath(txPath(f), 1),
}));

const txdotDistrictPaths = txdotSimplified.features
  .map((f) => {
    const c = txPath.centroid(f);
    return {
      id: f.properties.DIST_NBR,
      name: f.properties.DIST_NM,
      abbr: f.properties.DIST_ABRVN_NM,
      path: roundPath(txPath(f), 1),
      centroid: [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10],
    };
  })
  .sort((a, b) => a.id - b.id);

const txMetros = TX_METROS_LATLNG.map((m) => {
  const [x, y] = txProjection([m.lng, m.lat]);
  return {
    code: m.code,
    name: m.name,
    lat: m.lat,
    lng: m.lng,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
});

// ════════════════════════════════════════════════════════════════
// US-wide AlbersUsa (handles AK/HI insets natively)
// ════════════════════════════════════════════════════════════════
console.log("→ projecting US-wide layers");
const usProjection = geoAlbersUsa().fitSize(US_VIEWBOX, allStates);
const usPath = geoPath(usProjection);

const usStatePaths = allStates.features
  .map((f) => {
    const code = FIPS_TO_USPS[String(f.id).padStart(2, "0")];
    if (!code) return null;
    const c = usPath.centroid(f);
    return {
      code,
      name: f.properties.name,
      path: roundPath(usPath(f), 1),
      centroid: [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10],
    };
  })
  .filter((s) => s !== null)
  .sort((a, b) => a.code.localeCompare(b.code));

// ════════════════════════════════════════════════════════════════
// Emit TS modules
// ════════════════════════════════════════════════════════════════
const HEADER = `// Auto-generated by scripts/build-geo.mjs — do not edit by hand.
// Re-run \`npm run build:geo\` if upstream source data changes.
//
// Sources:
//   - us-atlas@3 (npm; TIGER/Line 1:10m simplified)
//   - data/source/txdot-districts.geojson (TxDOT Boundaries
//     MapServer, layer 0; simplified 0.005 Visvalingam weight)
//
// Coordinate system: SVG pixel space inside the indicated viewBox.
// Projection: d3-geoAlbers (Texas) / d3-geoAlbersUsa (US).
`;

console.log("→ writing TS modules");

// Texas main module — outline, districts, metros
const texasMain = `${HEADER}
export const TX_VIEWBOX = [${TX_VIEWBOX[0]}, ${TX_VIEWBOX[1]}] as const;

export interface TxdotDistrict {
  /** TxDOT-assigned 1-based district number (1–25). */
  id: number;
  /** Full district name (e.g. "Houston", "Childress"). */
  name: string;
  /** Three-letter abbreviation used by TxDOT (e.g. "HOU", "CHS"). */
  abbr: string;
  /** SVG path \`d\` attribute, in TX_VIEWBOX pixel space. */
  path: string;
  /** Pixel centroid \`[x, y]\` for badge / label placement. */
  centroid: readonly [number, number];
}

export interface TxMetro {
  code: string;
  name: string;
  lat: number;
  lng: number;
  /** Projected pixel coords inside TX_VIEWBOX. */
  x: number;
  y: number;
}

/** Texas state outline as a single SVG path \`d\` attribute. */
export const texasOutlinePath = ${JSON.stringify(texasOutlinePath)};

/** Texas state outline as a flat ring of \`[x, y]\` pixel pairs.
 *  Used at runtime by the hex-grid masker (point-in-polygon). */
export const texasOutlinePolygon: ReadonlyArray<readonly [number, number]> = ${JSON.stringify(texasOutlinePolygon)};

export const txdotDistricts: ReadonlyArray<TxdotDistrict> = ${JSON.stringify(txdotDistrictPaths)};

export const txMetros: ReadonlyArray<TxMetro> = ${JSON.stringify(txMetros)};
`;
fs.writeFileSync(path.join(OUT, "texas.ts"), texasMain);

// Texas counties — separate file due to size
const countiesOut = `${HEADER}
export interface TexasCounty {
  /** 5-digit FIPS code (state 48 + 3-digit county). */
  fips: string;
  name: string;
  path: string;
}

export const texasCounties: ReadonlyArray<TexasCounty> = ${JSON.stringify(texasCountyPaths)};
`;
fs.writeFileSync(path.join(OUT, "texas-counties.ts"), countiesOut);

// US states module
const usOut = `${HEADER}
export const US_VIEWBOX = [${US_VIEWBOX[0]}, ${US_VIEWBOX[1]}] as const;

export interface UsState {
  /** Two-letter USPS code. */
  code: string;
  name: string;
  /** SVG path \`d\` attribute, in US_VIEWBOX pixel space (AlbersUsa). */
  path: string;
  /** Pixel centroid \`[x, y]\` inside US_VIEWBOX. */
  centroid: readonly [number, number];
}

export const usStates: ReadonlyArray<UsState> = ${JSON.stringify(usStatePaths)};
`;
fs.writeFileSync(path.join(OUT, "us-states.ts"), usOut);

// ════════════════════════════════════════════════════════════════
// Stats
// ════════════════════════════════════════════════════════════════
function size(p) {
  return (fs.statSync(p).size / 1024).toFixed(1);
}
console.log("→ done");
console.log(`  texas.ts:          ${size(path.join(OUT, "texas.ts"))} KB`);
console.log(`  texas-counties.ts: ${size(path.join(OUT, "texas-counties.ts"))} KB`);
console.log(`  us-states.ts:      ${size(path.join(OUT, "us-states.ts"))} KB`);
