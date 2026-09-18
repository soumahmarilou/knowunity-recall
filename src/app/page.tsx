"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotSlot } from "@/components/MascotSlot/MascotSlot";
import { ActivityCard } from "@/components/ActivityCard/ActivityCard";
import { Button } from "@/components/Button/Button";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { NavigationButton } from "@/components/NavigationButton/NavigationButton";
import { Avatar } from "@/components/Avatar/Avatar";
import { useDragScroll } from "@/lib/dragScroll";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  Menu01,
  Notification01,
  FlashcardStack01,
  QuizQuestion01,
  ClipboardCheck01,
  StackSparkle01,
  Lightning01,
  Flask01,
  Lightbulb01,
  MyaiChat,
  SearchMd,
  Target01,
  Trophy02,
} from "@/components/Icons/Icons";
import styles from "./page.module.css";

/**
 * Home chat – Default. SPEC.md screen 4 (src/app/page.tsx).
 * Figma frame: "Home chat - Default" (node 13822:8296, Design
 * Deliverables page) — static, single state, no failure paths to build.
 */
export default function HomePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const activityRowRef = useDragScroll<HTMLDivElement>();
  const quickActionsRowRef = useDragScroll<HTMLDivElement>();
  usePrefetchRoutes(["/recall-exercice", "/study-plan"]);

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
          <h1 className={styles.greeting}>
            Evening study session,
            <br />
            Maria?
          </h1>
        </div>

        <div className={styles.activityRow} ref={activityRowRef}>
          {/* Flask01 per direct instruction — matches "Write an essay"'s
             own icon below, and the Recall exercice chip on
             /recall-exercice (see that page for the same swap). */}
          <ActivityCard
            icon={<Flask01 />}
            label="Recall exercice"
            onClick={() => router.push("/recall-exercice")}
          />
          <ActivityCard icon={<FlashcardStack01 />} label="Flashcards" />
          <ActivityCard icon={<QuizQuestion01 />} label="Quizz" />
          <ActivityCard icon={<ClipboardCheck01 />} label="Practice exam" />
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.quickActionsRow} ref={quickActionsRowRef}>
          <Button variant="Secondary" size="M" cta="Summarize" showLeftIcon leftIcon={<StackSparkle01 />} />
          <Button
            variant="Secondary"
            size="M"
            cta="Find study notes"
            showLeftIcon
            leftIcon={<Lightning01 />}
          />
          <Button variant="Secondary" size="M" cta="Write an essay" showLeftIcon leftIcon={<Flask01 />} />
          <Button variant="Secondary" size="M" cta="Explain" showLeftIcon leftIcon={<Lightbulb01 />} />
        </div>

        <ChatInput
          state="Default"
          value={message}
          onChange={setMessage}
          onMicClick={() => router.push("/recall-exercice")}
          onSend={() => {
            const trimmed = message.trim();
            router.push(trimmed ? `/recall-exercice?subject=${encodeURIComponent(trimmed)}` : "/recall-exercice");
          }}
        />

        <div className={styles.navbar}>
          {/* Figma marks all four nav buttons State=Active at once — read as
           * an authoring artifact (a real nav bar has exactly one current
           * tab), not reproduced. Only myai-chat (this screen) is Active. */}
          <NavigationButton icon={<MyaiChat />} hasLabel={false} state="Active" />
          <NavigationButton icon={<SearchMd />} hasLabel={false} state="Inactive" />
          <NavigationButton
            icon={<Target01 />}
            hasLabel={false}
            state="Inactive"
            onClick={() => router.push("/study-plan")}
          />
          <NavigationButton icon={<Trophy02 />} hasLabel={false} state="Inactive" />
          <Avatar size="Large" shape="Circle" initials="H" />
        </div>
      </div>
    </Screen>
  );
}
