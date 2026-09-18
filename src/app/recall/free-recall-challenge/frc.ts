import type { ProgressIndicatorValue } from "@/components/ProgressIndicator/ProgressIndicator";

/**
 * Free Recall Challenge's session content and state-machine helpers.
 *
 * The main 60s loop tracks two scalars end to end — `coverage` (a
 * ProgressIndicatorValue, bumped after every sent segment) and `xp` (a
 * running total) — plus a `start` timestamp (epoch ms, set once when the
 * student taps "Start" on Intro) that every route re-derives "seconds
 * remaining" from. There's no per-topic tracking during the main loop
 * itself (voice_recall_build_decisions.md describes it as one continuous
 * free-recall stream, segmented only by Send/Redo) — see this file's
 * `deriveMissedAspects` for how the Summary screen turns a single coverage
 * scalar into named things-to-revise, a decision this file discloses since
 * SPEC.md's 9e→9f handoff doesn't specify one.
 */

export type CoverageValue = ProgressIndicatorValue;

export const TOTAL_SECONDS = 60;

// Fixed, not randomized — per voice_recall_build_decisions.md this is a
// deliberate design choice ("XP counts up during the session"), not a mock
// coin-flip like the pass/hint/reveal outcomes are. 10 matches Concept
// Questions' "first try" XP value, invented here for the same reason theirs
// was: no number is specified anywhere in SPEC.md for FRC's per-segment XP.
export const XP_PER_SEGMENT = 10;

const COVERAGE_STEPS: CoverageValue[] = ["0", "25", "50", "75", "100"];

// Soft-weighted forward-step odds, keyed by current coverage's index in
// COVERAGE_STEPS. Index 0 of each row is the chance of *no* advance at all
// this segment — added per direct instruction, so the mascot's "confused"
// reaction (see After recording) has a real outcome to react to, not just
// the already-at-100% edge case. Indexes 1+ are the chance of advancing
// that many steps (index 1 = +1 step, index 2 = +2 steps, ...), sliced to
// however many steps remain before 100. Row 0 (starting from 0%, the first
// segment) is the most heavily biased toward the smallest non-zero step —
// "first segment weighted lower" — but every row still gives a real,
// non-zero chance to the largest remaining step, so a lucky first roll can
// still land high. Per voice_recall_build_decisions.md: "soft-weighted, no
// hard cap... a lucky roll could still land high."
const NO_ADVANCE_WEIGHT = 0.12;
const FORWARD_STEP_WEIGHTS: Record<number, number[]> = {
  0: [NO_ADVANCE_WEIGHT, 0.48, 0.22, 0.12, 0.06],
  1: [NO_ADVANCE_WEIGHT, 0.4, 0.26, 0.22],
  2: [NO_ADVANCE_WEIGHT, 0.35, 0.53],
  3: [NO_ADVANCE_WEIGHT, 0.88],
};

function weightedPick(weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return i;
  }
  return weights.length - 1;
}

/**
 * Rolls the next coverage value after a sent segment. Already-100% stays
 * put (a guaranteed "no advance" case, on top of the real chance of one at
 * any other coverage level too — see FORWARD_STEP_WEIGHTS above).
 */
export function bumpCoverage(current: CoverageValue): CoverageValue {
  const idx = COVERAGE_STEPS.indexOf(current);
  if (idx >= COVERAGE_STEPS.length - 1) return current;
  const pick = weightedPick(FORWARD_STEP_WEIGHTS[idx]); // 0 = no advance, 1+ = steps forward
  if (pick === 0) return current;
  const newIdx = Math.min(COVERAGE_STEPS.length - 1, idx + pick);
  return COVERAGE_STEPS[newIdx];
}

export function computeRemainingSeconds(start: number): number {
  return Math.max(0, TOTAL_SECONDS - Math.floor((Date.now() - start) / 1000));
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function getStartFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : Date.now();
}

export function getCoverageFromSearchParam(value: string | null): CoverageValue {
  return COVERAGE_STEPS.includes(value as CoverageValue) ? (value as CoverageValue) : "0";
}

export function getXpFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * How many named "aspects" the Summary screen offers to revise, derived
 * from the final coverage scalar. Not sourced from any real per-topic
 * tracking (none exists in the main loop) — an invented, disclosed tiering
 * that keeps the mechanic honest to coverage without inventing granular
 * data the mocked recall never produced. Four tiers now (0-3), not three —
 * see FRC_ASPECTS below for why 3 is the real ceiling.
 */
export function deriveMissedAspectCount(coverage: CoverageValue): number {
  if (coverage === "100") return 0;
  if (coverage === "75") return 1;
  if (coverage === "50") return 2;
  return 3;
}

export interface AspectHint {
  chipText: string;
  body: string;
}

