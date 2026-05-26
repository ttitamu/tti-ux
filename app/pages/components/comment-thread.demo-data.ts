import type {
  CommentAuthor,
  CommentThread,
} from "~/components/TuxCommentThread.vue";

// Sibling demo data per ADR-0011 — pages re-parse via a JS-only Babel
// pass that breaks on explicit `const` type annotations and non-null
// assertions. Keeping typed fixtures here lets the showcase page stay
// pure JS while consumers (and vue-tsc) still get the full Comment*
// shapes.

export const authors: Record<string, CommentAuthor> = {
  "u-amelia":  { id: "u-amelia",  name: "Amelia Reyes",   affiliation: "TTI · Mobility" },
  "u-darius":  { id: "u-darius",  name: "Darius Patel",   affiliation: "TTI · Safety" },
  "u-mariana": { id: "u-mariana", name: "Mariana Vega",   affiliation: "TTI · Roadways" },
  "u-jordan":  { id: "u-jordan",  name: "Jordan Kim",     affiliation: "TTI · MovementLab" },
  "u-me":      { id: "u-me",      name: "You",            affiliation: "TTI · Editorial" },
};

export const me: CommentAuthor = authors["u-me"] as CommentAuthor;

const hoursAgo = (h: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * h).toISOString();
const minutesAgo = (m: number) =>
  new Date(Date.now() - 1000 * 60 * m).toISOString();

export const initialThreads: CommentThread[] = [
  {
    id: "t1",
    anchor: "Methods §2 · sample selection",
    status: "open",
    comments: [
      {
        id: "c1",
        authorId: "u-amelia",
        createdAt: hoursAgo(26),
        body: "The 36-month follow-up window covers the construction-phase shift in 2024 — should we add a sensitivity analysis that excludes those quarters? @darius what did the safety team end up doing for the I-35 paper?",
      },
      {
        id: "c2",
        authorId: "u-darius",
        createdAt: hoursAgo(18),
        body: "We ran it both ways and the headline coefficient was within 4%. Worth a footnote either way; I can pull the numbers if you want them.",
      },
      {
        id: "c3",
        authorId: "u-me",
        createdAt: minutesAgo(12),
        body: "Footnote sounds right. @amelia can you draft 2-3 sentences and I'll fold it into the proofs pass?",
      },
    ],
  },
  {
    id: "t2",
    anchor: "Figure 3",
    status: "open",
    comments: [
      {
        id: "c4",
        authorId: "u-mariana",
        createdAt: hoursAgo(6),
        body: "The y-axis label is cut off in the print PDF — confirmed on letter + a4. Easy fix.",
      },
    ],
  },
  {
    id: "t3",
    anchor: "Abstract · plain-language summary",
    status: "resolved",
    resolvedBy: "u-jordan",
    resolvedAt: hoursAgo(48),
    comments: [
      {
        id: "c5",
        authorId: "u-jordan",
        createdAt: hoursAgo(72),
        body: "Reading-grade is 14.2 on the current draft — target was 10. I rewrote para 2; lmk what you think.",
      },
      {
        id: "c6",
        authorId: "u-amelia",
        createdAt: hoursAgo(50),
        body: "Lands at 9.8 now. Shipping.",
      },
    ],
  },
];
