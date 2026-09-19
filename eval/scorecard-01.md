# Scorecard 01 — Home chat, Study plan, Mode selection, Free Recall Challenge – Intro

Scope: `/` (Home chat), `/study-plan`, `/recall` (Mode selection), `/recall/free-recall-challenge` (Intro/launch). All four rendered at 390px, dark mode. Scored against `eval/rubric.md`.

Method: (1) every state of each screen was rendered and screenshotted via Playwright (default, typed/empty, tab switches, done/current/locked, pressed via `mouse.down()`, default vs. custom vs. long subject), then diffed by SHA-256 of the PNG bytes to catch states that should differ but don't. (2) Four critics — critic-system, critic-craft, critic-ux, critic-ambition — each ran independently, in isolated contexts, with only these four screens and the rubric; none saw another critic's output or the phase-1 diff results.

## Overall score: 4.60 / 10

`Σ(score × weight) / Σ(weight)` = `(5×3 + 6×3 + 5×3 + 3×3 + 3×2 + 6×1) / 15` = `69 / 15` = **4.60**

Three of four hard gates failed (below), which independently caps the eval at 5/10 — the computed weighted average is already under that cap, so the gates don't move the number but confirm the floor: this isn't ready to show as-is.

## Per-dimension table

| Dimension | Weight | Score | Scored by |
|---|---|---|---|
| System fidelity | High (×3) | 5/10 | critic-system |
| Coherence | High (×3) | 6/10 | critic-system |
| Craft | High (×3) | 5/10 | critic-craft |
| UX judgment | High (×3) | 3/10 | critic-ux |
| Accessibility | Medium (×2) | 3/10 | critic-ux |
| Structure | Low (×1) | 6/10 | critic-craft |
| **Weighted total** | Σ=15 | **4.60/10** | |

## Hard gates

