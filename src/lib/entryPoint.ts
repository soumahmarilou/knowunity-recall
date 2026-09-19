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

/**
 * How far into a mode a screen sits, on the same 0/25/50/75/100 scale
 * `ProgressRing`/`ProgressIndicator` already use elsewhere — Intro=0,
 * Session (the actual question/prompt screen, before any recording)=25,
 * Recording=50, Processing/Reveal/After-recording and every screen past
 * that=75. Session gets its own tier rather than sharing Intro's 0, per
 * direct instruction — leaving mid-question (having actually engaged
 * with the prompt) needs to read as real progress, not indistinguishable
 * from never having opened the mode at all. Threaded back to Study
 * plan's own `?progress=` (read by `StudyPlanContent.tsx`) so its
 * current-step ring reflects how far a student actually got before
 * bailing out via Close, not just whatever was last typed into the URL
 * by hand for testing.
 */
export type ExitCheckpoint = 0 | 25 | 50 | 75;

/**
 * Where a Close (X) button should go. Every Close button in the recall
 * flow used to hardcode `router.push("/")` regardless of how the student
 * got there — this is the one place that decision is made now, so it
 * can't drift back out of sync per-screen. Home is always the fallback;
 * Study plan only gets the real destination when that's genuinely where
 * the student came from.
 */
export function studyPlanCloseUrl(entry: EntryPoint, checkpoint: ExitCheckpoint): string {
  return entry === "study-plan" ? `/study-plan?progress=${checkpoint}` : "/";
}

/**
 * Where a mode's own "Return to..." button on its real Summary screen
 * should go, once the student has actually finished (not just bailed
 * out early) — marks the Study plan step complete via `?completed=1` in
 * addition to the same progress threading `studyPlanCloseUrl` does.
 */
export function studyPlanReturnUrl(entry: EntryPoint): string {
  return entry === "study-plan" ? "/study-plan?completed=1&progress=100" : "/";
}
