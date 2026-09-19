# Design system rules — Yummy / Knowie

Companion to `tokens.json`. That file holds every value. This file holds the rules for using them: which component to reach for, how the scaffold is put together, how things get named, and what never to do. No values are repeated here. If you need a number, a color, or a font size, it's in `tokens.json`.

## Which component to reach for

**The one main action on a screen.** `button`, variant Primary. One per screen, that's the whole point of "primary."

**A supporting action (Skip, Cancel, filter).** `button`, variant Secondary or Tertiary.

**An icon-only tap target (toolbar, list row, tight space).** `buttonIcon`. Only when the icon alone is unambiguous, there's no label fallback on this component.

**Two or more buttons that need to sit together.** `buttonGroup`. Don't wrap a single button in it.

**A filter, tag, or selectable option.** `chips`. Use `color=pro` only when the chip is actually gating or labeling paid content, not because gold looks nice.

**An icon anywhere in the UI.** `iconSlot`. Never place a bare icon frame directly, always go through the sizing wrapper so it lands on a real size step.

**Knowie the mascot, on screen.** `mascotSlot`. Only when Homie is conceptually present (onboarding, celebration, empty states). Not a general-purpose illustration container.

**Bounded progress (a session, a multi-step flow).** `progressIndicator`. It's a horizontal bar, not a ring, and it only supports four fixed steps (0/25/50/75/100), not a live percentage.

**Progress around one tappable icon, not a standalone bar.** `Progress Ring`. Same four-step convention as `progressIndicator`, but a ring that wraps a single control — the current step in a list, not a session-level overview. See its own section below.

**Brief, non-blocking system feedback.** `snackbar`. Never use it for something the user must acknowledge before continuing, that's a blocking dialog's job, not this component's.

**A heading with a supporting line under it.** `textBlock`. Sized for headings, not for body copy or list rows.

**A top nav bar.** `appBar`. Pick the variant that matches how many buttons the screen actually needs on the right.

**A home-screen quick-action entry point (Recall exercice, Flashcards, Quizz, Practice exam and anything like them).** `Activity card`. Fixed size, swappable icon, free-text label. See its own section below for the full property.

**A recording-in-progress visual.** `Waveform`. A standalone graphic only, not wired to any mic trigger or recording control yet. See its own section below before assuming it's plugged into something.

**Knowie giving feedback in text form, in a speech bubble.** `Mascot bubble`. See its own section below, it has real variants and properties worth knowing before you place one.

**The screen itself, the frame everything else sits inside.** `scaffold`. See below, it needs more than a one-liner.

`appBar`, `snackbar` and `textBlock` have little or no real usage evidence in the example screens yet. The guidance above is based on how they're built, not on a track record of how they hold up in a live layout.

**Known gap in this list, not something today's update fixes:** several other real, live components in the file have no entry here at all yet, among them `Superlist item`, `Stat box`, `Quiz result row`, `badgeChip`, `micButton`, `Chat Input` and `Icon badge`. They predate today's builds. Worth a pass to backfill at some point, flagging rather than quietly leaving it implied this list is complete.

## How the scaffold is composed

`scaffold` is the screen template. Every mockup in this file is built inside one. It's not a background you draw behind your content, it's a component you instantiate and then fill.

Structure, top to bottom:

- **A fixed system status bar at the very top.** Not part of this design system, it comes from an external library component and isn't something you control here.
- **`topNavigation`** — a slot near the top. This is where an `appBar` instance goes. Roughly a third of the screens in this file leave it empty on purpose, for full-bleed moments like a celebration screen.
- **`middleContent`** — a slot that fills the rest of the screen. This is the actual scrollable body, whatever the screen is about.
- **`bottomContent`** — a slot anchored near the bottom. In practice this holds whatever needs to stay pinned there: a primary button, a `buttonGroup`, or a mascot moment. Not strictly a tab bar, despite what the name might suggest.
- **`bottomSheetOnly`** — a slot that's empty on almost every screen in this file (filled in 3 of 17). Pair it with the `showBottomSheetBackground` toggle when a screen needs a bottom-sheet overlay, that toggle turns on a full-bleed dimming layer behind it.

Three booleans control visibility: `showTopNavSlot` and `showBottomNavSlot` (both on by default), `showBottomSheetBackground` (off by default). Turn a slot's matching boolean off if you're leaving it empty, don't just leave the slot floating unused.

