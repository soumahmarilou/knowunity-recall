import Image from "next/image";
import type { Expression } from "../Expressions/Expressions";
import styles from "./MascotSlot.module.css";

/**
 * A sized container for the Knowie mascot artwork. Figma: "mascotSlot"
 * component set.
 *
 * WHAT IT IS: A sized container for the Knowie mascot artwork. One
 * variant, size (XL/2XL/3XL/4XL) — no small/medium step, since the
 * mascot is a hero visual, not a small UI accent.
 *
 * WHEN TO USE IT: Wherever Knowie appears as a prominent visual —
 * onboarding, empty states, and likely the voice-recall feedback moment,
 * where Knowie's presence signals the app is listening or judging.
 *
 * DON'T: Don't use this slot for anything except the mascot — it's sized
 * for that one asset's proportions, not a general-purpose image container
 * the way iconSlot is for icons.
 *
 * Confirmed directly against Figma: this is a pure sizing box (no fill,
 * border, or radius of its own — unlike IconSlot's still-transparent but
 * visually-boxed pattern, this one is invisible chrome). The mascot sits
 * inset by a constant 12px on every side regardless of size step
 * (confirmed at all four sizes, not just assumed from one).
 *
 * `expression` (default "standby", this component's own default in
 * Figma): not a real Figma instance-swap property on mascotSlot itself —
 * Figma's own version of this component only ever shows "standby", no
 * swap control exposed. Added here as a real prop once a second screen
 * needed a different expression in this same size-managed box (first
 * needed for Guided Reflection – Intro, logged in component-gaps.md at
 * the time; promoted to a real prop here rather than inlined a second
 * time for Mode selection). Reuses the same 15 expression values and the
 * same public/images/expressions/*.png assets as the separate
 * Expressions component — the two are still visually distinct usages
 * (this one is always sized to one of mascotSlot's four fixed boxes with
 * its own 12px inset, matching the "standby" case's exact box-then-image
 * layering; Expressions on its own is a fixed 200×217 reference swatch),
 * so this doesn't just delegate rendering to <Expressions>, it reuses its
 * `Expression` type and its asset path convention.
 *
 * `animate` (default false, not a Figma property): plays a one-shot
 * celebratory bounce-in on mount, per direct instruction ("code an
 * animation of Knowie for the summary screens"). Opt-in and CSS-only
 * (a transform/opacity keyframe on the image wrapper, respecting
 * prefers-reduced-motion) — turned on for all three modes' own completion
 * screens (Guided Reflection and Concept Questions' Summary, Free Recall
 * Challenge's Final Summary), regardless of which expression each one
 * shows.
 *
 * Separately, `expression` itself always remounts (via `key`) and fades
 * in on change now, `animate` or not — per direct instruction, any
 * expression change anywhere in the app should read as a smooth
 * transition, not a hard image swap. No screen in this app currently
 * changes MascotSlot's `expression` while already mounted (every use so
 * far sets it once per screen), so this mostly future-proofs the
 * component rather than fixing something visibly broken today — but it's
 * the same instruction MascotBubble's own expression/content changes got,
 * and this is the other place `expression` lives.
 */

export type MascotSlotSize = "XL" | "2XL" | "3XL" | "4XL";

export interface MascotSlotProps {
  size?: MascotSlotSize;
  expression?: Expression;
  animate?: boolean;
}

export function MascotSlot({ size = "XL", expression = "standby", animate = false }: MascotSlotProps) {
  return (
    <div className={[styles.mascotSlot, styles[`size${size}`]].join(" ")}>
      <div
        key={expression}
        className={[styles.imageWrapper, animate ? styles.animate : styles.fade].join(" ")}
      >
        <Image
          src={`/images/expressions/${expression}.png`}
          alt=""
          fill
          sizes="320px"
          className={styles.image}
        />
      </div>
    </div>
  );
}
