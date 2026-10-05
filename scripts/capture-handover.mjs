import puppeteer from "puppeteer";

const artifactDir = "/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816";

const captures = [
  { route: "/docs", name: "docs_hub_handover_1024", width: 1024, height: 900 },
  { route: "/docs/comm-handover", name: "comm_handover_1024", width: 1024, height: 950 },
  { route: "/docs/comm-handover", name: "comm_handover_375", width: 375, height: 812 },
  { route: "/kits", name: "kits_scaffolding_1024", width: 1024, height: 900 },
  { route: "/kits", name: "kits_scaffolding_375", width: 375, height: 812 },
];

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const item of captures) {
    const page = await browser.newPage();
    await page.setViewport({ width: item.width, height: item.height, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:3030${item.route}`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${artifactDir}/${item.name}.png`, fullPage: false });
    console.log(`Captured ${item.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log("All handover screenshots captured successfully!");
}

run();
