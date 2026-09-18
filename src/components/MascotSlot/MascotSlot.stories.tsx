import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MascotSlot } from "./MascotSlot";

const meta = {
  title: "Components/MascotSlot",
  component: MascotSlot,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A sized container for the Knowie mascot artwork. size (XL/2XL/3XL/4XL) — no small/medium step, since the mascot is a hero visual, not a small UI accent — x expression (any of the 15 Expressions values, default standby).\n\n" +
          "WHEN TO USE IT: Wherever Knowie appears as a prominent visual — onboarding, empty states, and likely the voice-recall feedback moment, where Knowie's presence signals the app is listening or judging.\n\n" +
          "DON'T: Don't use this slot for anything except the mascot — it's sized for that one asset's proportions, not a general-purpose image container the way iconSlot is for icons.",
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["XL", "2XL", "3XL", "4XL"] },
    expression: {
      control: "select",
      options: [
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
        "approving",
        "sad",
        "confused",
        "placeholderIllustration",
      ],
    },
  },
} satisfies Meta<typeof MascotSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XL: Story = {
  name: "size=XL",
  args: { size: "XL" },
};

export const XXL: Story = {
  name: "size=2XL",
  args: { size: "2XL" },
};

export const XXXL: Story = {
  name: "size=3XL",
  args: { size: "3XL" },
};

export const XXXXL: Story = {
  name: "size=4XL",
  args: { size: "4XL" },
};

export const Excited: Story = {
  name: "size=2XL, expression=excited",
  args: { size: "2XL", expression: "excited" },
};
