// Reads directly from tokens/tokens.json (the source of truth) so these
// foundation stories can never drift from the real design tokens. Values
// are resolved the same way Style Dictionary resolves them when it builds
// build/css/tokens.css — this file duplicates that resolution logic only
// for *display* purposes (names, resolved values, descriptions); the
// actual swatch/box colors and sizes below are still rendered with the
// real generated CSS variables, not these resolved strings.
import tokensData from "../../../tokens/tokens.json";

type TokenNode = {
  $type?: string;
  $value?: unknown;
  $description?: string;
  [key: string]: unknown;
};

function isLeaf(node: unknown): node is TokenNode {
  return (
    typeof node === "object" &&
    node !== null &&
    "$value" in (node as Record<string, unknown>)
  );
}

function getByPath(path: string[]): unknown {
  let node: unknown = tokensData;
  for (const segment of path) {
    node = (node as Record<string, unknown>)[segment];
  }
  return node;
}

/** Raw (unresolved) node at a path, for callers that need to inspect structure
 * rather than read a single leaf — e.g. finding every composed text style
 * under typography.scale. */
export function getNode(path: string[]): unknown {
  return getByPath(path);
}

export function isTokenLeaf(node: unknown): boolean {
  return isLeaf(node);
}

// Style Dictionary's "css" transform group kebab-cases each path segment
// individually, then joins with "-" — e.g. ["color","interactive",
// "pressedInverse"] -> "--color-interactive-pressed-inverse". Deriving
// the name this way (instead of hand-typing it) means it can never fall
// out of sync with what build/css/tokens.css actually contains.
function camelToKebab(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function cssVarName(path: string[]): string {
  return "--" + path.map(camelToKebab).join("-");
}

function resolveValue(rawValue: unknown): unknown {
  if (
    typeof rawValue === "string" &&
    rawValue.startsWith("{") &&
    rawValue.endsWith("}")
  ) {
    const refPath = rawValue.slice(1, -1).split(".");
    const refNode = getByPath(refPath) as TokenNode;
    return resolveValue(refNode.$value);
  }
  return rawValue;
}

function formatValue(type: string | undefined, resolved: unknown): string {
  if (
    type === "color" &&
    typeof resolved === "object" &&
    resolved !== null
  ) {
    const color = resolved as { hex: string; alpha?: number };
    if (typeof color.alpha === "number" && color.alpha < 1) {
      const r = parseInt(color.hex.slice(1, 3), 16);
      const g = parseInt(color.hex.slice(3, 5), 16);
      const b = parseInt(color.hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
    }
    return color.hex;
  }
  if (
    type === "dimension" &&
    typeof resolved === "object" &&
    resolved !== null
  ) {
    const dim = resolved as { value: number; unit: string };
    return `${dim.value}${dim.unit}`;
  }
  return String(resolved);
}

export interface TokenEntry {
  /** Full path from the root of tokens.json, e.g. ["color","background","page"] */
  path: string[];
  /** Slash-joined path as it actually appears in tokens.json, e.g. "color/background/page" */
  name: string;
  cssVar: string;
  value: string;
  /** The token's own $description, or an explicit fallback when it has none. */
  description: string;
}

function describe(node: TokenNode, path: string[]): TokenEntry {
  return {
    path,
    name: path.join("/"),
    cssVar: cssVarName(path),
    value: formatValue(node.$type, resolveValue(node.$value)),
    description: node.$description ?? "No description provided.",
  };
}

/** Every leaf token nested under the given path, in the order tokens.json defines them. */
export function collectLeaves(path: string[]): TokenEntry[] {
  const root = getByPath(path);
  const entries: TokenEntry[] = [];

  function walk(node: unknown, currentPath: string[]) {
    if (isLeaf(node)) {
      entries.push(describe(node as TokenNode, currentPath));
      return;
    }
    if (typeof node === "object" && node !== null) {
      for (const key of Object.keys(node as Record<string, unknown>)) {
        walk((node as Record<string, unknown>)[key], [...currentPath, key]);
      }
    }
  }

  walk(root, path);
  return entries;
}

/** A single leaf token's entry, for tokens accessed directly (not walked). */
export function getLeaf(path: string[]): TokenEntry {
  return describe(getByPath(path) as TokenNode, path);
}
