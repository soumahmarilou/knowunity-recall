# Voice Recall Prototype — Spec

This prototype is the Next.js app in this repo (`src/app`). Every screen listed below is a **page with its own route**, reached by the student tapping a real button or link — this is a clickthrough prototype, not a single page with internal view-state. Storybook (`npm run storybook`) stays the component catalog: pages import and compose real components from `src/components/*`, they don't redraw them. Recall and judging are mocked per `design-brief.md` — there is no backend, no real speech-to-text, no real model call anywhere in this build.

## What we're building

A voice-first active-recall step for Knowunity: a student picks one of three modes (Guided Reflection, Concept Questions, Free Recall Challenge), explains what they know out loud (or by typing), and gets back text-only responses from Knowie — with every state, failure path, and mocked-judging behavior fully clicked-through, end to end, on a 390px dark-mode iOS frame.

---

## Screen list, build order (easiest first)

1. **Guided Reflection – Intro, alone.** The single smallest screen in the whole build: one `AppBar`, one `MascotSlot`, two `IconSlot`+`Icons` pairs, one `Button`. Build this one screen first, by itself, before touching anything else — it's the cheapest place to discover that a component doesn't import cleanly, a token doesn't resolve, or `AppBar`'s slot composition doesn't behave the way `design-system_1.md` describes. Finding that out here costs one screen; finding it out inside the session flow costs a debugging session across a state machine.
2. Mode selection
3. Concept Questions – Intro, Free Recall Challenge – Intro (same template as #1, now proven — should be near-copies)
4. Home chat – Default
5. Home chat – Recall exercice selected
6. Guided Reflection – session flow (Launched → Recording → Processing → Summary → Summary Continue)
7. Concept Questions – session flow (adds the hint ladder, Reveal)
8. Free Recall Challenge – session flow (segmented recording loop, timer, Aspect to revise, Final Summary)
9. Study plan – home (reached from the bottom nav bar's 3rd tab on every screen that has one)

---

## Per-screen breakdown

Shared chrome on every screen below (not re-listed per screen): the iOS status bar at the very top — per `design-system_1.md`, this is **not a component in this library**, it "comes from an external library component and isn't something you control here" — plus `AppBar` (variant depends on screen — noted per screen) from `src/components/AppBar/AppBar.tsx`, closing via `AppBarButtonIcon` (`src/components/AppBarButtonIcon/AppBarButtonIcon.tsx`) with the `x-close` icon from `src/components/Icons`.

### 1. Mode selection — `src/app/recall/page.tsx`

- **States:** static, single state.
- **Components:** `AppBar` (`variant=leftAndRightIconButton`), `MascotSlot` (`size=2XL`) showing `Expressions` `excited`, three `SuperlistItem` rows each pairing an `IconBadge` (`color=1`/`3`/`4`) with `Icons` (`microphone-01`, `lightbulb-01`, `graduation-hat-01`).
- **Actions →:**
  - Tap "Guided Reflection" row → `/recall/guided-reflection`
  - Tap "Concept Questions" row → `/recall/concept-questions`
  - Tap "Free Recall Challenge" row → `/recall/free-recall-challenge`
  - Tap close (x) → back to entry point (`/` or `/recall-exercice`, whichever the student came from)

### 2–4. Mode Intro screens

`src/app/recall/guided-reflection/page.tsx`, `src/app/recall/concept-questions/page.tsx`, `src/app/recall/free-recall-challenge/page.tsx`

- **States:** static, single state, per mode.
- **Components:** `AppBar` (`variant=leftIconButtonOnly`), `MascotSlot` (`size=2XL`) + `Expressions` `excited`, a row of `IconSlot` + `Icons` (mode-specific: microphone/graduation-hat for Guided Reflection; microphone/lightbulb/trending-up for Concept Questions; timer/gauge/trending-up for Free Recall Challenge), `Button` (`variant=Primary, size=L`) labeled "Start".
- **Actions →:**
  - Tap "Start" → that mode's `/session` route (e.g. `/recall/guided-reflection/session`)
  - Tap close (x) → `/recall`

### 5. Home chat – Default — `src/app/page.tsx`

- **States:** static.
- **Components:** `AppBar` (`variant=leftAndRightIconButton`), `BadgeChip` ×3 (`type=pro`/`xp`/`streak`), `MascotSlot`(`2XL`) + `Expressions` `excited`, `ActivityCard` ×4 (`Default`/`Recall exercice`/`Flashcards`/`Quizz`/`Practice exam` variants), `ChatInput` (`state=Default`), `ButtonIcon`, `IconSlot`, 4× `NavigationButton` (`State=Active`), and an **Avatar** component in the top-right.
  - ⚠️ **Build note:** `Avatar` doesn't exist in `src/components` yet — it's used in Figma's Home chat screens but was never ported. Build it before this screen, or stub it.
- **Actions →:**
  - Tap the "Recall exercice" `ActivityCard` or the mic `IconSlot` in the input row → `/recall-exercice`
  - Tap any other `ActivityCard` (Flashcards/Quizz/Practice exam) → out of scope, no route (see Out of scope)
  - Tap the nav bar's target tab → `/study-plan` (see screen 10). Tap the other 2 non-current tabs (search, trophy) → out of scope, no route

### 6. Home chat – Recall exercice selected — `src/app/recall-exercice/page.tsx`

- **States:** static (the chip-attached state of the same chat surface).
- **Components:** same chrome as Home chat – Default, minus the `ActivityCard` row, plus `ChatInput` (`state=Chip attached`) showing a `Chips` (`size=XS, color=Primary, active=False`) reading "Recall exercice" with an `x-close` to detach it.
- **Actions →:**
  - Tap send/mic on the attached chip → `/recall` (Mode selection)
  - Tap the chip's `x-close` → `/` (back to Home chat – Default, chip removed)

---

### Guided Reflection session flow

#### 7a. Launched — `src/app/recall/guided-reflection/session/page.tsx`

- **States:**
  - **Idle** — prompt shown, `MicButton` (`state=idle`), `ChatInput` (`state=Answer`) visible as the "or Type to answer" fallback.
  - **Permission-priming** (first mic tap only, once ever app-wide) — a small confirm card anchored at the mic ("Knowie needs your mic to hear your answer"), then the OS dialog fires.
  - **Mic-disabled** (only if the OS dialog was denied) — `MicButton` (`state=disabled`) + a tap-to-learn-more link explaining how to re-enable in Settings. Persists for the rest of the session.
- **Components:** `AppBar` (`variant=leftAndRightIconButton`), `Button` (`Primary, S`) "Finish", `AppBarButtonIcon` (`dots-vertical`), `MascotBubble` (`position=Left`) + `Expressions` `approving`, `Chips`, `MicButton`, `Icons` `microphone-01`, `ChatInput` (`state=Answer`), `ButtonIcon` (`Primary, S`) + `send-01` for the typed-answer send.
- **Actions →:**
  - Tap mic (granted, or already-granted) → `/recall/guided-reflection/session/recording`
  - Tap mic (first time, primer shown, student allows) → OS dialog → allow → `/recall/guided-reflection/session/recording`
  - Tap mic (first time, primer shown, student denies) → stays on this page, switches to Mic-disabled state
  - Type + tap send → `/recall/guided-reflection/session/processing` (text fallback skips Recording entirely)
  - Tap "Finish" → `/recall/guided-reflection/summary`

#### 7b. Recording — `src/app/recall/guided-reflection/session/recording/page.tsx`

- **States:** actively recording, single state.
- **Components:** `MascotBubble` (`Left`) + `approving`, `Waveform`, `MicButton` (`state=recording`) + `check-01` (Send), `ButtonIcon` (`Secondary, L`) + `trash-01` (Redo).
- **Actions →:**
  - Tap Send (check) → `/recall/guided-reflection/session/processing`
  - Tap Redo (trash) → back to `/recall/guided-reflection/session`, Idle state, take discarded

#### 7c. Processing — `src/app/recall/guided-reflection/session/processing/page.tsx` *(new — not yet in Figma or Storybook as a composed screen)*

- **States:** two phases — thinking, then acknowledging. `MicButton`/`ChatInput` show a real send/spin state only during the "thinking" phase; both settle to their sent/disabled look once "acknowledging" starts.
- **Components:** "Thinking" phase — `MascotBubble` + `Expressions` `thinking`, "Thinking…". "Acknowledging" phase — `MascotBubble` + `Expressions` `approving`, a fixed non-judgmental acknowledgment line (never "correct"/"pass" — this mode's own hard rule), `showButton` "Next question".
- **Actions →:** "Thinking" auto-advances to "Acknowledging" after a short delay — no tap needed. "Acknowledging" does **not** auto-advance: the student taps "Next question" to go to `/recall/guided-reflection/session`, Idle, `term + 1` (no result shown — Guided Reflection has no result state, ever). The session loops rather than ending at a fixed term count, so there's no last-term branch to Summary here — the AppBar's "Finish" button (present and always tappable on every Guided Reflection screen) is the only way to end the session and reach `/recall/guided-reflection/summary`.

#### 7d. Summary — `src/app/recall/guided-reflection/summary/page.tsx`

- **Components:** `SuperlistItem` ×N (`color=3`) recapping what was explored, `ButtonGroup` (`Vertical, L`) with `Button` (`Primary, L`) "Continue" and `Button` (`Secondary, L`) "Skip".
- **Actions →:**
  - Tap "Continue" or "Skip" → `/recall/guided-reflection/summary/continue`

#### 7e. Summary – Continue — `src/app/recall/guided-reflection/summary/continue/page.tsx`

- **Components:** `MascotSlot` + `standby`, `SuperlistItem` (`color=3`) "Find Study Notes".
- **Actions →:**
  - Tap the row → out of scope (flashcard/study-notes surface isn't built)
  - Tap close (x) → `/` (entry-point-dependent branching per `sprint-context.md` is Open, see below)

---

### Concept Questions session flow

#### 8a. Launched — `src/app/recall/concept-questions/session/page.tsx`

- **States:** Idle, Permission-priming, Mic-disabled (same pattern as Guided Reflection) **plus**:
  - **Result-passed** — mascot copy affirms, auto-advances to next term.
  - **Result-partial** — mascot bubble shows hint copy (e.g. "Almost there…"), `Chips`; student re-attempts.
  - **Forced reveal** — after the 2nd hint's re-attempt resolves, auto-routes to Reveal regardless of outcome.
- **Components:** `AppBar`, `ProgressIndicator` (`variant=Primary, thickness=24`, progress steps by term), `AppBarButtonIcon` (`dots-vertical`), `MascotBubble` + `approving`, `Chips`, `MicButton`, `ChatInput` (`state=Answer`), `Button` "Reveal answer" (self-service, visible and tappable at any point — not gated behind the hint ladder).
- **Actions →:**
  - Tap mic → `/recall/concept-questions/session/recording`
  - Tap "Reveal answer" (any time) → `/recall/concept-questions/session/reveal`
  - Type + send → `/recall/concept-questions/session/processing`

#### 8b. Recording — `src/app/recall/concept-questions/session/recording/page.tsx` *(new — mirrors Guided Reflection's Recording 1:1)*

- Same components/actions as 7b, routed to `/recall/concept-questions/session/processing` on Send, back to `/recall/concept-questions/session` on Redo.

#### 8c. Processing — `src/app/recall/concept-questions/session/processing/page.tsx` *(new)*

- Same as 7c, but on resolve routes back to `/recall/concept-questions/session` with the result state set (Result-passed / Result-partial / Forced-reveal → `/recall/concept-questions/session/reveal`).

#### 8d. Reveal — `src/app/recall/concept-questions/session/reveal/page.tsx`

Genuinely reuses the Launched screen (8a), not a separate composition — same `AppBar`/progress/XP, same mic + chat-input row. Only two things differ: the mascot's bubble (no "Reveal answer" button, body text is the term's answer, `expression="confused"`), and what the mic/chat-input actually do once tapped — nothing here is judged (the answer's already given), so neither one routes through Recording/Processing.

- **Reached from:** the self-service "Reveal answer" tap on Launched (any time), or automatically from Processing after the ladder's 2nd hint fails — both append the `"revealed"` outcome before navigating here.
- **Components:** same as 8a, minus the "Reveal answer"/"Next question" button; mascot's `bodyText` is the term's answer.
- **Actions →:** tap the mic, or send from the chat input → straight to `/recall/concept-questions/session`, next term (Idle) — or `/recall/concept-questions/summary` if this was the last term. `outcomes` carries forward unchanged (this screen never appends to it, only the two paths that lead here do).

**Cut from this build:** "Say it back" (a separate lighter-weight, unjudged repeat screen after a hinted pass or reveal) was designed but removed entirely per direct instruction — a hinted pass now advances the same way a clean first-try pass always did, and Reveal's own mic/chat (above) covers what Say it back would have offered after a reveal specifically.

#### 8f. Summary — `src/app/recall/concept-questions/summary/page.tsx`

- **Components:** `QuizResultRow` ×N, each pairing a `Chips` (`color=success` "First try" / `color=info` "Hint needed" / `color=error` "Revealed"), `ButtonGroup` (`Vertical, L`) "Continue"/"Skip".
- **Actions →:** → `/recall/concept-questions/summary/continue`

#### 8g. Summary – Continue — `src/app/recall/concept-questions/summary/continue/page.tsx`

- Same pattern as 7e.

---

### Free Recall Challenge session flow

#### 9a. Launched — `src/app/recall/free-recall-challenge/session/page.tsx`

- **States:** Idle (first segment, 1:00 countdown, `ProgressIndicator` at 0 = coverage), Permission-priming, Mic-disabled — same permission pattern as the other two modes.
- **Components:** `AppBar`, `ProgressIndicator` (`variant=Primary, thickness=24`, tracks "COVERAGE"), countdown text, `MascotBubble`, `Chips`, `MicButton`, `ChatInput` (`state=Answer`).
- **Actions →:** Tap mic → `/recall/free-recall-challenge/session/recording`. Type + send → `/recall/free-recall-challenge/session/processing`.

#### 9b. Recording — `src/app/recall/free-recall-challenge/session/recording/page.tsx`

- Same Send/Redo pattern as 7b, **per segment** — this is not one continuous 60s take. Timer keeps running in the background throughout.
- **Edge case:** if the timer hits 0 while a segment is actively recording (not yet sent), auto-cut and auto-send what's captured, straight to Processing — the one sanctioned exception to no-auto-endpointing.
- **Actions →:** Send → `/recall/free-recall-challenge/session/processing`. Redo → back to `/recall/free-recall-challenge/session`, Idle, same segment retried.

#### 9c. Processing — `src/app/recall/free-recall-challenge/session/processing/page.tsx` *(new)*

- Same as 7c/8c — every sent segment gets this beat, no special-casing for FRC's rapid-fire pace.
- **Actions →:** auto-advances to `/recall/free-recall-challenge/session/after-recording`

#### 9d. After recording — `src/app/recall/free-recall-challenge/session/after-recording/page.tsx`

Reuses Recording's own layout (same `AppBar`, coverage-gauge position, and controls row as Processing right before it — no restructuring between adjacent beats).

- **Components:** `ProgressIndicator` (bumped, soft-weighted random — no hard cap, but tuned so a single segment realistically won't land near 100%), `MascotBubble` with one of two fixed lines: "Nice! You still have time to tell everything you remember about Algebraic Fractions. Go!" (coverage below 100%) or "You did it!" (coverage hits 100%).
- **Actions →:**
  - Bump lands on 100% → auto-advances straight to `/recall/free-recall-challenge/summary`, regardless of time left on the clock
  - Bump stays below 100% and timer still running → auto-advances to `/recall/free-recall-challenge/session`, Idle, next segment
  - Bump stays below 100% and timer at 0 → auto-advances to `/recall/free-recall-challenge/summary`

#### 9e. Summary — `src/app/recall/free-recall-challenge/summary/page.tsx`

- **Components:** coverage recap text ("You covered X% of the lesson!"), `Button` "Continue" (revise missed aspects) / "Skip".
- **Actions →:**
  - Tap "Continue" → `/recall/free-recall-challenge/summary/aspect-to-revise`
  - Tap "Skip" → `/recall/free-recall-challenge/final-summary`

#### 9f. Aspect to revise — `src/app/recall/free-recall-challenge/summary/aspect-to-revise/page.tsx`

- **Components:** `MascotBubble` (`position=Right`), `ProgressIndicator`, "ASPECT YOU DIDN'T RECALL" label, prompt text, `Button` "Reveal answer".
- Reuses the same attempt/hint/reveal mechanic as Concept Questions — whether it routes through Concept Questions' own `/session/recording`, `/processing`, `/reveal` pages or gets its own copies is **Open** (not decided this session).
- **Actions →:** → `/recall/free-recall-challenge/final-summary` once the missed aspects are worked through.

#### 9g. Final Summary — `src/app/recall/free-recall-challenge/final-summary/page.tsx`

- **Components:** `MascotSlot` + `standby`, two `StatBox` (`type=Metric`) for XP and Score, `ButtonGroup` "Continue" / (secondary action, unlabeled in Figma).
- **Actions →:** → `/recall/free-recall-challenge/summary/continue`

#### 9h. Summary – Continue — `src/app/recall/free-recall-challenge/summary/continue/page.tsx`

- Same pattern as 7e/8g.

---

### 10. Study plan – home — `src/app/study-plan/page.tsx`

Reached from the bottom nav bar's 3rd tab (`target-01`) on every screen that has one — this tab is in scope (the other two, search and trophy, are not; see below). No Figma frame exists for this screen; built from `reference/study-plan-overview.png`.

- **States:** single state, two tabs (Plan/Materials) toggled locally, no navigation between them.
- **Components:** `AppBar` (`variant=default`, XP `BadgeChip`, "Focus Mode" `Button` Secondary/M, overflow `ButtonIcon`), a hero (exam badge, plan title, stats row), a Plan/Materials tab pair, a lesson header row, a 4-step lesson list (done/current/locked node pattern reused from the mode-selection-adjacent step badges, re-themed accent-1), bottom `NavigationButton` row + `Avatar`.
- **Actions →:**
  - Tap the 2nd lesson step ("Recall exercice", the only `current`/unlocked one) → `/recall?subject=Algebraic+Fractions&entry=study-plan` (Mode selection, with `entry=study-plan` so every mode's own Summary screen offers "Return to study plan" instead of "Return to home")
  - Tap the 1st (done) or 3rd/4th (locked) steps, "Materials" tab, "Focus Mode", or the "Algebraic Fractions 1" header button → out of scope, no route (nothing in this prototype's mock data models unlocking a step or provides materials content)
  - Tap the nav bar's 1st tab (chat bubble) → `/` (Home chat)
  - Tap the nav bar's 2nd/4th tabs (search, trophy) → out of scope, no route

---

## Explicitly out of scope

Per `voice-ux.md`'s own triage — not built, not designed, noted as known gaps rather than pretended away:

- Empty/silent recording (nothing said)
- Very noisy/garbled transcript
- Judge slow/times out past target
- No/dropped network mid-answer
- Mic hardware busy (on a call, etc.)
- Student switches language mid-answer
- Pause/resume into one take
- App backgrounded/killed mid-recording (OS-level interrupt) — explicitly deferred this session, grouped with the above
- **Skip a term (per-term "I don't know" escape)** — the current screens' behavior (Skip only exists at end-of-session Summary, not mid-recall) is intentional, confirmed, not a gap to fix
- Any `ActivityCard` other than "Recall exercice" on Home chat (Flashcards, Quizz, Practice exam)
- 2 of the 4 `NavigationButton` tabs (search, trophy) — the 3rd (target) is in scope, see Study plan below

---

## How the mocked recall behaves

No real STT, no real judging, anywhere in this build:

- **Result is randomized within weighted odds** — not scripted per screen, not based on recording length, not a hidden demo toggle.
- **Text fallback gets the identical randomized mock as voice** — no keyword or length matching on typed answers. Voice and text are genuinely equal paths.
- **Concept Questions' hint ladder:** odds shift toward pass after each hint used, so the ladder usually resolves before the forced reveal at attempt 3.
- **Free Recall Challenge's coverage bumps:** soft-weighted per segment (first segment weighted lower, no hard cap) — tuned so a student sees the mechanic across multiple sends rather than maxing out in one.
- **Guided Reflection never produces a pass/fail result** — every answer gets one acknowledgment beat, full stop, matching `sprint-context.md`'s "no scoring, ever."
- **XP increments per turn**, shown inline with each result/acknowledgment beat, not just at the Final Summary.

---

## Verification — a 5-minute check

Run this after building any screen, not just at the end. All five steps together should take about five minutes; if any one of them turns up a problem, stop and fix it before building the next screen.

1. **One clickthrough, one mode.** `npm run dev`, open at 390px width in dark mode. Go `/` → Recall exercice → Mode selection → pick one mode → Intro → Start → mic or type → Send → Processing → wherever it lands next → keep tapping through to that mode's Summary → Continue. Every tap should land exactly where this doc says. (~2 min)
2. **Trigger Processing twice.** Redo one term (or send a second segment in Free Recall Challenge) and confirm the result actually changes between the two — proves the mock is genuinely randomized, not hardcoded to one outcome. (~30 sec)
3. **Eyeball dark mode and width.** Across that same clickthrough: nothing flashes light-mode, nothing scrolls horizontally, nothing overflows the 390px frame. (part of step 1, no extra time)
4. **One import grep.** `grep -rL "from \"@/components" src/app/recall` (adjust the alias to whatever this repo actually uses) over the page files touched — anything that doesn't import from `src/components` is either a raw unstyled element or a token leak worth a second look. (~1 min)
5. **Guided Reflection sanity check.** Specifically confirm no screen in that mode ever shows a score, checkmark, or pass/fail word — the one rule from `sprint-context.md` that's easy to accidentally violate by reusing a Result component from another mode. (~30 sec)

This is a fast smoke test, not full QA — it covers one mode, one pass, the happy path. A fuller pass (all three modes, both permission branches, an axe-core re-scan of any new Storybook stories, a token-value audit against `tokens/tokens.json`) is worth doing before shipping, but budget more than five minutes for it and treat it as separate from this check.

---

## Open — undecided, not picked for you

- **The shared "primer" screen** `sprint-context.md` references ("Both hit the same primer, then mode selection") — this is different from the mic-permission priming card designed this session. No Figma frame for it exists in the Design Deliverables page, and it wasn't discussed this session. Does Mode Selection's own copy serve as this primer, or is there a separate first-encounter screen (F5) still to design?
- **Concept Questions vs. "Recall Questions" naming.** Figma names the Intro and Summary-Continue frames "Recall Questions," but Launched/Summary are named "Concept Questions" — same mode, inconsistent naming. This spec standardizes on `concept-questions` for routes; the Figma file itself still needs a naming cleanup pass.
- **Reveal screen's actual design.** No Figma frame shows what "Reveal answer" displays — the composition in 8d is proposed, not confirmed against a real design.
- **Say it back's actual design.** Same — no Figma frame exists; 8e's composition is proposed only.
- **Permission-priming card's and permission-denied state's exact visual form.** This spec treats both as in-page states of each mode's Launched screen (anchored card, then a persistent disabled-mic treatment) rather than separate routed screens, since neither has a named Figma frame and the interview described them in those terms — but this reading wasn't explicitly confirmed as an architecture decision.
- **Free Recall Challenge's Aspect to revise sub-flow.** Whether it reuses Concept Questions' own Recording/Processing/Reveal routes, or needs its own copies, wasn't decided.
- **Study-plan lesson-step entry point.** Referenced in `sprint-context.md`, no Figma screen exists for it, not addressed this session.
- **Guided Reflection / Concept Questions "Continue" branching by entry point** (`sprint-context.md`: "study-plan to next plan step, home-chat to a flashcard proposal") — neither destination is built or designed; Summary-Continue's row tap currently has nowhere real to go.
- **Session length.** Kickoff spec says 3–5 terms per session; nothing in this session's conversation fixed an exact number or where it's configured.
