"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { SuperlistItem } from "@/components/SuperlistItem/SuperlistItem";
import { ButtonGroup } from "@/components/ButtonGroup/ButtonGroup";
import { Button } from "@/components/Button/Button";
import { XClose, GraduationHat01 } from "@/components/Icons/Icons";
import { getSummaryTerms } from "../terms";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Guided Reflection – Summary. SPEC.md screen 7d
 * (src/app/recall/guided-reflection/summary/page.tsx). Figma frame:
 * "Guided Reflection - Summary" (node 13760:4750, Design Deliverables
 * page). Same AppBar deviation as Mode selection / earlier screens: the
 * frame's second right-side icon button has no resolvable icon, built as
 * leftIconButtonOnly instead. Always recaps the same 2 cards regardless of
 * how many loop turns actually happened before "Finish" was tapped —
 * there's no tracking of partial progress across route navigations in
 * this mocked prototype, and the session no longer has a fixed term count
 * to recap literally now that it loops (see terms.ts's header comment).
 * Converted to the Suspense/search-param pattern to read `entry`.
 */
export function GuidedReflectionSummaryContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/guided-reflection/summary/continue", "/", "/study-plan"]);
  const searchParams = useSearchParams();
  const summaryTerms = getSummaryTerms();
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

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
          <MascotSlot size="2XL" expression="excited" animate />
          <h1 className={styles.heading}>Here&apos;s what you explored</h1>
          <p className={styles.subtitle}>No score here, just what stuck.</p>
        </div>

        <div className={styles.highlights}>
          {summaryTerms.map((term) => (
            <SuperlistItem
              key={term.topic}
              icon={<GraduationHat01 />}
              iconColor="3"
              title={term.topic}
              descriptor={term.summaryDescriptor}
              showTrailingChevron={false}
            />
          ))}
        </div>
      </div>

      <div className={styles.bottomContent}>
        <ButtonGroup variant="Vertical" size="L">
          <Button
            variant="Primary"
            size="L"
            cta="Continue studying"
            onClick={() => router.push("/recall/guided-reflection/summary/continue")}
          />
          <Button
            variant="Secondary"
            size="L"
            cta={entry === "study-plan" ? "Return to study plan" : "Return to home"}
            onClick={() => router.push(entry === "study-plan" ? "/study-plan" : "/")}
          />
        </ButtonGroup>
      </div>
    </Screen>
  );
}
