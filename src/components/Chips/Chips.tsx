import type { ReactNode } from "react";
import { IconSlot, type IconSlotSize } from "../IconSlot/IconSlot";
import styles from "./Chips.module.css";

/**
 * Pill-shaped chip/tag. Figma: "chips" component set.
 *
 * WHAT IT IS: A pill-shaped chip/tag. size (XXS/XS/S/M) x color
 * (Primary/pro/success/info/error) x active (False/True), plus a Text
 * prop and showLeftIcon/showRightIcon booleans.
 *
 * WHEN TO USE IT: Filters, category tags, selectable options, or short
 * status labels. active toggles selected vs unselected, so it also works
 * as a filter chip. success/info/error show the outcome of a recall
 * attempt (first try, hint needed, revealed) inline on a summary row.
 *
 * DON'T: Don't use the pro color unless it's actually gating or labeling
 * paid-tier content. Don't use success/info/error for anything unrelated
 * to recall-attempt feedback.
 */

export type ChipSize = "XXS" | "XS" | "S" | "M";

interface ChipsCommonProps {
  /** Figma property name: Text. */
  text?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Figma only ever defines success/info/error at size=S, active=True — no
// other combination exists for those three colors. Modeled as a
// discriminated union so an invalid combination is a type error, not a
// silently-wrong render.
export type ChipsProps =
  | (ChipsCommonProps & {
      color?: "Primary" | "pro";
      size?: ChipSize;
      active?: "False" | "True";
    })
  | (ChipsCommonProps & {
      color: "success" | "info" | "error";
      size?: "S";
      active?: "True";
    });

const ICON_SLOT_SIZE: Record<ChipSize, IconSlotSize> = {
  XXS: "150",
  XS: "150",
  S: "200",
  M: "250",
};

export function Chips(props: ChipsProps) {
  const {
    color = "Primary",
    size = "XXS",
    active = "False",
    text = "1/2 words",
    showLeftIcon = true,
    showRightIcon = true,
    leftIcon,
    rightIcon,
  } = props;

  const isFeedbackColor = color === "success" || color === "info" || color === "error";
  const colorClass = isFeedbackColor
    ? styles[`color${color[0].toUpperCase()}${color.slice(1)}`]
    : active === "True"
      ? [styles[`color${color}`], styles.active].join(" ")
      : styles.inactive;

  const className = [styles.chip, styles[`size${size}`], colorClass].join(" ");
  const iconSlotSize = ICON_SLOT_SIZE[size];

  return (
    <span className={className}>
      {showLeftIcon && leftIcon && <IconSlot size={iconSlotSize} icon={leftIcon} />}
      <span className={styles.label}>{text}</span>
      {showRightIcon && rightIcon && <IconSlot size={iconSlotSize} icon={rightIcon} />}
    </span>
  );
}
