import type { ReactNode } from "react";
import { Chips } from "../Chips/Chips";
import styles from "./QuizResultRow.module.css";

/**
 * A quiz/recall summary row. Figma: "Quiz result row" component (a
 * single static component, not a component set — no variant axis, just
 * two exposed text properties, plus the nested chips instance's own
 * properties bubbled up).
 *
 * WHAT IT IS: A row stacking an optional "Question N" eyebrow, a title,
 * and a footer pairing an inline XP indicator (icon + value) with the
 * real chips component as an outcome badge. Text properties Title and XP
 * value are exposed; the nested chips instance's own properties (color,
 * Text, icon visibility) are also exposed and editable from this
 * component directly, no drilling in required.
 *
 * WHEN TO USE IT: One row per concept in a quiz or recall summary.
 *
 * DON'T: Don't expect the lightning icon to be swappable via a component
 * property — it's a raw vector group, not an icon-component instance,
 * same limitation as Stat box's own lightning icon.
 *
 * The outcome badge reuses the already-built Chips component directly
 * (always at size=S, active=True — the only combination this row's own
 * Figma instance ever uses, and the only one success/info/error support
 * anyway). The lightning icon is inlined as a fixed, non-swappable glyph
 * per the DON'T above — its real vector path, not Icons.tsx's larger
 * illustrative Lightning01 (a visually different glyph built for a
 * different context).
 *
 * Revised per direct instruction: the XP indicator and outcome chip used
 * to share the title's own row (title `flex:1`, xp+chip fixed-width on
 * the right), which squeezed a long title into a narrow column and grew
 * the row tall via wrapping. Now a column layout — title gets the row's
 * full width, xp+chip moved to their own footer row below it. A new,
 * code-only `questionNumber` prop (not a Figma property — this
 * component's Figma instance has no such field) renders a small "Question
 * N" eyebrow above the title, reusing Study plan's own established
 * "ordinal caption above a title" pattern (`caption-m-regular` /
 * `text-tertiary`) rather than inventing a new one.
 */

export type QuizResultRowChipColor = "Primary" | "pro" | "success" | "info" | "error";

