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

  console.log("Navigating to http://127.0.0.1:3030/visualizations/echarts ...");
  await page.goto('http://127.0.0.1:3030/visualizations/echarts', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));

  // Hide sticky header/navigation so it never obscures cards during scroll/capture
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
  });

  const spatialSection = await page.$('section[aria-labelledby="geographic-intelligence-heading"]');

  // 1. Click "Gulf Maritime Ports"
  console.log("Capturing Gulf Maritime Ports...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Gulf Maritime Ports'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_gulf_maritime_ports.png') });
    console.log('Captured live_echarts_gulf_maritime_ports.png');
  }

  // 2. Click "Border Gateways (POE)"
  console.log("Capturing Border Gateways...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Border Gateways'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_border_gateways.png') });
    console.log('Captured live_echarts_border_gateways.png');
  }

  // 3. Click "Triangle Flow Vectors"
  console.log("Capturing Triangle Flow Vectors...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('section[aria-labelledby="geographic-intelligence-heading"] button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Triangle Flow Vectors'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_triangle_flow_vectors.png') });
    console.log('Captured live_echarts_triangle_flow_vectors.png');
  }

  // Helper to find article by title text
  const getArticle = async (textSnippet) => {
    return await page.evaluateHandle((text) => {
      const articles = Array.from(document.querySelectorAll('article'));
      return articles.find(a => a.textContent && a.textContent.includes(text));
    }, textSnippet);
  };

  // 4. Click "UTP Allocation" in Morph Lab
  console.log("Capturing UTP Allocation Morph...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('UTP Allocation'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  const morphCard = await getArticle('Universal Morph & Aggregation Transition Lab');
  if (morphCard.asElement()) {
    await morphCard.asElement().screenshot({ path: path.join(outDir, 'live_echarts_utp_statewide_morph.png') });
    console.log('Captured live_echarts_utp_statewide_morph.png');
  }

  // 5. Drilldown to Megaprojects
  console.log("Capturing UTP Megaprojects Drilldown...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Drill Down to Megaprojects'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  if (morphCard.asElement()) {
    await morphCard.asElement().screenshot({ path: path.join(outDir, 'live_echarts_utp_megaprojects_drilldown.png') });
    console.log('Captured live_echarts_utp_megaprojects_drilldown.png');
  }

  // 6. Click "Lane Blockage (8 MPH)" in Shockwave Arena
  console.log("Capturing Shockwave Arena with Severe Lane Blockage...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Lane Blockage (8 MPH)'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const shockwaveCard = await getArticle('I-35 Corridor Vehicle Trajectory Time-Space Simulation');
  if (shockwaveCard.asElement()) {
    await shockwaveCard.asElement().screenshot({ path: path.join(outDir, 'live_echarts_timespace_shockwave_simulator.png') });
    console.log('Captured live_echarts_timespace_shockwave_simulator.png');
  }

  // 7. Dark Mode Coherence Check
  console.log("Capturing Dark Mode Spatial Command Center...");
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'tti-dark');
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 2000));
  if (spatialSection) {
    await spatialSection.screenshot({ path: path.join(outDir, 'live_echarts_maritime_dark_mode.png') });
    console.log('Captured live_echarts_maritime_dark_mode.png');
  }

  await browser.close();
  console.log('All targeted captures completed successfully.');
}

capture().catch(err => {
  console.error('Targeted screenshot capture error:', err);
  process.exit(1);
});
