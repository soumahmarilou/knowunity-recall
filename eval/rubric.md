# Prototype grading rubric

Seven weighted dimensions, scored 1–10 each, plus a separate set of hard gates that aren't part of the weighted score — a gate failure caps the whole eval regardless of how the dimensions scored.

**Weight → multiplier**, so the weighted average is computable: High = 3, Medium = 2, Low = 1. Overall score = `Σ(dimension score × multiplier) / Σ(multipliers)`.

---

## Scoring rules

- **"Looks good" is a 6, not a 9.** A 6 means nothing is obviously broken at a glance. A 9 means it would survive a senior critique untouched — someone looking specifically for the seams, the unhandled edge, the inconsistency between two screens doing the same thing, and not finding one.
- **A dimension scores 8 or above only if it was verified by rendering, measuring, or testing.** Never from reading the JSX/CSS and inferring it's probably fine. Contrast gets measured against the actual rendered pixels. A state gets triggered and observed, not confirmed by "the code path exists." If a dimension wasn't actually exercised, its ceiling is 7.

---

## Calibration — the reference

This is Marilou's own screen-by-screen scoring pass, kept verbatim, labeled as **the reference**: when a critic is unsure between two scores for these four screens, it compares against the row below — not against another critic's number, and not against the anchor prose alone. Predates §5 (Comprehension & wayfinding didn't exist yet) and §1's narrower scope (didn't yet exclude real-product resemblance) — see the note under the table for how the old "UX judgment" rows map onto the new §4/§5 split.

| Screen | Dimension | Score | Reason |
|---|---|---|---|
| Home chat | System fidelity | 6 | Uses the system's tokens and components. |
| Home chat | Coherence | 5 | Could be more coherent if the exercise's icon and name were cited in the rest of the flow. |
| Home chat | Craft | 5 | Missing personalised icons for each card and chip. |
| Home chat | UX judgment | 2 | The chat exercise selection and writing what you want to practice ask too much effort and comprehension; information architecture and naming problem; missing navigation labelling under the icons to navigate. |
| Home chat | Accessibility | 6 | No obvious problem. |
| Study plan | System fidelity | 3 | Doesn't exactly look like the current live Study plan. |
| Study plan | Coherence | 4 | Could be more coherent if the exercise's icon and name were cited in the rest of the flow; not the same Recall exercice icon as on the home page. |
| Study plan | Craft | 3 | Missing the step-by-step journey aspect, and the icons aren't necessarily very nice. |
| Study plan | UX judgment | 4 | Difficulty understanding what the different steps mean and why that order. |
| Study plan | Accessibility | 6 | No obvious problem. |
| Mode selection | System fidelity | 6 | Uses the system's tokens and components. |
| Mode selection | Coherence | 5 | Could be more coherent if the exercise's icon and name were cited in the rest of the flow. |
| Mode selection | Craft | 5 | Could have more effort on the icons and motion. |
| Mode selection | UX judgment | 3 | Categorisation not clear. |
| Mode selection | Accessibility | 6 | No obvious problem. |
| FRC Intro/launch | System fidelity | 5 | Uses the system's tokens and components, but added new icons. |
| FRC Intro/launch | Coherence | 5 | Could be more coherent if the exercise's icon and name were cited in the rest of the flow. |
| FRC Intro/launch | Craft | 5 | Could have more effort on the icons and motion. |
| FRC Intro/launch | UX judgment | 4 | Not clear and concrete enough, too much text; could have more scannability. |
| FRC Intro/launch | Accessibility | 6 | No obvious problem. |

**Reading the UX judgment rows above:** these scores predate the §4/§5 split. When comparing a new critic's score, route each reason against whichever dimension it actually describes — the comprehension/IA/naming complaints (all four screens' lowest scores) belong against **§5 Comprehension & wayfinding**; Home chat's "navigation labelling" clause belongs against **§3 Craft**; nothing in this table's UX judgment column is a voice-ux.md Principle miss (§4 didn't have a screen with recording states in this scope), so §4 has no calibration row yet.

---

## 1. System fidelity — **High**

**What it's scoring:** does every value trace back to a token in `tokens/tokens.json`, and every component to the real library in `src/components` — never a hand-rolled div standing in for a cataloged component, never a number invented because the exact token wasn't obvious. This is *internal* consistency with this project's own system, not a visual match to KnowUnity's real, live product — a screen can score high here even where it deliberately diverges from a real reference, as long as every value it uses is a real token and every component is a real one.

**Out of scope for this dimension:** whether a screen actually resembles the live production app. That's a legitimate thing to check and a real gap this rubric doesn't cover yet — see the note at the bottom of this file. Don't fold it into this score; a screen that's internally token-clean but unlike the real product still scores well here.

| Score | What it looks like here |
|---|---|
| **4** | Raw hex colors or invented px/spacing values show up outside any disclosed exception. A screen hand-rolls something the library already has a component for (a bespoke button-like `<div>` instead of `Button`). Nothing is flagged in `component-gaps.md` — gaps were just silently absorbed. |
| **6** | Values trace to tokens on the common path, but an audit would find drift — an undisclosed raw px value, a spacing number that was "close enough" instead of matched to the nearest real step, one component reimplemented inline instead of reused. Reads fine; wouldn't survive a token audit. |
| **9** | Every value in every screen resolves to a token variable — verified with `npm run check:tokens` (zero hits in `src/components`) plus a manual pass over `src/app`. Every gap that genuinely couldn't be avoided (the mic-primer card's `280px`, the three icons' `#1a1a1a` fill with no matching Figma token) is explicitly logged in `component-gaps.md`, not quietly shipped. Every real UI element has a matching entry under `src/components` with a Storybook story, named per design-system_1.md's convention (Title Case for the newer component layer — `Mascot bubble`, `Chat Input`, not `mascotBubble`). |

---

## 2. Coherence — **High**

**What it's scoring:** does the app read as one product designed by one hand, or as three modes that got built separately and happen to share a repo — same AppBar grammar, same motion language, same voice from Knowie, same handling of where a student came from, and the same identity (icon + name) for a given exercise everywhere it appears — from its card on Home or Study plan, through Mode selection, into the mode itself, and back on any later results screen. A student should be able to recognize "this is the same thing I picked" at every touchpoint, not just verify that the components are internally consistent.

| Score | What it looks like here |
|---|---|
| **4** | The three modes (Guided Reflection / Concept Questions / Free Recall Challenge) feel like different products — different transition timing between equivalent moments, Knowie's copy voice shifts between modes, a structurally identical screen (e.g. each mode's own Processing beat) is composed differently in one mode than the others, the Screen shell's 16px inset is overridden in some screens and not others. An exercise's icon/name on its selection card doesn't match what it's introduced as once inside the mode — a student who already did it doesn't recognize it by name on a later screen (confirmed in real usability testing, not inferred from a screenshot). |
| **6** | The three modes share the same components and mostly the same rhythm, but a close pass turns up seams — a mascot-expression convention used in one mode's Processing screen and skipped in another's equivalent moment, `entry` (Home vs. Study plan) threading correctly into one mode's Summary and getting dropped in another's. An exercise's icon or label is close-but-not-identical between where it's chosen and where it's used (right family, wrong instance) — enough to cause hesitation, not enough to be unrecognizable. |
| **9** | Moving Guided Reflection → Concept Questions → Free Recall Challenge back to back, nothing reads as a seam: identical AppBar/mic/chat-input grammar across all three, the same motion rule everywhere (in-place state swaps opacity-only/~150ms, real motion reserved for genuine one-time arrivals — the project's own established rule), Knowie's voice consistent throughout, `entry` threading to every mode's Summary with zero exceptions, and the same icon+name for a given exercise recognizable at every touchpoint from selection through completion. |

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

## 5. Comprehension & wayfinding — **High**

**What it's scoring:** can a student who's never seen this app figure out what to do next without being told — what to type or tap at Home, what a mode actually is before picking it, what a Study plan step means and why it's in that order, what just happened after an answer — measured against real, naive first-contact behavior, not whether the affordance technically exists. This is deliberately separate from UX judgment (§4), which is scoped narrowly to voice-ux.md's recording-specific states; this dimension covers everything else a first-time student has to parse on their own: entry points, naming, sequencing, and whether a result actually answers the question they have about their own performance. Added after real usability sessions surfaced this as the single largest source of visible confusion, in territory none of the other six dimensions were ever positioned to catch.

| Score | What it looks like here |
|---|---|
| **4** | A first-time-user session shows the student guessing, trying several wrong paths, or saying outright they don't understand what's being asked of them (e.g. "why am I the one explaining?", "I don't see the difference with the quiz"). A mode's name/category doesn't communicate what happens inside it — someone who already completed it doesn't recognize it by name on a later screen. A results/summary screen doesn't answer the specific question a student has about their own performance (e.g. "which one did I get wrong, and why?"). |
| **6** | The happy path is walkable by someone who already knows the product's own vocabulary ("recall," "reveal," "coverage"), but a genuinely first-time user hesitates, backtracks, or needs more than one attempt to find the right entry action. Feedback exists but doesn't register as an answer to the question the student actually has — a hint or correctness signal disappears before it reads as pass/fail, a step order is visible but never explained. |
| **9** | Verified with at least one real, unprimed person walking the flow cold — not inferred from copy that reads clearly to someone who already knows what it's supposed to say. They found the right entry action on the first try, correctly understood what each mode does before picking it, and could explain what just happened after an answer, using only what the interface itself told them. |

---

## 6. Accessibility — **Medium**

**What it's scoring:** contrast, touch targets, and whether meaning ever rests on color alone — the literal text of voice-ux.md Principle 1: "no hover on mobile, and color alone isn't enough: pair it with a shape, icon, or motion."

| Score | What it looks like here |
|---|---|
| **4** | A body-text/background pairing fails 4.5:1 somewhere in the main flow. A tappable control's real hit region — not just its visible box — measures under 44pt. A state (pass/hint/error, done/current/locked) is distinguished by color only, with no icon, shape, or text backup. |
| **6** | Contrast and touch targets pass on the happy path but weren't checked across every state or variant (a chip's color-on-color pairing in a less-common state was never measured). A control's visible box reads smaller than 44pt and the expanded hit region isn't documented anywhere, even if it happens to work when tapped. Color-only meaning shows up in a secondary or lower-traffic screen even though the primary flow avoids it. |
| **9** | Every text/background pairing that was actually rendered was measured and clears 4.5:1. Every tappable target's real hit region was measured at 44pt or above by tapping outside the visible edge, not inferred from CSS, and any expansion past the visible box is documented. Every place meaning is color-coded was confirmed to carry a second signal (icon, shape, or text) — Principle 1 checked against the rendered screens, not inferred from the CSS. |

---

## 7. Structure — **Low**

**What it's scoring:** the baseline — does the layout hold together and does the thing actually render, before craft or coherence even enter the picture.

| Score | What it looks like here |
|---|---|
| **4** | A screen overflows the 390px frame, breaks in dark mode, or fails to render on a real navigation (a route errors, a required search param crashes the page). |
| **6** | Every screen renders cleanly at 390px/dark mode on the happy path, but an edge case — a long name, a 3-digit XP count, the last item in a loop — visibly breaks layout once actually exercised. |
| **9** | Every screen and every state renders cleanly at 390px, dark mode, including realistic edge-case content (long text, high XP counts, every branch of every conditional), confirmed by actually navigating there. |

---

## Hard gates

Separate from the weighted score above. These are pass/fail — **a failed gate caps the overall eval at 5/10 regardless of how the seven dimensions scored**, since a hard gate failure means the prototype isn't ready to show, whatever its craft or coherence looks like.

| Gate | Pass condition |
|---|---|
| **Contrast** | Every body-text/background pairing actually rendered measures **4.5:1 or higher**. |
| **Touch targets** | Every tappable control's real hit region — the area that functionally responds to a tap, not just its visible box — measures **44pt or larger**, confirmed by actually tapping/clicking outside the visible edge, not inferred from CSS. A visible affordance smaller than 44pt only counts as passing if the expanded hit region is documented somewhere (`component-gaps.md`, or a comment on the component itself) — an invisible expansion nobody disclosed doesn't count as verified, even if it happens to work. |
| **No raw hex in component source** | `npm run check:tokens` exits clean (0) against `src/components` — no raw hex color literals outside a value that's genuinely a token. |
| **No silently-identical states** | No two states that are supposed to look different (pass vs. hint vs. reveal, done vs. current vs. locked, pressed vs. default) render pixel-identical. If two states can't be told apart, the state distinction doesn't functionally exist. |
| **No dead-end / non-terminating core loop** | Every core exercise (Guided Reflection / Concept Questions / Free Recall Challenge's actual session, not just their entry screens) reaches a natural end state, or gives an explicit way to stop, within its designed flow — verified by actually running the loop to completion, not read from the branching logic. A student is never left retrying the same step indefinitely with no visible progress and no exit; this is "never trap the student" (already named in UX judgment §4's 9-anchor) made explicit and testable as its own gate, since a session participant hit exactly this in Guided Reflection and had to bail out manually. |

---

## Known gap, not yet a dimension

Whether a screen actually resembles KnowUnity's real, live product is a real thing worth checking and isn't scored anywhere above — System fidelity (§1) is explicitly scoped to *internal* consistency with this project's own tokens/components, not to a real external reference. It isn't added as an eighth dimension here because, unlike every dimension above, there's no stable, always-available reference to score it against consistently across critics and eval runs — it needs a live comparison a given review may or may not have access to. If a review does have that access, note it separately rather than folding it into System fidelity's score.
