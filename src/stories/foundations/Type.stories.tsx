import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getLeaf, getNode, isTokenLeaf, type TokenEntry } from "./tokens";
import "./foundations.css";

const SIZE_SEGMENTS = new Set(["l", "m", "s", "xl", "xs", "xxs"]);

function formatStyleName(path: string[]): string {
  // Drop the leading ["typography","scale"] segments.
  return path
    .slice(2)
    .map((segment) =>
      SIZE_SEGMENTS.has(segment.toLowerCase())
        ? segment.toUpperCase()
        : segment[0].toUpperCase() + segment.slice(1),
    )
    .join(" ");
}

interface TextStyle {
  name: string;
  fontFamily: TokenEntry;
  fontSize: TokenEntry;
  fontWeight: TokenEntry;
  lineHeight: TokenEntry;
}

// A "style node" is any object in typography.scale whose direct children
// are all leaf tokens (fontFamily/fontSize/fontWeight/lineHeight) — this
// covers both single-weight styles (Display L) and weight-variant styles
// (Headline XS Bold / Headline XS Regular) without hardcoding either shape.
function collectTextStyles(): TextStyle[] {
  const styles: TextStyle[] = [];

  function walk(node: unknown, path: string[]) {
    if (typeof node !== "object" || node === null) return;
    const obj = node as Record<string, unknown>;
    const keys = Object.keys(obj);
    const allLeaves = keys.length > 0 && keys.every((k) => isTokenLeaf(obj[k]));
    if (allLeaves) {
      styles.push({
        name: formatStyleName(path),
        fontFamily: getLeaf([...path, "fontFamily"]),
        fontSize: getLeaf([...path, "fontSize"]),
        fontWeight: getLeaf([...path, "fontWeight"]),
        lineHeight: getLeaf([...path, "lineHeight"]),
      });
      return;
    }
    for (const key of keys) walk(obj[key], [...path, key]);
  }

  walk(getNode(["typography", "scale"]), ["typography", "scale"]);

  // Scale order: largest to smallest. Array#sort is stable, so ties (e.g.
  // Headline XS and Body M both sit at 18px) keep tokens.json's own order.
  return styles.sort(
    (a, b) => parseFloat(b.fontSize.value) - parseFloat(a.fontSize.value),
  );
}

// CSS only accepts normal | bold | bolder | lighter | a number for
// font-weight. tokens.json also uses "regular", "semi-bold" and "heavy" —
// none of those are valid CSS, so the browser silently ignores them. This
// flags exactly that, rather than pretending the weight renders correctly.
const VALID_CSS_FONT_WEIGHTS = new Set(["normal", "bold", "bolder", "lighter"]);
function isValidCssFontWeight(value: string): boolean {
  return VALID_CSS_FONT_WEIGHTS.has(value) || /^\d+$/.test(value);
}

function TokenField({ entry, flagInvalidWeight }: { entry: TokenEntry; flagInvalidWeight?: boolean }) {
  const invalid = flagInvalidWeight && !isValidCssFontWeight(entry.value);
  return (
    <div>
      <div className="foundations-name">
        {entry.name} <span className="foundations-value">{entry.value}</span>
        {invalid && (
          <span style={{ color: "var(--color-feedback-error-bold)" }}>
            {" "}
            — not a valid CSS font-weight, renders as default (400)
          </span>
        )}
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
  );
}

function TypeFoundations() {
  const styles = collectTextStyles();
  return (
    <div className="foundations-page">
      {styles.map((style) => (
        <section className="foundations-card" key={style.name}>
          <p
            style={{
              margin: 0,
              fontFamily: `var(${style.fontFamily.cssVar})`,
              fontSize: `var(${style.fontSize.cssVar})`,
              fontWeight: `var(${style.fontWeight.cssVar})`,
              lineHeight: `var(${style.lineHeight.cssVar})`,
              color: "var(--color-text-primary)",
            }}
          >
            {style.name}
          </p>
          <div className="foundations-grid">
            <TokenField entry={style.fontSize} />
            <TokenField entry={style.lineHeight} />
            <TokenField entry={style.fontWeight} flagInvalidWeight />
            <TokenField entry={style.fontFamily} />
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Type",
  component: TypeFoundations,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TypeFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {};