export interface Aspect {
  topic: string;
  prompt: string;
  hints: [AspectHint, AspectHint];
  revealAnswer: string;
}

// Reuses Concept Questions' own three terms verbatim (see
// ../concept-questions/terms.ts) rather than inventing new lesson content —
// both modes are already framed around the same "Algebraic Fractions"
// lesson (voice_recall_build_decisions.md's shared-content precedent, e.g.
// Concept Questions reusing Guided Reflection's 3-term breakdown).
// Duplicated rather than imported so FRC's route tree doesn't depend on
// Concept Questions' — an intentional disclosed decision, not an oversight.
//
// Revised: Term 1 (Factoring) was originally left out here on the
// reasoning that it's the concept a student free-recalls first in
// practice — per direct instruction this sub-flow needs the same 3-total
// question count as Concept Questions itself (both show a "1/3"-style
// progress number now), so all three terms are back in.
export const FRC_ASPECTS: Aspect[] = [
  {
    topic: "Factoring",
    prompt:
      "Let's test your understanding of Algebraic Fractions. To get started, can you explain in your own words the step-by-step process for simplifying an algebraic fraction?",
    hints: [
      {
        chipText: "Almost there",
        body: "You're on the right track talking about the numerator and denominator — try naming what you'd actually look for in each one first.",
      },
      {
        chipText: "One more try",
        body: "Think about it as rewriting both the top and bottom as a product of smaller pieces — what do you call finding those pieces?",
      },
    ],
    revealAnswer:
      "Factoring an algebraic fraction means rewriting the numerator and denominator as products, so any factor common to both can be identified before cancelling.",
  },
  {
    topic: "Cancelling terms",
    prompt: "Walk me through how you decide which terms can be cancelled in an algebraic fraction.",
    hints: [
      {
        chipText: "Almost there",
        body: "You've identified that we look for common terms, but the rule for how we can actually cancel them out is missing.",
      },
      {
        chipText: "One more try",
        body: "It comes down to multiplication versus addition — which one of those actually lets you cancel a piece from top and bottom?",
      },
    ],
    revealAnswer:
      "You can only cancel a factor that multiplies the entire numerator and the entire denominator — never a term that's just added or subtracted, since cancelling those would change the value of the fraction.",
  },
  {
    topic: "Simplify",
    prompt: "What does it mean for an algebraic fraction to be fully simplified, and how do you know when you're done?",
    hints: [
      {
        chipText: "Almost there",
        body: "You're close — think about what's left between the numerator and denominator once you've cancelled everything you can.",
      },
      {
        chipText: "One more try",
        body: "It's about whether there's still something both the top and bottom share — if there is, you're not done yet.",
      },
    ],
    revealAnswer:
      "A fraction is fully simplified once the numerator and denominator share no more common factors — at that point, further cancelling isn't possible without changing the fraction's value.",
  },
];

export type AspectOutcome = "first" | "hint" | "revealed";

// Same values as Concept Questions' XP_BY_OUTCOME — reused deliberately for
// a consistent XP scale across modes, not re-derived from scratch.
export const ASPECT_XP_BY_OUTCOME: Record<AspectOutcome, number> = {
  first: 10,
  hint: 5,
  revealed: 0,
};

// Same odds curve as Concept Questions' hint ladder (odds shift toward pass
// after each hint used) — SPEC.md 9f is explicit this sub-flow "reuses the
// same attempt/hint/reveal mechanic as Concept Questions."
export const ASPECT_PASS_ODDS_BY_ATTEMPT: Record<1 | 2, number> = { 1: 0.55, 2: 0.75 };

export function getAspectFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > FRC_ASPECTS.length) return 1;
  return parsed;
}

export function getTotalAspectsFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > FRC_ASPECTS.length) return 1;
  return parsed;
}

export function getHintsFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 2) return 0;
  return parsed;
}

// Uneven mapping onto ProgressIndicator's 5 fixed steps, same disclosed
// precedent as Concept Questions' PROGRESS_BY_TERM.
const ASPECT_PROGRESS_BY_TOTAL: Record<number, ProgressIndicatorValue[]> = {
  1: ["50"],
  2: ["25", "75"],
  // Same 0/25/75 mapping as Concept Questions' own PROGRESS_BY_TERM, for
  // the same reason (3 items onto ProgressIndicator's 5 fixed steps,
  // uneven since there's no exact "1 of 3" step).
  3: ["0", "25", "75"],
};

export function getAspectProgress(aspect: number, total: number): ProgressIndicatorValue {
  const row = ASPECT_PROGRESS_BY_TOTAL[total] ?? ASPECT_PROGRESS_BY_TOTAL[1];
  return row[aspect - 1] ?? row[row.length - 1];
}

export function buildFrcQuery(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
