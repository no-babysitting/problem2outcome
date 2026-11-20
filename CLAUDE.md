@AGENTS.md

## Claude Code specifics

- Decision 1: for a larger task, suggest plan mode before you start work.
- Decision 2: when you propose the criteria, add one line: they can confirm by typing `/goal` followed by the criteria, so Claude keeps working until they are met. Say that `/goal` reaching "met" is a model's verdict, not their acceptance (decision 4). Offer it before the work starts, never after.
- Check the current Claude Code docs before suggesting any other feature; do not rely on remembered tips.
- grill me and challenge me: ask with the AskUserQuestion tool, up to 4 questions per call, your recommended option first with " (Recommended)" on its label.
- The optional NB mod (`mod/nb`) adds the `/grill-me`, `/challenge-me` and `/teach-me` skills and a few zero-token commands; everything in this file works without it.