| Gate | Result | Evidence |
|---|---|---|
| Contrast ≥ 4.5:1 | **PASS** | critic-ux measured every rendered text/background pairing with correct alpha-compositing (catching and correcting a false 1.11:1 fail on Avatar's translucent background); worst real ratio found was 7.26:1 (SuperlistItem descriptor text, Mode selection). |
| Touch targets ≥ 44pt | **FAIL** | Home's mic button — the entry point to the whole voice-recall feature — measures 24×24px (`ChatInput.module.css:100`, no min-width/height). Bottom-nav icons measure 40×47px on every screen that has one (×4, `NavigationButton.module.css:8`). Study plan's Plan/Materials tabs measure 35×42 / 74×42px and the "Maths Exam" title button 196×36px (`study-plan/page.module.css:53-60,98-102`). All measured live via `getBoundingClientRect()`. |
| No raw hex in `src/components` | **FAIL** | `npm run check:tokens` exits 1. Three raw `#1a1a1a` literals remain in `Icons.tsx:42,58,66` (Send01, Menu01, Notification01); Menu01 and Notification01 render live on Home's AppBar, in scope for this pass. (The literal is overridden at runtime by `currentColor` in CSS, so the rendered pixel is unaffected — but the gate and the rubric's own 9-band both require the script to exit clean, and it doesn't.) |
| No silently-identical states | **FAIL** | Three components render their pressed state byte-for-byte identical to default: **ActivityCard** (Home's "Recall exercice" card), **SuperlistItem** (all three Mode selection mode cards — this screen's entire purpose), and Study plan's current-lesson-step `<button>`. Confirmed two independent ways: (a) SHA-256 of screenshots taken with the mouse held down vs. released matched exactly in phase 1; (b) critic-craft independently measured `background-color`/`box-shadow` before and after `mouse.down()` live and found zero change. None of the three components' CSS has any `:active`/`.pressed` rule at all (unlike `Button`, which does, and explicitly documents the one case — Primary — where the press effect is intentionally subtle). |

## Findings, ranked by severity, with evidence

**1. Mode selection's Close button dead-ends at `about:blank` for a student with no prior in-app navigation history.**
`src/app/recall/ModeSelectionContent.tsx:50` — `onLeftClick={() => router.back()}`, with no fallback. critic-ux reproduced this with a fresh Playwright context (no history) navigating directly to `/recall?subject=...&entry=study-plan`: tapping the 48×48px "Close" button (correctly sized, correctly labeled) leaves the student on a genuinely blank tab with no way back into the app — a real trap, the exact thing design-brief.md's hard constraints forbid. critic-system independently flagged the same line as a coherence seam: every sibling Intro screen (Guided Reflection, Concept Questions, Free Recall Challenge) hardcodes `router.push("/")` for the identical Close control instead — Mode selection is the one screen in this flow without a fixed fallback. *Fix: `onLeftClick={() => router.push("/")}` (or branch on `entry`, same as the Summary screens already do).*

**2. `subject` silently drops when routing to Concept Questions or Free Recall Challenge from Mode selection — only Guided Reflection keeps it.**
`src/app/recall/ModeSelectionContent.tsx:68-87`. critic-system verified by clicking through with `?subject=Photosynthesis` set: Guided Reflection carries it forward (`...?subject=Photosynthesis&entry=home`), the other two mode taps drop it entirely (`...?entry=home`, confirmed neither downstream route even references `subject` via grep). A student who typed a custom topic on Home loses that personalization the moment they pick anything but the first mode. *Fix: add `&subject=${encodeURIComponent(subject)}` to the two missing `router.push` calls (lines 79, 86).*

**3. Three primary tap targets have zero pressed-state feedback — see hard gate above.**
Same evidence as the hard-gate row: ActivityCard, all three SuperlistItem mode cards, and Study plan's current-step button. This is the single largest concentration of "silently identical states" in the app, and it lands on exactly the elements students are meant to tap to move forward.

**4. A long, unbreakable subject string overflows the 390px frame.**
critic-craft: navigating to `/recall?subject=Supercalifragilisticexpialidocioustopiconquantummechanicsandthermodynamics` produced `document.documentElement.scrollWidth = 793` against a 390px viewport. Cause: `TextBlock.module.css:1-11` sets `width: fit-content` on `.textBlock` with no `overflow-wrap`/`word-break` on `.title`. This heading takes raw, unvalidated student input (`ModeSelectionContent.tsx:36`) directly, so it's a reachable path, not a contrived one. *Fix: `max-width: 100%; overflow-wrap: break-word;` on `.title`, plus `min-width: 0` on its container in `recall/page.module.css`.*

**5. Touch-target failures land on core, always-visible chrome — see hard gate above.**
Mic button (24×24px), all four bottom-nav icons (40×47px), Study plan's tabs and title button. These aren't edge-case controls; they're present on every screen that has them.

**6. Home's bottom nav sits at 32px from the true frame edge; Study plan's sits at 16px — the same shell inset, applied twice on one screen.**
critic-craft measured both directly: Home's `.bottomContent` (`page.module.css:71-77`) adds its own `padding-bottom: var(--spacing-400)` *on top of* `Screen`'s own shell-level padding (`Screen.module.css:17`), doubling to 32px; Study plan doesn't re-add it and lands at the correct 16px. This is the exact regression CLAUDE.md names by title — "Set once on `Screen`'s shell; don't re-add it per screen" — reproduced live. *Fix: drop the trailing `var(--spacing-400)` from `page.module.css:75`.*

**7. Study plan's lesson-step status (done/current/locked) is color-coded with `accent-1`, a token documented as having no fixed meaning — an explicit "Never do this" violation.**
`study-plan/page.module.css:177-192`. `design-system_1.md:154`: "Never use `accent/1` through `accent/4` to signal status or paid tier... Status lives in `feedback/*`." `tokens.css:100`'s own comment names the correct token (`--color-feedback-success-bold`) for exactly this use. Disclosed in `component-gaps.md` as a color *choice*, never reconciled against this rule. *(Note: critic-ux separately confirmed status here is never color-only — it's paired with a distinct icon and fill/border per state — so this is a system-fidelity/rule violation, not an accessibility failure.)*

**8. Study plan's icons bypass `IconSlot` entirely.**
`study-plan/page.tsx:133-134,141-148,183-185` render bare icons/SVGs sized via ad hoc CSS instead of the cataloged wrapper — `design-system_1.md:17`: "An icon anywhere in the UI → `iconSlot`... never place a bare icon frame directly." The sibling FRC Intro screen in this same scope does it correctly, so the pattern was known and available.

