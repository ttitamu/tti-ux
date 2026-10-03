import puppeteer from 'puppeteer';
import path from 'node:path';

const outDir = '/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 2 });

  console.log("Navigating to http://127.0.0.1:3030/ ...");
  await page.goto('http://127.0.0.1:3030/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const roadway = await page.$('.tux-roadway-cross-section');
  if (roadway) {
    await roadway.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));

    // Capture Iso 3D (default or clicked)
    console.log("Capturing Iso 3D...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.tux-roadway__angle-btn'));
      const isoBtn = btns.find(b => b.textContent && b.textContent.includes('Iso 3D'));
      if (isoBtn) isoBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await roadway.screenshot({ path: path.join(outDir, 'live_roadway_current_iso.png') });
    console.log('Saved live_roadway_current_iso.png');
  } else {
    console.error('Could not find .tux-roadway-cross-section element!');
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
