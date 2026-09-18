import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { AppBarButton } from "./AppBarButton";

const meta = {
  title: "Components/AppBarButton",
  component: AppBarButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma's own description field for this component set is empty, and design-system_1.md only documents the general `appBar` concept, not this specific sub-component — no WHAT IT IS / WHEN TO USE IT / DON'T text exists to show here, stated plainly rather than invented.\n\n" +
          "Confirmed directly against Figma: a transparent, borderless, no-padding text button, 40px tall, fully rounded — visually close to Button's Tertiary variant, but a genuinely separate component with one real difference: Pressed dims the label (text/primary -> text/secondary), where Button's Tertiary keeps the same color when pressed. Loading swaps to a dedicated icon asset in Figma that couldn't be exported (same orphaned node as AppBarButtonIcon's Loading state) — this build reuses the same CSS spinner pattern instead.",
      },
    },
  },
  args: {
    cta: "Edit",
    onClick: fn(),
  },
} satisfies Meta<typeof AppBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "variant=text, state=Default",
  args: { state: "Default" },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Pressed: Story = {
  name: "variant=text, state=Pressed",
  args: { state: "Pressed" },
};

export const Disabled: Story = {
  name: "variant=text, state=Disabled",
  args: { state: "Disabled" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  name: "variant=text, state=Loading",
  args: { state: "Loading" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
