# Prototype grading rubric

Six weighted dimensions, scored 1–10 each, plus a separate set of hard gates that aren't part of the weighted score — a gate failure caps the whole eval regardless of how the dimensions scored.

**Weight → multiplier**, so the weighted average is computable: High = 3, Medium = 2, Low = 1. Overall score = `Σ(dimension score × multiplier) / Σ(multipliers)`.

---

## Scoring rules

- **"Looks good" is a 6, not a 9.** A 6 means nothing is obviously broken at a glance. A 9 means it would survive a senior critique untouched — someone looking specifically for the seams, the unhandled edge, the inconsistency between two screens doing the same thing, and not finding one.
- **A dimension scores 8 or above only if it was verified by rendering, measuring, or testing.** Never from reading the JSX/CSS and inferring it's probably fine. Contrast gets measured against the actual rendered pixels. A state gets triggered and observed, not confirmed by "the code path exists." If a dimension wasn't actually exercised, its ceiling is 7.

---

## 1. System fidelity — **High**

**What it's scoring:** does every value trace back to a token in `tokens/tokens.json`, and every component to the real library in `src/components` — never a hand-rolled div standing in for a cataloged component, never a number invented because the exact token wasn't obvious.

| Score | What it looks like here |
|---|---|
| **4** | Raw hex colors or invented px/spacing values show up outside any disclosed exception. A screen hand-rolls something the library already has a component for (a bespoke button-like `<div>` instead of `Button`). Nothing is flagged in `component-gaps.md` — gaps were just silently absorbed. |
| **6** | Values trace to tokens on the common path, but an audit would find drift — an undisclosed raw px value, a spacing number that was "close enough" instead of matched to the nearest real step, one component reimplemented inline instead of reused. Reads fine; wouldn't survive a token audit. |
| **9** | Every value in every screen resolves to a token variable — verified with `npm run check:tokens` (zero hits in `src/components`) plus a manual pass over `src/app`. Every gap that genuinely couldn't be avoided (the mic-primer card's `280px`, the three icons' `#1a1a1a` fill with no matching Figma token) is explicitly logged in `component-gaps.md`, not quietly shipped. Every real UI element has a matching entry under `src/components` with a Storybook story, named per design-system_1.md's convention (Title Case for the newer component layer — `Mascot bubble`, `Chat Input`, not `mascotBubble`). |

---

## 2. Coherence — **High**

**What it's scoring:** does the app read as one product designed by one hand, or as three modes that got built separately and happen to share a repo — same AppBar grammar, same motion language, same voice from Knowie, same handling of where a student came from.

