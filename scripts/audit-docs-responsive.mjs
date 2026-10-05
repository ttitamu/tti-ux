import puppeteer from "puppeteer";

const routes = [
  "/docs",
  "/getting-started",
  "/install",
  "/install/react",
  "/install/wordpress",
  "/install/dotnet",
  "/install/power-bi",
  "/install/nuxt-studio",
];

const viewports = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
];

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("Auditing docs & install routes across viewports...");
  let hasFailures = false;

  for (const route of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });

      try {
        await page.goto(`http://localhost:3030${route}`, { waitUntil: "networkidle0", timeout: 15000 });
        
        // Wait briefly for hydration
        await new Promise((r) => setTimeout(r, 200));

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const overflow = scrollWidth - clientWidth;

        if (overflow > 0) {
          console.error(`❌ FAIL: ${route} at ${vp.width}px has ${overflow}px overflow! (scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth})`);
          hasFailures = true;
        } else {
          console.log(`✅ PASS: ${route} at ${vp.width}px (0px overflow)`);
        }
      } catch (err) {
        console.error(`⚠️ ERROR on ${route} at ${vp.width}px:`, err.message);
        hasFailures = true;
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  if (hasFailures) {
    console.error("\nSome routes failed responsive audit!");
    process.exit(1);
  } else {
    console.log("\nAll tested routes passed responsive audit with 0px overflow!");
  }
}

run();
