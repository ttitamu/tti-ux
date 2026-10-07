import puppeteer from 'puppeteer';
import path from 'node:path';

const outDir = '/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [
    { url: 'http://127.0.0.1:3030/', name: 'review_home_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/', name: 'review_home_laptop_1024', width: 1024, height: 768 },
    { url: 'http://127.0.0.1:3030/', name: 'review_home_mobile_375', width: 375, height: 812 },
    { url: 'http://127.0.0.1:3030/components', name: 'review_components_lab_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/components', name: 'review_components_lab_mobile_375', width: 375, height: 812 },
    { url: 'http://127.0.0.1:3030/design/tux', name: 'review_doctrine_tux_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/kits', name: 'review_kits_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/examples/corridor-analytics', name: 'review_corridor_3d_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/admin', name: 'review_admin_desk_desktop', width: 1440, height: 900 },
    { url: 'http://127.0.0.1:3030/desk', name: 'review_desk_builder_desktop', width: 1440, height: 900 },
  ];

  for (const t of targets) {
    console.log(`Capturing ${t.name} (${t.width}x${t.height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width: t.width, height: t.height, deviceScaleFactor: 1.5 });
    try {
      await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, `${t.name}.png`), fullPage: false });
      console.log(`Saved ${t.name}.png`);
    } catch (e) {
      console.error(`Failed ${t.name}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("Capture run complete!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