**9. Home's hero heading still hand-rolls headline-l typography instead of `TextBlock`, and the code comment misrepresents this as already fixed.**
`src/app/page.module.css:38-48`, comment claims parity with a `component-gaps.md` "Resolved" entry that in fact lists only 4 other screens (Mode selection, and the three modes' own Intros) as converted — Home was never on that list. Confirmed live: Mode selection and FRC Intro (both in this scope) render through `TextBlock`; Home doesn't. A genuine, silently-unlogged inconsistency between structurally identical hero moments.

**10. `check:tokens` hard gate fails — see hard gate table above.**

**11. False tappable affordance: Home's non-interactive ActivityCards inherit `cursor: pointer` despite doing nothing when tapped.**
critic-craft: "Flashcards," "Quizz," and "Practice exam" render as plain `<div>`s with no `onClick` (`page.tsx:80-82`), but `cursor: pointer` is applied unconditionally to the shared `.card` class (`ActivityCard.module.css:1-10`) — confirmed via computed style. *Fix: scope `cursor: pointer` to the button case only.*

**12. Several rendered `<button>` elements on Study plan have no `onClick`.**
"Maths Exam" title (styled with a chevron implying navigation), "Focus Mode," "More options," "View materials" — all disclosed as known open gaps in the file's own header comment, so not hidden, but the chevron on "Maths Exam" specifically signals an action that doesn't exist, which reads as broken rather than deliberate.

**13. Ambition-tier gaps — informational only, not part of the weighted total.**
Materials tab's empty state is a single `<p>` instead of the `MascotSlot` + `TextBlock` pairing this app's own reference and component docs establish for empty states. FRC Intro's benefit-row icons drop the `IconBadge` colored treatment that `SuperlistItem` uses for the same "icon + short line" shape one screen earlier in the same flow. Study plan's stats row (`3 Weeks` / `Grade Goal: 7`) hand-rolls what `StatBox` is documented to cover directly. See critic-ambition's read below.

## Each critic's blind spot

- **critic-system** — did not review Guided Reflection's or Concept Questions' own Intro/session screens (out of scope for this pass), so can't confirm whether the `subject`-threading drop and the Close-button inconsistency are isolated to Mode selection/FRC Intro or run wider across all three modes. Cross-checked only via grep against the two sibling Intro files, not a full walkthrough.
- **critic-craft** — could not drive the 3-digit-XP / long-count edge case named in the rubric's Structure band: XP, streak, and grade-goal numbers are hardcoded JSX literals, not wired to any query param, so that specific edge case is unverified. Also, the Next.js dev-mode overlay (`<nextjs-portal>`) physically intercepted pointer events over the leftmost bottom-nav button during testing, requiring forced clicks — can't fully rule out it masking something real at that exact spot.
- **critic-ux** — did not test with a screen reader or keyboard-only navigation (focus order, ARIA semantics unverified — e.g. whether the unwired "Maths Exam"/"Focus Mode" buttons announce misleadingly). The `about:blank` trap was reproduced in Playwright Chromium with a fresh context; not separately confirmed inside a real iOS Safari/PWA shell, though the root cause (`router.back()` with no history fallback) is browser-independent.
- **critic-ambition** — never rendered any of the four screens in a browser; every proposal comes from reading component source, story option lists, and CSS. Whether `StatBox` or `IconBadge` would actually fit gracefully at their real rendered size next to existing layout is inferred from token-driven sizing, not visually confirmed.

## Critic-ambition's read (informational — not part of the weighted total)

**4/10.** Every slot on these four screens uses the correctly-named component doing exactly its documented default job — nothing is broken or invented — but nothing takes a swing beyond that either, and in two places a cataloged, purpose-built component that's already in use one screen away went unreached for in favor of a flatter, hand-styled default (see finding 13). Three proposed patterns, each built only from components verified to exist and already instantiated elsewhere in this same flow:
1. Give the Materials tab's empty state the `MascotSlot` + `TextBlock` treatment this app already establishes elsewhere.
2. Carry Mode selection's `IconBadge` treatment one screen further into FRC Intro's benefit list, closing the visual-weight drop between two structurally identical lists sitting back to back.
3. Replace Study plan's hand-rolled stats row with two `StatBox` instances — the component's own docs name this exact use case ("a single at-a-glance number with a label").
