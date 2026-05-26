import type {
  CommentAuthor,
  CommentThread,
} from "~/components/TuxCommentThread.vue";

// Sibling demo data per ADR-0011 — typed peer-review fixtures for the
// open-review section at the bottom of the paper page. The page can't
// hold `Record<string, CommentAuthor>` annotations directly (page
// macro-extractor breaks on TS-only `const` annotations).

export const reviewAuthors: Record<string, CommentAuthor> = {
  "rev-1":     { id: "rev-1",     name: "Reviewer 1",     affiliation: "Anonymous · TRR peer review" },
  "rev-2":     { id: "rev-2",     name: "Reviewer 2",     affiliation: "Anonymous · TRR peer review" },
  "ed-hassan": { id: "ed-hassan", name: "M. Hassan",      affiliation: "TTI · corresponding author" },
  "ed-chen":   { id: "ed-chen",   name: "R. Chen",        affiliation: "TTI · co-author" },
};

export const reviewMe: CommentAuthor = reviewAuthors["ed-hassan"] as CommentAuthor;

const daysAgo = (d: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * 24 * d).toISOString();

export const reviewThreads: CommentThread[] = [
  {
    id: "rev-t1",
    anchor: "Methods §2.3 · sample selection",
    status: "open",
    comments: [
      {
        id: "rev-c1",
        authorId: "rev-1",
        createdAt: daysAgo(9),
        body: "Strong design overall. One concern: the 36-month window straddles a construction-phase shift in 2024 on the I-35 corridor. A sensitivity analysis dropping those quarters would strengthen the persistence claim. @ed-hassan thoughts?",
      },
      {
        id: "rev-c2",
        authorId: "ed-hassan",
        createdAt: daysAgo(4),
        body: "We ran the analysis with and without 2024-Q2 through Q4. Headline coefficient moved <4%. We'll add a sensitivity-analysis footnote in the revised proofs.",
      },
    ],
  },
  {
    id: "rev-t2",
    anchor: "Discussion §4 · paragraph 2",
    status: "open",
    comments: [
      {
        id: "rev-c3",
        authorId: "rev-2",
        createdAt: daysAgo(7),
        body: "The cost-effectiveness extrapolation in para 2 is reasonable but feels under-cited — Hauer (2015) and the FHWA H-SIP framework both bear directly. Suggest one sentence + 2 cites.",
      },
    ],
  },
  {
    id: "rev-t3",
    anchor: "Abstract · plain-language summary",
    status: "resolved",
    resolvedBy: "ed-chen",
    resolvedAt: daysAgo(2),
    comments: [
      {
        id: "rev-c4",
        authorId: "rev-1",
        createdAt: daysAgo(8),
        body: "Reading grade is 14.2 — TRR's editorial target is closer to 10 for the plain-language summary block.",
      },
      {
        id: "rev-c5",
        authorId: "ed-chen",
        createdAt: daysAgo(3),
        body: "Rewrote — lands at 9.7 now. Should be in the next proofs revision.",
      },
    ],
  },
];
