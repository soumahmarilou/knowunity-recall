/**
 * Concept Questions' session content. Same 3-term topic breakdown as
 * Guided Reflection (Factoring / Cancelling terms / Simplify) for
 * cross-mode consistency, matching what Concept Questions' own Summary
 * screen already establishes in Figma.
 *
 * Figma-confirmed content (from "Concept Questions - Launched" and its
 * partial-result variant, node 13659:5771 / 13749:1171): term 1's prompt,
 * and one hint body ("You've identified that we look for common terms,
 * but the rule for how we can actually cancel them out is missing.") —
 * reassigned here to term 2 (Cancelling terms) since its content is
 * topically about cancelling terms specifically, not term 1's factoring/
 * simplifying opener. Everything else — term 2/3 prompts, every second
 * hint, every reveal-answer text — is invented here, not sourced from
 * Figma. Hint chip text "Almost there" is Figma-confirmed for a first
 * hint; "One more try" for a second hint is invented.
 */

import type { ProgressIndicatorValue } from "@/components/ProgressIndicator/ProgressIndicator";

export interface Hint {
  chipText: string;
  body: string;
}

export interface ConceptQuestionsTerm {
  topic: string;
  prompt: string;
  hints: [Hint, Hint];
  revealAnswer: string;
}

export const DEFAULT_SUBJECT = "Algebraic Fractions";

export function getSubjectFromSearchParam(value: string | null): string {
  return value?.trim() || DEFAULT_SUBJECT;
}

/**
 * Term 1's opening line is genuinely subject-agnostic framing ("let's test
 * your understanding of X") — interpolated per direct instruction, so
 * `subject` actually follows here from Mode selection instead of silently
 * dropping. The rest of term 1 (and every other term's prompt/hints/
 * revealAnswer) stays fixed, algebra-specific content — factoring,
 * cancelling terms, and simplifying rules don't generalize to an arbitrary
 * subject the way Guided Reflection's fully generic template does, so
 * swapping `subject` in there would produce nonsense for anything that
 * isn't algebra. Same fixed-content precedent Guided Reflection's own
 * Summary cards already set.
 */
export function getTermPrompt(termNumber: number, subject: string): string {
  if (termNumber === 1) {
    return `Let's test your understanding of ${subject}. To get started, can you explain in your own words the step-by-step process for simplifying an algebraic fraction?`;
  }
  return CONCEPT_QUESTIONS_TERMS[termNumber - 1].prompt;
}

/**
 * Term 1's title for the Summary screen's own `QuizResultRow` only — the
 * live question-asking screens (session/recording, via `getTermPrompt`
 * above) still need the full "let's test your understanding of X"
 * framing sentence, since that's the actual opening line read to the
 * student there. On Summary, each term already sits under its own
 * "Question N" label (see `QuizResultRow`'s `questionNumber` prop), so
 * re-stating the framing sentence just made that one row's card taller
 * than its siblings for no benefit — dropped here, first word
 * capitalized, per direct instruction. Terms 2/3 are unaffected (their
 * prompts never had this framing sentence to begin with).
 */
export function getTermSummaryTitle(termNumber: number, subject: string): string {
  if (termNumber === 1) {
    return "Can you explain in your own words the step-by-step process for simplifying an algebraic fraction?";
  }
  return getTermPrompt(termNumber, subject);
}

export const CONCEPT_QUESTIONS_TERMS: ConceptQuestionsTerm[] = [
  {
    topic: "Factoring",
    prompt:
      "Let's test your understanding of Algebraic Fractions. To get started, can you explain in your own words the step-by-step process for simplifying an algebraic fraction?",
    hints: [
      {
        chipText: "Almost there",
        body: "You're on the right track talking about the numerator and denominator. Try naming what you'd actually look for in each one first.",
      },
      {
        chipText: "One more try",
        body: "Think about it as rewriting both the top and bottom as a product of smaller pieces. What do you call finding those pieces?",
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
        body: "It comes down to multiplication versus addition. Which one of those actually lets you cancel a piece from top and bottom?",
      },
    ],
    revealAnswer:
      "You can only cancel a factor that multiplies the entire numerator and the entire denominator, never a term that's just added or subtracted, since cancelling those would change the value of the fraction.",
  },
  {
    topic: "Simplify",
    prompt:
      "What does it mean for an algebraic fraction to be fully simplified, and how do you know when you're done?",
    hints: [
      {
        chipText: "Almost there",
        body: "You're close. Think about what's left between the numerator and denominator once you've cancelled everything you can.",
      },
      {
        chipText: "One more try",
        body: "It's about whether there's still something both the top and bottom share. If there is, you're not done yet.",
      },
    ],
    revealAnswer:
      "A fraction is fully simplified once the numerator and denominator share no more common factors. At that point, further cancelling isn't possible without changing the fraction's value.",
  },
];

// ProgressIndicator's scale is now exact thirds (0/33/66/100), so this
// maps 1:1 onto how many terms have actually concluded (0-3) — no
// approximation needed anymore, unlike the old 5-step (0/25/50/75/100)
// scale this used to have to round onto.
const PASSED_PROGRESS: ProgressIndicatorValue[] = ["0", "33", "66", "100"];

/**
 * The bar fills only when a term is actually answered correctly — first
 * try or after a hint — not for a forced reveal, per direct instruction
 * (revising this file's own earlier "any conclusion counts, including a
 * reveal" call, which was flagged here as a disclosed interpretation
 * call at the time). A revealed term never fills its own third, on
 * Summary or anywhere else the outcome list is read back — it wasn't
 * gotten right, so it doesn't count as progress.
 */
export function getProgressFromOutcomes(outcomes: TermOutcome[]): ProgressIndicatorValue {
  const passedCount = outcomes.filter((o) => o !== "revealed").length;
  return PASSED_PROGRESS[Math.min(passedCount, PASSED_PROGRESS.length - 1)];
}

export type TermOutcome = "first" | "hint" | "revealed";

export const XP_BY_OUTCOME: Record<TermOutcome, number> = {
  first: 10,
  hint: 5,
  revealed: 0,
};

export const OUTCOME_CHIP: Record<TermOutcome, { text: string; color: "success" | "info" | "error" }> = {
  first: { text: "First try", color: "success" },
  hint: { text: "Hint needed", color: "info" },
  revealed: { text: "Revealed", color: "error" },
};

export function getTermFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > CONCEPT_QUESTIONS_TERMS.length) {
    return 1;
  }
  return parsed;
}

export function getHintsFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 2) return 0;
  return parsed;
}

export function parseOutcomes(value: string | null): TermOutcome[] {
  if (!value) return [];
  return value
    .split(",")
    .filter((v): v is TermOutcome => v === "first" || v === "hint" || v === "revealed");
}

export function appendOutcome(existing: string | null, outcome: TermOutcome): string {
  const list = parseOutcomes(existing);
  list.push(outcome);
  return list.join(",");
}
