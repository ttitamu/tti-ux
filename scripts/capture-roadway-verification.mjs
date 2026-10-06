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
  await new Promise(r => setTimeout(r, 1500));

  const roadway = await page.$('.tux-roadway-cross-section');
  if (!roadway) {
    console.error('Roadway element not found!');
    await browser.close();
    return;
  }

  await roadway.scrollIntoView();
  await new Promise(r => setTimeout(r, 600));

  // 1. Isometric View (Light mode)
  console.log("1. Setting Isometric View (48°)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tux-roadway__angle-btn'));
    const isoBtn = btns.find(b => b.textContent && b.textContent.includes('Iso 3D'));
    if (isoBtn) isoBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await roadway.screenshot({ path: path.join(outDir, 'roadway_3d_volumetric_iso_light.png') });
  console.log('Saved roadway_3d_volumetric_iso_light.png');

  // 2. Close-up on Embankment Ditch and Right Lanes
  console.log("2. Setting Zoom to 140% for Ditch & Vehicle Close-up...");
  await page.evaluate(() => {
    const slider = document.querySelector('#zoom-slider');
    if (slider) {
      slider.value = 1.35;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await roadway.screenshot({ path: path.join(outDir, 'roadway_3d_ditch_closeup_light.png') });
  console.log('Saved roadway_3d_ditch_closeup_light.png');

  // 3. Top-down view (0°)
  console.log("3. Setting Top-Down View (0°)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tux-roadway__angle-btn'));
    const topBtn = btns.find(b => b.textContent && b.textContent.includes('Top-Down'));
    if (topBtn) topBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await roadway.screenshot({ path: path.join(outDir, 'roadway_3d_volumetric_topdown_light.png') });
  console.log('Saved roadway_3d_volumetric_topdown_light.png');

  // 4. Driver View (68°)
  console.log("4. Setting Driver View (68°)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tux-roadway__angle-btn'));
    const driverBtn = btns.find(b => b.textContent && b.textContent.includes('Driver'));
    if (driverBtn) driverBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await roadway.screenshot({ path: path.join(outDir, 'roadway_3d_volumetric_driver_light.png') });
  console.log('Saved roadway_3d_volumetric_driver_light.png');

  // 5. Dark theme Iso View
  console.log("5. Switching to Dark Theme...");
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'tti-dark');
    document.documentElement.classList.add('dark');
    const btns = Array.from(document.querySelectorAll('.tux-roadway__angle-btn'));
    const isoBtn = btns.find(b => b.textContent && b.textContent.includes('Iso 3D'));
    if (isoBtn) isoBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await roadway.screenshot({ path: path.join(outDir, 'roadway_3d_volumetric_iso_dark.png') });
  console.log('Saved roadway_3d_volumetric_iso_dark.png');

  await browser.close();
  console.log('All verification captures complete!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
