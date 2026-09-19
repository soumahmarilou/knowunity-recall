/**
 * Guided Reflection's session content for this prototype.
 *
 * Three behavior changes here, all per direct instruction:
 *
 * 1. **Subject is dynamic, not hardcoded.** Every prompt now interpolates
 *    whatever subject the student typed into Recall exercice's chat input
 *    (threaded through Mode selection → this mode's Intro → every session
 *    route as `?subject=`), falling back to "Algebraic Fractions" — the
 *    only subject any of this content was ever Figma-confirmed against —
 *    when nothing was typed. Because the subject is now arbitrary, the
 *    originally Figma-confirmed topic label ("Factoring") no longer fits
 *    every possible subject either, so both topic labels below are generic
 *    ("Getting started" / "Reflection"), not concept-specific — a disclosed
 *    departure from the original Figma-confirmed labels, not an oversight.
 *
 * 2. **The session loops, not a fixed 3 terms.** There is no last term —
 *    only the AppBar's "Finish" button ends the session. Summary's own
 *    recap still only ever shows two fixed cards (opening + reflection),
 *    regardless of how many loop turns actually happened, matching this
 *    mode's existing "no tracking of partial progress across route
 *    navigations" design.
 *
 * 3. **Each term is a real two-turn exchange, not one combined prompt.**
 *    Knowie asks a main question, the student answers, Knowie asks a
 *    genuine follow-up (`?step=2`), the student answers that too, then a
 *    single acknowledgment closes out the term before looping to the
 *    next one (`?step=1`) — see session/processing/ProcessingContent.tsx
 *    for the step-aware acknowledgment/routing. Two question pairs
 *    alternate by term parity (odd → "interesting/why it stood out",
 *    even → "what to remember/why it matters") so consecutive terms
 *    never repeat the same pair, per direct instruction for more variety
 *    across loop turns.
 */

export interface GuidedReflectionTerm {
  topic: string;
  prompt: string;
  /** Shown on the Summary screen's recap row — a "what stuck" takeaway,
   * not the original prompt. */
  summaryDescriptor: string;
}

interface GuidedReflectionPair {
  main: GuidedReflectionTerm;
  followUp: GuidedReflectionTerm;
}

export const DEFAULT_SUBJECT = "Algebraic Fractions";

function getInterestPair(subject: string): GuidedReflectionPair {
  return {
    main: {
      topic: "Getting started",
      prompt: `What was the most interesting thing you learned about ${subject}?`,
      summaryDescriptor: `Your first take on ${subject}`,
    },
    followUp: {
      topic: "Getting started",
      prompt: "Why did it stand out to you?",
      summaryDescriptor: `Why that part of ${subject} stood out`,
    },
  };
}

function getMemoryPair(subject: string): GuidedReflectionPair {
  return {
    main: {
      topic: "Reflection",
      prompt: `What would you like to remember about ${subject}?`,
      summaryDescriptor: `What to remember from ${subject}`,
    },
    followUp: {
      topic: "Reflection",
      prompt: "Why is this important to you?",
      summaryDescriptor: `Why ${subject} matters`,
    },
  };
}

function getTermPair(term: number, subject: string): GuidedReflectionPair {
  return term % 2 === 1 ? getInterestPair(subject) : getMemoryPair(subject);
}

export function getStepContent(term: number, step: number, subject: string): GuidedReflectionTerm {
  const pair = getTermPair(term, subject);
  return step === 2 ? pair.followUp : pair.main;
}

/**
 * Summary's fixed 2-card recap — per direct instruction, these two cards
 * are fixed, specific curriculum content ("Factoring" / "Cancelling
 * terms"), not derived from the live session's dynamic `subject` the way
 * the in-session prompts above are. Takes no argument for exactly that
 * reason — unlike this file's other getters, nothing here varies by
 * subject.
 */
export function getSummaryTerms(): GuidedReflectionTerm[] {
  return [
    {
      topic: "Factoring",
      prompt: "",
      summaryDescriptor: "How to identify common factors in the numerator and denominator",
    },
    {
      topic: "Cancelling terms",
      prompt: "",
      summaryDescriptor: "Why cancelling only works on factors, not addends",
    },
  ];
}

export function getSubjectFromSearchParam(value: string | null): string {
  return value?.trim() || DEFAULT_SUBJECT;
}

export function getTermFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

/** Which question in the current term's pair is showing — step 1 (main)
 * or step 2 (follow-up). Anything else falls back to step 1. */
export function getStepFromSearchParam(value: string | null): number {
  return value === "2" ? 2 : 1;
}
