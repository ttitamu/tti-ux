import { assertNever, type MediaKind } from "./types";

export const ALLOWED_MEDIA_MIMES: Record<string, MediaKind> = {
  "image/png": "image",
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/gif": "gif",
  "image/webp": "image",
  "image/avif": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/ogg": "video",
};

export const MEDIA_ACCEPT = Object.keys(ALLOWED_MEDIA_MIMES).join(",");
export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;

export function mediaKindFromMime(mime: string): MediaKind | null {
  return ALLOWED_MEDIA_MIMES[mime] ?? null;
}

export function mediaKindLabel(kind: MediaKind): string {
  switch (kind) {
    case "image": return "Image";
    case "gif": return "GIF";
    case "video": return "Video";
    default: return assertNever(kind, "media kind");
  }
}
