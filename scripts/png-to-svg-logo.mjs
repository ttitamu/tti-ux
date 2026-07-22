/**
 * Convert the Copilot-made tuxedo PNGs into clean vector SVGs via potrace.
 *
 * One-off regeneration utility — the produced SVGs (`public/logo.svg`,
 * `public/logo-dark.svg`) are committed to the repo, so the design system
 * ships without any tracing dependency. `potrace` and `jimp` are NOT in
 * `devDependencies` because their transitive `phin@2.x` chain carries
 * a perpetual moderate-severity vuln (sensitive headers leak across
 * redirects) — a problem we don't trigger here (we only read local
 * files), but not worth carrying for a script that runs once per logo
 * refresh.
 *
 * To regenerate after the source PNGs change:
 *
 *   npm install --no-save potrace jimp@0.16
 *   node scripts/png-to-svg-logo.mjs
 *
 * Then commit the resulting SVGs and `git checkout package*.json` to
 * drop the temporary deps.
 *
 * Why this exists: the source PNGs are 1024×1024 RGBA (~1–2MB combined),
 * rendered at w-8 h-8 in the header. Vector tracing gets each down to
 * ~50KB with zero quality loss because the sources are flat 2-color with
 * transparent backgrounds — potrace recovers every curve exactly.
 *
 * Why alpha-tracing (not RGB luminance):
 * The PNGs have TRANSPARENT backgrounds, not black. Pixel sample at a
 * "black" region shows `{ r:0, g:0, b:0, a:0 }` — alpha zero. Tracing by
 * luminance on an RGBA image requires a compositing background choice
 * which biases every threshold decision. Instead, we build an intermediate
 * grayscale bitmap straight from the alpha channel — opaque pixels become
 * black (below potrace's threshold, traced as filled), transparent pixels
 * become white (skipped). Zero ambiguity.
 *
 * Output: SVGs with transparent backgrounds so the logo blends with the
 * page (no more black square framing it).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

let potrace, Jimp;
try {
  potrace = (await import("potrace")).default;
  Jimp = require("jimp");
} catch {
  console.error(
    "✗ Missing tracer deps. potrace + jimp are not in devDependencies\n" +
    "  by default (transitive phin vuln chain). Install temporarily:\n\n" +
    "    npm install --no-save potrace jimp@0.16\n\n" +
    "  Then re-run, commit the resulting SVGs, and:\n\n" +
    "    git checkout package.json package-lock.json\n",
  );
  process.exit(1);
}

const JOBS = [
  {
    input: "reference/logo-source/logo.png",
    output: "public/logo.svg",
    fill: "#5C0025",
    label: "light-mode (maroon)",
  },
  {
    input: "reference/logo-source/logo-dark.png",
    output: "public/logo-dark.svg",
    fill: "#FFFFFF",
    label: "dark-mode (white)",
  },
];

const POTRACE_OPTS = {
  threshold: 128,      // binary mask is pure black/white — exact midpoint
  turdSize: 2,         // kill tiny noise specks
  alphaMax: 0.4,       // preserve sharp lapel corners (default 1.0 rounds them)
  optCurve: true,
  optTolerance: 0.2,
  color: "auto",
};

async function alphaToBinaryBuffer(pngPath) {
  // Read the source, then overwrite each pixel's RGB with black (if that
  // pixel is opaque) or white (if transparent). Alpha gets forced to 255
  // so the final image is fully opaque B/W — potrace traces the black.
  const img = await Jimp.read(pngPath);
  const data = img.bitmap.data;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    const v = a >= 128 ? 0 : 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  return await new Promise((ok, fail) => {
    img.getBuffer("image/png", (err, buf) => {
      if (err) fail(err);
      else ok(buf);
    });
  });
}

for (const job of JOBS) {
  const inputPath = resolve(process.cwd(), job.input);
  const outputPath = resolve(process.cwd(), job.output);

  const binaryBuffer = await alphaToBinaryBuffer(inputPath);

  const svgRaw = await new Promise((ok, fail) => {
    potrace.trace(binaryBuffer, POTRACE_OPTS, (err, svg) => {
      if (err) fail(err);
      else ok(svg);
    });
  });

  const pathMatch = svgRaw.match(/<path[^>]*d="([^"]+)"/);
  if (!pathMatch || !pathMatch[1]) {
    console.error(`  FAIL ${job.label}: empty trace — check input file`);
    process.exit(1);
  }
  const pathData = pathMatch[1];

  const dimMatch = svgRaw.match(/width="(\d+)"\s+height="(\d+)"/);
  const width = dimMatch ? Number(dimMatch[1]) : 1024;
  const height = dimMatch ? Number(dimMatch[2]) : 1024;

  // Transparent-background SVG — the source PNG has transparent bg, and
  // the Tux mark reads cleaner floating on the header than boxed in a
  // black square. Use `currentColor` so theme CSS can override fill if
  // wanted; default to the brand fill.
  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!--`,
    `  tti-ux mark (${job.label}) — vector-traced from ${job.input} via potrace.`,
    `  Regenerate: node scripts/png-to-svg-logo.mjs`,
    `-->`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="tti-ux">`,
    `  <title>tti-ux</title>`,
    `  <path d="${pathData}" fill="${job.fill}"/>`,
    `</svg>`,
    "",
  ].join("\n");

  writeFileSync(outputPath, svg);
  const inSize = (readFileSync(inputPath).length / 1024).toFixed(1);
  const outSize = (Buffer.byteLength(svg) / 1024).toFixed(1);
  console.log(`ok   ${job.label}  ${inSize}KB → ${outSize}KB  (${outputPath})`);
}
