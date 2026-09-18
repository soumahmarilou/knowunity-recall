"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { Button } from "@/components/Button/Button";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { NavigationButton } from "@/components/NavigationButton/NavigationButton";
import { Avatar } from "@/components/Avatar/Avatar";
import {
  Timer01,
  ChevronRight,
  BlankPage01,
  StackSparkle01,
  Microphone01,
  Check01,
  DotsVertical,
  MyaiChat,
  SearchMd,
  Target01,
  Trophy02,
} from "@/components/Icons/Icons";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Study plan – home. Accessible from the bottom nav bar's 3rd icon
 * (target-01) on every screen that has one.
 *
 * Reference: reference/study-plan-overview.png — a plan already created
 * ("Maths Exam"), not the empty "create a plan" state this route used to
 * show. Per direct instruction, this IS the study-plan home page now —
 * this prototype's mock data has no real "no plan yet" vs. "has a plan"
 * distinction to branch on, so the empty state (reference/
 * study-plan-empty-state.png) was replaced outright rather than kept as
 * a second variant nothing here would ever actually reach.
 *
 * No Figma frame (Desktop Bridge disconnected for this build too) — built
 * from the reference screenshot. Disclosed deviations/decisions:
 * - Top row (XP badge, "Focus Mode", overflow menu) doesn't fit any of
 *   AppBar's fixed left/right-icon-button variants (no left icon at all
 *   here) — built with `variant="default"` and everything placed in the
 *   middle Slot instead.
 * - "Focus Mode" reads as an action, not a status chip, so it's a real
 *   `Button` (Secondary, M) with Timer01 (already an existing placeholder
 *   icon) rather than a new component — same reasoning as this app's
 *   other secondary-button rows (Home's own quick actions).
 * - The green exam icon's bordered-square badge, the Plan/Materials tabs,
 *   and the "Algebraic Fractions 1" header pill have no matching
 *   Storybook component — built inline from tokens, logged in
 *   component-gaps.md.
 * - The lesson-step circles reuse the exact same badge pattern this
 *   session's own empty-state build already established (done/current/
 *   locked), just re-themed to accent-1 (green) to match this reference
 *   instead of the empty state's accent-brand (purple) — the two screens
 *   showed genuinely different accent colors for what's structurally the
 *   same "step in a path" idea.
 * - Calendar icon (for "3 Weeks") is a new hand-built placeholder — no
 *   calendar glyph exists in this project's icon set. Target01 (already
 *   built for the nav bar) is reused for "Grade Goal: 7". BlankPage01
 *   (already existing) stands in for the header row's open-book icon —
 *   an approximation, not a literal match.
 * - Materials tab, the "Algebraic Fractions 1" header button, and Focus
 *   Mode still have no destination — same "flagged, not silently
 *   invented" treatment as this app's other still-open taps (e.g. Home
 *   chat's non-Recall-exercice ActivityCards). The lesson steps
 *   themselves now DO have one, per direct instruction resolving what was
 *   SPEC.md's own flagged-open "study-plan lesson-step entry point":
 *   step 1 ("Algebraic Fractions") is done, step 2 — renamed "Recall
 *   exercice", per direct instruction — is the current/unlocked one and
 *   enters Mode selection with `entry=study-plan` (`subject` still
 *   carries the lesson's real topic, "Algebraic Fractions", kept as its
 *   own field since it's no longer the same string as the step's own
 *   label). That's the signal every mode's own Summary screen uses to
 *   offer "Return to study plan" instead of "Return to home". The two
 *   remaining "locked" steps stay unwired; nothing in this prototype's
 *   mock data models unlocking them.
 */

const LESSON_STEPS = [
  { label: "Algebraic Fractions", icon: <Check01 />, state: "done" as const },
  { label: "Recall exercice", icon: <Microphone01 />, state: "current" as const, subject: "Algebraic Fractions" },
  { label: "Factorising Fractions", icon: <StackSparkle01 />, state: "locked" as const },
  { label: "Restricted Values", icon: <StackSparkle01 />, state: "locked" as const },
];

