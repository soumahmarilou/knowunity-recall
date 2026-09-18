"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { IconSlot } from "@/components/IconSlot/IconSlot";
import { Button } from "@/components/Button/Button";
import { XClose, Microphone01, Lightbulb01, TrendingUp01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
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
 * mode's own Intro.
 */
export function ConceptQuestionsIntroContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session"]);
  const searchParams = useSearchParams();
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  return (
    <Screen className={styles.screenGap}>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
      />

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <MascotSlot size="2XL" expression="excited" />
          <TextBlock variant="L" showCaption={false} title="Concept Questions" />
        </div>

        <div className={styles.benefits}>
          <div className={styles.benefitRow}>
            <IconSlot size="300" icon={<Microphone01 />} />
            <p className={styles.benefitLabel}>Explain concepts out loud</p>
          </div>
          <div className={styles.benefitRow}>
            {/* Lightbulb01 is hardcoded blue (accent-3) to match Mode
             * selection's blue IconBadge — overridden to the same neutral
             * color as this row's siblings here instead of changing the
             * shared component, since Mode selection still needs it blue. */}
            <span className={styles.neutralIcon}>
              <IconSlot size="300" icon={<Lightbulb01 />} />
            </span>
            <p className={styles.benefitLabel}>Stuck? Knowie gives you a hint</p>
          </div>
          <div className={styles.benefitRow}>
            {/* TrendingUp01 is a hand-built placeholder — see component-gaps.md */}
            <IconSlot size="300" icon={<TrendingUp01 />} />
            <p className={styles.benefitLabel}>Active recall boosts retention by up to 20%</p>
          </div>
        </div>
      </div>

      <div className={styles.bottomContent}>
        <Button
          variant="Primary"
          size="L"
          cta="Start"
          onClick={() => router.push(`/recall/concept-questions/session?entry=${entry}`)}
        />
      </div>
    </Screen>
  );
}
