import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BadgeChip } from "./BadgeChip";

const meta = {
  title: "Components/BadgeChip",
  component: BadgeChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A small icon+label pill with no background. Each TYPE variant (pro/streak/xp) hardcodes its own icon at native size — pro-badge-01, flame-01, lightning-01 — since these icons are non-square and would get squished by the standard iconSlot system.\n\n" +
          "WHEN TO USE IT: Decorative metric/status badges in the appBar cluster — paid-tier upsell (pro), daily-streak counter (streak), XP counter (xp). Text is a shared property, override per instance.\n\n" +
          "DON'T: Don't confuse with `chips` — chips always has a pill background, this never does. Don't reuse the pro type for a generic status, it's tied to the paid tier only.\n\n" +
          "Note: Figma's real label text isn't tokenized (Inter 16px, unbound, AUTO line-height) — this build substitutes the real type scale's closest match, Body S Bold, rather than the literal Figma values.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof BadgeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypePro: Story = {
  name: "type=pro",
  args: { type: "pro", label: "Upgrade" },
};

export const TypeStreak: Story = {
  name: "type=streak",
  args: { type: "streak", label: "7" },
};

export const TypeXp: Story = {
  name: "type=xp",
  args: { type: "xp", label: "120 XP" },
};