| Score | What it looks like here |
|---|---|
| **4** | The three modes (Guided Reflection / Concept Questions / Free Recall Challenge) feel like different products — different transition timing between equivalent moments, Knowie's copy voice shifts between modes, a structurally identical screen (e.g. each mode's own Processing beat) is composed differently in one mode than the others, the Screen shell's 16px inset is overridden in some screens and not others. |
| **6** | The three modes share the same components and mostly the same rhythm, but a close pass turns up seams — a mascot-expression convention used in one mode's Processing screen and skipped in another's equivalent moment, `entry` (Home vs. Study plan) threading correctly into one mode's Summary and getting dropped in another's. |
| **9** | Moving Guided Reflection → Concept Questions → Free Recall Challenge back to back, nothing reads as a seam: identical AppBar/mic/chat-input grammar across all three, the same motion rule everywhere (in-place state swaps opacity-only/~150ms, real motion reserved for genuine one-time arrivals — the project's own established rule), Knowie's voice consistent throughout, `entry` threading to every mode's Summary with zero exceptions. |

---

## 3. Craft — **High**

**What it's scoring:** spacing, rhythm, states, the small deliberate decisions that separate "assembled from components" from "actually designed" — whether interactive states are real and wired, not just defined in CSS and never triggered.

| Score | What it looks like here |
|---|---|
| **4** | Components sit in their default state only — pressed/disabled/loading states exist in the stylesheet but were never actually fired and checked. Spacing between elements is whatever a shared class happens to produce, not the exact gap the screen calls for. An obvious visual defect ships (a border that doesn't visibly separate from its own fill, a button that doesn't span full width when every sibling screen's equivalent does). |
| **6** | "Looks good" at a glance — most states exist and mostly work, spacing is close. This is explicitly the "looks good" score from the rule above, not a 9. |
| **9** | Every interactive state (`:active`/pressed, disabled, loading, sent) was actually triggered and observed, not just styled. Every gap/inset was checked against its sibling occurrences elsewhere in the app, not assumed consistent because it "should" be. Motion on any in-place change is opacity-only and ~150ms; real motion is reserved for genuine arrivals only. A senior critique finds no unexplained inconsistency between two screens doing structurally the same thing. |

---

## 4. UX judgment — **High**

**What it's scoring:** are the states from voice-ux.md's checklist handled, is the hierarchy clear, are failure paths actually designed rather than left as dead ends — measured against voice-ux.md's six principles and design-brief.md's hard constraints, not generic UX taste.

| Score | What it looks like here |
|---|---|
| **4** | A **Must**-tier state from voice-ux.md's States-to-design table is missing or dead-ends (permission denied has no way forward; Skip doesn't exist where the brief calls for it as an escape). A hard constraint from design-brief.md is violated — auto-endpointing added anywhere, or a manual stop introduced where the brief forbids one. |
| **6** | Every Must-tier state exists and technically has a way out, but doesn't reflect the *why* behind the six principles — system status is shown but not unmistakable (Principle 1: "no hover on mobile, color alone isn't enough"), the mic-permission ask isn't actually primed in context before the OS prompt (Principle 3), the Processing wait is a bare spinner instead of a calm "thinking" state (Principle 6). |
| **9** | Every Must-tier state in voice-ux.md's table is built and was verified reachable by actually clicking through it, not read from the code. Every hard constraint from design-brief.md holds with no exception found anywhere in the app. "Never trap the student" holds even in screens this project added on its own initiative (Reveal, After-recording) that weren't in the original checklist. A failure path (mic denied, permission refused) reads as designed, not bolted on. |

---

## 5. Accessibility — **Medium**

**What it's scoring:** contrast, touch targets, and whether meaning ever rests on color alone — the literal text of voice-ux.md Principle 1: "no hover on mobile, and color alone isn't enough: pair it with a shape, icon, or motion."

| Score | What it looks like here |
|---|---|
| **4** | A body-text/background pairing fails 4.5:1 somewhere in the main flow. A tappable control measures under 44pt. A state (pass/hint/error, done/current/locked) is distinguished by color only, with no icon, shape, or text backup. |
| **6** | Contrast and touch targets pass on the happy path but weren't checked across every state or variant (a chip's color-on-color pairing in a less-common state was never measured). Color-only meaning shows up in a secondary or lower-traffic screen even though the primary flow avoids it. |
| **9** | Every text/background pairing that was actually rendered was measured and clears 4.5:1. Every tappable target was measured at 44pt or above. Every place meaning is color-coded was confirmed to carry a second signal (icon, shape, or text) — Principle 1 checked against the rendered screens, not inferred from the CSS. |

---

## 6. Structure — **Low**

**What it's scoring:** the baseline — does the layout hold together and does the thing actually render, before craft or coherence even enter the picture.

| Score | What it looks like here |
|---|---|
| **4** | A screen overflows the 390px frame, breaks in dark mode, or fails to render on a real navigation (a route errors, a required search param crashes the page). |
| **6** | Every screen renders cleanly at 390px/dark mode on the happy path, but an edge case — a long name, a 3-digit XP count, the last item in a loop — visibly breaks layout once actually exercised. |
| **9** | Every screen and every state renders cleanly at 390px, dark mode, including realistic edge-case content (long text, high XP counts, every branch of every conditional), confirmed by actually navigating there. |

---

## Hard gates

Separate from the weighted score above. These are pass/fail — **a failed gate caps the overall eval at 5/10 regardless of how the six dimensions scored**, since a hard gate failure means the prototype isn't ready to show, whatever its craft or coherence looks like.

| Gate | Pass condition |
|---|---|
| **Contrast** | Every body-text/background pairing actually rendered measures **4.5:1 or higher**. |
| **Touch targets** | Every tappable control measures **44pt or larger**. |
| **No raw hex in component source** | `npm run check:tokens` exits clean (0) against `src/components` — no raw hex color literals outside a value that's genuinely a token. |
| **No silently-identical states** | No two states that are supposed to look different (pass vs. hint vs. reveal, done vs. current vs. locked, pressed vs. default) render pixel-identical. If two states can't be told apart, the state distinction doesn't functionally exist. |
