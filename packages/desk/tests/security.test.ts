import { describe, it, expect } from "vitest";
import {
  createPageSchema,
  updatePageSchema,
  createMediaSchema,
  feedbackSchema,
  parseOrThrow,
} from "../../server/utils/desk-schemas";
import { sanitizeDeskHtml } from "../../app/utils/desk/render";
import { extractActorFromEvent } from "../../server/utils/desk-service";
import type { H3Event } from "h3";

describe("TUX Desk Security Controls (P0)", () => {
  describe("S2: Request Payload Validation", () => {
    it("rejects empty titles and enforces title length limits on pages", () => {
      expect(() => parseOrThrow(createPageSchema, { title: "" })).toThrow(/Title is required/);
      expect(() => parseOrThrow(createPageSchema, { title: "a".repeat(256) })).toThrow(/Title must be at most 255/);
    });

    it("validates slug character set and length", () => {
      expect(() => parseOrThrow(createPageSchema, { title: "Test", slug: "Invalid Slug with Spaces!" })).toThrow(/Slug can only contain/);
      expect(() => parseOrThrow(createPageSchema, { title: "Test", slug: "valid-slug_123" })).not.toThrow();
    });

    it("rejects directory traversal in media filenames (S2)", () => {
      expect(() =>
        parseOrThrow(createMediaSchema, {
          filename: "../../etc/passwd",
          mime: "image/png",
          bytes: 1024,
          kind: "image",
        })
      ).toThrow(/Filename cannot contain directory traversal/);

      expect(() =>
        parseOrThrow(createMediaSchema, {
          filename: "valid-photo.png",
          mime: "image/png",
          bytes: 1024,
          kind: "image",
        })
      ).not.toThrow();
    });

    it("rejects invalid MIME types and media asset size > 100MB", () => {
      expect(() =>
        parseOrThrow(createMediaSchema, {
          filename: "test.png",
          mime: "invalid-mime-format",
          bytes: 1024,
          kind: "image",
        })
      ).toThrow(/Invalid MIME format/);

      expect(() =>
        parseOrThrow(createMediaSchema, {
          filename: "huge-file.iso",
          mime: "application/octet-stream",
          bytes: 150_000_000,
          kind: "document",
        })
      ).toThrow(/exceeds 100MB limit/);
    });

    it("validates feedback reason against allowed editorial enums", () => {
      expect(() =>
        parseOrThrow(feedbackSchema, {
          vote: "down",
          reason: "unsupported-reason-token" as any,
        })
      ).toThrow(/(Invalid enum value|Invalid option)/);

      expect(() =>
        parseOrThrow(feedbackSchema, {
          vote: "down",
          reason: "outdated",
          note: "Updated speed limit from 40 to 45 mph",
        })
      ).not.toThrow();
    });
  });

  describe("S3: HTML Sanitization & Iframe Sandboxing", () => {
    it("strips iframes pointing to unauthorized domains", () => {
      const maliciousHtml = '<iframe src="https://attacker.com/malicious.html"></iframe>';
      const clean = sanitizeDeskHtml(maliciousHtml);
      expect(clean).not.toContain("attacker.com");
      expect(clean).not.toContain("<iframe");
    });

    it("allows trusted YouTube and Vimeo embeds but locks down the allow permissions attribute", () => {
      const youtubeHtml = '<iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" allow="camera; microphone; geolocation"></iframe>';
      const clean = sanitizeDeskHtml(youtubeHtml);
      expect(clean).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      expect(clean).not.toContain("camera");
      expect(clean).not.toContain("geolocation");
      expect(clean).toContain('allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"');
    });

    it("strips script tags and inline event handlers from user-supplied HTML", () => {
      const xss = '<p>Normal text</p><script>alert("xss")</script><img src="x" onerror="alert(1)">';
      const clean = sanitizeDeskHtml(xss);
      expect(clean).not.toContain("<script");
      expect(clean).not.toContain("onerror");
      expect(clean).toContain("<p>Normal text</p>");
    });
  });

  describe("S1: Authentication and Actor Extraction", () => {
    it("extracts actor metadata from X-TTI-Actor and X-TTI-User-ID headers", () => {
      const mockEvent = {
        node: {
          req: {
            headers: {
              "x-tti-actor": "j-doe",
              "x-tti-user-id": "usr-12345",
              "x-tti-email": "j-doe@tti.tamu.edu",
            },
          },
        },
      } as unknown as H3Event;

      const actor = extractActorFromEvent(mockEvent);
      expect(actor).not.toBeNull();
      expect(actor?.userId).toBe("usr-12345");
      expect(actor?.login).toBe("j-doe");
      expect(actor?.email).toBe("j-doe@tti.tamu.edu");
    });
  });
});
