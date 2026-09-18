/**
 * scripts/build-brand-logos.mjs
 *
 * Generates production-ready, ultra-high-quality transparent PNGs of the
 * official Texas A&M Transportation Institute (TTI) brand logos.
 *
 * Designed specifically to comply with Microsoft 365 Admin Center strict
 * <= 10 KB file size ceiling (Organization profile -> Custom themes) while
 * maintaining 2.8x-5.6x Retina clarity for navbar display heights (24-48px).
 *
 * Output directory: public/resources/logos/
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = join(ROOT_DIR, "public");
const OUT_DIR = join(PUBLIC_DIR, "resources", "logos");
const HIRES_DIR = join(OUT_DIR, "hires");

// Aggie Maroon brand anchor
const AGGIE_MAROON = { r: 80, g: 0, b: 0 }; // #500000

// Target lockup width: 680px gives ~131px height (exact 5.18:1 ratio),
// yielding >2.7x Retina pixel density at 250px navbar width, while staying
// strictly between 7.5KB and 9.5KB with 64-color palette quantization.
const LOCKUP_WIDTH = 680;
const GLYPH_WIDTH = 512;
const SQUARE_SIZE = 512;

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(HIRES_DIR, { recursive: true });

async function createMaroonBuffer(sourceBlackPath) {
  const img = sharp(sourceBlackPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const maroonData = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    maroonData[i] = AGGIE_MAROON.r;
    maroonData[i + 1] = AGGIE_MAROON.g;
    maroonData[i + 2] = AGGIE_MAROON.b;
    maroonData[i + 3] = data[i + 3]; // Preserve exact alpha anti-aliasing
  }
  return { data: maroonData, info };
}

async function run() {
  console.log("=== Building TTI Brand Logo Assets (<10KB Transparent PNGs) ===\n");

  const colorSource = join(PUBLIC_DIR, "TTI-Color.png");
  const blackSource = join(PUBLIC_DIR, "TTI-black.png");
  const whiteSource = join(PUBLIC_DIR, "TTI_white.png");

  if (!existsSync(colorSource) || !existsSync(blackSource) || !existsSync(whiteSource)) {
    console.error("Missing source images in public/ directory.");
    process.exit(1);
  }

  // 1. High-Resolution Masters archive
  copyFileSync(colorSource, join(HIRES_DIR, "tti-logo-color-hires.png"));
  copyFileSync(blackSource, join(HIRES_DIR, "tti-logo-black-hires.png"));
  copyFileSync(whiteSource, join(HIRES_DIR, "tti-logo-white-hires.png"));
  if (existsSync(join(PUBLIC_DIR, "TTI-glyph.svg"))) {
    copyFileSync(join(PUBLIC_DIR, "TTI-glyph.svg"), join(OUT_DIR, "tti-glyph.svg"));
  }
  console.log("✓ Copied hires master PNGs and SVG to public/resources/logos/");

  // 2. Full Lockup PNGs (width=680, height=131)
  const lockupConfigs = [
    {
      name: "tti-logo-color.png",
      label: "Color (Aggie Maroon #500000 glyph + Black text)",
      input: colorSource,
    },
    {
      name: "tti-logo-black.png",
      label: "Monochrome Black (#000000)",
      input: blackSource,
    },
    {
      name: "tti-logo-white.png",
      label: "Monochrome White (#FFFFFF)",
      input: whiteSource,
    },
  ];

  for (const item of lockupConfigs) {
    const buf = await sharp(item.input)
      .resize({ width: LOCKUP_WIDTH, kernel: "lanczos3" })
      .png({ palette: true, quality: 100, effort: 10, colours: 64 })
      .toBuffer();
    const dest = join(OUT_DIR, item.name);
    writeFileSync(dest, buf);
    console.log(`✓ Generated ${item.name} — ${buf.length} bytes (${(buf.length / 1024).toFixed(2)} KB)`);
  }

  // Full Lockup - All Maroon variant (#500000)
  const maroonMaster = await createMaroonBuffer(blackSource);
  const maroonLockupBuf = await sharp(maroonMaster.data, {
    raw: { width: maroonMaster.info.width, height: maroonMaster.info.height, channels: 4 },
  })
    .resize({ width: LOCKUP_WIDTH, kernel: "lanczos3" })
    .png({ palette: true, quality: 100, effort: 10, colours: 64 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, "tti-logo-maroon.png"), maroonLockupBuf);
  console.log(
    `✓ Generated tti-logo-maroon.png — ${maroonLockupBuf.length} bytes (${(maroonLockupBuf.length / 1024).toFixed(2)} KB)`
  );

  // 3. Road Glyph Marks (Highway "A" standalone mark)
  const glyphCropConfigs = [
    {
      name: "tti-glyph-color.png",
      squareName: "tti-glyph-color-square.png",
      input: colorSource,
      crop: { left: 0, top: 0, width: 2320, height: 969 },
    },
    {
      name: "tti-glyph-black.png",
      squareName: "tti-glyph-black-square.png",
      input: blackSource,
      crop: { left: 0, top: 0, width: 2210, height: 924 },
    },
    {
      name: "tti-glyph-white.png",
      squareName: "tti-glyph-white-square.png",
      input: whiteSource,
      crop: { left: 0, top: 0, width: 2345, height: 979 },
    },
  ];

  for (const item of glyphCropConfigs) {
    // Rectangular mark
    const gBuf = await sharp(item.input)
      .extract(item.crop)
      .resize({ width: GLYPH_WIDTH, kernel: "lanczos3" })
      .png({ palette: true, quality: 100, effort: 10, colours: 64 })
      .toBuffer();
    writeFileSync(join(OUT_DIR, item.name), gBuf);
    console.log(`✓ Generated ${item.name} — ${gBuf.length} bytes (${(gBuf.length / 1024).toFixed(2)} KB)`);

    // Centered square (512x512) for avatars/favicons/app icons
    const sqBuf = await sharp(item.input)
      .extract(item.crop)
      .resize({
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: "lanczos3",
      })
      .png({ palette: true, quality: 100, effort: 10, colours: 64 })
      .toBuffer();
    writeFileSync(join(OUT_DIR, item.squareName), sqBuf);
    console.log(`✓ Generated ${item.squareName} — ${sqBuf.length} bytes (${(sqBuf.length / 1024).toFixed(2)} KB)`);
  }

  // Maroon glyph variants
  const maroonGlyphBuf = await sharp(maroonMaster.data, {
    raw: { width: maroonMaster.info.width, height: maroonMaster.info.height, channels: 4 },
  })
    .extract({ left: 0, top: 0, width: 2210, height: 924 })
    .resize({ width: GLYPH_WIDTH, kernel: "lanczos3" })
    .png({ palette: true, quality: 100, effort: 10, colours: 64 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, "tti-glyph-maroon.png"), maroonGlyphBuf);
  console.log(
    `✓ Generated tti-glyph-maroon.png — ${maroonGlyphBuf.length} bytes (${(maroonGlyphBuf.length / 1024).toFixed(2)} KB)`
  );

  const maroonSqBuf = await sharp(maroonMaster.data, {
    raw: { width: maroonMaster.info.width, height: maroonMaster.info.height, channels: 4 },
  })
    .extract({ left: 0, top: 0, width: 2210, height: 924 })
    .resize({
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .png({ palette: true, quality: 100, effort: 10, colours: 64 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, "tti-glyph-maroon-square.png"), maroonSqBuf);
  console.log(
    `✓ Generated tti-glyph-maroon-square.png — ${maroonSqBuf.length} bytes (${(maroonSqBuf.length / 1024).toFixed(2)} KB)`
  );

  // Verification census
  console.log("\n--- Verification Census ---");
  const generatedFiles = readdirSync(OUT_DIR).filter((f) => f.endsWith(".png"));
  let allPass = true;
  for (const f of generatedFiles) {
    const s = statSync(join(OUT_DIR, f));
    const isUnder10KB = s.size < 10240;
    const isUnder10kDec = s.size < 10000;
    if (!isUnder10KB) allPass = false;
    console.log(
      `  ${f.padEnd(28)} : ${String(s.size).padStart(6)} bytes (${(s.size / 1024).toFixed(2)} KB) — ${
        isUnder10kDec ? "PASS (<10,000 B)" : isUnder10KB ? "PASS (<10,240 B)" : "FAIL (>10KB)"
      }`
    );
  }

  if (allPass) {
    console.log("\n✅ All assets passed strict < 10 KB requirement for Microsoft 365 Admin Center!");
  } else {
    console.error("\n❌ Some assets exceed 10 KB!");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Fatal error generating logos:", err);
  process.exit(1);
});
