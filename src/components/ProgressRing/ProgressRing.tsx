import styles from "./ProgressRing.module.css";

/**
 * A circular progress ring around a tappable icon. Figma: "Progress Ring"
 * component set.
 *
 * WHAT IT IS: A circular progress ring, stepped in quarters (0/25/50/75/
 * 100), that wraps around a tappable icon rather than sitting as its own
 * standalone bar. Track uses border/strong (not border/default — needs
 * to read as a full circle at a glance even when the filled arc is
 * short, per border/strong's own token description), the filled arc
 * uses feedback/success/bold — the same green buttonIcon's own Success
 * variant uses for a completed step.
 *
 * WHEN TO USE IT: A single bounded task that's already in progress and
 * still tappable to continue — the current step in a multi-step list,
 * sized to sit just outside a 56px (buttonIcon L) icon. Not for a
 * completed or not-yet-started state; those don't need a ring at all.
 *
 * DON'T: Don't use this for the same job progressIndicator already
 * does — a linear, multi-step overview bar. This is specifically for
 * one in-progress ring around one tappable icon, not a general progress
 * bar.
 *
 * Purely decorative (aria-hidden) — the tappable icon it wraps carries
 * its own aria-label, and that label is where progress should be spoken
 * from (e.g. "…, 50% complete"), not a second, separately-announced
 * progressbar role competing with it. Same reasoning TranscriptView
 * already established for a fast-updating visual paired with its own
 * accessible text elsewhere.
 */

export type ProgressRingValue = "0" | "25" | "50" | "75" | "100";

export interface ProgressRingProps {
  progress?: ProgressRingValue;
  /** Slow breathing scale to invite a tap — off by default since it's
   * decorative/enticement, not a status signal, unlike the loading
   * spinner elsewhere in this library. */
  pulse?: boolean;
}

const SIZE = 64;
const STROKE = 4.5; // disclosed raw value — no stroke-width token in
// tokens.json lands anywhere near this (only 1px/2px exist); matches the
// ring's own Figma build (innerRadius 0.86 at 64px).
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ progress = "0", pulse = false }: ProgressRingProps) {
  const pct = Number(progress);
  const dashoffset = CIRCUMFERENCE * (1 - pct / 100);

  return (
    <svg
      className={[styles.ring, pulse && styles.pulse].filter(Boolean).join(" ")}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
    >
      <circle
        className={styles.track}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE}
        fill="none"
      />
      {pct > 0 && (
        <circle
          className={styles.fill}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      )}
    </svg>
  );
}
