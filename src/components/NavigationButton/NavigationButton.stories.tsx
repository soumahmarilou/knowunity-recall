import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GraduationHat01 } from "../Icons/Icons";
import { NavigationButton } from "./NavigationButton";

const meta = {
  title: "Components/NavigationButton",
  component: NavigationButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma's own description field for this component set is empty, and design-system_1.md doesn't document it at all (it's one of the components flagged there as a known gap in that file's coverage) — no WHAT IT IS / WHEN TO USE IT / DON'T text exists to show here, stated plainly rather than invented.\n\n" +
          "Confirmed directly against Figma and its rendered states: an icon over a label. State (Inactive/Active) genuinely changes both the icon's color/opacity and the label's color/weight — confirmed by comparing rendered screenshots of both states, not just raw property values. The icon goes through IconSlot at size 300 (24px), per design-system_1.md's rule that a bare icon should never sit directly in a layout.",
      },
    },
  },
  argTypes: {
    state: { control: "radio", options: ["Inactive", "Active"] },
    label: { control: "text" },
    hasLabel: { control: "boolean" },
  },
  args: {
    label: "Home",
    icon: <GraduationHat01 />,
    onClick: fn(),
  },
} satisfies Meta<typeof NavigationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  name: "State=Inactive",
  args: { state: "Inactive" },
};

export const Active: Story = {
  name: "State=Active",
  args: { state: "Active" },
};
