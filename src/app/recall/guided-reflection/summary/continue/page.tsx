"use client";

import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { SuperlistItem } from "@/components/SuperlistItem/SuperlistItem";
import { XClose, GraduationHat01 } from "@/components/Icons/Icons";
import styles from "./page.module.css";

/**
 * Guided Reflection – Summary - Continue. SPEC.md screen 7e
 * (src/app/recall/guided-reflection/summary/continue/page.tsx). Figma
 * frame: "Guided Reflection - Summary - Continue" (node 13759:3769,
 * Design Deliverables page). Note: mascot expression is "standby" here,
 * not "excited" — confirmed from the frame, a deliberately calmer beat
 * than the Summary reveal before it.
 */
export default function GuidedReflectionSummaryContinuePage() {
  const router = useRouter();

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
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
         built, so no onClick is wired. */}
      <div className={styles.bottomContent}>
        <SuperlistItem
          icon={<GraduationHat01 />}
          iconColor="3"
          title="Find Study Notes"
          descriptor="Revise the concepts to recall even better next time"
        />
      </div>
    </Screen>
  );
}
