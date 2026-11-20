# problem2outcome

A workspace for doing real work with an AI agent (Claude Code or Codex) **while you stay the one who decides**.

The agent does the work. You make four decisions it should not make for you:

1. What is the real problem?
2. What counts as done?
3. What to delegate, what to keep?
4. Accept or redo?

The help fades as you get good at each decision. Nothing to install: the method lives in `AGENTS.md`.

## Start

1. Clone or download this repository. It becomes your work folder.
2. Open the folder in Claude Code (terminal or Desktop) or Codex, or add the repository to a Claude Code Project.
3. Say what you want done. The agent takes it from there.

Each task gets its own folder under `tasks/` with a short `decisions.md`: your criteria and whether you accepted the result. `me.md` keeps your support level for each decision. Both are plain files you can read, edit or delete. They stay in your folder; nothing is sent anywhere.

## What is in here

| Path | What it is |
|---|---|
| `AGENTS.md` | The working agreement the agent follows (Codex reads it; Claude Code reads it through `CLAUDE.md`) |
| `CLAUDE.md` | Imports `AGENTS.md` and adds Claude Code specifics |
| `templates/` | Starting points for `decisions.md` and `me.md` |
| `tasks/` | Your tasks, one folder each |
| `research/` | The research behind this project |

## For maintainers

Keep `AGENTS.md` thin. On every major model or harness release, delete instructions the agent now follows well by default, and never hardcode platform tips: the agent looks them up.

---

Tiếng Việt: cứ nói với agent bằng tiếng Việt, nó sẽ trả lời bằng tiếng Việt.
