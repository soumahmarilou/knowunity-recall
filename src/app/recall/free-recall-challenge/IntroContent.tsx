"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { IconSlot } from "@/components/IconSlot/IconSlot";
import { Button } from "@/components/Button/Button";
import { XClose, Timer01, Gauge01, TrendingUp01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import { getSubjectFromSearchParam } from "./frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Intro. SPEC.md screen 3 (src/app/recall/free-recall-challenge/page.tsx).
 * Figma frame: "Free Recall Challenge - Intro" (node 13659:5485, Design
 * Deliverables page) — static, single state, no failure paths to build.
 *
 * Converted to the Suspense/search-param pattern (was a plain default
 * export) to carry `entry` (Home chat vs. Study plan, see
 * src/lib/entryPoint.ts) through into the session, same as every other
 * mode's own Intro. Now also carries `subject` — previously dropped
 * silently at this exact hop from Mode selection; interpolated into the
 * main loop's prompt (see frc.ts) and term 1's opening line in the
 * aspect-to-revise sub-flow.
 */
export function FreeRecallChallengeIntroContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/session"]);
  const searchParams = useSearchParams();
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
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
          <TextBlock variant="L" showCaption={false} title="Free Recall Challenge" />
        </div>

        <div className={styles.benefits}>
          <div className={styles.benefitRow}>
            {/* Timer01 is a hand-built placeholder — see component-gaps.md */}
            <IconSlot size="300" icon={<Timer01 />} />
            <p className={styles.benefitLabel}>60 seconds to say everything you remember</p>
          </div>
          <div className={styles.benefitRow}>
            {/* Gauge01 is a hand-built placeholder — see component-gaps.md */}
            <IconSlot size="300" icon={<Gauge01 />} />
            <p className={styles.benefitLabel}>Watch your coverage gauge fill up</p>
          </div>
          <div className={styles.benefitRow}>
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
          onClick={() =>
            router.push(
              `/recall/free-recall-challenge/session?start=${Date.now()}&coverage=0&xp=0&subject=${encodeURIComponent(subject)}&entry=${entry}`,
            )
          }
        />
      </div>
    </Screen>
  );
}
