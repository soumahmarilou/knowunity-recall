"use client";

import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { SuperlistItem } from "@/components/SuperlistItem/SuperlistItem";
import { XClose, GraduationHat01 } from "@/components/Icons/Icons";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Summary - Continue. SPEC.md screen 9h — "same
 * pattern as 7e/8g" — identical copy to Guided Reflection's and Concept
 * Questions' own Summary - Continue.
 */
export default function FreeRecallChallengeSummaryContinuePage() {
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
         sitting right under the heading anymore. */}
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
