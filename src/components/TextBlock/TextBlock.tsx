import styles from "./TextBlock.module.css";

/**
 * Title + caption text pair. Figma: "textBlock" component set.
 *
 * WHAT IT IS: A title + caption text pair. variant (XL/L/M/S, sets the
 * type scale) x showCaption boolean, plus title and caption text
 * properties (defaults: "Header" / "Caption"). Two stacked text layers,
 * nothing else.
 *
 * WHEN TO USE IT: A section or screen heading with a supporting line
 * underneath — page titles, card headers, empty-state copy. Turn
 * showCaption off for a title-only moment.
 *
 * DON'T: Don't use it as a generic two-line block for body copy or list
 * items — the variant naming ties it to heading-scale sizes, not body
 * text.
 */

export type TextBlockVariant = "XL" | "L" | "M" | "S";

export interface TextBlockProps {
  variant?: TextBlockVariant;
  /** Figma property name: showCaption. */
  showCaption?: boolean;
  /** Figma property name: title. */
  title?: string;
  /** Figma property name: caption. */
  caption?: string;
}

export function TextBlock({
  variant = "XL",
  showCaption = true,
  title = "Header",
  caption = "Caption",
}: TextBlockProps) {
  return (
    <div className={[styles.textBlock, styles[`variant${variant}`]].join(" ")}>
      <p className={styles.title}>{title}</p>
      {showCaption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
