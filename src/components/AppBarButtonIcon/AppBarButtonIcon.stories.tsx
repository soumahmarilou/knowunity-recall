import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { XClose } from "../Icons/Icons";
import { AppBarButtonIcon } from "./AppBarButtonIcon";

const meta = {
  title: "Components/AppBarButtonIcon",
  component: AppBarButtonIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma's own description field for this component set is empty, and design-system_1.md only documents the general `appBar` concept, not this specific sub-component — no WHAT IT IS / WHEN TO USE IT / DON'T text exists to show here, stated plainly rather than invented.\n\n" +
          "Confirmed directly against Figma: a transparent, borderless 48x48 icon button, visually identical to ButtonIcon's Tertiary variant at rest — but Pressed genuinely dims the icon (text/primary -> text/secondary), unlike ButtonIcon's Tertiary which has no Pressed treatment. Loading swaps to a dedicated icon asset in Figma that couldn't be exported (orphaned node, export failed) — this build reuses the same CSS spinner already used for Button/ButtonIcon's Loading state instead.",
      },
    },
  },
  args: {
    icon: <XClose />,
    "aria-label": "Close",
    onClick: fn(),
  },
} satisfies Meta<typeof AppBarButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "variant=default, state=Default",
  args: { state: "Default" },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Pressed: Story = {
  name: "variant=default, state=Pressed",
  args: { state: "Pressed" },
};

export const Disabled: Story = {
  name: "variant=default, state=Disabled",
  args: { state: "Disabled" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  name: "variant=default, state=Loading",
  args: { state: "Loading" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
