import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { ButtonIcon } from "../ButtonIcon/ButtonIcon";
import { XClose } from "../Icons/Icons";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "WHAT IT IS: A layout wrapper for grouping buttons. variant (Horizontal/Vertical) x size (M/L). It arranges child button instances, it doesn't create new buttons itself.\n\n" +
          "WHEN TO USE IT: Whenever 2+ buttons need to sit together with consistent spacing — e.g. a confirm+cancel pair, or stacked CTAs in a bottom sheet. Use Vertical when horizontal space is tight or both actions need equal weight.\n\n" +
          "DON'T: Don't use it for a single button — just place the button directly.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["Horizontal", "Vertical"] },
    size: { control: "radio", options: ["M", "L"] },
  },
  // Every story below supplies its own `render`, which ignores this — it
  // only exists to satisfy ButtonGroupProps' required `children`.
  args: { children: null },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma's own Vertical examples: two full-width buttons, one Primary, one
// Secondary, both stretched — reproduced exactly (stretch is automatic,
// see ButtonGroup.module.css).
export const VerticalM: Story = {
  name: "Vertical, M",
  args: { variant: "Vertical", size: "M", children: null },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="Primary" size="M" cta="Continue" />
      <Button variant="Secondary" size="M" cta="Cancel" />
    </ButtonGroup>
  ),
};

export const VerticalL: Story = {
  name: "Vertical, L",
  args: { variant: "Vertical", size: "L", children: null },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="Primary" size="L" cta="Continue" />
      <Button variant="Secondary" size="L" cta="Cancel" />
    </ButtonGroup>
  ),
};

// Figma's own Horizontal examples: a fixed-size buttonIcon beside a button
// that grows to fill the rest of the row (layoutGrow: 1 on that specific
// instance in Figma, not a structural property of the group — reproduced
// here the same way, as a per-child override, not baked into the wrapper).
export const HorizontalM: Story = {
  name: "Horizontal, M",
  args: { variant: "Horizontal", size: "M", children: null },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonIcon variant="Secondary" size="M" icon={<XClose />} aria-label="Close" />
      <div style={{ flex: 1 }}>
        <Button variant="Primary" size="M" cta="Continue" />
      </div>
    </ButtonGroup>
  ),
};

export const HorizontalL: Story = {
  name: "Horizontal, L",
  args: { variant: "Horizontal", size: "L", children: null },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonIcon variant="Secondary" size="L" icon={<XClose />} aria-label="Close" />
      <div style={{ flex: 1 }}>
        <Button variant="Primary" size="L" cta="Continue" />
      </div>
    </ButtonGroup>
  ),
};
