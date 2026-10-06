import { assertNever } from "./types";

export const EMBED_KINDS = ["youtube", "vimeo", "image", "gif", "video", "unknown"] as const;
export type EmbedKind = (typeof EMBED_KINDS)[number];

export interface ParsedMedia {
  kind: EmbedKind;
  src: string;
  embedSrc?: string;
}

const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
const VIMEO = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i;
const IMAGE_EXT = /\.(png|jpe?g|webp|svg|avif)(\?|$)/i;
const GIF_EXT = /\.gif(\?|$)/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?|$)/i;

export function parseMediaUrl(raw: string): ParsedMedia {
  const url = raw.trim();
  if (!url) return { kind: "unknown", src: url };

  const youtube = YOUTUBE.exec(url);
  if (youtube?.[1]) {
    return {
      kind: "youtube",
      src: url,
      embedSrc: `https://www.youtube-nocookie.com/embed/${youtube[1]}`,
    };
  }

  const vimeo = VIMEO.exec(url);
  if (vimeo?.[1]) {
    return {
      kind: "vimeo",
      src: url,
      embedSrc: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }

  if (GIF_EXT.test(url)) return { kind: "gif", src: url };
  if (IMAGE_EXT.test(url)) return { kind: "image", src: url };
  if (VIDEO_EXT.test(url)) return { kind: "video", src: url };

  if (url.startsWith("/api/media/")) {
    return { kind: "unknown", src: url };
  }

  return { kind: "unknown", src: url };
}

export function isSafeHttpUrl(value: string): boolean {
  if (value.startsWith("/api/media/") || value.startsWith("/p/") || value.startsWith("/docs/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function embedKindLabel(kind: EmbedKind): string {
  switch (kind) {
    case "youtube": return "YouTube";
    case "vimeo": return "Vimeo";
    case "image": return "Image";
    case "gif": return "GIF";
    case "video": return "Video";
    case "unknown": return "Link";
    default: return assertNever(kind, "embed kind");
  }
}
