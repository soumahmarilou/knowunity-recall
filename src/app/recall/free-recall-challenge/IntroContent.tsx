"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { IconBadge } from "@/components/IconBadge/IconBadge";
import { Button } from "@/components/Button/Button";
import { XClose, GraduationHat01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import { getSubjectFromSearchParam } from "./frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Intro. SPEC.md screen 3 (src/app/recall/free-recall-challenge/page.tsx).
 * Figma frame: "Free Recall Challenge - Intro" (node 13659:5485, Design
 * Deliverables page) — static, single state, no failure paths to build.
 *
 * Converted to the Suspense/search-param pattern (was a plain default
 * export) to carry `entry` (Home chat vs. Study plan, see
 * src/lib/entryPoint.ts) through into the session, same as every other
 * mode's own Intro. Now also carries `subject` — previously dropped
 * silently at this exact hop from Mode selection; interpolated into the
 * main loop's prompt (see frc.ts) and term 1's opening line in the
 * aspect-to-revise sub-flow.
 *
 * Revised per direct instruction, same treatment as Guided Reflection's
 * and Concept Questions' own Intros (see Guided Reflection's file
 * comment for the full reasoning): the explanatory benefit list is now
 * folded into the title itself, with a small icon+name eyebrow above it
 * using Mode selection's own icon for this card (GraduationHat01) — this
 * screen previously used three different, unrelated icons (Timer01/
 * Gauge01/TrendingUp01) and never this mode's own identity icon anywhere
 * on it. The old benefit rows are replaced by a single "how does Knowie
 * judge this" line (this build's disclosed proposal, not Figma-sourced).
 *
 * Revised again per direct instruction: the mascot is gone from this
 * screen entirely, replaced by a large `IconBadge` (`size="L"`, see
 * Guided Reflection's own Intro comment for the full reasoning) showing
 * this same identity icon at hero scale — `color="4"`, matching Mode
 * selection's own `iconColor` for this card.
 *
 * Revised a third time, same treatment as Guided Reflection's own Intro
 * (see that file's comment): the eyebrow's own icon and the transparency
 * line's leading icon are both gone, the eyebrow is one step bigger and
 * spaced further from the title, and the transparency line is centered.
 *
 * Revised a fourth time, same treatment as Guided Reflection's own Intro
 * (see that file's comment): the standalone hero-scale `IconBadge` is
 * gone, replaced by a much smaller one (`size="M"`) sitting beside the
 * eyebrow text again, horizontally aligned as one row. The gap to the
 * title below grew again too (spacing-400).
 */
const TITLE = "Say everything you remember before time's up";
const TRANSPARENCY_LINE = "Knowie checks how many of the lesson's topics you actually mention.";
export function FreeRecallChallengeIntroContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/session"]);
  const searchParams = useSearchParams();
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  return (
    <Screen className={styles.screenGap}>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 0))}
      />

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <div className={styles.titleGroup}>
            <div className={styles.exerciseLabel}>
              <IconBadge size="M" color="4" icon={<GraduationHat01 />} />
              <span className={styles.exerciseLabelText}>Free Recall Challenge</span>
            </div>
            <TextBlock variant="L" showCaption={false} title={TITLE} />
          </div>
        </div>

        <div className={styles.benefits}>
          <p className={styles.benefitLabel}>{TRANSPARENCY_LINE}</p>
        </div>
      </div>

      <div className={styles.bottomContent}>
        <Button
          variant="Primary"
          size="L"
          cta="Start"
          onClick={() =>
            router.push(
              `/recall/free-recall-challenge/session?start=${Date.now()}&coverage=0&xp=0&subject=${encodeURIComponent(subject)}&entry=${entry}`,
            )
          }
        />
      </div>
    </Screen>
  );
}
