import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconSlot } from "./IconSlot";

// Placeholder only — Figma's instance-swap accepts any icon component; no
// specific icon asset was pulled from Figma for this story.
const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const meta = {
  title: "Components/IconSlot",
  component: IconSlot,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'WHAT IT IS: A sized container for an icon. One variant, "Size (IGNORE)" (100/150/200/250/300/400 — the name flags it as legacy, not meant for deliberate picking), plus an instance-swap property so any icon component can be dropped in. It\'s a slot, not an icon itself.\n\n' +
          "WHEN TO USE IT: Anywhere an icon needs a consistent, swappable container — inside buttonIcon, appBar's left/right buttons, list rows, etc. Pick the size step that matches the icon's context.\n\n" +
          'DON\'T: Don\'t be thrown by the "Size (IGNORE)" property name — it\'s a known leftover, not a new bug. Safe to use as-is.',
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["100", "150", "200", "250", "300", "400"] },
  },
  args: {
    icon: <PlaceholderIcon />,
  },
} satisfies Meta<typeof IconSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Size100: Story = {
  name: "Size (IGNORE)=100",
  args: { size: "100" },
};

export const Size150: Story = {
  name: "Size (IGNORE)=150",
  args: { size: "150" },
};

export const Size200: Story = {
  name: "Size (IGNORE)=200",
  args: { size: "200" },
};

export const Size250: Story = {
  name: "Size (IGNORE)=250",
  args: { size: "250" },
};

export const Size300: Story = {
  name: "Size (IGNORE)=300",
  args: { size: "300" },
};

export const Size400: Story = {
  name: "Size (IGNORE)=400",
  args: { size: "400" },
};
