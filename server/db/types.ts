export const PAGE_STATUSES = [
  "draft",
  "in_review",
  "changes_requested",
  "approved",
  "published",
] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

export const VISIBILITIES = ["public", "internal", "private"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const MEDIA_KINDS = ["image", "gif", "video"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const FEEDBACK_REASONS = [
  "outdated",
  "wrong",
  "missing",
  "hard_to_follow",
  "not_for_me",
  "other",
] as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number];

export const ISSUE_KINDS = ["feedback", "staleness", "review"] as const;
export type IssueKind = (typeof ISSUE_KINDS)[number];

export const ISSUE_STATUSES = ["open", "resolved"] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export function assertNever(value: never, label: string): never {
  throw new Error(`Unhandled ${label}: ${String(value)}`);
}
