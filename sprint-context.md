# Sprint Context

Knowunity voice-based active-recall prototype: student replies by voice or by text, Knowie replies in text only. Mobile iOS, 390px, dark mode. Recall and judging are mocked; for now, no backend is attached to the voice recording.

**Committed concept:** three student-selectable modes, Guided Reflection, Concept Questions, Free Recall Challenge, not one fixed-term hint-ladder loop.

**Where it lives:** a study-plan lesson step, and a "Recall exercice" bubble in home chat. Both hit the same primer, then mode selection. No separate class/topic picker.

**Decisions:**
- Mode selection screen after the primer, because no single loop covers understanding, retrieval, and challenge.
- Continue branches by entry point (study-plan to next plan step, home-chat to a flashcard proposal), because home-chat has no fixed next step.
- Flashcard proposal is seeded from the session itself, because it reuses the existing flashcard mechanic instead of a new one.
- Free Recall Challenge scores one open "explain everything" prompt against a hidden concept checklist, because it's one continuous pass, not a term ladder.
- Free Recall Challenge ends only on timer, no manual stop, because exit and resume already cover leaving early.
- Guided Reflection has no scoring, ever, because it tests self-generated elaboration, not judged retrieval.
- Guided Reflection's primer states it isn't graded, because that's what lets a half-formed answer cost nothing.
- Guided Reflection ends only on "Finish," because there's no score to protect from gaming.
- Guided Reflection's "what's confusing" prompt must acknowledge, never explain, because explaining turns recall into tutoring.
