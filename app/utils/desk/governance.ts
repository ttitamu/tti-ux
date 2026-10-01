/**
 * Editorial Governance & Staleness Detection
 *
 * Adapted from emberloom-docs for TTI-UX.
 * Provides cadence calculation, staleness thresholds, and feedback triage rules.
 */

export type FeedbackReason =
  | "outdated"
  | "wrong"
  | "missing"
  | "hard_to_follow"
  | "not_for_me"
  | "other";

export interface FeedbackReasonOption {
  id: FeedbackReason;
  label: string;
  description: string;
}

export const FEEDBACK_REASONS: FeedbackReasonOption[] = [
  { id: "outdated", label: "Outdated", description: "Information is obsolete or no longer reflects current standards" },
  { id: "wrong", label: "Inaccurate", description: "Contains incorrect details, steps, or code syntax" },
  { id: "missing", label: "Missing steps", description: "Missing prerequisites, required steps, or examples" },
  { id: "hard_to_follow", label: "Hard to follow", description: "Confusing structure, difficult explanations, or unclear flow" },
  { id: "not_for_me", label: "Not what I needed", description: "Looking for a different topic, system, or scope" },
  { id: "other", label: "Other", description: "General improvement suggestion or observation" },
];

export interface StalenessInput {
  verifiedUntil?: Date | string | null;
  lastVerified?: Date | string | null;
  reviewCadenceDays?: number;
  now?: Date;
}

export function parseDate(val: Date | string | null | undefined): Date | null {
  if (!val) return null;
  const d = typeof val === "string" ? new Date(val) : val;
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Computes the effective verification expiry date from explicit verifiedUntil or
 * from lastVerified + reviewCadenceDays.
 */
export function calculateEffectiveVerifiedUntil(input: StalenessInput): Date | null {
  const verifiedUntil = parseDate(input.verifiedUntil);
  if (verifiedUntil) return verifiedUntil;

  const lastVerified = parseDate(input.lastVerified);
  if (lastVerified && input.reviewCadenceDays && input.reviewCadenceDays > 0) {
    return new Date(lastVerified.getTime() + input.reviewCadenceDays * 86_400_000);
  }

  return null;
}

/**
 * Determines whether a document's verification window has expired.
 */
export function isVerificationStale(
  input: StalenessInput | Date | string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!input) return false;
  if (input instanceof Date || typeof input === "string") {
    const d = parseDate(input);
    if (!d) return false;
    return d.getTime() < now.getTime();
  }

  const effective = calculateEffectiveVerifiedUntil(input);
  if (!effective) return false;
  const currentTime = input.now ? input.now.getTime() : now.getTime();
  return effective.getTime() < currentTime;
}

/**
 * Calculates how many full days a document is overdue for review.
 */
export function daysOverdue(
  verifiedUntil: Date | string | null | undefined,
  now: Date = new Date(),
): number {
  const d = parseDate(verifiedUntil);
  if (!d) return 0;
  const diff = now.getTime() - d.getTime();
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Triage rule from emberloom-docs: decides whether negative feedback warrants
 * opening an immediate editorial issue or should wait for batch accumulation.
 */
export function shouldOpenFeedbackIssue(input: {
  vote: "up" | "down";
  reason?: FeedbackReason | string;
  note?: string;
  recentDowns?: number;
}): boolean {
  if (input.vote === "up") return false;
  if (input.note && input.note.trim().length > 0) return true;
  if (input.reason && input.reason !== "other") return true;
  return (input.recentDowns ?? 0) >= 3;
}
