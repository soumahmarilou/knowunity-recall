"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { SuperlistItem } from "@/components/SuperlistItem/SuperlistItem";
import { XClose, GraduationHat01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import styles from "./page.module.css";

/**
 * Guided Reflection – Summary - Continue. SPEC.md screen 7e
 * (src/app/recall/guided-reflection/summary/continue/page.tsx). Figma
 * frame: "Guided Reflection - Summary - Continue" (node 13759:3769,
 * Design Deliverables page). Note: mascot expression is "standby" here,
 * not "excited" — confirmed from the frame, a deliberately calmer beat
 * than the Summary reveal before it.
 *
 * Converted to the Suspense/search-param pattern to read `entry` — this
 * screen's own Close button was still hardcoded to `router.push("/")`
 * regardless of where the student came from, unlike every other Close
 * button in this flow.
 */
export function GuidedReflectionSummaryContinueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 75))}
      />

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <MascotSlot size="2XL" expression="standby" />
          <h1 className={styles.heading}>Continue studying</h1>
        </div>
      </div>

      {/* Anchored at the bottom of the page, per direct instruction — not
         sitting right under the heading anymore. Tapping this row is out
         of scope per SPEC.md — the flashcard/study-notes surface isn't
         built, so no onClick is wired. showTrailingChevron={false} per
         the component's own doc comment ("Don't leave Show trailing
         chevron on for a row that isn't actually tappable") — it was
         rendering as a real <button> with no destination and a false
         "tap to navigate" chevron. */}
      <div className={styles.bottomContent}>
        <SuperlistItem
          icon={<GraduationHat01 />}
          iconColor="3"
          title="Find Study Notes"
          descriptor="Revise the concepts to recall even better next time"
          showTrailingChevron={false}
        />
      </div>
    </Screen>
  );
}
