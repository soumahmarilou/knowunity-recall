"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { IconBadge } from "@/components/IconBadge/IconBadge";
import { Button } from "@/components/Button/Button";
import { XClose, Lightbulb01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import { getSubjectFromSearchParam } from "./terms";
import styles from "./page.module.css";

/**
 * Concept Questions – Intro. SPEC.md screen 3 (src/app/recall/concept-questions/page.tsx).
 * Figma frame: "Recall Questions - Intro" (node 13659:5342, Design
 * Deliverables page — named "Recall Questions" in Figma, "Concept
 * Questions" everywhere else; see SPEC.md's Open section) — static,
 * single state, no failure paths to build.
 *
 * Converted to the Suspense/search-param pattern (was a plain default
 * export) to carry `entry` (Home chat vs. Study plan, see
 * src/lib/entryPoint.ts) through into the session, same as every other
 * mode's own Intro. Now also carries `subject` — previously dropped
 * silently at this exact hop from Mode selection (only Guided Reflection
 * threaded it); term 1's opening line interpolates it, see terms.ts.
 *
 * Revised per direct instruction, same treatment as Guided Reflection's
 * own Intro (see that file's comment for the full reasoning): the
 * explanatory benefit list is now folded into the title itself, with a
 * small icon+name eyebrow above it using Mode selection's own icon for
 * this card (Lightbulb01) rather than the Microphone01 this screen used
 * before — that earlier choice didn't match this mode's own identity
 * anywhere else in the app. The old benefit rows are replaced by a
 * single "how does Knowie judge this" line (this build's disclosed
 * proposal, not Figma-sourced).
 *
 * Revised again per direct instruction: the mascot is gone from this
 * screen entirely, replaced by a large `IconBadge` (`size="L"`, see
 * Guided Reflection's own Intro comment for the full reasoning) showing
 * this same identity icon at hero scale — `color="3"`, matching Mode
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
const TITLE = "Answer questions, get hints if you're stuck";
const TRANSPARENCY_LINE = "Knowie checks whether your answer includes the key ideas behind each concept.";
export function ConceptQuestionsIntroContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session"]);
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
              <IconBadge size="M" color="3" icon={<Lightbulb01 />} />
              <span className={styles.exerciseLabelText}>Concept Questions</span>
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
              `/recall/concept-questions/session?subject=${encodeURIComponent(subject)}&entry=${entry}`,
            )
          }
        />
      </div>
    </Screen>
  );
}
