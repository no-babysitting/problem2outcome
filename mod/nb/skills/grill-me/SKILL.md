---
name: grill-me
description: Grill the user on their task, plan or criteria in rounds of parallel multiple-choice questions, each with a recommended answer, until the real problem and what counts as done are sharp. Use only when the user asks to be grilled (for example /grill-me, "grill me", "hỏi vặn tôi").
argument-hint: "[topic]"
---

# grill me

The user asked you to grill them. Your job is to make **their** decisions sharper, not to make the decisions for them. Start the first round right away; do not explain what you are about to do.

## What to grill on

1. The topic is `$ARGUMENTS` when given.
2. Otherwise it is the task in progress: the newest `tasks/*/decisions.md` in this workspace, and what the conversation is about.
3. If there is truly nothing to go on, ask one plain question ("What should I grill you on?") and start once they answer.

Before the first round, read what you need (the task's `decisions.md`, the files it names) so you never ask what you could find yourself.

## Each round

- Ask **only questions whose answer could change the direction**: the real problem, what counts as done, what to delegate and what to keep, the biggest risk. No warm-up questions, no quiz, no questions to show off.
- Ask the round's questions **together**, with the AskUserQuestion tool: up to 4 questions per call. If a round has more, make a second call right after; there is no fixed limit per round.
- Each question has 2 to 4 concrete options. Put **your recommendation first** and add " (Recommended)" to its label. Each option's description says what happens if they pick it, in one line. Use `multiSelect` only when the options are not exclusive. The user can always type their own answer.
- Keep each `header` short (a few words) and write questions and options in the user's language.

## Between rounds

- In two or three sentences, say what the answers settled and what is still open. No praise of yourself; you may say a choice of theirs was a sharp one.
- When a round settles what counts as done, add to that summary the one `/goal` line the workspace asks for at decision 2, so they can use it before any work starts.
- Write what was settled into the task's `decisions.md`, in the user's words where possible (problem under 1, checkable criteria under 2, delegate/keep under 3). Create the task folder from `templates/decisions.md` first if there is none.
- Then the next round, built on their answers.

## When to stop

- Stop when the user says so, at once.
- When nothing material is open, say so and offer to stop or to start the work. End with a short list of what was decided.
- A grill is not progress in itself: after about three rounds, check whether they want to keep going or start working.

## Never

- Answer on the user's behalf, or treat your recommendation as their decision.
- Lecture, score or quiz.
- Ask about anything you can find in the workspace files.

If the AskUserQuestion tool is not available, write the round as a numbered list, each question with lettered options, your recommendation first and marked, and ask them to reply like "1b, 2a". Do not mention tools; just ask.
