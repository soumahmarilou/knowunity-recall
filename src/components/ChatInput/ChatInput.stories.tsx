import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { ChatInput, type ChatInputProps } from "./ChatInput";

const meta = {
  title: "Components/ChatInput",
  component: ChatInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'WHAT IT IS: The chat input bar Knowie\'s screens use. One variant (state): Default, Chip attached, Answer.\n\n' +
          "WHEN TO USE IT: state=Default for the standard \"Ask anything\" entry point (Home chat). state=Chip attached when a category/context filter (a chips instance) is pinned above the text entry. state=Answer for the no-attachment, send-button variant used when answering inside a guided flow.\n\n" +
          'DON\'T: Don\'t reach for the deprecated "OLD Icon Button" component for the leading "+" — use the real buttonIcon component (variant=Secondary, size=L) with plus-01 swapped in. Don\'t bind placeholder text to text/disabled — use text/secondary.\n\n' +
          "KNOWN GAP: the \"Chip attached\" variant's frame also holds a Camera / Gallery / Files attachment row, sitting in an auto-named, unrenamed frame and never mentioned in this component's own Figma description. Included per direction, not invented — Figma's own icon choices are reproduced as-is: Camera and Gallery both use camera-01, and Files uses stack-sparkle-01 (not a files icon).",
      },
    },
  },
  args: {
    onChange: fn(),
    onAttachClick: fn(),
    onMicClick: fn(),
    onSend: fn(),
    onChipRemove: fn(),
    onCameraClick: fn(),
    onGalleryClick: fn(),
    onFilesClick: fn(),
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledChatInput(props: ChatInputProps) {
  const [value, setValue] = useState(props.value);
  return <ChatInput {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  name: "state=Default",
  args: { state: "Default", value: "" },
  render: (args) => <ControlledChatInput {...args} />,
};

export const ChipAttached: Story = {
  name: "state=Chip attached",
  args: { state: "Chip attached", value: "", placeholder: "Tell me what you want to practice..." },
  render: (args) => <ControlledChatInput {...args} />,
};

export const Answer: Story = {
  name: "state=Answer",
  args: { state: "Answer", value: "" },
  render: (args) => <ControlledChatInput {...args} />,
};
