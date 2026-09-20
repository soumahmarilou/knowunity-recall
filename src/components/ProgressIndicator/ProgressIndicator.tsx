import styles from "./ProgressIndicator.module.css";

/**
 * Bounded progress bar. Figma: "progressIndicator" component set.
 *
 * WHAT IT IS: A horizontal linear progress bar (pill-shaped track, fixed
 * height, fill width scales with progress). variant (Primary/Coral) x
 * thickness (24/16) x progress (0/33/66/100), plus a showText boolean for
 * a percentage label. Progress is stepped in thirds, not a free 0-100
 * value.
 *
 * Revised per direct instruction from the original 5-step 0/25/50/75/100
 * scale (quarters) down to this 4-step 0/33/66/100 scale (thirds) — both
 * in code and in Figma. Every caller that used to map "3 things onto 5
 * steps" (Concept Questions' term progress, Free Recall Challenge's
 * aspect-to-revise progress) now maps onto this scale exactly, no
 * approximation needed. Free Recall Challenge's own coverage gauge — a
 * genuinely continuous soft-weighted percentage, not a 3-item count —
 * loses its previous finer 25/50/75 gradation as a result; that trade
 * was confirmed explicitly rather than assumed.
 *
 * WHEN TO USE IT: Any bounded progress state — a study session, a
 * multi-step flow, or a possible "evaluating" indicator while Knowie
 * judges a spoken answer.
 *
 * DON'T: Don't treat the 33% steps as fine-grained enough for continuous
 * progress without checking how the bar looks between steps —
 * intermediate values aren't built as variants.
 *
 * KNOWN GAP: despite the description calling it "a percentage label," the
 * live component's actual example text reads a fraction ("2/3"), not
 * "66%" — and thickness=16 has no text layer at all in Figma, so showText
 * only has an effect at thickness=24. Reproduced as a discriminated union
 * for that reason: showText/progressText are only assignable together
 * with thickness="24". The text itself isn't an exposed Figma property
 * (no TEXT componentProperty exists for it, just a per-instance override),
 * so it's a free `progressText` prop here — needed for any real use,
 * defaulted to match Figma's own per-step example values.
 */

export type ProgressIndicatorVariant = "Primary" | "Coral";
export type ProgressIndicatorValue = "0" | "33" | "66" | "100";

interface ProgressIndicatorCommonProps {
  variant?: ProgressIndicatorVariant;
  progress?: ProgressIndicatorValue;
  /** Required: the bar has no visible label by default (showText is
   * false in most uses), so screen readers rely on this entirely. Same
   * requirement as ButtonIcon/MicButton's aria-label. */
  "aria-label": string;
}

export type ProgressIndicatorProps =
  | (ProgressIndicatorCommonProps & {
      thickness: "24";
      /** Figma property name: showText. */
      showText?: boolean;
      /** Free text — Figma exposes no TEXT property for this layer, just a
       * per-instance override. Defaults to Figma's own example for each
       * progress step ("0/12" ... "12/12"). */
      progressText?: string;
    })
  | (ProgressIndicatorCommonProps & { thickness: "16" });

const DEFAULT_PROGRESS_TEXT: Record<ProgressIndicatorValue, string> = {
  "0": "0/3",
  "33": "1/3",
  "66": "2/3",
  "100": "3/3",
};

export function ProgressIndicator(props: ProgressIndicatorProps) {
  const { variant = "Primary", progress = "0", thickness, "aria-label": ariaLabel } = props;
  const showText = props.thickness === "24" ? (props.showText ?? false) : false;
  const progressText =
    props.thickness === "24" ? (props.progressText ?? DEFAULT_PROGRESS_TEXT[progress]) : undefined;

  const rootClassName = [styles.root, styles[`thickness${thickness}`]].join(" ");
  const fillClassName = [styles.fill, styles[`fill${variant}`]].join(" ");

  return (
    <div
      className={rootClassName}
      role="progressbar"
      aria-valuenow={Number(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div className={styles.track}>
        <div className={fillClassName} style={{ width: `${progress}%` }} />
      </div>
      {showText && <span className={styles.text}>{progressText}</span>}
    </div>
  );
}
