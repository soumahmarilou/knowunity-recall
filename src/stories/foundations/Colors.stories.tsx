import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { collectLeaves } from "./tokens";
import "./foundations.css";

// Only the semantic color groups — the ones components actually consume.
// Primitives (navy, violet, red, alpha, ...) are deliberately excluded:
// design-system_1.md says never read a primitive directly, so a
// foundations page built for that rule shouldn't showcase them as if
// they were meant to be used on their own.
const SEMANTIC_GROUPS = [
  "background",
  "text",
  "border",
  "interactive",
  "feedback",
  "accent",
  "pro",
  "mascot",
];

function ColorFoundations() {
  return (
    <div className="foundations-page">
      {SEMANTIC_GROUPS.map((group) => {
        const entries = collectLeaves(["color", group]);
        return (
          <section key={group}>
            <h2 className="foundations-group-title">color/{group}</h2>
            <div className="foundations-grid">
              {entries.map((entry) => (
                <div className="foundations-card" key={entry.name}>
                  <div
                    className="foundations-swatch"
                    style={{ background: `var(${entry.cssVar})` }}
                  />
                  <div className="foundations-name">{entry.name}</div>
                  <div className="foundations-value">{entry.value}</div>
                  <p
                    className={
                      "foundations-description" +
                      (entry.description === "No description provided."
                        ? " is-missing"
                        : "")
                    }
                  >
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const meta = {
  title: "Foundations/Colors",
  component: ColorFoundations,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};
