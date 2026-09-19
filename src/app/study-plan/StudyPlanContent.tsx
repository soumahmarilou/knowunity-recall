"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ProgressRing, type ProgressRingValue } from "@/components/ProgressRing/ProgressRing";
import { NavigationButton } from "@/components/NavigationButton/NavigationButton";
import { Avatar } from "@/components/Avatar/Avatar";
import {
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
 * - Top row (XP badge, overflow menu) doesn't fit any of AppBar's fixed
 *   left/right-icon-button variants (no left icon at all here) — built
 *   with `variant="default"` and everything placed in the middle Slot
 *   instead. The row originally also had a "Focus Mode" button; removed
 *   per direct instruction — it had no destination and no clear meaning
 *   on screen.
 * - The green exam icon's bordered-square badge, the Plan/Materials tabs,
 *   and the "Algebraic Fractions 1" header pill have no matching
 *   Storybook component — built inline from tokens, logged in
 *   component-gaps.md.
 * - Calendar icon (for "3 Weeks") is a new hand-built placeholder — no
 *   calendar glyph exists in this project's icon set. Target01 (already
 *   built for the nav bar) is reused for "Grade Goal: 7". BlankPage01
 *   (already existing) stands in for the header row's open-book icon —
 *   an approximation, not a literal match.
 * - Materials tab and the "Algebraic Fractions 1" header button still
 *   have no destination — same "flagged, not silently invented"
 *   treatment as this app's other still-open taps.
 *
 * Lesson-step icons, per direct instruction (see component-gaps.md for
 * the full build note): real `ButtonIcon` instances now, not a
 * hand-rolled circle. Done → `variant="Success"`. Locked → `variant=
 * "Primary" state="Disabled"` — both already existed once actually
 * checked against Figma, nothing new needed for either. Current → the
 * plain `variant="Primary"` default, wrapped in a new `ProgressRing`
 * that fills toward how far the student got (`?progress=` on this
 * route, snapped to the nearest of 0/25/50/75/100) and pulses gently to
 * invite a tap. The tappable area is the icon alone now — the label next
 * to it is plain, inert text, not part of any control (per direct
 * instruction).
 */

type LessonStepState = "done" | "current" | "locked";
interface LessonStep {
  label: string;
  state: LessonStepState;
  subject?: string;
}

// `completed` (from `?completed=1`, set by a mode's own Summary screen's
// "Return to study plan" button — see src/lib/entryPoint.ts) flips
// "Recall exercice" from current to done and unlocks the next step, per
// direct instruction. "Factorising Fractions" has no real lesson content
// of its own in this prototype's mock data — it becomes visually current
// (real ButtonIcon + ProgressRing treatment) but isn't wired to a
// subject/onClick of its own yet, same "flagged, not silently invented"
// treatment as this file's other still-open taps (see component-gaps.md).
function getLessonSteps(completed: boolean): LessonStep[] {
  return [
    { label: "Algebraic Fractions", state: "done" },
    {
      label: "Recall exercice",
      state: completed ? "done" : "current",
      subject: "Algebraic Fractions",
    },
    { label: "Factorising Fractions", state: completed ? "current" : "locked" },
    { label: "Restricted Values", state: "locked" },
  ];
}

const PROGRESS_STEPS: ProgressRingValue[] = ["0", "25", "50", "75", "100"];

function snapProgress(raw: string | null): ProgressRingValue {
  const parsed = Number(raw);
  if (raw === null || !Number.isFinite(parsed)) return "0";
  const clamped = Math.max(0, Math.min(100, parsed));
  return PROGRESS_STEPS.reduce((closest, step) =>
    Math.abs(Number(step) - clamped) < Math.abs(Number(closest) - clamped) ? step : closest,
  );
}

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

export function StudyPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"plan" | "materials">("plan");
  usePrefetchRoutes(["/recall", "/"]);

  const progress = snapProgress(searchParams.get("progress"));
  const completed = searchParams.get("completed") === "1";
  const lessonSteps = getLessonSteps(completed);

  return (
    <Screen className={styles.screen}>
      <AppBar variant="default">
        <div className={styles.topRow}>
          <BadgeChip type="xp" label="1" />
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
              {lessonSteps.map((step) => {
                if (step.state === "done") {
                  return (
                    <div key={step.label} className={styles.step}>
                      <ButtonIcon variant="Success" size="L" icon={<Check01 />} aria-label={`${step.label}, completed`} />
                      <p className={styles.stepLabel}>{step.label}</p>
                    </div>
                  );
                }

                if (step.state === "locked") {
                  return (
                    <div key={step.label} className={styles.step}>
                      <ButtonIcon
                        variant="Primary"
                        size="L"
                        state="Disabled"
                        icon={<StackSparkle01 />}
                        aria-label={`${step.label}, locked`}
                      />
                      <p className={styles.stepLabel}>{step.label}</p>
                    </div>
                  );
                }

                const ringProgress = step.subject ? progress : "0";
                return (
                  <div key={step.label} className={styles.step}>
                    <div className={styles.currentIconWrap}>
                      <div className={styles.ringLayer}>
                        <ProgressRing progress={ringProgress} pulse />
                      </div>
                      <ButtonIcon
                        variant="Primary"
                        size="L"
                        icon={<Microphone01 />}
                        aria-label={
                          step.subject
                            ? `${step.label}, continue, ${progress}% complete`
                            : `${step.label}, not yet available`
                        }
                        onClick={
                          step.subject
                            ? () =>
                                router.push(`/recall?subject=${encodeURIComponent(step.subject!)}&entry=study-plan`)
                            : undefined
                        }
                      />
                    </div>
                    <p className={[styles.stepLabel, styles.stepLabelCurrent].join(" ")}>{step.label}</p>
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
        <Avatar size="Large" shape="Circle" initials="M" />
      </div>
    </Screen>
  );
}
