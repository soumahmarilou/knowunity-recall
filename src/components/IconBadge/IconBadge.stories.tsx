import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GraduationHat01 } from "../Icons/Icons";
import { IconBadge } from "./IconBadge";

const meta = {
  title: "Components/IconBadge",
  component: IconBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "WHAT IT IS: An icon-on-a-colored-background badge. 5 color variants (1/2/3/4/brand, matching this file's accent buckets) plus an instance-swap Icon property (default graduation-hat-01). size=S is the original 32×32 (icon 20×20, and this component's own default); size=M is a modest step up (36×36, icon 24×24); size=L is a 120×120 hero scale (icon 64×64) for replacing a mascot-sized slot.\n\n" +
          "WHEN TO USE IT: Wherever an icon needs to read as a colored badge rather than a bare glyph. S is Superlist item's leading icon. M is the mode Intro screens' icon+name eyebrow. L is for a hero moment where the icon itself carries the identity a mascot would otherwise occupy.\n\n" +
          "DON'T: Don't expect a color set here to follow a parent component's own color automatically — color lives entirely in which variant of this badge is placed.",
      },
    },
  },
  argTypes: {
    color: { control: "radio", options: ["1", "2", "3", "4", "brand"] },
    size: { control: "radio", options: ["S", "M", "L"] },
  },
  args: {
    // Matches Figma's own default Icon property value.
    icon: <GraduationHat01 />,
  },
} satisfies Meta<typeof IconBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Color1: Story = { name: "color=1", args: { color: "1" } };
export const Color2: Story = { name: "color=2", args: { color: "2" } };
export const Color3: Story = { name: "color=3", args: { color: "3" } };
export const Color4: Story = { name: "color=4", args: { color: "4" } };
export const ColorBrand: Story = { name: "color=brand", args: { color: "brand" } };

export const Medium: Story = { name: "size=M, color=brand", args: { size: "M", color: "brand" } };
export const Large: Story = { name: "size=L, color=brand", args: { size: "L", color: "brand" } };
