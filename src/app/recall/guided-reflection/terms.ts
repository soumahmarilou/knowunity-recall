/**
 * Guided Reflection's session content for this prototype.
 *
 * Two behavior changes here, both per direct instruction:
 *
 * 1. **Subject is dynamic, not hardcoded.** Every prompt now interpolates
 *    whatever subject the student typed into Recall exercice's chat input
 *    (threaded through Mode selection → this mode's Intro → every session
 *    route as `?subject=`), falling back to "Algebraic Fractions" — the
 *    only subject any of this content was ever Figma-confirmed against —
 *    when nothing was typed. Because the subject is now arbitrary, term 1's
 *    originally Figma-confirmed topic label ("Factoring") no longer fits
 *    every possible subject either, so both topic labels below are generic
 *    ("Getting started" / "Reflection"), not concept-specific — a disclosed
 *    departure from the original Figma-confirmed labels, not an oversight.
 *
 * 2. **The session loops, not a fixed 3 terms.** Term 1 keeps a distinct
 *    opening prompt; every term after that repeats the identical
 *    reflective template indefinitely. There is no last term anymore —
 *    only the AppBar's "Finish" button ends the session now. Summary's own
 *    recap still only ever shows two fixed cards (opening + reflection),
 *    regardless of how many loop turns actually happened, matching this
 *    mode's existing "no tracking of partial progress across route
 *    navigations" design.
 */

export interface GuidedReflectionTerm {
  topic: string;
  prompt: string;
  /** Shown on the Summary screen's recap row — a "what stuck" takeaway,
   * not the original prompt. */
  summaryDescriptor: string;
}

export const DEFAULT_SUBJECT = "Algebraic Fractions";

export function getOpeningTerm(subject: string): GuidedReflectionTerm {
  return {
    topic: "Getting started",
    prompt: `What was the most interesting thing you learned about ${subject}?`,
    summaryDescriptor: `Your first take on ${subject}`,
  };
}

export function getRepeatingTerm(subject: string): GuidedReflectionTerm {
  return {
    topic: "Reflection",
    prompt: `What would you like to remember from ${subject}, and why is it important to you?`,
    summaryDescriptor: `Reflecting on what stuck from ${subject}`,
  };
}

export function getTermContent(term: number, subject: string): GuidedReflectionTerm {
  return term === 1 ? getOpeningTerm(subject) : getRepeatingTerm(subject);
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