function CalendarIcon() {
  // Hand-built placeholder — no calendar glyph exists in this project's
  // icon set, and the Desktop Bridge stayed disconnected for this build.
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="10" width="34" height="30" rx="4" stroke="var(--color-text-secondary)" strokeWidth="3" />
      <path d="M7 19H41" stroke="var(--color-text-secondary)" strokeWidth="3" />
      <path d="M15 6V13" stroke="var(--color-text-secondary)" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 6V13" stroke="var(--color-text-secondary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ExamIcon() {
  // The green glyph inside the hero's bordered badge — same
  // hand-built-placeholder situation as CalendarIcon above. A first draft
  // (two facing chevrons) rendered ambiguously as a "<>" bracket at this
  // size rather than reading as exam-related, so redrawn as a plain
  // checkmark, the least ambiguous "you've got this covered" glyph
  // buildable with confidence without a real Figma source.
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 24L21 31L34 17" stroke="var(--color-accent-1-bold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StudyPlanPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"plan" | "materials">("plan");
  usePrefetchRoutes(["/recall", "/"]);

  return (
    <Screen className={styles.screen}>
      <AppBar variant="default">
        <div className={styles.topRow}>
          <BadgeChip type="xp" label="1" />
          <Button variant="Secondary" size="M" cta="Focus Mode" showLeftIcon leftIcon={<Timer01 />} />
          <ButtonIcon variant="Tertiary" size="M" icon={<DotsVertical />} aria-label="More options" />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <div className={styles.examBadge}>
            <ExamIcon />
          </div>
          <button type="button" className={styles.planTitle}>
            Maths Exam
            <ChevronRight className={styles.chevronDown} />
          </button>
          <div className={styles.statsRow}>
            <span className={styles.stat}>
              <CalendarIcon />
              3 Weeks
            </span>
            <span className={styles.stat}>
              <Target01 />
              Grade Goal: 7
            </span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={[styles.tab, tab === "plan" && styles.tabActive].filter(Boolean).join(" ")}
            onClick={() => setTab("plan")}
          >
            Plan
          </button>
          <button
            type="button"
            className={[styles.tab, tab === "materials" && styles.tabActive].filter(Boolean).join(" ")}
            onClick={() => setTab("materials")}
          >
            Materials
          </button>
        </div>

        {tab === "plan" ? (
          <>
            <div className={styles.lessonHeader}>
              <p className={styles.lessonHeaderTitle}>Algebraic Fractions 1</p>
              <ButtonIcon variant="Secondary" size="S" icon={<BlankPage01 />} aria-label="View materials" />
            </div>

            <div className={styles.stepsList}>
              {LESSON_STEPS.map((step) => {
                const isCurrent = step.state === "current";
                const nodeClass =
                  step.state === "done" ? styles.nodeDone : isCurrent ? styles.nodeCurrent : styles.nodeLocked;
                const content = (
                  <>
                    <span className={[styles.node, nodeClass].join(" ")}>
                      {isCurrent ? <span className={styles.nodeIconLarge}>{step.icon}</span> : step.icon}
                    </span>
                    <p className={[styles.stepLabel, isCurrent && styles.stepLabelCurrent].filter(Boolean).join(" ")}>
                      {step.label}
                    </p>
                  </>
                );
                return isCurrent ? (
                  <button
                    key={step.label}
                    type="button"
                    className={styles.step}
                    onClick={() =>
                      router.push(`/recall?subject=${encodeURIComponent(step.subject)}&entry=study-plan`)
                    }
                  >
                    {content}
                  </button>
                ) : (
                  <div key={step.label} className={styles.step}>
                    {content}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className={styles.materialsPlaceholder}>No materials linked yet.</p>
        )}
      </div>

      <div className={styles.navbar}>
        <NavigationButton icon={<MyaiChat />} hasLabel={false} state="Inactive" onClick={() => router.push("/")} />
        <NavigationButton icon={<SearchMd />} hasLabel={false} state="Inactive" />
        <NavigationButton icon={<Target01 />} hasLabel={false} state="Active" />
        <NavigationButton icon={<Trophy02 />} hasLabel={false} state="Inactive" />
        <Avatar size="Large" shape="Circle" initials="H" />
      </div>
    </Screen>
  );
}
