import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { MicButton } from "./MicButton";

const meta = {
  title: "Components/MicButton",
  component: MicButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: micButton — the primary tap target that starts voice capture on a Launched screen. Five states (idle/recording/processing/sent/disabled), each with its own fill/icon combination. Always pair it with the microphone-01 icon for idle; never swap in a different icon or reuse the shape for another action.\n\n" +
          "WHEN TO USE IT: idle to prompt a tap-to-record. recording once capture starts (icon swaps to check-01, tap to send — no waveform or timer on the button itself). processing while the answer is being sent (icon swaps to the shared loading-01 component). sent right after processing finishes — greyed like disabled but keeps the check-01 icon, paired with a \"Sent\" label under the button (not a Figma variant, added per direct instruction). disabled when voice input isn't available (reuses button/buttonIcon's own Disabled tokens).\n\n" +
          "DON'T: Don't treat processing as final — the state spec places the real send/processing animation under the mascot, not on this button, so this variant is a placeholder until confirmed. Don't expect a discard icon next to recording — trash-01 exists in the icon library but has no container built here yet. Icon is hardcoded per state, not an instance-swap property.",
      },
    },
  },
  argTypes: {
    state: { control: "radio", options: ["idle", "recording", "disabled", "processing", "sent"] },
  },
  args: {
    "aria-label": "Record your answer",
    onClick: fn(),
  },
} satisfies Meta<typeof MicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  name: "state=idle",
  args: { state: "idle" },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Recording: Story = {
  name: "state=recording",
  args: { state: "recording", "aria-label": "Send your answer" },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  name: "state=disabled",
  args: { state: "disabled" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Processing: Story = {
  name: "state=processing",
  args: { state: "processing" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Sent: Story = {
  name: "state=sent",
  args: { state: "sent", "aria-label": "Sent" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
