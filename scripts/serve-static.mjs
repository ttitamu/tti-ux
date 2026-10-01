#!/usr/bin/env node
/**
 * scripts/serve-static.mjs — lightweight zero-dependency static server
 * for previewing prerendered .output/public on port 3030.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, ".output", "public");
const PORT = parseInt(process.env.PORT || "3030", 10);
const HOST = process.env.HOST || "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  // Support Nuxt Icon local API endpoint for offline/air-gapped previews
  if (urlPath.startsWith("/api/_nuxt_icon")) {
    try {
      const match = urlPath.match(/\/api\/_nuxt_icon\/([^/?]+)/);
      const collectionName = match ? match[1].replace(/\.json$/, "") : "";
      const searchParams = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams;
      const iconsParam = searchParams.get("icons") || "";
      const iconNames = iconsParam ? iconsParam.split(",") : [];

      const iconPkgPath = path.join(ROOT, "node_modules", "@iconify-json", collectionName || "lucide", "icons.json");
      if (fs.existsSync(iconPkgPath)) {
        const collectionData = JSON.parse(fs.readFileSync(iconPkgPath, "utf8"));
        const iconsSubset = {};
        for (const name of iconNames) {
          if (collectionData.icons && collectionData.icons[name]) {
            iconsSubset[name] = collectionData.icons[name];
          } else if (collectionData.aliases && collectionData.aliases[name]) {
            iconsSubset[name] = collectionData.aliases[name];
          }
        }
        const responseData = {
          prefix: collectionName || "lucide",
          icons: Object.keys(iconsSubset).length ? iconsSubset : collectionData.icons,
          width: collectionData.width,
          height: collectionData.height,
        };
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=604800, immutable",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify(responseData));
        return;
      }
    } catch (err) {
      console.error("Error serving local icon API:", err);
    }
  }

  let filePath = path.join(PUBLIC_DIR, urlPath);

  // If path is a directory or has no extension, look for index.html or .html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    } else if (fs.existsSync(path.join(filePath, "index.html"))) {
      filePath = path.join(filePath, "index.html");
    } else {
      filePath = path.join(PUBLIC_DIR, "200.html");
    }
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Static server listening on http://${HOST}:${PORT} (serving ${PUBLIC_DIR})`);
});
