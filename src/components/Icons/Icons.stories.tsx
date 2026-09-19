import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconSlot } from "../IconSlot/IconSlot";
import { ICONS, type IconName } from "./Icons";

// Rendered through IconSlot (24-step) rather than bare, matching how these
// icons are actually meant to be used — see IconSlot's own docs.
function IconPreview({ name }: { name: IconName }) {
  const Icon = ICONS[name];
  return <IconSlot size="400" icon={<Icon />} />;
}

const meta = {
  title: "Components/Icons",
  component: IconPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Combined set from two Figma sources — no formal three-paragraph description exists for either in Figma, only these section subtitles:\n\n" +
          '"Icon library — plain stroke icons"\n\n' +
          '"Colored icon family — accent-tinted icons"\n\n' +
          "Figma models size as separate fixed-pixel variants per icon (24/12/16); this set ships one scalable SVG per icon instead and leaves sizing to IconSlot, which already owns that job.\n\n" +
          "KNOWN GAP: trending-up-01, timer-01, and gauge-01 are hand-built placeholders, not ported from real Figma vector data (built while the Desktop Bridge plugin was disconnected) — see the KNOWN GAP comment above their definitions in Icons.tsx.\n\n" +
          "KNOWN DEVIATION: redo-01 is the one icon in this set not hand-built to match Figma — sourced from the @mdi/react + @mdi/js package per direct instruction, since no redo glyph exists in this project's icon set or Figma's library.",
      },
    },
  },
} satisfies Meta<typeof IconPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XClose: Story = { name: "x-close", args: { name: "x-close" } };
export const Send01: Story = { name: "send-01", args: { name: "send-01" } };
export const Plus01: Story = { name: "plus-01", args: { name: "plus-01" } };
export const Menu01: Story = { name: "menu-01", args: { name: "menu-01" } };
export const Notification01: Story = { name: "notification-01", args: { name: "notification-01" } };
export const Check01: Story = { name: "check-01", args: { name: "check-01" } };
export const Trash01: Story = { name: "trash-01", args: { name: "trash-01" } };
export const Microphone01: Story = { name: "microphone-01", args: { name: "microphone-01" } };
export const GraduationHat01: Story = { name: "graduation-hat-01", args: { name: "graduation-hat-01" } };
export const ProBadge01: Story = { name: "pro-badge-01", args: { name: "pro-badge-01" } };
export const Lightning01: Story = { name: "lightning-01", args: { name: "lightning-01" } };
export const Flame01: Story = { name: "flame-01", args: { name: "flame-01" } };
export const Lightbulb01: Story = { name: "lightbulb-01", args: { name: "lightbulb-01" } };
export const BlankPage01: Story = { name: "blank-page-01", args: { name: "blank-page-01" } };
export const FlashcardStack01: Story = { name: "flashcard-stack-01", args: { name: "flashcard-stack-01" } };
export const QuizQuestion01: Story = { name: "quiz-question-01", args: { name: "quiz-question-01" } };
export const ClipboardCheck01: Story = { name: "clipboard-check-01", args: { name: "clipboard-check-01" } };
export const Flask01: Story = { name: "flask-01", args: { name: "flask-01" } };
export const StackSparkle01: Story = { name: "stack-sparkle-01", args: { name: "stack-sparkle-01" } };
export const Camera01: Story = { name: "camera-01", args: { name: "camera-01" } };
export const Target04: Story = { name: "target-04", args: { name: "target-04" } };
export const Trash02: Story = { name: "trash-02", args: { name: "trash-02" } };
export const Loading01: Story = { name: "loading-01", args: { name: "loading-01" } };
export const ChevronRight: Story = { name: "chevron-right", args: { name: "chevron-right" } };
export const TrendingUp01: Story = { name: "trending-up-01", args: { name: "trending-up-01" } };
export const Timer01: Story = { name: "timer-01", args: { name: "timer-01" } };
export const Gauge01: Story = { name: "gauge-01", args: { name: "gauge-01" } };
export const RaisedHand01: Story = { name: "raised-hand-01", args: { name: "raised-hand-01" } };
export const MyaiChat: Story = { name: "myai-chat", args: { name: "myai-chat" } };
export const SearchMd: Story = { name: "search-md", args: { name: "search-md" } };
export const Trophy02: Story = { name: "trophy-02", args: { name: "trophy-02" } };
export const DotsVertical: Story = { name: "dots-vertical", args: { name: "dots-vertical" } };
export const Redo01: Story = { name: "redo-01", args: { name: "redo-01" } };
export const Target01: Story = { name: "target-01", args: { name: "target-01" } };
