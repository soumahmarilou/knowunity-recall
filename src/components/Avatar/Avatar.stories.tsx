import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: A round avatar badge. Only one Figma instance was ever inspected (Type=Image, Size=Large, Shape=Circle, Initials=\"H\") — size and shape are typed for fidelity to that instance, not a confirmed full option set.\n\n" +
          "WHEN TO USE IT: Wherever the signed-in student's identity is shown.\n\n" +
          "DON'T: Don't assume an image mode exists yet — no real avatar-image asset or system exists in this project, so this renders the initials fallback only.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "size=Large, shape=Circle",
  args: { size: "Large", shape: "Circle", initials: "H" },
};