export interface QuizResultRowProps {
  /** Code-only, not a Figma property — see the component comment above. */
  questionNumber?: number;
  /** Figma property name: Title. */
  title?: string;
  /** Figma property name: XP value. */
  xpValue?: string;
  /** The nested chips instance's own Text property. */
  chipText?: string;
  /** The nested chips instance's own color property. */
  chipColor?: QuizResultRowChipColor;
  chipShowLeftIcon?: boolean;
  chipShowRightIcon?: boolean;
  chipLeftIcon?: ReactNode;
  chipRightIcon?: ReactNode;
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 11.903429985046387 14.602334022521973" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        transform="translate(0, 1.6988329887390137)"
        d="M 3.1631475165403318 14.602334022521973 C 2.5420932789028576 14.602334022521973 1.955929508891321 14.26917429833092 1.6279570418790261 13.730447428799367 C 1.2999845748667314 13.191720559267814 1.2720720926243336 12.532488981893417 1.5581757322906784 11.958319546260931 C 2.081536053318583 10.895042816737869 2.4932464869698383 10.072774488880786 2.807262671267993 9.434808468067278 C 2.507202748887508 9.434808468067278 2.1722517973763766 9.434808468067278 1.7954323512628263 9.434808468067278 C 1.034815328076891 9.434808468067278 0.37189236707581996 8.966967153245802 0.11370127204128502 8.243938990690383 C -0.1514679539520847 7.520910828134964 0.05787620357413614 6.726997406625215 0.6300834829068257 6.230801607964617 C 2.1443393983198615 4.919426957985845 5.77297032523396 2.013137298224124 7.803608430716065 0.3898681848594414 C 8.124602766769526 0.13468175963370949 8.50840094693956 0 8.906154785929614 0 C 9.555121588995368 0 10.15524141295987 0.36151412352853085 10.476235749013329 0.9356835591610171 C 10.790251933311483 1.502764490023481 10.776295525818519 2.211615474035571 10.441344927847389 2.7716079001280125 L 9.206214250787744 4.83436464724065 L 10.106393976336259 4.83436464724065 C 10.860032868563358 4.83436464724065 11.522955808767959 5.3022064690719795 11.788125034761329 6.018146126857377 C 12.053294260754699 6.734085784642774 11.850928754099078 7.527999206152524 11.285699605725224 8.031283509583144 L 4.342452813185767 14.14866971724054 C 4.014480346173473 14.439298687441795 3.595792218289267 14.595245348748666 3.170125813870932 14.595245348748666 L 3.1631475165403318 14.602334022521973 Z"
        fill="var(--color-accent-3-bold)"
      />
      <path
        transform="translate(1.0280879735946655, 2.7511167526245117)"
        d="M 2.1280072068588725 12.500940311125191 C 1.967510024350411 12.500940311125191 1.8000344918905127 12.444232554224563 1.6604717249439476 12.337904889477016 C 1.3673899278738681 12.111072552099191 1.2836522968209907 11.714115676494988 1.451127610917927 11.380955674369618 C 2.518782742185235 9.226048448154875 3.118902724281179 8.006824249210371 3.4887440312138973 7.319238690884714 C 2.930492963427637 7.340504222513886 2.072181987779295 7.34050470971861 0.7602920013577028 7.34050470971861 C 0.43929763634077945 7.34050470971861 0.1601720972485311 7.142026388106253 0.04852188785057355 6.837220422871759 C -0.06312832154738401 6.532414457637265 0.020609366695792997 6.19216593044512 0.27182235343855193 5.97951060095003 C 1.772122142306631 4.682313112155384 5.393775452213507 1.7831120214537446 7.417435609332528 0.166931601792688 C 7.710517406402607 -0.06698926065191171 8.108271530839842 -0.052812083765912815 8.387397064732971 0.19528578656142087 C 8.6665225986261 0.4504721819555296 8.729325866108264 0.8545173713724263 8.53393799446272 1.1805888695564293 L 6.342802346476745 4.838259945360561 L 9.08521088906756 4.838259945360561 C 9.406205254084483 4.838259945360561 9.685331099924701 5.036738266972917 9.796981309322659 5.341544232207411 C 9.908631518720616 5.6463501974419055 9.824893565322414 5.979510220692683 9.580658730964602 6.199254054129141 L 2.637411311932865 12.31663887064312 C 2.4908704133978254 12.444232068340174 2.3164169261194694 12.508028984069824 2.141963470035822 12.508028984069824 L 2.1280072068588725 12.500940311125191 Z M 4.4447488906938295 7.184557285002007 C 4.305186123747265 7.461009192220216 3.7888040222618686 8.488843362239649 2.2954823649822647 11.508549083320753 L 8.924714028904424 5.667615751516823 L 6.23115224106115 5.667615751516823 C 5.959004859552968 5.667615751516823 5.700813866000569 5.518757401127605 5.568229241040715 5.2706595308002715 C 5.435644616080861 5.029650164414305 5.442622404527539 4.731932449616281 5.582185171474103 4.490923083230314 L 7.668649012004738 1.0104644369570916 C 5.6449888548857174 2.6195563526767813 2.330373106110528 5.284836707686271 0.8579860099681287 6.546591592272448 C 2.9723618777373204 6.511149038236825 3.893476006487225 6.49697207128457 4.053973188995687 6.489883560741513 C 4.1097982936946655 6.468618029112341 4.158645433176951 6.475706539655398 4.2214486798626405 6.489883560741513 C 4.402880267534762 6.532414623999855 4.535464767715781 6.702538657857113 4.535464767715781 6.893928454402695 C 4.535464767715781 7.0286101560411165 4.535464861299907 7.12076068615348 4.437770925477135 7.184557285002007 L 4.4447488906938295 7.184557285002007 Z"
        fill="var(--color-accent-3-on-bold)"
      />
    </svg>
  );
}

export function QuizResultRow({
  questionNumber,
  title = "Factoring",
  xpValue = "10  XP",
  chipText = "First try",
  chipColor = "success",
  chipShowLeftIcon = false,
  chipShowRightIcon = false,
  chipLeftIcon,
  chipRightIcon,
}: QuizResultRowProps) {
  return (
    <div className={styles.row}>
      {questionNumber !== undefined && (
        <p className={styles.questionNumber}>Question {questionNumber}</p>
      )}
      <p className={styles.title}>{title}</p>
      <div className={styles.footer}>
        <span className={styles.xpIndicator}>
          <span className={styles.lightningIcon} aria-hidden="true">
            <LightningIcon />
          </span>
          <span className={styles.xpValue}>{xpValue}</span>
        </span>
        <Chips
          text={chipText}
          color={chipColor}
          size="S"
          active="True"
          showLeftIcon={chipShowLeftIcon}
          showRightIcon={chipShowRightIcon}
          leftIcon={chipLeftIcon}
          rightIcon={chipRightIcon}
        />
      </div>
    </div>
  );
}
