import type { ReactNode } from "react";
import { AppBarButtonIcon } from "../AppBarButtonIcon/AppBarButtonIcon";
import { AppBarButton } from "../AppBarButton/AppBarButton";
import styles from "./AppBar.module.css";

/**
 * Top nav bar. Figma: "appBar" component set.
 *
 * WHAT IT IS: A top nav bar template. A fixed "Top Nav Default" frame
 * holds an optional left icon button and an open Slot in the middle for
 * screen-specific content (title, search, etc). Some variants add one or
 * two buttons/icon-buttons on the right. The variant property switches
 * between 6 preset left/right layouts.
 *
 * WHEN TO USE IT: At the top of any screen needing a persistent nav bar
 * (back/close left, title/content middle, 0-2 actions right). Pick the
 * variant matching how many right-side buttons the screen needs.
 *
 * DON'T: Don't assume the middle Slot handles long content gracefully —
 * it has no max-width constraint, so long titles or search fields need
 * checking at real screen width.
 *
 * Composed from the already-built AppBarButtonIcon (left icon, and every
 * icon-button on the right) and AppBarButton (the text CTA button on the
 * right, confirmed directly in Figma as a distinct "App Bar Button"
 * component set, not the general Button component).
 */

export type AppBarVariant =
  | "default"
  | "leftIconButtonOnly"
  | "leftAndRightIconButton"
  | "leftAndRightButton"
  | "leftAndTwoRightIconButtons"
  | "leftAnd2RightButtons";

interface AppBarLeftProps {
  /** Left icon-button icon. Required for every variant except "default". */
  leftIcon: ReactNode;
  leftAriaLabel: string;
  onLeftClick?: () => void;
}

interface AppBarSlotProps {
  /** Content for the middle Slot (title, search, etc). Optional — Figma's
   * Slot has no required content, and about a third of real screens leave
   * their topNavigation slot empty entirely at the scaffold level. */
  children?: ReactNode;
}

type AppBarProps =
  | ({ variant: "default" } & AppBarSlotProps)
  | ({ variant: "leftIconButtonOnly" } & AppBarLeftProps & AppBarSlotProps)
  | ({ variant: "leftAndRightIconButton" } & AppBarLeftProps &
      AppBarSlotProps & {
        rightIcon: ReactNode;
        rightAriaLabel: string;
        onRightClick?: () => void;
      })
  | ({ variant: "leftAndRightButton" } & AppBarLeftProps &
      AppBarSlotProps & {
        rightCta: string;
        onRightClick?: () => void;
      })
  | ({ variant: "leftAndTwoRightIconButtons" } & AppBarLeftProps &
      AppBarSlotProps & {
        rightIcon: ReactNode;
        rightAriaLabel: string;
        onRightClick?: () => void;
        right2Icon: ReactNode;
        right2AriaLabel: string;
        onRight2Click?: () => void;
      })
  | ({ variant: "leftAnd2RightButtons" } & AppBarLeftProps &
      AppBarSlotProps & {
        rightIcon: ReactNode;
        rightAriaLabel: string;
        onRightClick?: () => void;
        rightCta: string;
        onRight2Click?: () => void;
      });

export function AppBar(props: AppBarProps) {
  const { children } = props;

  return (
    <div className={styles.appBar}>
      {props.variant !== "default" && (
        <AppBarButtonIcon
          icon={props.leftIcon}
          aria-label={props.leftAriaLabel}
          onClick={props.onLeftClick}
        />
      )}

      <div className={styles.slot}>{children}</div>

      {props.variant === "leftAndRightIconButton" && (
        <AppBarButtonIcon
          icon={props.rightIcon}
          aria-label={props.rightAriaLabel}
          onClick={props.onRightClick}
        />
      )}

      {props.variant === "leftAndRightButton" && (
        <AppBarButton cta={props.rightCta} onClick={props.onRightClick} />
      )}

      {props.variant === "leftAndTwoRightIconButtons" && (
        <div className={styles.rightButtons}>
          <AppBarButtonIcon
            icon={props.rightIcon}
            aria-label={props.rightAriaLabel}
            onClick={props.onRightClick}
          />
          <AppBarButtonIcon
            icon={props.right2Icon}
            aria-label={props.right2AriaLabel}
            onClick={props.onRight2Click}
          />
        </div>
      )}

      {props.variant === "leftAnd2RightButtons" && (
        <div className={styles.rightButtons}>
          <AppBarButtonIcon
            icon={props.rightIcon}
            aria-label={props.rightAriaLabel}
            onClick={props.onRightClick}
          />
          <AppBarButton cta={props.rightCta} onClick={props.onRight2Click} />
        </div>
      )}
    </div>
  );
}
