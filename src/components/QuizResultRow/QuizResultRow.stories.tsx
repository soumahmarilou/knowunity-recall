import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuizResultRow } from "./QuizResultRow";

const meta = {
  title: "Components/QuizResultRow",
  component: QuizResultRow,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A row stacking an optional \"Question N\" eyebrow, a title, and a footer pairing an inline XP indicator (icon + value) with the real chips component as an outcome badge. Text properties Title and XP value are exposed; the nested chips instance's own properties (color, Text, icon visibility) are also exposed and editable from this component directly, no drilling in required.\n\n" +
          "WHEN TO USE IT: One row per concept in a quiz or recall summary.\n\n" +
          "DON'T: Don't expect the lightning icon to be swappable via a component property — it's a raw vector group, not an icon-component instance, same limitation as Stat box's own lightning icon.",
      },
    },
  },
  argTypes: {
    chipColor: { control: "radio", options: ["Primary", "pro", "success", "info", "error"] },
  },
} satisfies Meta<typeof QuizResultRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstTry: Story = {
  name: "chips: color=success, Text=First try",
  args: { questionNumber: 1, title: "Factoring", xpValue: "10  XP", chipColor: "success", chipText: "First try" },
};

export const HintNeeded: Story = {
  name: "chips: color=info, Text=Hint needed",
  args: {
    questionNumber: 2,
    title: "Quadratic equations",
    xpValue: "5  XP",
    chipColor: "info",
    chipText: "Hint needed",
  },
};

export const Revealed: Story = {
  name: "chips: color=error, Text=Revealed",
  args: { questionNumber: 3, title: "Word problems", xpValue: "0  XP", chipColor: "error", chipText: "Revealed" },
};
