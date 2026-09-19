"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { Screen } from "@/components/Screen/Screen";
import { IconSlot } from "@/components/IconSlot/IconSlot";
import { Button } from "@/components/Button/Button";
import { XClose, Microphone01, GraduationHat01 } from "@/components/Icons/Icons";
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
 */
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
          <MascotSlot size="2XL" expression="excited" />
          <TextBlock variant="L" showCaption={false} title="Guided Reflection" />
        </div>

        <div className={styles.benefits}>
          <div className={styles.benefitRow}>
            <IconSlot size="300" icon={<Microphone01 />} />
            {/* "will asks you" is verbatim from the Figma frame's copy —
             * reproduced as-is, not corrected. Flagged in the build report. */}
            <p className={styles.benefitLabel}>
              Knowie will asks you your thoughts about what you learned
            </p>
          </div>
          <div className={styles.benefitRow}>
            <IconSlot size="300" icon={<GraduationHat01 />} />
            <p className={styles.benefitLabel}>
              Your understanding of your lesson will deepen through conversation
            </p>
          </div>
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
