"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { StatBox } from "@/components/StatBox/StatBox";
import { ButtonGroup } from "@/components/ButtonGroup/ButtonGroup";
import { Button } from "@/components/Button/Button";
import { XClose, Lightning01, Gauge01 } from "@/components/Icons/Icons";
import { getCoverageFromSearchParam, getXpFromSearchParam } from "../frc";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Final Summary. SPEC.md screen 9g. "Score"
 * (the second StatBox) isn't a concept defined anywhere else in SPEC.md —
 * mapped here directly to the session's final coverage percentage, the
 * only session-level performance number this mode actually produces, a
 * disclosed decision rather than inventing a separate scoring system.
 * The secondary ButtonGroup action was "Skip" going to the same
 * destination as "Continue" — per direct instruction, relabeled to match
 * every other mode's own final screen: "Continue studying" (unchanged
 * destination) and "Return to home"/"Return to study plan" depending on
 * `entry` (Home chat vs. Study plan, see src/lib/entryPoint.ts).
 */
export function FinalSummaryContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/summary/continue", "/", "/study-plan"]);
  const searchParams = useSearchParams();
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  const goToContinue = () => router.push("/recall/free-recall-challenge/summary/continue");
  const goToReturn = () => router.push(entry === "study-plan" ? "/study-plan" : "/");

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
      />

      <div className={styles.middleContent}>
        <MascotSlot size="2XL" expression="standby" animate />
        <h1 className={styles.heading}>Challenge complete!</h1>

        <div className={styles.stats}>
          <StatBox icon={<Lightning01 />} label="XP" value={String(xp)} color="3" />
          <StatBox icon={<Gauge01 />} label="Score" value={`${coverage}%`} color="4" />
        </div>
      </div>

      <div className={styles.bottomContent}>
        <ButtonGroup variant="Vertical" size="L">
          <Button variant="Primary" size="L" cta="Continue studying" onClick={goToContinue} />
          <Button
            variant="Secondary"
            size="L"
            cta={entry === "study-plan" ? "Return to study plan" : "Return to home"}
            onClick={goToReturn}
          />
        </ButtonGroup>
      </div>
    </Screen>
  );
}
