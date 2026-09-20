"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { QuizResultRow } from "@/components/QuizResultRow/QuizResultRow";
import { ButtonGroup } from "@/components/ButtonGroup/ButtonGroup";
import { Button } from "@/components/Button/Button";
import { XClose } from "@/components/Icons/Icons";
import {
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  OUTCOME_CHIP,
  getSubjectFromSearchParam,
  getTermPrompt,
  parseOutcomes,
} from "../terms";
import { getEntryFromSearchParam, studyPlanCloseUrl, studyPlanReturnUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Concept Questions – Summary. SPEC.md screen 8f
 * (src/app/recall/concept-questions/summary/page.tsx). Figma frame:
 * "Concept Questions - Summary" (node 13758:3651, Design Deliverables
 * page). Same unresolved second AppBar icon as every other Summary
 * screen this session — built leftIconButtonOnly, same disclosed reason.
 */
export function ConceptQuestionsSummaryContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/summary/continue", "/", "/study-plan"]);
  const searchParams = useSearchParams();
  const outcomes = parseOutcomes(searchParams.get("outcomes"));
  const correctCount = outcomes.filter((o) => o !== "revealed").length;
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
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
          <MascotSlot size="2XL" expression="excited" animate />
          <h1 className={styles.heading}>
            {correctCount}/{CONCEPT_QUESTIONS_TERMS.length} right answer{correctCount === 1 ? "" : "s"}!
          </h1>
          <p className={styles.subtitle}>Here&apos;s how each concept went.</p>
        </div>

        <div className={styles.concepts}>
          {CONCEPT_QUESTIONS_TERMS.map((term, index) => {
            const outcome = outcomes[index] ?? "revealed";
            const chip = OUTCOME_CHIP[outcome];
            return (
              <QuizResultRow
                key={term.topic}
                title={getTermPrompt(index + 1, subject)}
                xpValue={`${XP_BY_OUTCOME[outcome]}  XP`}
                chipText={chip.text}
                chipColor={chip.color}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.bottomContent}>
        <ButtonGroup variant="Vertical" size="L">
          <Button
            variant="Primary"
            size="L"
            cta="Continue studying"
            onClick={() => router.push(`/recall/concept-questions/summary/continue?entry=${entry}`)}
          />
          <Button
            variant="Secondary"
            size="L"
            cta={entry === "study-plan" ? "Return to study plan" : "Return to home"}
            onClick={() => router.push(studyPlanReturnUrl(entry))}
          />
        </ButtonGroup>
      </div>
    </Screen>
  );
}
