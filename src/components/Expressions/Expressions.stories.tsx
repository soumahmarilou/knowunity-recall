import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Expressions } from "./Expressions";

const meta = {
  title: "Components/Expressions",
  component: Expressions,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A reference sheet of Knowie's facial expressions — 15 states (standby default, excited, laughing, giggling, determined, questioning, thinking, dazed, amazed, angry, overIt, approving, sad, confused, plus a placeholderIllustration fallback). Each variant is a 200×217 illustration.\n\n" +
          "WHEN TO USE IT: As the reference for which expressions exist and what each is called, when deciding how Knowie should react at a given moment — including a voice-recall judging moment, where Knowie's expression is likely part of the feedback.\n\n" +
          "DON'T: Don't assume these are already placed on real screens — they aren't yet, this set is meant to get wired in during prototyping. A separate, older family of expression instances already exists live on screens; check with the team before extending either one further.",
      },
    },
  },
  argTypes: {
    expression: {
      control: "select",
      options: [
        "standby",
        "excited",
        "laughing",
        "giggling",
        "determined",
        "questioning",
        "thinking",
        "dazed",
        "amazed",
        "angry",
        "overIt",
        "approving",
        "sad",
        "confused",
        "placeholderIllustration",
      ],
    },
  },
} satisfies Meta<typeof Expressions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standby: Story = { name: "Property 1=standby", args: { expression: "standby" } };
export const Excited: Story = { name: "Property 1=excited", args: { expression: "excited" } };
export const Laughing: Story = { name: "Property 1=laughing", args: { expression: "laughing" } };
export const Giggling: Story = { name: "Property 1=giggling", args: { expression: "giggling" } };
export const Determined: Story = { name: "Property 1=determined", args: { expression: "determined" } };
export const Questioning: Story = { name: "Property 1=questioning", args: { expression: "questioning" } };
export const Thinking: Story = { name: "Property 1=thinking", args: { expression: "thinking" } };
export const Dazed: Story = { name: "Property 1=dazed", args: { expression: "dazed" } };
export const Amazed: Story = { name: "Property 1=amazed", args: { expression: "amazed" } };
export const Angry: Story = { name: "Property 1=angry", args: { expression: "angry" } };
export const OverIt: Story = { name: "Property 1=overIt", args: { expression: "overIt" } };
export const Approving: Story = { name: "Property 1=approving", args: { expression: "approving" } };
export const Sad: Story = { name: "Property 1=sad", args: { expression: "sad" } };
export const Confused: Story = { name: "Property 1=confused", args: { expression: "confused" } };
export const PlaceholderIllustration: Story = {
  name: "Property 1=placeholderIllustration",
  args: { expression: "placeholderIllustration" },
};
