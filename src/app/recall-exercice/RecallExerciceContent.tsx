"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { TextBlock } from "@/components/TextBlock/TextBlock";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { NavigationButton } from "@/components/NavigationButton/NavigationButton";
import { Avatar } from "@/components/Avatar/Avatar";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  Menu01,
  Notification01,
  Flask01,
  MyaiChat,
  SearchMd,
  Target01,
  Trophy02,
} from "@/components/Icons/Icons";
import styles from "./page.module.css";

/**
 * Home chat – Recall exercice selected. SPEC.md screen 5
 * (src/app/recall-exercice/page.tsx). Figma frame: "Home chat - Recall
 * exercice selected" (node 13834:3546, Design Deliverables page) —
 * static, single state, no failure paths to build.
 *
 * Converted to the Suspense/search-param pattern to read `?subject=` —
 * Home chat's own chat input now sends here the same way (see that
 * page's own `onSend` fix), and whatever was typed there pre-fills this
 * screen's input instead of arriving empty, so nothing typed feels lost
 * in the handoff.
 */
export function RecallExerciceContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall"]);
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(() => searchParams.get("subject")?.trim() ?? "");

  const goToModeSelection = () => {
    const trimmed = message.trim();
    router.push(trimmed ? `/recall?subject=${encodeURIComponent(trimmed)}` : "/recall");
  };

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<Menu01 />}
        leftAriaLabel="Menu"
        rightIcon={<Notification01 />}
        rightAriaLabel="Notifications"
      >
        <div className={styles.badges}>
          <BadgeChip type="pro" label="Upgrade" />
          <BadgeChip type="xp" label="2" />
          <BadgeChip type="streak" label="3" />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <div className={styles.hero}>
          <MascotSlot size="2XL" expression="excited" />
          {/* Same TextBlock + non-breaking-space fix as Home chat's own
             greeting (src/app/page.tsx) — this screen's greeting was
             still the old hand-rolled <h1>, missed when Home's was
             converted, with two separate bugs as a result: "Harry"
             instead of "Maria" (Home already says Maria), and no
             protection against "Evening study session," itself wrapping
             onto 2 lines before the manual <br/>, producing 3 lines
             total on a real device's system font instead of the
             intended 2. */}
          <TextBlock
            variant="L"
            showCaption={false}
            title={"Evening study session, Maria?"}
          />
        </div>
      </div>

      <div className={styles.bottomContent}>
        <ChatInput
          state="Chip attached"
          value={message}
          onChange={setMessage}
          placeholder="Tell me what you want to practice..."
          // Flask01 per direct instruction — matches Home chat's "Write an
          // essay" button and its own Recall exercice ActivityCard (see
          // src/app/page.tsx), replacing the default flashcard-stack icon.
          chipIcon={<Flask01 />}
          onMicClick={goToModeSelection}
          onSend={goToModeSelection}
          onChipRemove={() => router.push("/")}
        />

        <div className={styles.navbar}>
          <NavigationButton icon={<MyaiChat />} hasLabel={false} state="Active" />
          <NavigationButton icon={<SearchMd />} hasLabel={false} state="Inactive" />
          <NavigationButton
            icon={<Target01 />}
            hasLabel={false}
            state="Inactive"
            onClick={() => router.push("/study-plan")}
          />
          <NavigationButton icon={<Trophy02 />} hasLabel={false} state="Inactive" />
          <Avatar size="Large" shape="Circle" initials="M" />
        </div>
      </div>
    </Screen>
  );
}
