import { readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP_DIRS = new Set([
  "node_modules",
  ".nuxt",
  ".output",
  ".data",
  ".git",
  ".github",
  "app",
  "public",
  "dist",
  "coverage",
  "packages",
  "templates",
  "reference",
]);

/**
 * Recursively walks a directory discovering all Markdown (.md) files
 * and returns their corresponding URL route paths.
 */
export function markdownRoutes(root: string, subDir = ""): string[] {
  const targetDir = subDir ? join(root, subDir) : root;
  if (!existsSync(targetDir)) return [];

  const routes: string[] = [];

  function walk(dir: string): void {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (SKIP_DIRS.has(entry.name)) continue;

      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!entry.name.endsWith(".md")) continue;

      const rel = relative(root, full).replaceAll("\\", "/");

      // Root special docs
      if (rel.toLowerCase() === "changelog.md") {
        routes.push("/changelog");
        continue;
      }
      if (rel.toLowerCase() === "readme.md") {
        continue;
      }

      // Clean route
      const cleanPath = rel.replace(/\.md$/i, "");
      // docs/adr/README.md -> /docs/adr
      if (cleanPath.endsWith("/README")) {
        routes.push(`/${cleanPath.replace(/\/README$/i, "")}`);
      } else {
        routes.push(`/${cleanPath}`);
      }
    }
  }

  walk(targetDir);
  return routes.sort();
}

/**
 * Returns all design documentation routes (/design/*).
 */
export function designRoutes(root: string): string[] {
  const dir = join(root, "design");
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => `/design/${f.replace(/\.md$/, "")}`)
    .sort();
}

/**
 * Returns all architectural & guide doc routes (/docs/*).
 */
export function docsRoutes(root: string): string[] {
  const dir = join(root, "docs");
  if (!existsSync(dir)) return [];

  return markdownRoutes(root, "docs");
}
