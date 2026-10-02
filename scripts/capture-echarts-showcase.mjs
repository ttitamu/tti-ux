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

  await page.goto('http://127.0.0.1:3030/visualizations/echarts', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));

  const spatialSection = await page.$('section[aria-labelledby="geographic-intelligence-heading"]');
  const showcaseSection = await page.$('section[aria-labelledby="dynamic-animations-heading"]');

  // 1. Click "Triangle Flow Vectors"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const flowBtn = btns.find(b => b.textContent && b.textContent.includes('Triangle Flow Vectors'));
    if (flowBtn) flowBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_triangle_flow_vectors.png') });
    console.log('Captured live_echarts_triangle_flow_vectors.png');
  }

  // 2. Click "Texas 254 Counties"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const countyBtn = btns.find(b => b.textContent && b.textContent.includes('Texas 254 Counties'));
    if (countyBtn) countyBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_texas_counties_map.png') });
    console.log('Captured live_echarts_texas_counties_map.png');
  }

  // 3. Click "USA Albers National"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const albersBtn = btns.find(b => b.textContent && b.textContent.includes('USA Albers National'));
    if (albersBtn) albersBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_usa_albers_map.png') });
    console.log('Captured live_echarts_usa_albers_map.png');
  }

  // 4. Click "Bar" in the Universal Morph Lab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div[role="group"][aria-label="Morph chart style"] button'));
    const barBtn = btns.find(b => b.textContent && b.textContent.includes('Bar'));
    if (barBtn) barBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (showcaseSection) {
    await showcaseSection.screenshot({ path: path.join(outDir, 'live_echarts_morph_transition_bar.png') });
    console.log('Captured live_echarts_morph_transition_bar.png');
  }

  // 5. Dark Mode Coherence Check
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'tti-dark');
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_spatial_dark_mode.png') });
    console.log('Captured live_echarts_spatial_dark_mode.png');
  }

  await browser.close();
  console.log('Targeted captures completed successfully.');
}

capture().catch(err => {
  console.error('Targeted screenshot capture error:', err);
  process.exit(1);
});
