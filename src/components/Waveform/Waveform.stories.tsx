import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Waveform } from "./Waveform";

const meta = {
  title: "Components/Waveform",
  component: Waveform,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: Organic, non-repeating amplitude bars (sine envelope + wobble, not strict alternation) for a live in-progress recording. Fill bound to accent/1/bold, with the last few bars fading toward the leading edge to read as live incoming audio.\n\n" +
          "WHEN TO USE IT: Anywhere a recording-in-progress needs a waveform visual.\n\n" +
          "DON'T: Don't assume this is already wired into a recording screen or micButton — it's a standalone graphic; where and how to pair it hasn't been decided yet.\n\n" +
          "KNOWN GAP: the description above is quoted verbatim from Figma, but the live component doesn't match it — every one of its 20 bars is fully opaque, no fade toward either edge. Built here exactly as it actually is, per direction, not as described.",
      },
    },
  },
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

// No variants exist in Figma — a single static component, no exposed
// properties — so there's exactly one story.
export const Default: Story = {};
