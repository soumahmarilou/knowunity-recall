---
name: build-screen
description: "Applies when building or editing any screen in this prototype (Knowunity voice-recall). Triggers on: build screen, create screen, implement screen, add a route, finish a screen, edit an existing screen, or any request naming one of SPEC.md's screens (Mode selection, Guided Reflection, Concept Questions, Free Recall Challenge, Home chat, and their sub-states). A screen is a page at its own route in src/app — building it only as a Storybook story does not satisfy this skill."
---

# Building a screen in this prototype

A screen is a page with its own route under `src/app`, reached by the student clicking from the screen before it. **Storybook is the catalog for components only** — it holds `src/components/*` and their states/variants, nothing else. If a screen exists only as a Storybook story, it is not built. This skill is the required method for turning one entry in `SPEC.md` into a real page.

## The method

Work through these in order. Don't skip ahead because a step looks obvious — the point of this project is that it usually isn't.

### 1. Read `SPEC.md` for this screen

Find the screen's entry in the "Per-screen breakdown" section: its states, which components it uses, what the student can do, and where each action leads. This is the spec, not a suggestion — build what it says, not what seems reasonable. If something in it looks wrong or won't work as written, say so before building around it rather than silently improvising a fix.

### 2. Check whether this screen has a Figma frame

Some screens in `SPEC.md` map to a real frame on the "Design Deliverables" page of the Figma file ("Yummy__Knowie Design System"); some don't (their composition in `SPEC.md` is marked proposed, not confirmed against a design). Check via the Figma MCP tools (`figma_get_status`, `figma_get_file_data` on the Design Deliverables page, `figma_get_component_for_development_deep` on the matching node) before assuming either way. Whether a frame exists changes what "done" means for this screen — see the two branches at the end of this file.

### 3. Query Storybook for every component you'll use — never assume a prop

For each component `SPEC.md` names, look it up before writing a single line that uses it:

- Preferred: the Storybook MCP tools, if connected this session.
- Fallback, when the Storybook MCP fails to connect (it has, repeatedly, in this project — don't burn time retrying it): the local dev server. Run `npm run storybook` if it isn't already up, then read `http://localhost:6006/index.json` for the real story/variant list, and read the component's own source file directly (`src/components/<Name>/<Name>.tsx`) for its actual prop names, required vs. optional, and default values.

Do not guess a prop name from what seems logical, from the Figma layer name, or from a similar component. This codebase has real, specific traps: prop names that don't match their Figma variant name (`IconSlot`'s size prop is `size`, not "Size (IGNORE)"), required props with no default (`"aria-label"` on every icon-only button), and components whose Figma-implied composition doesn't actually exist in code yet (`MascotSlot` cannot show any expression but "standby" — it has no `expression` prop, `Expressions` is a separate, unwired component). Reading the source is the only way to catch these before they become a build that doesn't compile or doesn't render what the spec describes.

### 4. Compose from what's in Storybook — that's the only place to look for something to reuse

Most of the Figma component library was never ported to code. Don't go looking in Figma for a component to reuse, and don't hand-roll something that resembles a Figma layer — if it isn't in `src/components`, it doesn't exist for this purpose yet. Compose the screen entirely from what Storybook actually documents.

### 5. When something you need isn't in Storybook

Build it inside the screen, from tokens, without stopping to ask first. Then add one line to `component-gaps.md` at the project root (create the file if it doesn't exist yet) recording what it was and which screen needed it.

Before adding that line, check whether the same gap is already on the list from an earlier screen. If it is, that's the signal it's a real, recurring component, not a one-off — build it properly this time: a real component under `src/components/<Name>/`, with its own `.stories.tsx`, following the patterns in `design-system_1.md` (naming, prop shape, `aria-label` on anything icon-only, etc.), not another inline version buried in a page.

### 6. Every value from the generated tokens

No raw hex, no raw px, no invented spacing or radius number. Every value traces to `tokens/tokens.json` via `build/css/tokens.css`'s generated CSS variables. If a value you need genuinely isn't in `tokens.json`, that's a gap to flag, not a number to invent — same rule as `CLAUDE.md`'s hard rules.

A corollary, learned from this correction recurring: an exact-pixel gap request ("12px between X and Y") names two *specific* elements, not "wherever the container's uniform gap already lands." A shared flex `gap` on a parent can happen to look right for one sibling pair and be wrong for another nearby one that reuses the same class in a different screen/state — check the actual rendered gap between the two named elements, in every place that pairing occurs (e.g. Recording's mic button + its own label, not just the idle Launched screen's equivalent), rather than assuming one fix already covered every occurrence of "the mic button's label."

A second corollary, from a "natural size" request (e.g. "this bar's default height is 56px") that took three rounds to actually land: a `display:flex` row's own height/width follows its *tallest/widest child's margin box*, not the child you're mentally treating as "the content that drives the size." A small icon button sitting next to a single line of text is often taller than that line (this codebase's `ButtonIcon` S size is a fixed 48px square against an 18px/24px-line-height text row) — dropping a `min-height`/`height` override in favor of "let it size naturally" can silently let that button re-inflate the row instead. Check the actual computed height against the target number, not just that removing the override made it *shrink-able* again. If the mismatch is real, don't resize the shared component (that's a global change); cancel just that child's extra contribution locally, e.g. a wrapping element with a negative margin sized to the difference, keeping the child's own rendered size and alignment untouched.

