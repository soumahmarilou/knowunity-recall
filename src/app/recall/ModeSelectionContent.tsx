"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { SuperlistItem } from "@/components/SuperlistItem/SuperlistItem";
import { XClose, Microphone01, Lightbulb01, GraduationHat01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

const DEFAULT_SUBJECT = "Algebraic Fractions";

/**
 * Mode selection. SPEC.md screen 2 (src/app/recall/page.tsx).
 * Figma frame: "Mode selection" (node 13654:4988, Design Deliverables
 * page) — static, single state, no failure paths to build.
 *
 * The heading's subject now reflects whatever the student actually typed
 * into the "Home chat – Recall exercice selected" chat input (`?subject=`,
 * threaded through from that screen's onSend/onMicClick) instead of a
 * hardcoded "Algebraic Fractions" — per direct instruction. Falls back to
 * that same Figma-confirmed default when nothing was typed (e.g. arriving
 * via the mic tap with an empty field, or navigating here directly).
 */
export function ModeSelectionContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/guided-reflection",
    "/recall/concept-questions",
    "/recall/free-recall-challenge",
  ]);
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject")?.trim() || DEFAULT_SUBJECT;
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  return (
    <Screen className={styles.screenGap}>
      {/* SPEC.md says variant=leftAndRightIconButton, but the Figma frame's
       * second (right-side) App Bar Button Icon instance has no resolvable
       * icon in the data — checked twice this session, both times empty —
       * and none of this screen's documented actions need a right-side
       * button. Built as leftIconButtonOnly instead; see the build report. */}
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.back()}
      />

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <MascotSlot size="2XL" expression="excited" />
          <TextBlock variant="L" showCaption={false} title={`Let's recall ${subject}`} />
        </div>

        <div className={styles.explanationGroup}>
          <p className={styles.explanation}>Choose one of the following modes:</p>

          <div className={styles.modeCards}>
            <SuperlistItem
              icon={<Microphone01 />}
              iconColor="1"
              title="Guided Reflection"
              descriptor="Tell your thoughts about what you learned"
              onClick={() =>
                router.push(
                  `/recall/guided-reflection?subject=${encodeURIComponent(subject)}&entry=${entry}`,
                )
              }
            />
            <SuperlistItem
              icon={<Lightbulb01 />}
              iconColor="3"
              title="Concept Questions"
              descriptor="Answer and elaborate on targeted questions"
              onClick={() =>
                router.push(
                  `/recall/concept-questions?subject=${encodeURIComponent(subject)}&entry=${entry}`,
                )
              }
            />
            <SuperlistItem
              icon={<GraduationHat01 />}
              iconColor="4"
              title="Free Recall Challenge"
              descriptor="Say everything you know before the clock end"
              onClick={() =>
                router.push(
                  `/recall/free-recall-challenge?subject=${encodeURIComponent(subject)}&entry=${entry}`,
                )
              }
            />
          </div>
        </div>
      </div>
    </Screen>
  );
}
