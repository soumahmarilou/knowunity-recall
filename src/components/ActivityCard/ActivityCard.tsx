import type { ReactNode } from "react";
import { IconSlot } from "../IconSlot/IconSlot";
import { GraduationHat01 } from "../Icons/Icons";
import styles from "./ActivityCard.module.css";

/**
 * Fixed-size home-screen quick-action card. Figma: "Activity card" component.
 *
 * WHAT IT IS: A fixed 120×110 quick-action card with a swappable icon and
 * a free-text label.
 *
 * WHEN TO USE IT: Home screen quick-action entry points — Recall
 * exercice, Flashcards, Quizz, Practice exam.
 *
 * DON'T: Don't hand-build this from raw frames per screen — use the
 * component so a future style change propagates everywhere it's used.
 */

export interface ActivityCardProps {
  /** Figma property name: Icon (instance-swap). Default: graduation-hat-01. */
  icon?: ReactNode;
  /** Plain text layer in Figma, not a formal component property there yet
   * — exposed here as a real prop since the content still has to come
   * from somewhere. */
  label?: string;
  /** Not a Figma component property — Figma's "Activity card" has no
   * interaction state at all, despite its own WHEN TO USE IT text calling
   * it a "quick-action entry point." Added when Home chat – Default needed
   * these to actually be tappable; renders a real <button> when provided,
   * same pattern as SuperlistItem's showTrailingChevron. */
  onClick?: () => void;
  /** Not a Figma component property either, same disclosed-gap situation
   * as onClick above — added so the card's inset shadow (see
   * ActivityCard.module.css) can be forced off for a static Storybook
   * story, same `state` naming Button/ButtonIcon already use. The real
   * tap-driven state is `:active`, wired separately in CSS. */
  state?: "Default" | "Pressed";
}

export function ActivityCard({
  icon = <GraduationHat01 />,
  label = "Label",
  onClick,
  state = "Default",
}: ActivityCardProps) {
  const className = [styles.card, state === "Pressed" && styles.pressed].filter(Boolean).join(" ");

  const content = (
    <>
      <IconSlot size="300" icon={icon} />
      <span className={styles.label}>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
