import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Screen } from "./Screen";

const meta = {
  title: "Components/Screen",
  component: Screen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "WHAT IT IS: A 390px-wide, full-height, dark-background page shell — the outer frame every screen in this prototype was hand-building identically. Not Figma's real \"scaffold\" component (no slots, no size variant, no bottom-sheet handling) — see the component's own doc comment for the distinction.\n\n" +
          "WHEN TO USE IT: Wrap every screen's root in this instead of hand-rolling the width/height/background rule per page.\n\n" +
          "DON'T: Don't expect any layout structure beyond the outer frame — compose AppBar, content, and nav bar freely inside it, same as before.",
      },
    },
  },
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    children: null,
  },
};