`scaffold` also carries a `size` variant for the device frame (phone, tablet, desktop, several named device sizes). Pick the one that matches what you're actually designing for.

One structural note, not a style rule: the specific copy of `scaffold` that all 17 example screens actually use isn't visible on any page in this file right now. It still renders correctly everywhere it's used, but nobody can currently open it directly to look at or edit it. Worth tracking down and fixing before it becomes the next hidden-duplicate problem. Flagging it here rather than writing around it.

## `Activity card`

Built today, from a real gap: four home-screen quick-action entries (Recall exercice, Flashcards, Quizz, Practice exam) were hand-drawn as raw frames instead of a component. No existing component matched the shape, so this is a new one, not a swap-in.

**States and options.** A single component, not a variant set. One real property: `Icon`, an instance-swap, default `graduation-hat-01` at size 24. Swap it to any icon in the library. This was a deliberate choice over a variant set: the ask was one component with a swappable icon, not named variants per activity.

**Other properties.** The label is a plain text layer (not an exposed component property yet). Edit it directly on the instance, same as any other free text.

**When to reach for it, what not to do with it (from the component's own Figma description, quoted, not paraphrased):**

> WHAT IT IS: A fixed 120×110 quick-action card with a swappable icon and a free-text label.
>
> WHEN TO USE IT: Home screen quick-action entry points — Recall exercice, Flashcards, Quizz, Practice exam.
>
> DON'T: Don't hand-build this from raw frames per screen — use the component so a future style change propagates everywhere it's used.

**Values, pointed at `tokens.json`, not repeated here.** Background fill is bound to `background/surface`. Label color is bound to `text/primary`. Corner radius (16), the inner gap (6) and the padding (12 horizontal / 8 vertical) match `radius/400`, `spacing/150` and `spacing/300`/`spacing/200` respectively, but are set as raw numbers on the layer, not actually bound to those tokens. Worth knowing if this component ever needs a token audit, the same way this file already flags letter-spacing as unbound elsewhere.

## `Waveform`

Built today as a standalone graphic, deliberately not pre-assembled into anything. Twenty organic amplitude bars (sine envelope plus wobble, not a strict alternating rhythm) for a live, in-progress recording.

**States and options.** None. It's a single static component, no variants, no exposed properties.

**Other properties.** None.

**When to reach for it, what not to do with it (from the component's own Figma description, quoted, not paraphrased):**

> WHAT IT IS: Organic, non-repeating amplitude bars (sine envelope + wobble, not strict alternation) for a live in-progress recording. Fill bound to accent/1/bold, with the last few bars fading toward the leading edge to read as live incoming audio.
>
> WHEN TO USE IT: Anywhere a recording-in-progress needs a waveform visual.
>
> DON'T: Don't assume this is already wired into a recording screen or micButton — it's a standalone graphic; where and how to pair it hasn't been decided yet.

**Values, pointed at `tokens.json`, not repeated here.** Fill is bound to `accent/1/bold`.

## `Mascot bubble`

Existing component, given a real `position` variant today, plus a genuine bug fix to how it collapses. Knowie's feedback speech bubble: mascot, tail and message card together.

**States and options.** One variant axis, `position`: `Left` (default) or `Right`. `Right` is a full mirror, mascot and tail flip to the other side, nothing about the text, chip or button content mirrors with it, everything still reads left to right.

**Other properties, all boolean or text, identical on both position variants:**
- `Show chip` (boolean, default true). Turns the status chip (e.g. "Almost there") on or off.
- `Show button` (boolean, default true). Turns the "Reveal answer" button on or off. Fixed today so that turning it off actually collapses the card instead of leaving dead space, the card now resizes correctly to 200 / 164 / 148 / 112 tall depending on which of chip and button are showing.
- `Body text` (text, default the sample feedback line already on the component). The feedback message itself.

**When to reach for it, what each state means, what not to do with it (from the component's own Figma description, quoted, not paraphrased):**

> WHAT IT IS: Knowie's feedback speech bubble: mascot, tail, and message card together. The card can optionally show a status chip and a "Reveal answer" button alongside the feedback text.
>
> WHEN TO USE IT: Any screen where Knowie responds to the student in text. Keep Position on Left, that's the layout used on every real recall-feedback screen. Turn Show chip on for a status label like "Almost there," and Show button on when there's an answer to reveal. Body text holds the feedback message itself.
>
> DON'T: Don't switch Position to Right without a real reason, it's a mirrored layout with no actual use in the app yet. Don't turn on Show button when there's nothing to reveal, it'll show a dead action that goes nowhere.

**Found and fixed while pulling this together for today's update:** the `position` variant set had picked up a third, undocumented value along the way (an auto-named leftover from an earlier corrupted-clone recovery, structurally a duplicate of `Right`). Confirmed it had zero real instances anywhere in the file before deleting it. `position` is now correctly just `Left`/`Right`, no debris.

**Values, pointed at `tokens.json`, not repeated here.** The on-canvas description text (and the matching component description) uses body copy bound to `text/secondary`. Width is fixed at 358 regardless of state; height is not tokenized, it's a real content-driven auto-layout result.

## `buttonIcon`

Existing component, given a real fourth variant today: `Success`, a solid green accent for a completed step, built out to the same full grid as the other three variants. Scoped here to documenting what's true after that change — the rest of `buttonIcon` (its `Primary`/`Secondary`/`Tertiary` history) predates today and has no entry of its own yet, part of this file's existing backfill gap noted above.

**States and options.** `variant`: `Primary`/`Secondary`/`Tertiary`/`Success`. `size`: `S`/`M`/`L`. `state`: `Default`/`Pressed`/`Disabled`/`Loading` — `Success` has all 12 `size` × `state` combinations, not a partial row.

**Other properties.** None exposed — the icon itself is supplied by the consumer, not a component property (no swap property exists on this set).

**When to reach for it, what each state means, what not to do with it (from the component's own Figma description, quoted, not paraphrased):**

> WHAT IT IS: The icon-only counterpart to button. Same variant grid — variant (Primary/Secondary/Tertiary/Success) x size (S/M/L) x state (Default/Pressed/Disabled/Loading) — but no CTA text or icon-toggle props, since the icon is the whole button. Success is a solid green accent for a completed step, built out to the same full grid as the other three variants, with the same border/inner-shadow treatment as Primary (an initial flat, borderless version read as "not really a button" once actually looked at — corrected per direct instruction).
>
> WHEN TO USE IT: A tappable action with no room or need for a label — nav bar actions, close/back, compact toolbars. Used this way inside appBar's variants. Success specifically marks a step that's already done.
>
> DON'T: Don't use it for an action a first-time user can't identify from the icon alone — there's no label to fall back on.

**Values, pointed at `tokens.json`, not repeated here.** `Success`'s fill is bound to `feedback/success/bold`, its icon color to `feedback/success/onBold` — the same green `progressIndicator`'s own fill already resolves to, and the same token `Progress Ring`'s filled arc uses below. Its `Disabled` state collapses to `background/surface`, matching `Primary`/`Secondary`'s own `Disabled` treatment exactly. A locked/not-yet-available step reuses the existing `Disabled` state on `Primary` rather than a new variant — its fill (`background/surface`) and icon color (`text/disabled`) already matched what a hand-rolled "locked" badge needed, once actually checked against Figma.

**Pressed.** `Primary`/`Secondary`/`Success` all flatten their inner shadow on press, paired with the icon settling down by the same amount the shadow used to offset it (2px at S/M, 4px at L) — the same felt "pushed in" result `button` already gives its own Primary/Secondary on press, so `buttonIcon` reads as the same button family rather than a differently-behaved one. Built and verified in both Figma (all 9 `Primary`/`Secondary`/`Success` × `S`/`M`/`L` `Pressed` components, shadow removed and icon shifted) and code (`box-shadow: none` + a `translateY` on the icon wrapper), per direct instruction.

## `Progress Ring`

Built today, from a real gap: no circular progress component existed anywhere in this file, and `progressIndicator` (the one progress component that does exist) is explicitly documented as a horizontal bar, not a ring. Needed to wrap a single tappable icon — the current step in a multi-step list — with a fill that shows how far into it the student got. Originally placed in an empty, disconnected area of the canvas, far from `buttonIcon` — undiscoverable there, and gone entirely by the time of a later pass (its node no longer resolved, and it had dropped out of the component search index — most likely deleted while unrecognized as real, sitting isolated the way it was). Rebuilt identically, this time positioned directly beside `buttonIcon`'s own library frame, with a composed example (a real `buttonIcon` Primary/L/Default instance with a `Progress Ring` instance behind it, positioned the same way `/study-plan`'s current step actually pairs them) placed right there too, so the relationship between the two components is visible on the canvas, not just implied by their descriptions.

**Is this a `buttonIcon` state?** No — `Progress Ring` is a separate component, not a `state` value on `buttonIcon`'s own variant grid. `state` (`Default`/`Pressed`/`Disabled`/`Loading`) describes the button surface's own look; the ring is a decorative layer that sits behind whichever `buttonIcon` instance it's paired with, unrelated to that button's own state. Folding it in as a fifth `state` would force a `buttonIcon` in `Default` to somehow also encode "has a ring" — two independent things collapsed into one axis — where composing two real components (as the example above does) keeps them each doing one job.

**States and options.** One variant axis, `progress`: `0`/`25`/`50`/`75`/`100`, the same four-step convention `progressIndicator` already established, not a free 0-100 value.

**Other properties.** None exposed on the Figma component. The code-side component adds one more real prop, `pulse` (boolean, default off) — a slow breathing-scale loop that invites a tap, purely a code-side motion detail with no Figma variant behind it, since Figma has no way to preview a CSS animation.

**When to reach for it, what not to do with it (from the component's own Figma description, quoted, not paraphrased):**

> WHAT IT IS: A circular progress ring, stepped in quarters (0/25/50/75/100), that wraps around a tappable icon rather than sitting as its own standalone bar. Track uses border/strong (not border/default — needs to read as a full circle at a glance even when the filled arc is short, per border/strong's own token description), the filled arc uses feedback/success/bold — the same green buttonIcon's own Success variant uses for a completed step.
>
> WHEN TO USE IT: A single bounded task that's already in progress and still tappable to continue — the current step in a multi-step list, sized to sit just outside a 56px (buttonIcon L) icon. Not for a completed or not-yet-started state; those don't need a ring at all.
>
> DON'T: Don't use this for the same job progressIndicator already does — a linear, multi-step overview bar. This is specifically for one in-progress ring around one tappable icon, not a general progress bar.

**Values, pointed at `tokens.json`, not repeated here.** Track is bound to `border/strong` (was `border/default` — too faint to read as a full circle at a glance once actually seen in the app rather than assumed, fixed per direct instruction; both Figma and code updated together), the filled arc to `feedback/success/bold`. Diameter (64px) and stroke width (4.5px) are both raw values, not bound to a spacing/stroke token — 64px matches `spacing/1600` in value but isn't literally bound to it in Figma, and no stroke-weight token in `tokens.json` lands anywhere near 4.5px (only `stroke/border` at 1px and `stroke/heavyBorder` at 2px exist). Flagged, not invented — carried over as-is from the component's own build.

## Naming conventions

These are the patterns actually in use across the file, not a proposal.

- **Semantic color tokens**: lowercase, slash-separated, `group/subgroup` (`background/page`, `feedback/error/bold`). Multi-word segments are camelCase (`onPrimary`, `pressedInverse`), never kebab-case or snake_case.
- **Typography primitives**: same shape, lowercase and slash-separated (`font/size/xs`, `font/weight/bold`).
- **Text styles**: Title Case after a shared prefix (`Greed/Body M Bold`, `Greed/Headline XS Regular`).
- **Spacing, radius, icon, illustration, stroke steps**: PascalCase group name, slash, then the step (`Space/100`, `Radius/Full`, `Icon/200`). This is a different casing convention from the color tokens (`Space` vs `background`). That inconsistency already exists in the file, it's not something to copy forward, anything new here should follow the color layer's lowercase pattern instead.
- **Components, older layer** (`button`, `buttonIcon`, `mascotSlot`, `scaffold`, `micButton`, `badgeChip` and the rest of the original set): lowercase-leading camelCase, one word where possible.
- **Components, newer layer** (`Superlist item`, `Stat box`, `Quiz result row`, `Mascot bubble`, `Chat Input`, `Icon badge`, `Activity card`, `Waveform`, and today's `Progress Ring`): Title Case, space-separated, plain English words describing the actual UI element. This is a real, consistent split, not noise, every component built for the voice-recall feature work follows this second pattern and none of them follow the first. **The naming convention documented here previously (lowercase camelCase) no longer matches current practice.** Going forward, follow the newer Title Case pattern, it's what every recent component actually uses, not the older rule. Reconciling the two layers retroactively is a separate decision, not something to do silently.
- **Instance layer names should match their component's real name.** They don't always: some `appBar` instances in the example screens are labeled "App Bar" instead. A renamed instance is harder to find in search and reads like a second, different component. Rename it back to match, or better, don't rename component instances at all.

## Description convention

Every component built or touched in the voice-recall feature work follows the same content and typography rules for its description. Anything new should too.

- **Exactly three paragraphs, in this order, with these labels:** `WHAT IT IS:`, `WHEN TO USE IT:`, `DON'T:`. Nothing else. No changelog language, no dates, no "FIXED on...", no "REAL USAGE:", no per-state breakdown beyond what those three paragraphs need. History like that belongs in the build log (`claude/component-build-specs.md`), never on the canvas or in the component's own description field.
- **The component's own Figma `description` field and the on-canvas description text inside its demo card carry the identical text**, not two different versions of the same idea.
- **Typography for the on-canvas text**: Greed Standard-TRIAL Regular, 16px, fill bound to `text/secondary`, not a flat hardcoded color. `textAutoResize` set to `HEIGHT`, never `NONE`, a fixed-height box will silently clip as the text grows.
- **No literal backticks or other markdown syntax around property names.** Figma text doesn't render markdown, backticks just show up as stray characters. Reference a property by its plain name instead (`Show chip`, not `` `Show chip` ``).
- **Write for a non-technical reader.** No implementation caveats, no discovery narrative, no hedging about how confirmed a pattern is. If a detail is only useful to whoever rebuilds the component, it goes in the build log, not the description.

## Structural conventions

- **An icon that should be swappable from the component's own property panel**, not just replaceable by drilling in, gets a real `INSTANCE_SWAP` component property named `Icon` (Figma stores it internally as `Icon#<nodeId>`), bound to the icon instance via `componentPropertyReferences.mainComponent`. This is the pattern `Superlist item` established and `Activity card` reused, follow it rather than inventing a new one.
- **A swappable icon alone is not a reason to build a variant set.** If the only real axis of change is "which icon," keep it a single component with an instance-swap property, the way `Activity card` does. Reach for a variant set only when there's a second, structurally different layout to switch between, the way `Mascot bubble`'s `position` axis actually rearranges children.
- **A child that must stay anchored or centered independent of its parent's own HUG-sizing** (like `Mascot bubble`'s speech-bubble tail) should be taken out of the auto-layout flow with `layoutPositioning: ABSOLUTE` and a `STRETCH` constraint, not left as a `FILL`-sized child inside a `HUG` parent. `FILL` inside `HUG` is a contradiction Figma will only resolve by coincidence, it has broken more than once in this file.
- **Before deleting anything on the theory that it's an unused duplicate**, confirm it with a real scan: walk every page's instances, resolve each one's main component with `getMainComponentAsync()`, and check the count is actually zero. Don't rely on a name pattern or on memory of what "should" be in use, that's exactly how a leftover duplicate variant went unnoticed inside `Mascot bubble` until today.

## Never do this

- Never invent a value that isn't in `tokens.json`. If something is missing, say so instead of filling the gap.
- Never use a CSS fallback value like `var(--token, #333)`. If a token resolves to nothing that's a bug to fix, not to hide.
- Sentence case on every label, button and heading. Capitals only for proper nouns.
- Never put an appearance word in a semantic name. A word that describes how a color looks belongs in the primitive layer only.
- Never read a primitive directly. Components consume the semantic layer, and the semantic layer references the primitives.
- Never use `accent/1` through `accent/4` to signal status or paid tier. They're decorative, no fixed meaning. Status lives in `feedback/*`, paid tier lives in `pro/*`.
- Never duplicate a component's layers to reuse it somewhere else. Instantiate the real component instead. A duplicated copy looks identical today and silently drifts from its source forever, this file has had 8 of those found hidden in it so far, most recently a stray `position` variant on `Mascot bubble`.
- Never assume a text style's letter-spacing is tokenized just because tracking tokens exist in `tokens.json`. No text style in this file is actually bound to them, spacing is set as a raw number per style. Treat it as fixed, not swappable.
