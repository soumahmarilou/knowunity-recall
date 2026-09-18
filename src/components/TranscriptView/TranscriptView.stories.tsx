import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TranscriptView } from "./TranscriptView";

const meta = {
  title: "Components/TranscriptView",
  component: TranscriptView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A live, scrollable transcript box for an active recording — new this session, not a Figma/design-system component, per direct instruction. Content overflowing the top/bottom fades out (a mask-image gradient, styled after song-lyrics views like Apple Music's) instead of cutting off sharply, and auto-scrolls to keep the newest text in view as it grows.\n\n" +
          "WHEN TO USE IT: Any mode's Recording screen, paired with `useMockTranscript` (src/lib/mockTranscript.ts) for the text itself — no real speech-to-text exists anywhere in this prototype (CLAUDE.md's hard rule), so the text is scripted, topic-neutral filler revealed word by word, not an actual transcription.\n\n" +
          "DON'T: Don't wire this to any real STT/audio-analysis pipeline — the mocked-recall rule applies here exactly as everywhere else in this app. Renders nothing (`null`) when `text` is empty, so it never shows an empty box before recording starts.",
      },
    },
  },
  argTypes: {
    text: { control: "text" },
  },
} satisfies Meta<typeof TranscriptView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Growing: Story = {
  name: "mid-recording (a few words in)",
  args: {
    text: "So basically what I remember is that you need to break it down into smaller parts first",
  },
};

export const Overflowing: Story = {
  name: "overflowing — fade visible top and bottom",
  args: {
    text:
      "So basically what I remember is that you need to break it down into smaller parts first, and then look at how those parts connect to each other. I think the important part is understanding why it actually works, not just memorizing the steps. Once that clicks, the rest kind of follows naturally.",
  },
  decorators: [
    (Story) => (
      <div style={{ height: 120, width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  name: "text=\"\" (renders nothing)",
  args: { text: "" },
};
