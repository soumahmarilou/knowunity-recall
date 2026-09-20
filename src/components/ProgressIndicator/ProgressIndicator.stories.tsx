import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressIndicator } from "./ProgressIndicator";

const meta = {
  title: "Components/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  args: {
    "aria-label": "Recall progress",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A horizontal linear progress bar (pill-shaped track, fixed height, fill width scales with progress). variant (Primary/Coral) x thickness (24/16) x progress (0/33/66/100), plus a showText boolean for a percentage label. Progress is stepped in thirds, not a free 0-100 value.\n\n" +
          "WHEN TO USE IT: Any bounded progress state — a study session, a multi-step flow, or a possible \"evaluating\" indicator while Knowie judges a spoken answer.\n\n" +
          "DON'T: Don't treat the 33% steps as fine-grained enough for continuous progress without checking how the bar looks between steps — intermediate values aren't built as variants.\n\n" +
          'KNOWN GAP: despite the description calling it "a percentage label," the live component\'s actual example text reads a fraction ("2/3"), not "66%" — and thickness=16 has no text layer at all in Figma, so showText only has an effect at thickness=24.',
      },
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryT24P0: Story = {
  name: "variant=Primary, thickness=24, progress=0",
  args: { variant: "Primary", thickness: "24", progress: "0" },
};
export const PrimaryT24P33: Story = {
  name: "variant=Primary, thickness=24, progress=33",
  args: { variant: "Primary", thickness: "24", progress: "33" },
};
export const PrimaryT24P66: Story = {
  name: "variant=Primary, thickness=24, progress=66",
  args: { variant: "Primary", thickness: "24", progress: "66" },
};
export const PrimaryT24P100: Story = {
  name: "variant=Primary, thickness=24, progress=100",
  args: { variant: "Primary", thickness: "24", progress: "100" },
};

export const PrimaryT16P0: Story = {
  name: "variant=Primary, thickness=16, progress=0",
  args: { variant: "Primary", thickness: "16", progress: "0" },
};
export const PrimaryT16P33: Story = {
  name: "variant=Primary, thickness=16, progress=33",
  args: { variant: "Primary", thickness: "16", progress: "33" },
};
export const PrimaryT16P66: Story = {
  name: "variant=Primary, thickness=16, progress=66",
  args: { variant: "Primary", thickness: "16", progress: "66" },
};
export const PrimaryT16P100: Story = {
  name: "variant=Primary, thickness=16, progress=100",
  args: { variant: "Primary", thickness: "16", progress: "100" },
};

export const CoralT24P0: Story = {
  name: "variant=Coral, thickness=24, progress=0",
  args: { variant: "Coral", thickness: "24", progress: "0" },
};
export const CoralT24P33: Story = {
  name: "variant=Coral, thickness=24, progress=33",
  args: { variant: "Coral", thickness: "24", progress: "33" },
};
export const CoralT24P66: Story = {
  name: "variant=Coral, thickness=24, progress=66",
  args: { variant: "Coral", thickness: "24", progress: "66" },
};
export const CoralT24P100: Story = {
  name: "variant=Coral, thickness=24, progress=100",
  args: { variant: "Coral", thickness: "24", progress: "100" },
};

export const CoralT16P0: Story = {
  name: "variant=Coral, thickness=16, progress=0",
  args: { variant: "Coral", thickness: "16", progress: "0" },
};
export const CoralT16P33: Story = {
  name: "variant=Coral, thickness=16, progress=33",
  args: { variant: "Coral", thickness: "16", progress: "33" },
};
export const CoralT16P66: Story = {
  name: "variant=Coral, thickness=16, progress=66",
  args: { variant: "Coral", thickness: "16", progress: "66" },
};
export const CoralT16P100: Story = {
  name: "variant=Coral, thickness=16, progress=100",
  args: { variant: "Coral", thickness: "16", progress: "100" },
};

// showText only exists at thickness=24 in Figma (thickness=16 has no text
// layer at all) — shown as extra stories rather than folded into the
// sixteen variant x thickness x progress states above.
export const WithText: Story = {
  name: "variant=Primary, thickness=24, progress=66, showText=true",
  args: {
    variant: "Primary",
    thickness: "24",
    progress: "66",
    showText: true,
    "aria-label": "2 of 3 recalled",
  },
};
export const WithTextCoral: Story = {
  name: "variant=Coral, thickness=24, progress=33, showText=true",
  args: {
    variant: "Coral",
    thickness: "24",
    progress: "33",
    showText: true,
    "aria-label": "1 of 3 recalled",
  },
};
