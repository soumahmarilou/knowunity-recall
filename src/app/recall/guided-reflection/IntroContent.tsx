"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppBar } from "@/components/AppBar/AppBar";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { Screen } from "@/components/Screen/Screen";
import { IconBadge } from "@/components/IconBadge/IconBadge";
import { Button } from "@/components/Button/Button";
import { XClose, Microphone01 } from "@/components/Icons/Icons";
import { getSubjectFromSearchParam } from "./terms";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Guided Reflection – Intro. SPEC.md screen 1 (src/app/recall/guided-reflection/page.tsx).
 * Figma frame: "Guided Reflection - Intro" (node 13659:5199, Design
 * Deliverables page) — static, single state, no failure paths to build.
 * Converted to the Suspense/search-param pattern to carry `subject`
 * through into the session — see terms.ts's header comment.
 *
 * Revised per direct instruction: the explanatory benefit list used to
 * take 2 lines of body text to say what this mode is; that's now folded
 * into the title itself (so the concept reads in one glance, no
 * scrolling/reading required to understand what's about to happen), with
 * a small icon+name eyebrow above it for identity — same icon
 * (Microphone01) Mode selection already uses for this exact card, not a
 * new one, so the identity carries through instead of drifting between
 * screens. The old benefit rows are replaced by a single line answering
 * "how does Knowie judge this" (this build's disclosed proposal for that
 * open ask, not a Figma-sourced copy) — Guided Reflection's own answer is
 * that there isn't one, since this mode never scores anything.
 *
 * Revised again per direct instruction: the mascot is gone from this
 * screen entirely, replaced by a large `IconBadge` (`size="L"`, added to
 * that component for this exact purpose) showing this same identity icon
 * at hero scale instead — the icon itself carries the identity a mascot
 * would otherwise occupy. `color="1"`, matching Mode selection's own
 * `iconColor` for this card.
 *
 * Revised a third time per direct instruction: the small eyebrow's own
 * icon is gone (the large `IconBadge` above it already carries that
 * identity, so a second copy of the same icon right next to it read as
 * redundant) — plain text now, one step bigger on the type scale
 * (caption-m instead of caption-s) and with more room between it and the
 * title below (spacing-300 instead of spacing-100). The transparency
 * line's own leading icon is gone too, and the line itself is centered.
 *
 * Revised a fourth time per direct instruction: the standalone hero-scale
 * `IconBadge` is gone — instead, a much smaller one (`size="M"`, the same
 * size Superlist item's own leading icon already uses, ~60% smaller than
 * the hero-scale one this replaces) sits directly beside the eyebrow text
 * again, the two horizontally aligned as one row. The gap to the title
 * below grew again too (spacing-400, up from spacing-300) now that the
 * row above it is shorter and needs more separation to read as distinct.
 */
const TITLE = "Talk through what you learned";
const TRANSPARENCY_LINE = "There's no scoring here: nothing you say is marked right or wrong.";
export function GuidedReflectionIntroContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/guided-reflection/session"]);
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
              <IconBadge size="M" color="1" icon={<Microphone01 />} />
              <span className={styles.exerciseLabelText}>Guided Reflection</span>
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
              `/recall/guided-reflection/session?subject=${encodeURIComponent(subject)}&entry=${entry}`,
            )
          }
        />
      </div>
    </Screen>
  );
}
