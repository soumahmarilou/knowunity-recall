/**
 * Where the student entered a recall mode from — Home chat's Recall
 * exercice, or a Study Plan lesson step. Threaded via `?entry=` through
 * every route in all three modes (same URL-param-state pattern already
 * used for Guided Reflection's `subject`), purely so each mode's own
 * Summary screen knows whether its "Return to..." button should read
 * "Return to home" or "Return to study plan" and where it should go —
 * nothing else in any mode branches on this value.
 */
export type EntryPoint = "home" | "study-plan";

export function getEntryFromSearchParam(value: string | null): EntryPoint {
  return value === "study-plan" ? "study-plan" : "home";
}
