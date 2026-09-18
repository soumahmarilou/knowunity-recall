import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextBlock } from "./TextBlock";

const meta = {
  title: "Components/TextBlock",
  component: TextBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A title + caption text pair. variant (XL/L/M/S, sets the type scale) x showCaption boolean, plus title and caption text properties (defaults: \"Header\" / \"Caption\"). Two stacked text layers, nothing else.\n\n" +
          "WHEN TO USE IT: A section or screen heading with a supporting line underneath — page titles, card headers, empty-state copy. Turn showCaption off for a title-only moment.\n\n" +
          "DON'T: Don't use it as a generic two-line block for body copy or list items — the variant naming ties it to heading-scale sizes, not body text.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["XL", "L", "M", "S"] },
    showCaption: { control: "boolean" },
    title: { control: "text" },
    caption: { control: "text" },
  },
} satisfies Meta<typeof TextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XL: Story = {
  name: "variant=XL",
  args: { variant: "XL" },
};

export const L: Story = {
  name: "variant=L",
  args: { variant: "L" },
};

export const M: Story = {
  name: "variant=M",
  args: { variant: "M" },
};

export const S: Story = {
  name: "variant=S",
  args: { variant: "S" },
};
