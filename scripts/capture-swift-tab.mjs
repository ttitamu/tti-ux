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

  await page.goto('http://127.0.0.1:3030/components/avatar', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  // Find the button with text containing SWIFT
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const swiftBtn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'swift');
    if (swiftBtn) {
      swiftBtn.click();
      return true;
    }
    return false;
  });

  console.log("Clicked swift tab:", clicked);
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(outDir, 'component_avatar_swift_tab.png'),
  });
  console.log("Saved component_avatar_swift_tab.png");

  await browser.close();
}

main().catch(console.error);
