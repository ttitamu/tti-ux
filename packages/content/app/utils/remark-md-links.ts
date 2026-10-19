import { existsSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

export interface MdNode {
  type?: string;
  url?: string;
  children?: MdNode[];
}

export interface RemarkFile {
  path?: string;
  history?: string[];
  data?: Record<string, unknown>;
}

export interface RemarkMdLinksOptions {
  rootDir?: string;
  currentPath?: string;
  repoUrl?: string;
}

const DEFAULT_REPO_URL = "https://github.com/ttitamu/tti-ux";

export function sourceFilePath(file: RemarkFile, rootDir: string, defaultPath?: string): string {
  const raw = file.path || file.history?.[0] || (typeof file.data?.file === "string" ? file.data.file : undefined);
  if (raw) {
    return isAbsolute(raw) ? raw : resolve(rootDir, raw);
  }
  if (defaultPath) {
    return isAbsolute(defaultPath) ? defaultPath : resolve(rootDir, defaultPath);
  }
  return join(rootDir, "README.md");
}

export function rewriteMarkdownHref(
  url: string,
  fromFile: string,
  rootDir: string,
  repoUrl = DEFAULT_REPO_URL,
): string {
  // Ignore external links, protocols, anchors, and data URLs.
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("#") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const hashIndex = url.indexOf("#");
  const pathPart = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);

  if (!pathPart.toLowerCase().endsWith(".md")) {
    return url;
  }

  const fromDir = dirname(fromFile);
  let resolved: string;

  if (pathPart.startsWith("/")) {
    resolved = resolve(rootDir, `.${pathPart}`);
  } else {
    resolved = resolve(fromDir, pathPart);
  }

  // If the file doesn't exist relative to fromDir, check common doc locations:
  // e.g., if link is "components.md" and fromDir wasn't specified (resolved to root),
  // check if design/components.md or docs/components.md exists.
  if (!existsSync(resolved)) {
    const candidateDesign = resolve(rootDir, "design", pathPart);
    const candidateDocs = resolve(rootDir, "docs", pathPart);
    if (existsSync(candidateDesign)) {
      resolved = candidateDesign;
    } else if (existsSync(candidateDocs)) {
      resolved = candidateDocs;
    }
  }

  const rel = relative(rootDir, resolved).replaceAll("\\", "/");

  // Check if file exists inside the repo
  if (existsSync(resolved) && !rel.startsWith("..")) {
    // Special route mappings for known root docs:
    if (rel.toLowerCase() === "changelog.md") {
      return `/changelog${hash}`;
    }
    if (rel.toLowerCase() === "readme.md") {
      return `/${hash}`;
    }

    // design/*.md -> /design/*
    if (rel.startsWith("design/")) {
      const stem = rel.slice("design/".length).replace(/\.md$/i, "");
      return `/design/${stem}${hash}`;
    }

    // docs/* -> /docs/*
    if (rel.startsWith("docs/")) {
      const stem = rel.slice("docs/".length).replace(/\.md$/i, "");
      // docs/adr/README.md -> /docs/adr
      if (stem.endsWith("/README") || stem === "README") {
        const base = stem.replace(/\/?README$/i, "");
        return `/docs${base ? `/${base}` : ""}${hash}`;
      }
      return `/docs/${stem}${hash}`;
    }

    // Default clean relative path
    const cleanRoute = rel.replace(/\.md$/i, "");
    return `/${cleanRoute}${hash}`;
  }

  // Fallback to GitHub repo blob for files outside or unmapped
  return `${repoUrl}/blob/main/${rel}${hash}`;
}

export function remarkMdLinks(options: RemarkMdLinksOptions = {}) {
  const rootDir = options.rootDir ?? process.cwd();
  const repoUrl = options.repoUrl ?? DEFAULT_REPO_URL;

  return (tree: MdNode, file: RemarkFile = {}) => {
    const fromFile = sourceFilePath(file, rootDir, options.currentPath);
    const walk = (node: MdNode): void => {
      if (node.type === "link" && typeof node.url === "string") {
        node.url = rewriteMarkdownHref(node.url, fromFile, rootDir, repoUrl);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export default remarkMdLinks;
