import puppeteer from 'puppeteer';
import path from 'node:path';

const outDir = '/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });

  console.log("Navigating to http://127.0.0.1:3030/components...");
  await page.goto('http://127.0.0.1:3030/components', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Catalog Grid View
  await page.screenshot({
    path: path.join(outDir, 'catalog_enhanced_grid.png'),
  });
  console.log("Saved catalog_enhanced_grid.png");

  // 2. Click Table View
  const tableBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Table'));
  });
  if (tableBtn && tableBtn.asElement()) {
    await tableBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(outDir, 'catalog_matrix_table.png'),
    });
    console.log("Saved catalog_matrix_table.png");
  }

  // 3. Click Previews View
  const previewBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Previews'));
  });
  if (previewBtn && previewBtn.asElement()) {
    await previewBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(outDir, 'catalog_micro_previews.png'),
    });
    console.log("Saved catalog_micro_previews.png");
  }

  // 4. Component Page: TuxAvatar with TuxPlayground and Multi-Framework Tabs
  console.log("Navigating to /components/avatar...");
  await page.goto('http://127.0.0.1:3030/components/avatar', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outDir, 'component_avatar_playground.png'),
  });
  console.log("Saved component_avatar_playground.png");

  // Click Swift Tab on the example
  const swiftTab = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'SWIFT');
  });
  if (swiftTab && swiftTab.asElement()) {
    await swiftTab.asElement().click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(outDir, 'component_avatar_swift_tab.png'),
    });
    console.log("Saved component_avatar_swift_tab.png");
  }

  // 5. Component Page: TuxStatus with TuxPlayground
  console.log("Navigating to /components/status...");
  await page.goto('http://127.0.0.1:3030/components/status', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outDir, 'component_status_playground.png'),
  });
  console.log("Saved component_status_playground.png");

  await browser.close();
  console.log("All screenshots captured successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
