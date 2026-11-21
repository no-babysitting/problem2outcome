# NB add-on for the Claude desktop app

`AGENTS.md` works without this. The add-on makes the method visible while you work:

- **The Colleague** `[•_•]`, a small face above the message box. Its face and the little field of characters around it show what Claude is doing: waiting, reading, working, asking you, or done. After a turn it says one short line about the decision that is now yours.
- **Your task's four decisions** next to it: which ones you have made, and which one is yours now.
- **A calm meter** for how full the conversation is, so you know when to start a fresh one.
- **A coloured ASCII lake behind the chat.** The sun rises as you make your decisions.
- **`/grill-me`, `/challenge-me` and `/teach-me`**, with questions shown as choices you can click.
- **One pause before the first file is written**, if you have not said what counts as done yet. It asks only once.

## Before you add it

Add-ons like this run with the same access as Claude Code itself, so only add ones whose code you have read or whose author you trust. This one reads only your workspace folder and keeps its settings on your computer. It makes no network calls. Try it on a test folder first.

## Add it

In the Claude desktop app, open a **Code** session in your workspace folder. Type this into the message box and send it:

```
/plugin install nb --marketplace no-babysitting/problem2outcome
```

Claude asks two things: say **yes** to adding the source, then pick who it is for (just you is fine). It usually turns on at once. If Claude says it needs a reload, type `/reload-plugins`. You do not need a new session.

Add-ons need a recent Claude Code; see the [official page on mods](https://code.claude.com/docs/en/plugins/mods/overview) for the minimum version. Type `/status` to see yours.

## Commands that cost nothing

These answer at once, without asking the model:

- `/nb`: where your task stands, and what each skill is for.
- `/mascot quiet | normal | chatty`: how often The Colleague speaks. At `quiet` it says nothing and Claude is not asked for its line.
- `/nb-lang en | vi`: the add-on's language. It also follows the `Language:` line in your `me.md`.
- `/nb-scene on | off`: the lake behind the chat.

## Good to know

- The pause before the first file catches the agent's usual ways of writing a file, including a shell command that writes with `>` or `tee`. It is a safety net; the main guard is `AGENTS.md`.
- The Colleague's line is written by Claude at the end of its reply, inside a `<nb>…</nb>` tag that the add-on hides from the chat. If you copy or export a conversation, or turn the add-on off mid-session, you may see these tags.
- The add-on speaks English and Vietnamese. Other languages fall back to English.
- A decision shows as made only when its `decisions.md` section says `Confirmed: yes`, which the agent writes after you confirm in your own words. A draft the agent wrote is not a decision.
