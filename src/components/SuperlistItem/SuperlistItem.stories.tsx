import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { SuperlistItem } from "./SuperlistItem";

const meta = {
  title: "Components/SuperlistItem",
  component: SuperlistItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A leading-icon list row — an Icon badge, a title, a descriptor line below it (reusing .List Bottom Section), and an optional trailing chevron. Two properties: Icon (instance-swap, swaps a whole Icon badge instance) and Show trailing chevron (boolean, default true).\n\n" +
          "WHEN TO USE IT: Any row that pairs a category/topic icon with a title and a short supporting line — a tappable navigation row (chevron on), or a static, non-tappable info row (chevron off).\n\n" +
          'DON\'T: Don\'t confuse this with the existing "listItem" component elsewhere in this section — that\'s a different, generic selectable-row builder. Don\'t leave "Show trailing chevron" on for a row that isn\'t actually tappable. To recolor the icon, swap the Icon property to a different Icon badge color; to change just the glyph, drill into that instance once and use its own Icon property.',
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof SuperlistItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowTrailingChevronTrue: Story = {
  name: "Show trailing chevron=true",
  args: { showTrailingChevron: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const ShowTrailingChevronFalse: Story = {
  name: "Show trailing chevron=false",
  args: { showTrailingChevron: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};
