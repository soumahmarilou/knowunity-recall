import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { MicPermissionPrimer } from "./MicPermissionPrimer";

const meta = {
  title: "Components/MicPermissionPrimer",
  component: MicPermissionPrimer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'WHAT IT IS: A small confirm card that asks for microphone access before a first recording — "Knowie needs your mic to hear your answer", with "Allow" and "Not now" buttons.\n\n' +
          "WHEN TO USE IT: Anchored above a MicButton the first time a screen needs to ask for mic permission, before the student's first recording attempt on that screen.\n\n" +
          "DON'T: Don't use it for the mic-disabled state (permission already denied) — that's a separate note-plus-link pattern, not this card.",
      },
    },
  },
  args: {
    onAllow: fn(),
    onDismiss: fn(),
  },
} satisfies Meta<typeof MicPermissionPrimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: "relative", paddingTop: 100 }}>
        <Story />
      </div>
    ),
  ],
};
