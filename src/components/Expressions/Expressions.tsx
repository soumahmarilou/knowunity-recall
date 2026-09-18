import Image from "next/image";
import styles from "./Expressions.module.css";

/**
 * A reference sheet of Knowie's facial expressions. Figma: "Expressions"
 * component set.
 *
 * WHAT IT IS: A reference sheet of Knowie's facial expressions — 15
 * states (standby default, excited, laughing, giggling, determined,
 * questioning, thinking, dazed, amazed, angry, overIt, approving, sad,
 * confused, plus a placeholderIllustration fallback). Each variant is a
 * 200×217 illustration.
 *
 * WHEN TO USE IT: As the reference for which expressions exist and what
 * each is called, when deciding how Knowie should react at a given
 * moment — including a voice-recall judging moment, where Knowie's
 * expression is likely part of the feedback.
 *
 * DON'T: Don't assume these are already placed on real screens — they
 * aren't yet, this set is meant to get wired in during prototyping. A
 * separate, older family of expression instances already exists live on
 * screens; check with the team before extending either one further.
 *
 * Figma's own variant property here is literally named "Property 1" (a
 * generic, unhelpful leftover name, same situation as IconSlot's "Size
 * (IGNORE)") — this component names the prop `expression` instead; the
 * 15 option values themselves match Figma exactly.
 *
 * Each expression is an auto-traced illustration (thousands of path
 * points per face, same situation as Mascot bubble's and mascotSlot's own
 * artwork) — impractical to inline as SVG, so all 15 ship as real image
 * assets at public/images/expressions/.
 */

export type Expression =
  | "standby"
  | "excited"
  | "laughing"
  | "giggling"
  | "determined"
  | "questioning"
  | "thinking"
  | "dazed"
  | "amazed"
  | "angry"
  | "overIt"
  | "approving"
  | "sad"
  | "confused"
  | "placeholderIllustration";

export interface ExpressionsProps {
  expression?: Expression;
}

export function Expressions({ expression = "standby" }: ExpressionsProps) {
  return (
    <Image
      src={`/images/expressions/${expression}.png`}
      alt={expression}
      width={200}
      height={217}
      className={styles.expression}
    />
  );
}
