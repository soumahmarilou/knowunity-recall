import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { MascotBubble } from "./MascotBubble";

const meta = {
  title: "Components/MascotBubble",
  component: MascotBubble,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'WHAT IT IS: Knowie\'s feedback speech bubble: mascot, tail, and message card together. The card can optionally show a status chip and a "Reveal answer" button alongside the feedback text.\n\n' +
          "WHEN TO USE IT: Any screen where Knowie responds to the student in text. Keep Position on Left, that's the layout used on every real recall-feedback screen. Turn Show chip on for a status label like \"Almost there,\" and Show button on when there's an answer to reveal. Body text holds the feedback message itself.\n\n" +
          "DON'T: Don't switch Position to Right without a real reason, it's a mirrored layout with no actual use in the app yet. Don't turn on Show button when there's nothing to reveal, it'll show a dead action that goes nowhere.",
      },
    },
  },
  argTypes: {
    position: { control: "radio", options: ["Left", "Right"] },
    buttonText: { control: "text" },
    expression: {
      control: "select",
      options: [
        "approving",
        "standby",
        "excited",
        "laughing",
        "giggling",
        "determined",
        "questioning",
        "thinking",
        "dazed",
        "amazed",
        "angry",
        "overIt",
        "sad",
        "confused",
        "placeholderIllustration",
      ],
    },
  },
  args: {
    onRevealAnswer: fn(),
  },
} satisfies Meta<typeof MascotBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  name: "position=Left",
  args: { position: "Left" },
};

export const Right: Story = {
  name: "position=Right",
  args: { position: "Right" },
};

// The card's height genuinely collapses (200 / 164 / 148 / 112 tall) as
// the chip and button are turned off — the "genuine bug fix" called out
// in design-system_1.md. Demonstrated across all four combinations since
// it's the component's standout behavior, not just a cosmetic toggle.
export const ChipOnly: Story = {
  name: "position=Left, Show button=false",
  args: { position: "Left", showButton: false },
};

export const ButtonOnly: Story = {
  name: "position=Left, Show chip=false",
  args: { position: "Left", showChip: false },
};

export const NeitherChipNorButton: Story = {
  name: "position=Left, Show chip=false, Show button=false",
  args: { position: "Left", showChip: false, showButton: false },
};

export const Thinking: Story = {
  name: "expression=thinking, Show chip=false, Show button=false",
  args: {
    position: "Left",
    expression: "thinking",
    showChip: false,
    showButton: false,
    bodyText: "Thinking…",
  },
};

// Concept Questions' position-in-sequence label, added directly above the
// chip/body — small and thin, per direct instruction.
export const WithOverline: Story = {
  name: "overline=Question 1 of 3",
  args: {
    position: "Left",
    overline: "Question 1 of 3",
    showChip: false,
  },
};

// Overline and the status chip share one row — chip on the left, overline
// on the right, 16px apart, per direct instruction, not stacked as two
// separate rows.
export const OverlineWithChip: Story = {
  name: "overline=Question 1 of 3, Show chip=true",
  args: {
    position: "Left",
    overline: "Question 1 of 3",
    showChip: true,
  },
};

// Concept Questions' Reveal screen — a second chip below the body text
// instead of plain text concatenated onto the end of it.
export const WithFooterChip: Story = {
  name: "footerChipText=Repeat the answer to go to the next question.",
  args: {
    position: "Left",
    showChip: false,
    footerChipText: "Repeat the answer to go to the next question.",
  },
};

// Guided Reflection's acknowledgment beat — same button, a custom label
// instead of the default "Reveal answer" (see the buttonText prop).
export const CustomButtonText: Story = {
  name: "Show chip=false, buttonText=Next question",
  args: {
    position: "Left",
    showChip: false,
    buttonText: "Next question",
    bodyText:
      "Nice! Being able to share your own take on this part of the course really shows you've got a good handle on it.",
  },
};
