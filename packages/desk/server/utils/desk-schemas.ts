/**
 * server/utils/desk-schemas.ts — Zod validation schemas for TUX Desk API endpoints.
 *
 * Enforces strict type boundaries, enum restrictions, and payload size limits (S2).
 */

import { createError } from "h3";
import { z } from "zod";

export const createPageSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]+$/, "Slug can only contain lowercase letters, numbers, hyphens, and underscores")
    .max(100, "Slug must be at most 100 characters")
    .optional(),
  bodyMd: z
    .string()
    .max(500_000, "Markdown body exceeds maximum allowed size (500KB)")
    .optional(),
  bodyJson: z.record(z.string(), z.unknown()).optional(),
  reviewCadenceDays: z.number().int().min(1).max(365).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  visibility: z.enum(["public", "internal", "restricted"]).optional(),
});

export const updatePageSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]+$/, "Slug can only contain lowercase letters, numbers, hyphens, and underscores")
    .max(100)
    .optional(),
  bodyMd: z
    .string()
    .max(500_000, "Markdown body exceeds maximum allowed size (500KB)")
    .optional(),
  bodyJson: z.record(z.string(), z.unknown()).optional(),
  reviewCadenceDays: z.number().int().min(1).max(365).optional(),
});

export const feedbackSchema = z.object({
  pageId: z.string().trim().min(1).max(128).default("general"),
  vote: z.enum(["up", "down"]).default("up"),
  reason: z
    .enum(["outdated", "wrong", "missing", "hard_to_follow", "not_for_me", "other"])
    .optional(),
  note: z.string().trim().max(2000, "Feedback note must be at most 2000 characters").optional(),
  sessionId: z.string().trim().max(128).default("anonymous"),
});

export const createMediaSchema = z.object({
  filename: z
    .string({ required_error: "filename is required" })
    .trim()
    .min(1, "filename is required")
    .max(255, "filename must be at most 255 characters")
    .refine((name) => !name.includes("..") && !name.includes("/") && !name.includes("\\"), {
      message: "Filename cannot contain directory traversal characters",
    }),
  mime: z
    .string({ required_error: "mime is required" })
    .trim()
    .min(1, "mime is required")
    .max(100, "mime must be at most 100 characters")
    .regex(/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i, "Invalid MIME format"),
  bytes: z
    .number({ required_error: "bytes is required" })
    .int()
    .nonnegative("bytes cannot be negative")
    .max(104_857_600, "Media asset exceeds 100MB limit"),
  kind: z.enum(["image", "document", "video", "audio"], {
    required_error: "kind is required",
    invalid_type_error: "kind must be one of: image, document, video, audio",
  }),
});

export const resolveIssueSchema = z.object({
  note: z.string().trim().max(2000, "Resolution note must be at most 2000 characters").optional(),
});

export const forgejoAuthSchema = z.object({
  action: z.enum(["signin", "signout"]).default("signin"),
  token: z.string().trim().max(256, "Token exceeds maximum length").optional(),
});

export const forgejoSubmissionSchema = z.object({
  kind: z.enum(["bug", "idea"], {
    required_error: "Submission kind (bug or idea) is required",
  }),
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  summary: z
    .string({ required_error: "Summary is required" })
    .trim()
    .min(10, "Summary must be at least 10 characters")
    .max(4000, "Summary must be at most 4000 characters"),
  componentOrRoute: z.string().trim().max(160).optional(),
  category: z.string().trim().max(80).optional(),
  details: z.string().trim().max(4000).optional(),
});

export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw createError({
      statusCode: 400,
      statusMessage: firstIssue ? `${firstIssue.path.join(".") || "body"}: ${firstIssue.message}` : "Validation failed",
    });
  }
  return result.data;
}
