import styles from "./Waveform.module.css";

/**
 * A recording-in-progress visual. Figma: "Waveform" component (a single
 * static component, not a component set — no variants, no exposed
 * properties).
 *
 * WHAT IT IS: Organic, non-repeating amplitude bars (sine envelope +
 * wobble, not strict alternation) for a live in-progress recording. Fill
 * bound to accent/1/bold, with the last few bars fading toward the
 * leading edge to read as live incoming audio.
 *
 * WHEN TO USE IT: Anywhere a recording-in-progress needs a waveform
 * visual.
 *
 * DON'T: Don't assume this is already wired into a recording screen or
 * micButton — it's a standalone graphic; where and how to pair it hasn't
 * been decided yet.
 *
 * KNOWN GAP: the description above (quoted verbatim from Figma) says the
 * last few bars fade toward the leading edge. Checked directly against
 * the live component: every one of its 20 bars has opacity 1, no fade
 * anywhere — confirmed both from each bar's own properties and a rendered
 * screenshot. Built here exactly as it actually is (solid, static, no
 * fade), not as the description claims, per direction.
 *
 * Bar heights below are the real per-bar values read directly off the
 * live Figma component (an organic, hand-tuned amplitude pattern, not a
 * formula) — content data, not a design token, the same way an icon's SVG
 * path coordinates aren't tokenized either. They're the resting shape;
 * `levels` (from `useMicLevel`, real mic input via the Web Audio API, not
 * a mocked/looping animation) scales each bar live off actual voice
 * amplitude during an active recording — undecided in Figma (per the DON'T
 * above), built as a disclosed extension rather than left static.
 */

const BAR_HEIGHTS = [
  15, 21.36, 19.36, 18.48, 23.95, 24.77, 18.98, 18.9, 24.24, 23.43, 19.91, 23.98, 28, 24.65, 20.36,
  22.81, 21.93, 14.12, 11.48, 15.41,
];

const MIN_SCALE = 0.3;
// Slightly wider swing between quiet and loud, per direct instruction —
// the reactive pulse read as too subtle at 1.4.
const MAX_EXTRA_SCALE = 1.7;

export interface WaveformProps {
  /** Live per-bar amplitude (0–1) from `useMicLevel`. Omit (or pass `null`)
   * for the static resting bars — e.g. permission not yet granted. */
  levels?: number[] | null;
}

export function Waveform({ levels }: WaveformProps = {}) {
  return (
    <div className={styles.waveform} aria-hidden="true">
      {BAR_HEIGHTS.map((height, index) => {
        const scale = levels ? MIN_SCALE + levels[index] * MAX_EXTRA_SCALE : 1;
        return <span key={index} className={styles.bar} style={{ height: `${height * scale}px` }} />;
      })}
    </div>
  );
}
