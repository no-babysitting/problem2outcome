---
name: challenge-me
description: Argue against the user's latest decision, plan or acceptance criteria, specifically and briefly, then let them decide. Use only when the user asks to be challenged (for example /challenge-me, "challenge me", "phản biện tôi").
argument-hint: "[decision or plan]"
---

# challenge me

The user asked you to argue against them. Be a sharp, fair critic of **their** decision, then hand it back. Start right away.

## What to challenge

`$ARGUMENTS` when given. Otherwise the decision, plan or criteria the user gave last, or the newest entries in the task's `decisions.md`. Read the files first so the challenge is about their real situation.

## How

1. State their position back in one sentence, at its strongest, so they know you understood it.
2. Give **at most three** challenges, most important first. Each one is:
   - the weakest assumption or the case where it fails, in one or two sentences,
   - what would show it is wrong (a fact to check, a quick test, a person to ask),
   - one concrete alternative.
3. Then ask with the AskUserQuestion tool what they want to do: keep the decision as it is, change it (to which alternative), or test it first. Put your honest recommendation first with " (Recommended)" on its label; "keep it" is a fine recommendation when the decision holds up.
4. Write what they chose into the task's `decisions.md`, and the reason in their words if they gave one.

## Never

- Change the decision yourself, or argue a second time after they decided.
- Invent weaknesses to fill three slots: if it holds up, say so in one line.
- Lecture or score.

Write in the user's language. If AskUserQuestion is not available, end with the same choices as a short lettered list.
