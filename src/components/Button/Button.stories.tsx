import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: The text button. variant (Primary/Secondary/Tertiary) x size (S/M/L) x state (Default/Pressed/Disabled/Loading), plus a CTA text property and showLeftIcon/showRightIcon booleans for an optional icon on either side.\n\n" +
          "WHEN TO USE IT: Any tappable action that needs a text label. Primary for the one main action on a screen, Secondary/Tertiary for supporting actions.\n\n" +
          "DON'T: Don't skip the Loading state when an action triggers a network call — it's a real variant, not an afterthought.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["Primary", "Secondary", "Tertiary"] },
    size: { control: "radio", options: ["S", "M", "L"] },
    state: { control: "radio", options: ["Default", "Pressed", "Disabled", "Loading"] },
    cta: { control: "text" },
  },
  args: {
    cta: "Continue",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryDefault: Story = {
  name: "Primary / Default",
  args: { variant: "Primary", state: "Default" },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const PrimaryPressed: Story = {
  name: "Primary / Pressed",
  args: { variant: "Primary", state: "Pressed" },
};

export const PrimaryDisabled: Story = {
  name: "Primary / Disabled",
  args: { variant: "Primary", state: "Disabled" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const PrimaryLoading: Story = {
  name: "Primary / Loading",
  args: { variant: "Primary", state: "Loading" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const SecondaryDefault: Story = {
  name: "Secondary / Default",
  args: { variant: "Secondary", state: "Default" },
};

export const SecondaryPressed: Story = {
  name: "Secondary / Pressed",
  args: { variant: "Secondary", state: "Pressed" },
};

export const SecondaryDisabled: Story = {
  name: "Secondary / Disabled",
  args: { variant: "Secondary", state: "Disabled" },
};

export const SecondaryLoading: Story = {
  name: "Secondary / Loading",
  args: { variant: "Secondary", state: "Loading" },
};

export const TertiaryDefault: Story = {
  name: "Tertiary / Default",
  args: { variant: "Tertiary", state: "Default" },
};

export const TertiaryPressed: Story = {
  name: "Tertiary / Pressed",
  args: { variant: "Tertiary", state: "Pressed" },
};

export const TertiaryDisabled: Story = {
  name: "Tertiary / Disabled",
  args: { variant: "Tertiary", state: "Disabled" },
};

export const TertiaryLoading: Story = {
  name: "Tertiary / Loading",
  args: { variant: "Tertiary", state: "Loading" },
};
