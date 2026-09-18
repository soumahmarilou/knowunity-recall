import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ClipboardCheck01,
  FlashcardStack01,
  GraduationHat01,
  QuizQuestion01,
} from "../Icons/Icons";
import { ActivityCard } from "./ActivityCard";

const meta = {
  title: "Components/ActivityCard",
  component: ActivityCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A fixed 120×110 quick-action card with a swappable icon and a free-text label.\n\n" +
          "WHEN TO USE IT: Home screen quick-action entry points — Recall exercice, Flashcards, Quizz, Practice exam.\n\n" +
          "DON'T: Don't hand-build this from raw frames per screen — use the component so a future style change propagates everywhere it's used.\n\n" +
          "Note: this is a single Figma component, not a variant set — no size/state axis exists. The four stories below use the actual four real-world entries named in the component's own \"when to use it\" guidance, not invented content.",
      },
    },
  },
} satisfies Meta<typeof ActivityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const RecallExercice: Story = {
  name: "Recall exercice",
  args: { icon: <GraduationHat01 />, label: "Recall exercice" },
};

export const Flashcards: Story = {
  args: { icon: <FlashcardStack01 />, label: "Flashcards" },
};

export const Quizz: Story = {
  args: { icon: <QuizQuestion01 />, label: "Quizz" },
};

export const PracticeExam: Story = {
  name: "Practice exam",
  args: { icon: <ClipboardCheck01 />, label: "Practice exam" },
};
