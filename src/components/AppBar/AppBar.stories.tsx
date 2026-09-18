import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Check01, Plus01, XClose } from "../Icons/Icons";
import { AppBar } from "./AppBar";

const meta = {
  title: "Components/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'WHAT IT IS: A top nav bar template. A fixed "Top Nav Default" frame holds an optional left icon button and an open Slot in the middle for screen-specific content (title, search, etc). Some variants add one or two buttons/icon-buttons on the right. The variant property switches between 6 preset left/right layouts.\n\n' +
          "WHEN TO USE IT: At the top of any screen needing a persistent nav bar (back/close left, title/content middle, 0-2 actions right). Pick the variant matching how many right-side buttons the screen needs.\n\n" +
          "DON'T: Don't assume the middle Slot handles long content gracefully — it has no max-width constraint, so long titles or search fields need checking at real screen width.",
      },
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "variant=default",
  args: {
    variant: "default",
    children: "Screen title",
  },
};

export const LeftIconButtonOnly: Story = {
  name: "variant=leftIconButtonOnly",
  args: {
    variant: "leftIconButtonOnly",
    leftIcon: <XClose />,
    leftAriaLabel: "Close",
    onLeftClick: fn(),
    children: "Screen title",
  },
};

export const LeftAndRightIconButton: Story = {
  name: "variant=leftAndRightIconButton",
  args: {
    variant: "leftAndRightIconButton",
    leftIcon: <XClose />,
    leftAriaLabel: "Close",
    onLeftClick: fn(),
    children: "Screen title",
    rightIcon: <Check01 />,
    rightAriaLabel: "Confirm",
    onRightClick: fn(),
  },
};

export const LeftAndRightButton: Story = {
  name: "variant=leftAndRightButton",
  args: {
    variant: "leftAndRightButton",
    leftIcon: <XClose />,
    leftAriaLabel: "Close",
    onLeftClick: fn(),
    children: "Screen title",
    rightCta: "Edit",
    onRightClick: fn(),
  },
};

export const LeftAndTwoRightIconButtons: Story = {
  name: "variant=leftAndTwoRightIconButtons",
  args: {
    variant: "leftAndTwoRightIconButtons",
    leftIcon: <XClose />,
    leftAriaLabel: "Close",
    onLeftClick: fn(),
    children: "Screen title",
    rightIcon: <Plus01 />,
    rightAriaLabel: "Add",
    onRightClick: fn(),
    right2Icon: <Check01 />,
    right2AriaLabel: "Confirm",
    onRight2Click: fn(),
  },
};

export const LeftAnd2RightButtons: Story = {
  name: "variant=leftAnd2RightButtons",
  args: {
    variant: "leftAnd2RightButtons",
    leftIcon: <XClose />,
    leftAriaLabel: "Close",
    onLeftClick: fn(),
    children: "Screen title",
    rightIcon: <Plus01 />,
    rightAriaLabel: "Add",
    onRightClick: fn(),
    rightCta: "Edit",
    onRight2Click: fn(),
  },
};
