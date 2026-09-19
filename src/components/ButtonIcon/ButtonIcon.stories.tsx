import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { ButtonIcon } from "./ButtonIcon";

// Placeholder only — Figma exposes no icon-swap property on buttonIcon, and
// no icon asset was pulled from Figma for this story. Any real usage
// supplies its own icon via the `icon` prop.
const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const meta = {
  title: "Components/ButtonIcon",
  component: ButtonIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: The icon-only counterpart to button. Same variant grid — variant (Primary/Secondary/Tertiary) x size (S/M/L) x state (Default/Pressed/Disabled/Loading) — but no CTA text or icon-toggle props, since the icon is the whole button.\n\n" +
          "WHEN TO USE IT: A tappable action with no room or need for a label — nav bar actions, close/back, compact toolbars. Used this way inside appBar's variants.\n\n" +
          "DON'T: Don't use it for an action a first-time user can't identify from the icon alone — there's no label to fall back on.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["Primary", "Secondary", "Tertiary", "Success"] },
    size: { control: "radio", options: ["S", "M", "L"] },
    state: { control: "radio", options: ["Default", "Pressed", "Disabled", "Loading"] },
  },
  args: {
    icon: <PlaceholderIcon />,
    "aria-label": "Example action",
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonIcon>;

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

export const SuccessDefault: Story = {
  name: "Success / Default",
  args: { variant: "Success", state: "Default" },
};
export const SuccessPressed: Story = {
  name: "Success / Pressed",
  args: { variant: "Success", state: "Pressed" },
};
export const SuccessDisabled: Story = {
  name: "Success / Disabled",
  args: { variant: "Success", state: "Disabled" },
};
export const SuccessLoading: Story = {
  name: "Success / Loading",
  args: { variant: "Success", state: "Loading" },
};
