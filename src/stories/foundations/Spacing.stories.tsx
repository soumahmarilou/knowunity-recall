import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { collectLeaves, type TokenEntry } from "./tokens";
import "./foundations.css";

function bySizeAscending(a: TokenEntry, b: TokenEntry): number {
  return Math.abs(parseFloat(a.value)) - Math.abs(parseFloat(b.value));
}

function SpacingRow({ entry, negative }: { entry: TokenEntry; negative?: boolean }) {
  return (
    <div className="foundations-row" key={entry.name}>
      <div
        className="foundations-bar"
        style={{
          width: negative
            ? `calc(var(${entry.cssVar}) * -1)`
            : `var(${entry.cssVar})`,
          height: 20,
        }}
      />
      <div>
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
    </div>
  );
}

function SpacingFoundations() {
  const all = collectLeaves(["spacing"]);
  const positive = all.filter((e) => !e.path.includes("negative")).sort(bySizeAscending);
  const negative = all.filter((e) => e.path.includes("negative")).sort(bySizeAscending);

  return (
    <div className="foundations-page">
      <section>
        <h2 className="foundations-group-title">spacing</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {positive.map((entry) => (
            <SpacingRow entry={entry} key={entry.name} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="foundations-group-title">spacing/negative</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {negative.map((entry) => (
            <SpacingRow entry={entry} negative key={entry.name} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Spacing",
  component: SpacingFoundations,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpacingFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSteps: Story = {};
