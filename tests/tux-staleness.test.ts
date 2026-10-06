import { describe, it, expect } from "vitest";
import {
  isVerificationStale,
  calculateEffectiveVerifiedUntil,
  daysOverdue,
  shouldOpenFeedbackIssue,
  FEEDBACK_REASONS,
} from "../app/utils/desk/governance";

describe("TuxStaleness & Editorial Governance", () => {
  const now = new Date("2026-09-18T12:00:00Z");

  it("returns false when verifiedUntil is in the future", () => {
    const verifiedUntil = new Date("2026-10-01T00:00:00Z");
    expect(isVerificationStale(verifiedUntil, now)).toBe(false);
  });

  it("returns true when verifiedUntil is in the past", () => {
    const verifiedUntil = new Date("2026-09-01T00:00:00Z");
    expect(isVerificationStale(verifiedUntil, now)).toBe(true);
  });

  it("returns false when verifiedUntil is null or empty", () => {
    expect(isVerificationStale(null, now)).toBe(false);
    expect(isVerificationStale(undefined, now)).toBe(false);
  });

  it("calculates verifiedUntil from lastVerified and reviewCadenceDays", () => {
    const input = {
      lastVerified: "2026-06-01T00:00:00Z",
      reviewCadenceDays: 90,
      now,
    };
    // 90 days from June 1 is roughly end of August, which is past Sept 18 -> stale!
    expect(isVerificationStale(input, now)).toBe(true);

    const freshInput = {
      lastVerified: "2026-09-01T00:00:00Z",
      reviewCadenceDays: 90,
      now,
    };
    // 90 days from Sept 1 is end of November -> fresh!
    expect(isVerificationStale(freshInput, now)).toBe(false);
  });

  it("prioritizes explicit verifiedUntil over cadence calculation", () => {
    const input = {
      verifiedUntil: "2026-12-31T00:00:00Z",
      lastVerified: "2025-01-01T00:00:00Z",
      reviewCadenceDays: 30, // would be expired if used
      now,
    };
    expect(isVerificationStale(input, now)).toBe(false);
  });

  it("calculates days overdue accurately", () => {
    const fiveDaysAgo = new Date("2026-09-13T12:00:00Z");
    expect(daysOverdue(fiveDaysAgo, now)).toBe(5);

    const tomorrow = new Date("2026-09-19T12:00:00Z");
    expect(daysOverdue(tomorrow, now)).toBe(0);
  });

  it("applies triage rules for feedback issues", () => {
    expect(shouldOpenFeedbackIssue({ vote: "up" })).toBe(false);
    expect(shouldOpenFeedbackIssue({ vote: "down", note: "Missing code sample" })).toBe(true);
    expect(shouldOpenFeedbackIssue({ vote: "down", reason: "outdated" })).toBe(true);
    expect(shouldOpenFeedbackIssue({ vote: "down", reason: "other", recentDowns: 1 })).toBe(false);
    expect(shouldOpenFeedbackIssue({ vote: "down", reason: "other", recentDowns: 3 })).toBe(true);
  });

  it("exports standard feedback reasons", () => {
    expect(FEEDBACK_REASONS.length).toBeGreaterThan(4);
    expect(FEEDBACK_REASONS.map(r => r.id)).toContain("outdated");
    expect(FEEDBACK_REASONS.map(r => r.id)).toContain("wrong");
  });
});
