@AGENTS.md

## What this is

Static mobile prototype (Next.js) of Knowunity's voice-based active-recall feature — no real backend, recall, or judging logic.

## Hard rules

- Committed concept: three student-selectable modes — Guided Reflection, Concept Questions, Free Recall Challenge — not one fixed-term hint-ladder loop.
- Mobile only, 390px width, dark mode only.
- Student can reply by voice or by text. Recall is mocked: no backend on the voice recording yet — no speech-to-text, no model calls.
- Knowie responds in text only, never speaks.
- Sentence case on every label, button, and heading; capitals only for proper nouns.
- Build from the components that already exist in [design-system_1.md](design-system_1.md); stop and flag before creating a new one.
- Before writing any Next.js code, read AGENTS.md and the relevant guide in `node_modules/next/dist/docs/`.
- Every design decision (component choice, value, naming) follows [design-system_1.md](design-system_1.md); every value comes from [tokens/tokens.json](tokens/tokens.json).
- Every product/flow decision follows the full decision log in [sprint-context.md](sprint-context.md), inside the hard constraints and mandate set in [design-brief.md](design-brief.md).
- Before designing any voice-input state (recording, processing, error, permission), read [voice-ux.md](voice-ux.md)'s six principles and its States-to-design checklist.
- Match a screen to its real design before building it: check [reference/](reference/) for the matching screenshot or recording first.
- Real, shipped image assets go in `public/images/`. Design reference media stays in `reference/` and never ships.

## Never

- Never use a CSS fallback value (e.g. `var(--token, #333)`) — a token resolving to nothing is a bug to fix, not hide.
- Never invent a token value not in `tokens/tokens.json` — see design-system_1.md § "Never do this" for the full list (no reading primitives directly, no `accent/1-4` for status/tier, no duplicating a component's layers).
- Never add scoring to Guided Reflection, a manual stop to Free Recall Challenge, or a topic/class picker before mode selection — see sprint-context.md's decision log.
- Never trap the student — every required step needs a way out (skip, text fallback, cancel-and-re-record). See design-brief.md § Hard constraints.
- Never auto-detect when the student is done talking — push-to-talk with an explicit send only, no auto-endpointing. See design-brief.md § Hard constraints and voice-ux.md § Principle 2.
- Never edit AGENTS.md.
- Never edit `build/css/tokens.css` by hand — it's generated; edit [tokens/tokens.json](tokens/tokens.json) and run `npm run tokens`.

## Storybook

When working on UI, use the storybook tools to read the component
library before answering or writing anything. Never assume a
component prop exists. Query the documentation, and use only props
that are documented or shown in a story. If a prop isn't there,
stop and ask me.

## File map

- [AGENTS.md](AGENTS.md) — Next.js version rules; read before any Next.js code. Do not edit.
- [design-brief.md](design-brief.md) — the product brief: user problem, hard constraints, kickoff spec, and open mandate; read first, before sprint-context.md, to know what's fixed vs. still yours to design.
- [voice-ux.md](voice-ux.md) — voice-input UX principles and the States-to-design checklist (must/if-time/out-of-scope); read before designing any recording, processing, error, or permission state.
- [sprint-context.md](sprint-context.md) — concept + decision log; read before designing or building any screen or flow.
- [design-system_1.md](design-system_1.md) — which component to use, scaffold structure, naming, description format; read before styling or building any component.
- [tokens/tokens.json](tokens/tokens.json) — actual color/spacing/type/radius values (DTCG format); read whenever a design value is needed.
- `build/css/tokens.css` — generated CSS variables from `tokens/tokens.json`; never hand-edit, run `npm run tokens` to regenerate.
- [reference/](reference/) — real screenshots + recordings of every screen being rebuilt; check before building or reviewing a matching screen.
- `public/images/` — shipped image assets used by the app.
- `src/app/layout.tsx` — root layout, fonts, global HTML shell; read when changing global structure.
- `src/app/page.tsx` — home screen; still default `create-next-app` boilerplate, not the real home screen yet.
- `src/app/globals.css` — Tailwind theme wiring and CSS variables; read when changing global styles.
- `hello.html` — standalone scratch file, unrelated to the Next app.
- `.claude/skills/` — interactive-prototype, ui-designer, ux-designer, ux-motion; each SKILL.md self-triggers by task type, read its `references/` files as it directs.
- `.claude/launch.json` — VS Code debug config for `npm run dev`.
- `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` — build/tooling config; read only when changing build setup.
- `style-dictionary.config.mjs` — turns `tokens/tokens.json` into `build/css/tokens.css`; read when changing what gets generated or adding a new output platform.
- `README.md` — stock `create-next-app` instructions; no project-specific content.
