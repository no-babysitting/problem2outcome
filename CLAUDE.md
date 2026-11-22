@AGENTS.md

## Claude Code specifics

- Decision 1: for a larger task, suggest plan mode before you start work.
- Decision 2, larger tasks only: when you propose the criteria, add one short line: typing `/goal` with the criteria keeps Claude working until it judges them met, and that judgement is not their acceptance. Offer it before the work starts, never after. On a small task, do not mention `/goal`.
- Check the current Claude Code docs before suggesting any other feature; do not rely on remembered tips.
- grill me and challenge me: ask with the AskUserQuestion tool, up to 4 questions per call, your recommended option first with " (Recommended)" on its label.
- The optional NB mod (`mod/nb`) adds the `/grill-me`, `/challenge-me` and `/teach-me` skills and a few zero-token commands; everything in this file works without it.
