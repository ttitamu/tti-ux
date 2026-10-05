import puppeteer from 'puppeteer';
import path from 'node:path';

const outDir = '/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });

  console.log("Navigating to http://127.0.0.1:3030/ ...");
  await page.goto('http://127.0.0.1:3030/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Hero Stage (Light Mode)
  console.log("1. Capturing Hero Stage...");
  const hero = await page.$('.tux-home-hero');
  if (hero) {
    await hero.screenshot({ path: path.join(outDir, 'home_hero_enhanced_light.png') });
    console.log("Saved home_hero_enhanced_light.png");
  }

  // 2. Multi-Target Ecosystem Section
  console.log("2. Capturing Multi-Target Ecosystem Section...");
  const ecosystemSection = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent && h.textContent.includes('Institutional Ecosystem'));
    if (target && target.closest('section')) {
      target.closest('section').scrollIntoView();
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'home_ecosystem_grid.png') });
  console.log("Saved home_ecosystem_grid.png");

  // 3. High-Contrast Mode Toggle Test
  console.log("3. Testing High-Contrast Mode toggle...");
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const hcBtn = btns.find(b => b.textContent && b.textContent.includes('High-Contrast AAA'));
    if (hcBtn) hcBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  if (hero) {
    await hero.screenshot({ path: path.join(outDir, 'home_hero_high_contrast.png') });
    console.log("Saved home_hero_high_contrast.png");
  }

  await browser.close();
  console.log("Capture completed successfully!");
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
