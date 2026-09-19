"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { Button } from "@/components/Button/Button";
import { ButtonGroup } from "@/components/ButtonGroup/ButtonGroup";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { XClose } from "@/components/Icons/Icons";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getSubjectFromSearchParam,
  deriveMissedAspectCount,
  buildFrcQuery,
} from "../frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Summary. SPEC.md screen 9e. Component list
 * originally read text + two buttons only, no MascotSlot — per direct
 * instruction, now also shows the final coverage gauge (right under the
 * heading) and a MascotBubble (position="Right", per direct instruction)
 * inviting the student into the revise sub-flow. Buttons relabeled
 * "Continue the exercice" / "Skip to summary", also per direct
 * instruction, replacing the earlier missedCount-conditional subtitle
 * text and generic "Continue"/"Skip" — same simplification direction as
 * this mode's own post-segment message (one fixed line, not a branch per
 * outcome). The routing itself still branches on `missedCount` (nothing
 * to revise skips straight to Final Summary either way) — that's just no
 * longer reflected in the copy.
 *
 * At coverage 100% there's nothing left to revise, so per direct
 * instruction this screen drops both the "revise" invitation (no
 * MascotBubble) and the two-button choice — just a single "Continue"
 * straight to Final Summary. The gauge still shows (now reading 100%).
 */
export function FreeRecallChallengeSummaryContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/free-recall-challenge/summary/aspect-to-revise",
    "/recall/free-recall-challenge/final-summary",
  ]);
  const searchParams = useSearchParams();
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const missedCount = deriveMissedAspectCount(coverage);

  const handleContinue = () => {
    if (missedCount === 0) {
      router.push(
        `/recall/free-recall-challenge/final-summary?${buildFrcQuery({ coverage, xp, subject, entry })}`,
      );
      return;
    }
    router.push(
      `/recall/free-recall-challenge/summary/aspect-to-revise?${buildFrcQuery({
        aspect: 1,
        total: missedCount,
        hints: 0,
        coverage,
        xp,
        subject,
        entry,
      })}`,
    );
  };

  const handleSkip = () => {
    router.push(
      `/recall/free-recall-challenge/final-summary?${buildFrcQuery({ coverage, xp, subject, entry })}`,
    );
  };

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
      />

      <div className={styles.middleContent}>
        <h1 className={styles.heading}>You covered {coverage}% of the lesson!</h1>
        <ProgressIndicator
          variant="Primary"
          thickness="24"
          progress={coverage}
          aria-label={`Final coverage ${coverage}%`}
        />
        {coverage !== "100" && (
          <MascotBubble
            position="Right"
            bodyText="Let's revise the aspects you didn't think of!"
            showChip={false}
            showButton={false}
          />
        )}
      </div>

      <div className={styles.bottomContent}>
        {coverage === "100" ? (
          <Button variant="Primary" size="L" cta="Continue" onClick={handleContinue} />
        ) : (
          <ButtonGroup variant="Vertical" size="L">
            <Button variant="Primary" size="L" cta="Continue the exercice" onClick={handleContinue} />
            <Button variant="Secondary" size="L" cta="Skip to summary" onClick={handleSkip} />
          </ButtonGroup>
        )}
      </div>
    </Screen>
  );
}
