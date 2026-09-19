import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressRing } from "./ProgressRing";

const meta = {
  title: "Components/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A circular progress ring, stepped in quarters (0/25/50/75/100), that wraps around a tappable icon rather than sitting as its own standalone bar. Track uses border/default, the filled arc uses feedback/success/bold — the same green buttonIcon's own Success variant uses for a completed step.\n\n" +
          "WHEN TO USE IT: A single bounded task that's already in progress and still tappable to continue — the current step in a multi-step list, sized to sit just outside a 56px (buttonIcon L) icon. Not for a completed or not-yet-started state; those don't need a ring at all.\n\n" +
          "DON'T: Don't use this for the same job progressIndicator already does — a linear, multi-step overview bar. This is specifically for one in-progress ring around one tappable icon, not a general progress bar.",
      },
    },
  },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Progress0: Story = {
  name: "progress=0",
  args: { progress: "0" },
};
export const Progress25: Story = {
  name: "progress=25",
  args: { progress: "25" },
};
export const Progress50: Story = {
  name: "progress=50",
  args: { progress: "50" },
};
export const Progress75: Story = {
  name: "progress=75",
  args: { progress: "75" },
};
export const Progress100: Story = {
  name: "progress=100",
  args: { progress: "100" },
};

export const Pulsing: Story = {
  name: "progress=50, pulse=true",
  args: { progress: "50", pulse: true },
};
