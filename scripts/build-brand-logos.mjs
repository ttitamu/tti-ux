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
 * Also includes dual-mode contoured keyline variants engineered specifically
 * for M365 Copilot Chat, which renders the same logo across light and dark modes.
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

function generateKeylineBuffer(data, width, height, radius = 1.8, feather = 0.8) {
  const outlineData = Buffer.alloc(width * height * 4);
  const rCeil = Math.ceil(radius);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxA = 0;
      for (let dy = -rCeil; dy <= rCeil; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -rCeil; dx <= rCeil; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > radius) continue;
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const a = data[(ny * width + nx) * 4 + 3];
          const falloff = d > radius - feather ? (radius - d) / feather : 1;
          const effA = a * Math.max(0, Math.min(1, falloff));
          if (effA > maxA) maxA = effA;
        }
      }
      const idx = (y * width + x) * 4;
      outlineData[idx] = 255;
      outlineData[idx + 1] = 255;
      outlineData[idx + 2] = 255;
      outlineData[idx + 3] = Math.round(maxA);
    }
  }

  const compositeData = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const baseA = data[idx + 3] / 255;
    const outA = outlineData[idx + 3] / 255;
    const finalA = baseA + outA * (1 - baseA);
    if (finalA > 0) {
      compositeData[idx + 3] = Math.round(finalA * 255);
      for (let c = 0; c < 3; c++) {
        const baseC = data[idx + c];
        const outC = outlineData[idx + c];
        const blended = (baseC * baseA + outC * outA * (1 - baseA)) / finalA;
        compositeData[idx + c] = Math.round(blended);
      }
    }
  }
  return compositeData;
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

  // 1. High-Resolution Masters archive & Vector SVG
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
    const gBuf = await sharp(item.input)
      .extract(item.crop)
      .resize({ width: GLYPH_WIDTH, kernel: "lanczos3" })
      .png({ palette: true, quality: 100, effort: 10, colours: 64 })
      .toBuffer();
    writeFileSync(join(OUT_DIR, item.name), gBuf);
    console.log(`✓ Generated ${item.name} — ${gBuf.length} bytes (${(gBuf.length / 1024).toFixed(2)} KB)`);

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

  // 4. Dual-Mode Keyline Variants (for M365 Copilot Chat & dual light/dark surfaces)
  const baseColorImg = sharp(join(OUT_DIR, "tti-logo-color.png"));
  const { data: baseData, info: baseInfo } = await baseColorImg.raw().toBuffer({ resolveWithObject: true });
  const keylineLockupData = generateKeylineBuffer(baseData, baseInfo.width, baseInfo.height, 1.8, 0.8);
  const keylineLockupBuf = await sharp(keylineLockupData, {
    raw: { width: baseInfo.width, height: baseInfo.height, channels: 4 },
  })
    .png({ palette: true, quality: 100, effort: 10, colours: 64 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, "tti-logo-keyline.png"), keylineLockupBuf);
  writeFileSync(join(OUT_DIR, "tti-logo-dual.png"), keylineLockupBuf);
  console.log(
    `✓ Generated tti-logo-keyline.png — ${keylineLockupBuf.length} bytes (${(keylineLockupBuf.length / 1024).toFixed(2)} KB)`
  );

  const sqColorImg = sharp(join(OUT_DIR, "tti-glyph-color-square.png"));
  const { data: sqData, info: sqInfo } = await sqColorImg.raw().toBuffer({ resolveWithObject: true });
  const keylineSqData = generateKeylineBuffer(sqData, sqInfo.width, sqInfo.height, 2.2, 1.0);
  const keylineSqBuf = await sharp(keylineSqData, {
    raw: { width: sqInfo.width, height: sqInfo.height, channels: 4 },
  })
    .png({ palette: true, quality: 100, effort: 10, colours: 64 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, "tti-glyph-keyline-square.png"), keylineSqBuf);
  console.log(
    `✓ Generated tti-glyph-keyline-square.png — ${keylineSqBuf.length} bytes (${(keylineSqBuf.length / 1024).toFixed(2)} KB)`
  );

  // Verification census
  console.log("\n--- Verification Census ---\n");
  const generatedFiles = readdirSync(OUT_DIR).filter((f) => f.endsWith(".png"));
  let allPass = true;
  for (const f of generatedFiles) {
    const s = statSync(join(OUT_DIR, f));
    const isUnder10KB = s.size < 10240;
    const isUnder10kDec = s.size < 10000;
    if (!isUnder10KB) allPass = false;
    console.log(
      `  ${f.padEnd(30)} : ${String(s.size).padStart(6)} bytes (${(s.size / 1024).toFixed(2)} KB) — ${
        isUnder10kDec ? "PASS (<10,000 B)" : isUnder10KB ? "PASS (<10,240 B)" : "FAIL (>10KB)"
      }`
    );
  }

  if (allPass) {
    console.log("\n✅ All assets passed strict < 10 KB requirement for Microsoft 365 Admin Center!\n");
  } else {
    console.error("\n❌ Some assets exceed 10 KB!\n");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Fatal error generating logos:", err);
  process.exit(1);
});