### 7. Mobile only, 390px, dark mode

No responsive breakpoints, no light mode. Every screen renders correctly at exactly 390px wide, dark mode only — that's the whole target, not a default that happens to also support something wider.

### 8. Build every state listed for the screen, including the failure ones

If `SPEC.md` lists a permission-denied state, a mic-disabled state, an error path — build it in the same pass as the happy path, not as a follow-up. A screen with only its happy-path state built is not done, even if that's the state most likely to get demoed.

### 9. Every action goes where `SPEC.md` says it goes

Wire up real navigation to the real destination route for every tap `SPEC.md` lists. A button that doesn't lead anywhere — or leads to a placeholder instead of the documented route — means the screen isn't finished, even if it looks correct at rest.

A structural note for this codebase specifically: the button-family components (`Button`, `SuperlistItem`, `ButtonIcon`, etc.) take `onClick`, not `href`. Wiring real navigation therefore means a Client Component (`"use client"`) using `useRouter().push(...)` from `next/navigation` — not wrapping them in `<Link>`, which would nest a `<button>` inside an `<a>`.

### 10. A "Processing"-style transitional screen changes only the bubble's text

Recording → Processing (and any similar brief, auto-advancing beat) is not a new screen design — it's the same screen with one thing different. Reuse the prior screen's own `page.module.css` (import the sibling file, don't copy its classes — copies drift, an import can't) and keep every component in place: same `AppBar` (progress bar, XP badge, Finish button, whatever it had), same Send/Redo controls (swap the mic button to its own built-in `state="processing"`, then `state="sent"` once the brief spin ends, rather than removing it), same chat input — except the waveform, which Processing never shows (it's a recording-in-progress visual, and the recording is already sent by the time Processing shows).

The `MascotBubble` genuinely does animate here, per direct instruction (revising an earlier version of this same note that said it shouldn't) — `expression="thinking"` while the thinking beat runs, then a result-specific expression once it resolves: `"approving"` for a good outcome, `"determined"` for a failed attempt that still has a hint left, `"confused"` for a forced-reveal/totally-wrong outcome. What still doesn't change is everything *else* about the screen's structure — the "don't restructure Processing" lesson was about the surrounding layout, not about freezing the mascot's own expression forever; don't over-apply it to mean "nothing on this screen may ever change beyond the bubble's text."

This turned out to generalize past Processing specifically: three separate "brief result state" screens built this way as their own dedicated route (Concept Questions' Reveal, Free Recall Challenge's Aspect-to-revise Reveal, Free Recall Challenge's After-recording coverage-bump beat) all had to be torn back down into an in-place content swap on the screen that triggered them, per direct correction each time. The pattern to default to now: a state that's reached automatically or by a single tap, shows for a beat (with or without a timer), and then either settles back or advances — is not automatically a new screen just because it shows different content or a different mascot message. Ask whether it's reachable any other way, needs its own distinct layout for a real reason, or is genuinely a separate step in the flow (a Recording screen is a real screen — the student does something there); if not, it's local state (a boolean/enum + `useEffect` timer) on the existing screen, with the URL's search params carrying the result forward via `router.replace`, not a route of its own.

### 11. An in-place state transition needs to be almost invisible as an animation

When a screen's own content changes without navigating anywhere (a mascot's expression, a bubble's body text, anything else that swaps via local state rather than a route change), the animation on it has to stay small enough that it doesn't register as an animation at all — the goal is "this feels like the same screen, updated," not "something is transitioning." Concretely, per a direct correction on `MascotBubble`/`MascotSlot`'s own change-transitions: a first version used a translateY slide plus a 300–350ms duration, and that read as "the page changed," not "this element's own state updated." Fixed by going opacity-only (no transform at all) and short (150ms).

The underlying rule to default to: any perceptible *distance* (translate, scale beyond a hair) or *duration* much past ~150ms on a same-screen content swap will read as a page-level transition on a screen this small, even though nothing navigated. Reserve real motion (translate, scale, longer duration) for things that are genuinely one-time arrivals — a screen's own mount, a celebration beat (`MascotSlot`'s `animate` bounce-in on the completion screens is exactly this, and correctly stays more expressive) — never for a value that can change repeatedly while the student stays put.

### 12. Navigation must be immediate — no fade, no transition, 0 seconds, ever

This has come up three times now, and the first attempted fix was wrong: "there's a loading moment between pages" was addressed by prefetching the likely next route(s) with `usePrefetchRoutes` from `src/lib/prefetchRoutes.ts`; "every click makes the next screen jump" was then (mis)diagnosed as needing a fade-in on `Screen`'s own mount to soften the cut — that fade was explicitly rejected per direct correction: navigation must be instant, 0 seconds, no fade at all, full stop. `Screen.module.css` has no mount animation and must not regain one. Do not reach for a screen-level transition as a fix for perceived navigation slowness — it papers over the symptom with something explicitly ruled out, not a real mitigation.

The one legitimate lever here is prefetching, not animation: per Next.js's own prefetching docs (`node_modules/next/dist/docs/01-app/02-guides/prefetching.md`, `.../03-file-conventions/loading.md` — read before touching navigation code, per `AGENTS.md`), a route that calls `useSearchParams()` is a *dynamic* route, and dynamic routes are skipped by prefetch unless the route folder has its own `loading.js`. Every route in this app reads its state from search params, so `usePrefetchRoutes` alone is not fully prefetch-eligible. Adding real `loading.js` boundaries to all ~25+ routes has not been attempted (large, uncertain payoff specifically in dev mode). If navigation still feels slow after `usePrefetchRoutes` is in place, that's a real load/compile-time issue to flag and investigate on its own terms — never paper over it with a fade.

It came up a third time after both of the above were already in place, and this time the actual cause was structural, not cosmetic: every one of this app's ~25+ `page.tsx` files wraps its client content in `<Suspense fallback={null}>` (required because `useSearchParams()` needs a Suspense boundary to satisfy Next's static-rendering constraint — nothing to do with loading UI on its own). When a route's JS chunk hasn't been loaded/prefetched yet client-side, React actually suspends on that chunk load and renders the fallback for real — `null` means the entire screen (background, AppBar, everything) vanishes to nothing for that window, then the whole page pops in at once the instant it resolves. That blank-then-pop *is* the "looks like a bug, it jumps" effect, confirmed by throttling the network and watching the DOM: with `fallback={null}` the `Screen` shell disappeared entirely during the load; swapping every page.tsx's fallback to `<Screen>{null}</Screen>` (same import, `import { Screen } from "@/components/Screen/Screen";`) keeps the dark shell continuously present — only the inner content pops in once ready, never a full blank flash. This is not an animation and doesn't violate "navigation must be 0 seconds" above — it's closing a real gap in what renders while a chunk loads, so **every new page.tsx must use `<Suspense fallback={<Screen>{null}</Screen>}>`, never `fallback={null}`**, from the start.

## When you're done

**If the screen has a Figma frame:** match it. Then list every difference between what you built and the frame — sizing, spacing, copy, anything — even small ones. Don't silently absorb a discrepancy into "close enough."

**If it doesn't:** you had to make behavioral calls the frame would otherwise have settled. Read `design-brief.md` and `voice-ux.md` before making them — they hold the hard constraints and the voice-UX principles this prototype has to respect (push-to-talk, no auto-endpointing, never trap the student, generous judging, and the rest). When you're done, tell the user plainly what you had to decide that wasn't written down anywhere — that's exactly the kind of thing that belongs in `SPEC.md`'s Open section or a follow-up decision, not something to leave undocumented just because it worked.
