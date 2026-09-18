import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check01, XClose } from "../Icons/Icons";
import { Chips, type ChipsProps } from "./Chips";

const meta = {
  title: "Components/Chips",
  component: Chips,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A pill-shaped chip/tag. size (XXS/XS/S/M) x color (Primary/pro/success/info/error) x active (False/True), plus a Text prop and showLeftIcon/showRightIcon booleans.\n\n" +
          "WHEN TO USE IT: Filters, category tags, selectable options, or short status labels. active toggles selected vs unselected, so it also works as a filter chip. success/info/error show the outcome of a recall attempt (first try, hint needed, revealed) inline on a summary row.\n\n" +
          "DON'T: Don't use the pro color unless it's actually gating or labeling paid-tier content. Don't use success/info/error for anything unrelated to recall-attempt feedback.\n\n" +
          "Note: size is a real, independent control for Primary/pro (all 4 sizes x both active states exist in Figma) — only shown at one size per story below, matching how the text Button's size axis was handled. success/info/error are structurally locked to size=S, active=True in Figma; no other combination of those three colors exists.",
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["XXS", "XS", "S", "M"] },
    text: { control: "text" },
  },
  args: {
    text: "Label",
    showLeftIcon: false,
    showRightIcon: false,
  },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryFalse: Story = {
  name: "size=XXS, color=Primary, active=False",
  args: { color: "Primary", active: "False" } as ChipsProps,
};

export const PrimaryTrue: Story = {
  name: "size=XXS, color=Primary, active=True",
  args: { color: "Primary", active: "True" } as ChipsProps,
};

export const ProFalse: Story = {
  name: "size=XXS, color=pro, active=False",
  args: { color: "pro", active: "False" } as ChipsProps,
};

export const ProTrue: Story = {
  name: "size=XXS, color=pro, active=True",
  args: { color: "pro", active: "True" } as ChipsProps,
};

export const SuccessTrue: Story = {
  name: "size=S, color=success, active=True",
  args: { color: "success", size: "S", showLeftIcon: true, leftIcon: <Check01 /> } as ChipsProps,
};

export const InfoTrue: Story = {
  name: "size=S, color=info, active=True",
  args: { color: "info", size: "S" } as ChipsProps,
};

export const ErrorTrue: Story = {
  name: "size=S, color=error, active=True",
  args: { color: "error", size: "S", showLeftIcon: true, leftIcon: <XClose /> } as ChipsProps,
};
