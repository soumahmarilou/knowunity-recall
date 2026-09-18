import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flame01, Target04 } from "../Icons/Icons";
import { StatBox } from "./StatBox";

const meta = {
  title: "Components/StatBox",
  component: StatBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'WHAT IT IS: A stat display box (icon + number). Icon is an instance-swap property (default lightning-01; target-04 and flame-01 are also common). Color is set per-instance via a variable mode (collection "Stat box accent", modes 1-4 + brand), not a variant — default is mode 3 (blue).\n\n' +
          "WHEN TO USE IT: A single at-a-glance number with a label — streaks, XP, session counts.\n\n" +
          "DON'T: Don't expect the icon to automatically match the box's color — the Icon property is shared across all color modes, so pick one whose native color fits, or accept the mismatch.",
      },
    },
  },
  argTypes: {
    color: { control: "radio", options: ["1", "2", "3", "4", "brand"] },
  },
} satisfies Meta<typeof StatBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Color1: Story = {
  name: "color=1",
  args: { color: "1", icon: <Target04 />, label: "Streak", value: "7" },
};

export const Color2: Story = {
  name: "color=2",
  args: { color: "2", icon: <Flame01 />, label: "Streak", value: "12" },
};

export const Color3: Story = {
  name: "color=3 (default)",
  args: { color: "3", label: "XP", value: "11" },
};

export const Color4: Story = {
  name: "color=4",
  args: { color: "4", label: "Sessions", value: "5" },
};

export const ColorBrand: Story = {
  name: "color=brand",
  args: { color: "brand", label: "Score", value: "98" },
};
