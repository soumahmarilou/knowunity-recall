import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { collectLeaves } from "./tokens";
import "./foundations.css";

function RadiusFoundations() {
  const entries = collectLeaves(["radius"]).sort(
    (a, b) => parseFloat(a.value) - parseFloat(b.value),
  );

  return (
    <div className="foundations-page">
      <section>
        <h2 className="foundations-group-title">radius</h2>
        <div className="foundations-grid">
          {entries.map((entry) => (
            <div className="foundations-card" key={entry.name}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "var(--color-interactive-primary)",
                  borderRadius: `var(${entry.cssVar})`,
                }}
              />
              <div className="foundations-name">
                {entry.name} <span className="foundations-value">{entry.value}</span>
              </div>
              <p
                className={
                  "foundations-description" +
                  (entry.description === "No description provided." ? " is-missing" : "")
                }
              >
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Radius",
  component: RadiusFoundations,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RadiusFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSteps: Story = {};
