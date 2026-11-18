# WS2a — Native AI Platform Capabilities (as of 2026-11-17): what No Babysitting can delegate vs. must own

Research date: 2026-11-17. "Fetched 2026-11-17" means the official page was read on that date and describes current shipped state on that date unless it is labelled beta or preview. Tags: [Fact] = stated by an official/primary source; [Finding] = reported by credible secondary sources or several sources agreeing; [Inference] = my reasoning from cited facts; [Hypothesis] = speculative, needs validation. The no-babysitting repo and site were NOT used.

Source quality: Anthropic official docs (code.claude.com, support.claude.com) were fetched in full and are the strongest evidence. OpenAI help and blog pages returned HTTP 403 to the fetcher. OpenAI claims therefore rest on developers/learn.chatgpt.com docs (fetched), search snippets of help.openai.com, and press coverage; each is labelled. Google evidence comes from the official Gemini CLI changelog (fetched), the official Google Developers Blog via search, support.google.com via search snippets, and press.

---

## Q1. Anthropic: what is shipped natively (Claude.ai, Projects, Memory, Skills, Cowork, Claude Code, Agent SDK, MCP, connectors, cloud agents)?

### Takeaway
As of Nov 2026, Anthropic natively covers almost the whole execution and context layer: skills (an open format), plugins, memory you can inspect and edit, project instructions, subagents, hooks, cloud sandboxed sessions that clone GitHub repos and run tests, scheduled and background tasks, multi-thread "Projects" that coordinate parallel work, a granular permission model, and Learning and Explanatory output styles. Products for non-developers (Cowork, skill recording) are moving the same machinery to non-technical users. What it does not ship is a cross-task layer that frames problems, evaluates outcomes, and assesses how well the user collaborates.

### Cited Findings
**Skills (Claude.ai / API / Claude Code)**
- [Fact, fetched 2026-11-17; article "updated over 2 weeks ago"] A custom skill is a directory with a required `skill.md`. Its YAML frontmatter has a `name` (≤64 chars) and a `description` (≤200 chars), plus an optional `dependencies` field. The body loads only when needed ("progressive disclosure"), and a skill can bundle reference files and executable scripts. — [Claude Help: How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Fact, same source] Skills are available on the Free, Pro, Max, Ultra, Team and Enterprise plans and **require code execution to be enabled**. They are uploaded and enabled in Customize > Skills. The article labels Claude Code "beta" and the API "beta", and API skills cannot install packages at runtime. Team and Enterprise admins can provision skills org-wide. — [Claude Help](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Fact, same source] **Skill creation by recording a task**: Claude watches a task for about 10 minutes and proposes a new skill or an update to an existing one. It is available on Pro, Max, Ultra and Team in Cowork on Claude for Mac only. This is native "workflow capture". — [Claude Help](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Fact, same source] The article links to the open Agent Skills spec at agentskills.io "for cross-platform compatibility". — [Claude Help](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- Note on a conflict: the support article labels Claude Code skills "beta", while the Claude Code docs present skills as a standard feature. — [Claude Code overview](https://code.claude.com/docs/en/overview)

**Memory (Claude.ai)**
- [Fact, fetched 2026-11-17] Memory is saved "as a set of individual topics as you chat". It covers role, projects, people, and communication and technical preferences, and it skips sensitive topics such as health, politics and religion by default. — [Claude Help: chat search and memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)
- [Fact, same] "Each project has its own memory." Inside a project, Claude uses that project's memory plus account memory, but not memory from other projects. "Use account memory" can be switched off per project to isolate it. — [same](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)
- [Fact, same] Users can view, edit and delete each topic under Settings > Your Claude > Manage, or by telling Claude to remember, change or forget something. Pausing memory keeps entries, and reset deletes everything, including project memories. Incognito chats are on all plans and memory can be turned off for a single chat. Memory **import/export between Claude and other AI services** exists and is labelled experimental. — [same](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)
- [Fact, same] Memory is on by default on Free, Pro, Max and Ultra. On Team and Enterprise, owners control it. Org members get memory on by default only for orgs created on or after **2026-10-31**. — [same](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)
- [Finding, search snippets of the official article] "Search and reference chats" lets Claude search past chats as a visible tool call (paid plans), and it can be toggled off in Settings > Memory. — [Claude Help 11817273](https://support.claude.com/en/articles/11817273)

**Projects (Claude.ai chat)**
- [Finding, official snippet] A project saves new memory to itself. Archived projects must be unarchived before they can be deleted. — [Claude Help: Projects](https://support.claude.com/en/articles/9519177-projects)

**Cowork and plugins (non-developer agent surface)**
- [Finding, secondary sources agree] Cowork launched as a research preview on 2026-01-12 and became GA on all paid plans on **2026-04-09**. A plugin system (skills + connectors + commands + sub-agents) opened on 2026-01-30 with 11 plugins in `anthropics/knowledge-work-plugins`. On 2026-02-24 private enterprise plugin marketplaces and a unified "Customize" menu were added. — [The Decoder](https://the-decoder.com/anthropics-cowork-gets-plugins-that-turn-claude-into-a-specialized-assistant-for-knowledge-workers/); [Claude blog: Cowork and plugins across the enterprise](https://claude.com/resources/articles/cowork-plugins-across-enterprise); [TechRadar](https://www.techradar.com/pro/claude-cowork-is-now-available-for-enterprise-use-adds-analytics-access-controls-and-more)
- [Fact] Cloud Cowork tasks share account memory ("One memory across chat and Claude Cowork"), and local Cowork sessions do not use memory. — [Claude Help 11817273](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)

**Claude Code (CLI, IDE, desktop, web, mobile)**
- [Fact, fetched 2026-11-17] Surfaces are Terminal, VS Code/Cursor, JetBrains, Desktop and Web (claude.ai/code), plus iOS/Android. Features include CLAUDE.md, auto memory, skills, hooks, subagents ("a lead agent coordinates the work"), background agents, Agent SDK, MCP, GitHub Actions/GitLab CI, GitHub Code Review, Slack routing, Chrome debugging, cloud scheduled tasks (formerly "routines", which can trigger on API calls and GitHub events), desktop scheduled tasks, `/loop`, Remote Control, Dispatch, `--teleport` and "dynamic workflows". — [Claude Code overview](https://code.claude.com/docs/en/overview)
- [Fact] CLAUDE.md comes in managed-policy, user, project and local tiers. Claude Code **reads AGENTS.md natively** when no CLAUDE.md is present (requires v2.1.277+), and a setting can load both. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- [Fact] **Auto memory** is "notes Claude writes itself based on your corrections and preferences". It is per repository and loaded every session (first 200 lines or 25KB). Subagents can keep their own auto memory. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- [Fact] `/doctor prompt-audit` audits CLAUDE.md, AGENTS.md, rules, skills, commands, subagents and output styles. This is a native "improve my instructions" feature for the config layer. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- [Fact] Permission modes are `default` (asks before edits, shell and network), `acceptEdits`, `plan` (read-only until the plan is approved), `auto` (a classifier blocks risky actions such as `curl | bash`, force-push, prod deploys and data exfiltration; it pauses after 3 consecutive or 20 total blocks), `bypassPermissions` (isolated VMs only) and `dontAsk` (CI). Deny rules apply in every mode. An OS-level Bash sandbox (macOS/Linux/WSL2) blocks network by default. Docs say "Auto mode reduces prompts but doesn't guarantee safety." — [Permission modes](https://code.claude.com/docs/en/permission-modes.md)
- [Fact] **Output styles**: the built-ins are Proactive, Concise, **Explanatory** (adds "Insight" blocks that explain choices) and **Learning** (Insight blocks plus `TODO(human)`: "When it reaches a piece with a real design decision… it leaves a few lines for you", then waits and gives an Insight on the user's code). Custom output styles are Markdown files and can ship in plugins with `force-for-plugin`. Docs: "An output style gives Claude instructions to follow. It doesn't guarantee that something always happens." — [Output styles](https://code.claude.com/docs/en/output-styles)

**Claude Code cloud sessions (Anthropic's web/cloud agent)**
- [Fact, fetched 2026-11-17] Cloud sessions are on Pro, Max, Ultra and Team, and on Enterprise with premium or Chat+Claude Code seats. Each runs in an isolated Anthropic-managed VM and keeps running after the laptop closes. There is no separate VM charge, and usage counts toward plan limits. — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Fact] With the Claude GitHub App, sessions can reach "**Any public repository**, and private repositories that the Claude GitHub App is installed on". `/web-setup` reaches whatever the `gh` token can access. GitHub credentials "never enter a session's VM", because a proxy attaches them server side. Network is "Limited" by default with an allowlist, and setup scripts and env vars are configurable. — [same](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Fact] Auto-fix PRs: Claude subscribes to PR events and pushes clear fixes. "If a reviewer's comment could be interpreted multiple ways… Claude asks you before acting." The session diff view supports inline comments sent back to Claude. Sessions can be shared (Team visibility, or Public on Pro/Max/Ultra). — [same](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Fact] Limits: cloning and PR creation require GitHub (other hosts only via a bundle upload under 100MB, with no push back). Sessions expire after inactivity, and background shell commands and subagents are not restored. ZDR, HIPAA and CMEK orgs cannot use cloud sessions. — [same](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Fact, **public beta**] **Projects in Claude Code** are "one ongoing conversation where Claude coordinates a stream of related work". A coordinator starts parallel threads (cloud sessions) that report back. The project has an optional goal, project instructions (≤16,000 chars), and **project memory** (a `MEMORY.md` index plus files that users can read, edit and delete in Project settings > Memory). Claude "saves preferences like these to project memory on its own". Non-code work is supported (uploaded documents, with outputs in a Library). Available on Pro, Max and Ultra with a gradual rollout and waitlist; **not on Team/Enterprise yet**. The docs include a troubleshooting section titled "Threads guessed or stalled instead of asking". — [Claude Code Projects](https://code.claude.com/docs/en/claude-projects.md)

**Repository access in Claude.ai chat (non-Code)**
- [Fact, official snippet] Under Customize > Connectors > GitHub Integration, the user can "Add from GitHub" to select files and folders into a chat or project. They must fit the context window, and "Sync now" refreshes them. — [Claude Help: GitHub integration](https://support.claude.com/en/articles/10167454-using-the-github-integration); [Claude connectors docs: GitHub](https://claude.com/docs/connectors/github)
- [Fact] The API web fetch tool can fetch only URLs that already appear in the conversation. — [Web fetch tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool.md)
- [Finding, user bug reports, date-uncertain, may be fixed] Users report that a public GitHub URL pasted into claude.ai chat falls back to unauthenticated web_fetch, which cannot read private repos and does not reliably fetch whole repos. They also report bugs where the connector shows "Connected" but has an empty file tree or missing subdirectories (Jan 2026). — [claudeissues #72032](https://claudeissues.com/issue/72032-bug-p0-regression-github-connector-is-authorized-at-account-level-but-unavailabl); [claudeissues #92585](https://claudeissues.com/issue/92585-github-connector-shows-connected-but-file-browser-stays-empty-add-repository-ins); [Classmethod, Jan 2026](https://dev.classmethod.jp/en/articles/20260114_claude-github-integration-subdirectory-bug-january-2026/)

**MCP**
- [Finding] The Linux Foundation formed the **Agentic AI Foundation (AAIF)** on **2025-12-09**. Its founding projects are Anthropic's MCP, OpenAI's AGENTS.md and Block's goose, and more than 10,000 MCP servers had been published. — [InfoQ](https://www.infoq.com/news/2025/12/agentic-ai-foundation); [SD Times](https://sdtimes.com/ai/linux-foundation-forms-agentic-ai-foundation-to-be-new-home-for-mcp-goose-and-agents-md/)

**Learning mode (Claude.ai)**
- [Finding, secondary] Claude Learning Mode was announced in April 2025 with Claude for Education. One review calls it less polished than its rivals. — [Tom's Guide](https://www.tomsguide.com/ai/claudes-new-learning-modes-take-on-chatgpts-study-mode-heres-what-they-do); [Glasp comparison](https://glasp.ai/articles/ai-study-modes-compared)

### Inferences
- [Inference] Anthropic already ships every execution primitive NB's flow step (5) needs: sandboxed cloud execution of public repos, test runs, PRs, background and scheduled work, and HITL approvals. NB should own none of these.
- [Inference] Anthropic is moving into NB's "Workflow Design" area in three ways: skill recording (workflow capture), Projects with a goal, coordinator and project memory (persistent problem→work decomposition), and auto memory learning from corrections. It is moving into "Coaching" through the Learning/Explanatory output styles and Learning Mode, and into "instruction quality" through `/doctor prompt-audit`. All of these are developer- or education-scoped and task-local. None evaluates the human's framing or collaboration quality across tasks.
- [Inference] Output styles + plugins (`force-for-plugin`) + skills already let a third party deliver a "coaching persona" natively in Claude Code without a hosted service. That is the cheapest NB delivery vehicle on Claude, and also the easiest for others to copy.

### Gaps
- I found no official Anthropic page with exact Claude.ai behaviour (Nov 2026) when a public GitHub URL is pasted into plain chat. The evidence is user bug reports only, so this is unverified.
- I did not fetch a Claude.ai (non-Code) Projects page describing current project-instruction limits, or a current "Learning mode" page for claude.ai consumer plans.
- I did not verify Agent SDK specifics beyond the overview's mention: "full control over orchestration, tool access, and permissions".

---

## Q2. OpenAI: what is shipped natively (ChatGPT Projects, Memory, Custom GPTs, Agent/Work, Apps SDK, Codex, AGENTS.md, Skills)?

### Takeaway
As of Nov 2026, OpenAI has converged with Anthropic. Skills use the same open SKILL.md standard across ChatGPT and Codex, plugins and apps are MCP-based in one shared directory, memory has two modes (saved memories and chat-history synthesis) plus project-only memory, and **ChatGPT Work (launched 2026-07-09)** is a long-running, approval-gated agent that has absorbed the earlier "ChatGPT agent". Codex cloud runs repo tasks in sandboxes with configurable internet access. Study mode is a native Socratic learning mode. I found no native capability that evaluates how the user frames problems or collaborates.

### Cited Findings
**ChatGPT Work (agent)**
- [Finding, multiple press reports agree; official post 403] OpenAI launched **ChatGPT Work on 2026-07-09** with GPT-5.6. It is "an agent built to finish the job" that works across connected apps, files and the browser and "can stay with a project for hours". It breaks complex projects into steps and outputs sheets, slides, docs and web apps. — [The Next Web](https://thenextweb.com/news/openai-chatgpt-work-agent-launch); [VentureBeat](https://venturebeat.com/technology/openai-introduces-chatgpt-work-a-cloud-based-ai-agent-that-manages-tasks-across-email-slack-and-calendars); [BNN Bloomberg](https://www.bnnbloomberg.ca/business/artificial-intelligence/2026/07/09/openai-launches-chatgpt-work/)
- [Finding] HITL: users can "follow its progress, answer its questions, change direction, and approve important actions". Users control what it can access, when it checks in, and when it needs approval. An **auto-review** layer uses OpenAI models to check important actions before execution (OpenAI's 100% red-team block rate is self-reported). Scheduled Tasks can run once, on a schedule, on event triggers, or as monitors, and Computer Use can run inside them. Usage is metered like Codex. Rollout went to Pro/Enterprise/Edu first, then Plus/Business. The Codex desktop app merged into a new ChatGPT desktop app (Chat + Work + Codex), and Atlas browser is being sunset. — [The Next Web](https://thenextweb.com/news/openai-chatgpt-work-agent-launch)
- [Finding, search snippet of the official help article; page returned 403 to the fetcher] "ChatGPT agent is no longer available. Use ChatGPT Work for longer, multi-step tasks and finished deliverables." Earlier versions of the same article described confirmations for high-impact actions, "watch mode" on certain sites, and user takeover of the virtual browser for logins. — [OpenAI Help: ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent)

**Skills and plugins**
- [Fact, fetched 2026-11-17, undated page] OpenAI skills "build on the open agent skills standard" (agentskills.io). Each is a directory with `SKILL.md` (`name` and `description`) and optional `scripts/`, `references/`, `assets/` and `agents/openai.yaml`. Codex locations are REPO `.agents/skills`, USER `$HOME/.agents/skills`, ADMIN `/etc/codex/skills`, and SYSTEM (bundled `skill-creator` and `skill-installer`). Invocation is explicit (`@` in ChatGPT, `$` or `/skills` in Codex) or implicit by description match, which `allow_implicit_invocation: false` disables. The initial skill list uses ≤2% of the context window by default. — [OpenAI docs: Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Fact, same] "Plugins distribute skills and connectors through a universal plugin directory shared by ChatGPT and Codex". Plugin-bundled skills work in Chat and Work on web, desktop and mobile, and in Codex app and CLI. Standalone skills work in the ChatGPT desktop app, Codex CLI and the IDE. `@skill-creator` is available in ChatGPT Work. — [OpenAI docs: Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Finding] Skills first appeared in Dec 2025 (ChatGPT Code Interpreter and Codex CLI, around 2025-12-12). A March 2026 summary put ChatGPT Skills in beta for Business/Enterprise. — [ITPro](https://www.itpro.com/software/development/openais-skills-in-codex-service-aims-to-supercharge-agent-efficiency-for-developers); [Let's Data Science](https://letsdatascience.com/news/openai-adds-skills-support-to-chatgpt-19c7fe95)

**Apps SDK / apps in ChatGPT**
- [Fact] Apps in ChatGPT and the Apps SDK (built on MCP) launched on **2025-10-06**. — [OpenAI: Introducing apps in ChatGPT](https://openai.com/index/introducing-apps-in-chatgpt/)
- [Finding] An app directory at chatgpt.com/apps accepts vetted submissions (from Dec 2025). The Apps SDK sits on the open **MCP Apps** spec (2026-01-26), and Apps and plugins were reportedly merged into one MCP-based system (merge date unverified). — [VentureBeat](https://venturebeat.com/technology/openai-now-accepting-chatgpt-app-submissions-from-third-party-devs-launches); [mcp.directory](https://mcp.directory/blog/mcp-apps-standard-vs-openai-apps-sdk-2026); [Alpic](https://alpic.ai/blog/in-chatgpt-codex-merge-openai-combines-apps-and-plugins-all-based-on-mcp)

**Memory and Projects**
- [Finding, official help snippets via search] Saved memories are a "notepad" stored separately from chat history, so deleting a chat does not delete a memory. A newer "improved memory" is "a continually updated synthesis of context from your past chats", and users can switch between it and the legacy saved-memories list (Settings > Personalization > Memory). Turning off "Reference chat history" schedules deletion within 30 days. Temporary Chats neither use nor create memories. — [OpenAI Help: Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)
- [Finding, official snippets] **Project-only memory** is optional at project creation and switches on automatically when a project is shared. Shared projects cannot access members' outside memories. Study mode does not apply inside projects. — [OpenAI Help: Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt); [OpenAI Academy: Projects](https://openai.com/academy/projects)

**Codex (cloud, CLI) and AGENTS.md**
- [Fact, fetched 2026-11-17] Codex cloud tasks run in their own workspace from web, desktop, mobile or CLI and keep running while the computer sleeps. Codex can check out any repo available through the connected **GitHub or GitLab** account and run scripts and tests. Users review, follow up, and commit or open a PR. Internet access is configured per environment, with an allowlist and network secrets. — [Codex cloud docs](https://learn.chatgpt.com/docs/cloud.md)
- [Fact, official docs via search] Setup scripts have internet access. Agent internet access is **off by default** and can be set to limited or unrestricted, with a domain and HTTP-method allowlist, behind a proxy. AGENTS.md is the repo or user file that gives Codex persistent instructions (e.g. lint and test commands). — [Codex cloud environments](https://developers.openai.com/codex/cloud/environments); [Agent internet access](https://developers.openai.com/codex/cloud/agent-internet); [Codex glossary](https://developers.openai.com/codex/glossary)

**Study mode**
- [Finding, secondary] ChatGPT **Study Mode** launched in July 2025, is free on all plans, and uses guided questioning instead of direct answers. One podcast claims it was later removed, which conflicts with other sources (unverified). — [Fast Company](https://www.fastcompany.com/91439393/ai-tutor-chatgpt-openai); [EdTech Insiders](https://edtechinsiders.substack.com/p/study-modes-the-new-ai-battleground); [Podbean episode](https://www.podbean.com/media/share/pb-vevns-1974a8b?download=1)

### Inferences
- [Inference] With ChatGPT Work, OpenAI's main knowledge-worker surface now decomposes ambiguous projects into steps, asks questions mid-task and requests approvals. That is the "plan → execute → check in" half of NB's flow, shipped natively for S2/S3 users.
- [Inference] Skills (SKILL.md) and MCP plugins are portable between Claude and OpenAI. An NB methodology packaged as an Agent Skill + MCP server could run in both without a hosted UI, subject to the portability gaps in Q6.

### Gaps
- OpenAI official pages (help.openai.com, openai.com/index) returned 403. ChatGPT Work's exact plan availability for Free/Plus, its memory behaviour, and whether it uses Projects memory are unverified.
- I did not verify the current status of Custom GPTs (still offered? replaced by Projects plus skills?). No source was found in this pass.
- Study mode's status as of Nov 2026 is uncertain because sources conflict.

---

## Q3. Google: what is shipped natively (Gemini app, Gems, memory/Personal Intelligence, Gemini CLI to Antigravity CLI, Jules, NotebookLM)?

### Takeaway
As of Nov 2026, Google's consumer Gemini app has Gems (a custom persona with instructions and knowledge files, plus a "rewrite instructions with Gemini" helper), past-chat memory, opt-in Personal Intelligence (connected Google apps), and Guided Learning. On the developer side, Gemini CLI (with skills, plan mode, subagents, sandboxing, MCP and a memory inbox) was **replaced for individual and free users by Antigravity CLI on 2026-06-18**. Jules is an asynchronous GitHub coding agent (GA since Aug 2025). Google's developer surface is the least stable of the three.

### Cited Findings
- [Fact, official Google Developers Blog via search] Google is transitioning Gemini CLI to **Antigravity CLI** (`agy`), announced 2026-05-19. Gemini CLI and Gemini Code Assist IDE extensions stopped serving Google AI Pro, Ultra and free individual users on **2026-06-18**. Enterprise and paid API access is unchanged. — [Google Developers Blog](https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/); [The Register](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605) (developers criticise it as "far less open")
- [Fact, fetched 2026-11-17; latest entry v0.64.0, 2026-10-13] The Gemini CLI changelog itself says it "was replaced by Antigravity CLI on June 18th, 2026" for unpaid-tier and Google One users. Feature timeline: Agent Skills in v0.24.0 (2026-01-14), skills on by default plus a `skill-creator` skill in v0.26.0 (2026-01-27), and a `/memory` inbox "for reviewing skills extracted during sessions" in v0.39.0 (2026-04-23). It also lists: Plan Mode (v0.29.0, 2026-02-17; default in v0.34.0, 2026-03-17); a generalist subagent for delegation (v0.32.0); subagent sandboxing (v0.36.0); a four-tier GEMINI.md memory system (v0.40.0, 2026-04-28); an Auto Memory inbox for skill management (v0.42.0, 2026-05-12); gVisor, bubblewrap, Seatbelt and Windows sandboxes (Mar–Apr 2026); an admin MCP allowlist (v0.29.0); hardening against indirect prompt injection (v0.61.0, 2026-09-23); and autonomous plan execution in non-interactive mode (v0.63.0, 2026-10-06). — [Gemini CLI changelog](https://geminicli.com/docs/changelogs/)
- [Fact, official Google blog] The Jules extension for Gemini CLI was introduced on 2025-10-29. `/jules` offloads tasks to a separate VM that commits to a new branch. — [Google Developers Blog: Jules extension](https://developers.googleblog.com/ko/introducing-the-jules-extension-for-gemini-cli/)
- [Finding] Jules left beta in Aug 2025 with paid tiers tied to Google AI Pro and Ultra. Later sources mention Jules Tools (CLI) and event-triggered background agents for issues and PRs. — [TechCrunch](https://techcrunch.com/2025/08/06/googles-ai-coding-agent-jules-is-now-out-of-beta); [InfoQ](https://www.infoq.com/news/2025/08/google-jules)
- [Fact, official support snippet] To create a Gem you give it a name, instructions and optional "Knowledge" files (from device or Drive). "**Use Gemini to rewrite instructions**" expands brief instructions into fuller ones, which is a native "improve my prompt" for personas. — [Google Help: Use Gems in Gemini Apps](https://support.google.com/gemini/answer/15146780)
- [Finding] Past-chat memory ("Personal context") rolled out from Aug 2025 and is toggleable. Past-chat personalization reached the free tier globally except Europe on 2026-02-26. **Personal Intelligence** (opt-in access to Gmail, Photos, Search and YouTube) launched in beta on 2026-01-14. — [9to5Google](https://9to5google.com/2025/08/13/gemini-personal-context/); [Android Authority](https://www.androidauthority.com/google-gemini-personal-intelligence-rollout-3632287); [Google: Building personal intelligence (PDF)](https://ai.google/static/documents/building_personal_intelligence.pdf)
- [Finding, secondary] Gemini **Guided Learning** (Aug 2025) adds diagrams, videos and quizzes to a Socratic mode. — [Glasp](https://glasp.ai/articles/ai-study-modes-compared); [Wonder Tools](https://wondertools.substack.com/p/turn-ai-into-your-personal-tutor)

### Inferences
- [Inference] Google's developer-agent surface broke compatibility within 6 months (Gemini CLI to Antigravity CLI), and migration guides advise re-testing "MCP servers, hooks, and skills". — [mcp.directory migration guide](https://mcp.directory/blog/antigravity-cli-vs-gemini-cli-migration-2026). That supports NB keeping only thin, standard-format adapters (SKILL.md, AGENTS.md, MCP) and not deep platform-specific integrations.
- [Inference] Gemini CLI's "/memory inbox for reviewing skills extracted during sessions" is a native evaluation-to-adaptation loop at the workflow level: the platform proposes reusable workflows from observed sessions and the user confirms. It matches NB's B5 "persistent change requires confirmation" principle, already shipped.

### Gaps
- I did not verify Antigravity CLI's current feature set (skills/AGENTS.md support) or Jules's Nov 2026 status. Search returned mostly 2025 coverage.
- NotebookLM was not researched in this pass (time budget). It is probably relevant to S2/S3 document-grounded framing.
- I found no official statement on whether Saved Info and past-chat memory apply inside Gems.

---

## Q4. Others (briefly): Microsoft Copilot, Cursor, GitHub Copilot

### Takeaway
These matter mainly as Agent Skills / AGENTS.md / MCP adopters, which raises the portability ceiling for an NB methodology packaged in those formats. I did not research them in depth.

### Cited Findings
- [Finding, secondary; counts vary from 26 to 40+] GitHub Copilot, VS Code, Cursor, Goose and Gemini CLI are reported as Agent Skills adopters, and Microsoft and OpenAI reportedly added support within 48 hours of the Dec 2025 open-standard release. — [The Decoder](https://the-decoder.com/anthropic-publishes-agent-skills-as-an-open-standard-for-ai-platforms/); [Noqta](https://www.noqta.tn/en/news/skill-md-open-standard-30-ai-coding-tools-adoption-2026)
- [Fact] Claude Code ships extensions for VS Code and **Cursor**. — [Claude Code overview](https://code.claude.com/docs/en/overview)

### Inferences
- [Inference] For S1 (developers), distribution through SKILL.md + AGENTS.md reaches nearly every major coding agent. For S3, no equivalent "install once, works everywhere" channel exists. Consumer chat apps each need their own setup (Claude Skills upload, ChatGPT plugin directory, Gemini Gems).

### Gaps
- I did not research Microsoft 365 Copilot agents, Copilot Notebooks or Cursor rules/memory first-hand. The agentskills.io client showcase is rendered dynamically and the fetch returned no list, so the official adopter list is unverified.

---

## Q5. Repository / resource access: can each platform read a pasted public GitHub URL, clone it, run tests, and in what sandbox?

### Takeaway
Full "paste a public repo URL, clone, run tests in a sandbox" works natively today in **coding-agent surfaces**: Claude Code cloud sessions (any public repo via the GitHub App), Codex cloud (repos reachable through a connected GitHub/GitLab account), and Jules. In **plain chat apps** (claude.ai chat, ChatGPT chat, Gemini app) a pasted repo URL gives at best a web fetch of individual pages or a connector-based file import, with no clone and no test execution. A URL-first NB entry point therefore depends on routing users into a coding-agent surface, which S2/S3 users mostly do not use.

### Cited Findings
| Platform surface (as of 2026-11-17) | Read pasted public repo URL | Clone | Run tests | Sandbox / network | Private repo |
|---|---|---|---|---|---|
| Claude Code cloud (claude.ai/code, mobile, `--cloud`) | Yes. GitHub App reaches "any public repository" | Yes | Yes (shell in VM) | Isolated Anthropic VM; Limited network allowlist by default; creds kept outside the VM | App-installed repos or `/web-setup` gh token — [docs](https://code.claude.com/docs/en/claude-code-on-the-web) |
| Claude Code local CLI/IDE | Yes (git/web fetch per permissions) | Yes | Yes | Local; optional OS sandbox, network off by default — [permission modes](https://code.claude.com/docs/en/permission-modes.md) | Local creds |
| claude.ai chat / Projects | Partial: web_fetch of URLs in the conversation; GitHub integration imports selected files into context | No | No (code execution runs in the skill/analysis container only, not a repo checkout; unverified for repos) | — | GitHub connector — [Help](https://support.claude.com/en/articles/10167454-using-the-github-integration); [web fetch](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool.md); user reports of failures: [#72032](https://claudeissues.com/issue/72032-bug-p0-regression-github-connector-is-authorized-at-account-level-but-unavailabl) |
| Codex cloud | Repos available via connected GitHub/GitLab account (public-repo-without-connection behaviour not documented) | Yes | Yes | Per-task workspace; agent internet off by default, allowlist optional — [Codex cloud](https://learn.chatgpt.com/docs/cloud.md); [agent internet](https://developers.openai.com/codex/cloud/agent-internet) | Connected account |
| ChatGPT Work | Via connectors/plugins and browser (unverified for repo clone; Codex is "the engine underneath") | Unverified | Unverified | Cloud; auto-review of risky actions — [TNW](https://thenextweb.com/news/openai-chatgpt-work-agent-launch) | Connectors |
| Jules | GitHub-integrated async agent | Yes (VM) | Yes | Separate VM, commits to new branch — [Google blog](https://developers.googleblog.com/ko/introducing-the-jules-extension-for-gemini-cli/) | GitHub auth |
| Gemini CLI → Antigravity CLI | Local | Yes | Yes | gVisor/bubblewrap/Seatbelt sandboxes; prompt-injection hardening (v0.61.0) — [changelog](https://geminicli.com/docs/changelogs/) | Local creds |

- [Fact] Claude Code cloud **auto-fix** warns that Claude can reply to PR comments under the user's GitHub account, which can trigger comment-driven automation such as Atlantis. This is a documented untrusted-action risk. — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Fact] Even with network disabled, a cloud session "can still communicate with the Anthropic API, which may allow data to exit the VM". — [same](https://code.claude.com/docs/en/claude-code-on-the-web)

### Inferences
- [Inference] NB should delegate all repo inspection and execution to these surfaces and not build its own fetcher or sandbox. The NB-specific value is choosing which surface fits the user's problem and making the permission and network constraints visible (WS3 item 8). The platforms surface these well for developers but assume developer literacy.
- [Hypothesis] For S2/S3, "paste a repo URL into plain chat" will feel unreliable (partial fetch, connector bugs). A document, folder or Projects upload entry point (Claude Code Projects already accepts uploaded documents) is likely the better native path.

### Gaps
- I did not confirm whether Codex cloud can clone a public repo the user does not own without connecting GitHub, or whether ChatGPT Work can run a test suite.

---

## Q6. Portability: what is an open standard vs. locked-in?

### Takeaway
Three formats are now cross-vendor: **Agent Skills (SKILL.md)**, **AGENTS.md** and **MCP** (MCP and AGENTS.md under the Linux Foundation's AAIF since 2025-12-09; Agent Skills openly governed on GitHub, origin Anthropic). Core SKILL.md fields (`name`, `description`, body) are portable. Vendor extensions are not, for example Anthropic's `dependencies`, OpenAI's `agents/openai.yaml`, and the differing install locations. Memory, project memory, output styles, hooks, permission settings, Projects/Work orchestration and evaluation data are all platform-locked. Claude's memory import/export is experimental.

### Cited Findings
- [Fact] Agent Skills is "a lightweight, open format… originally developed by Anthropic, released as an open standard". Its core is `SKILL.md` with `name` and `description` at minimum, optional `scripts/`, `references/` and `assets/`, and three-stage progressive disclosure (discovery → activation → execution). — [agentskills.io](https://agentskills.io/home)
- [Finding] It shipped for Claude on 2025-10-16 and was published as an open standard on 2025-12-18. Governance runs openly on GitHub; one claim of AAIF governance from May 2026 is unconfirmed. — [Daniel Vaughan (May 2026)](https://codex.danielvaughan.com/2026/05/05/agent-skills-open-standard-portable-skills-codex-cli-cross-agent/); [jsDelivr README of agentskills repo](https://cdn.jsdelivr.net/gh/agentskills/agentskills@main/README.md)
- [Finding] A July 2026 compatibility test reportedly found "a significant portability gap" among major tools, and maintainers advise sticking to core fields. Vercel's skills.sh registry reportedly grew to more than 90,000 listings by July 2026. — [Business Tech Navigator](https://businesstechnavigator.com/news/agent-skills-open-standard-skills-sh-2026) (secondary, unverified)
- [Fact] OpenAI skills "build on the open agent skills standard" but add `agents/openai.yaml` and `.agents/skills` paths. — [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills). Anthropic adds an optional `dependencies` field. — [Claude Help](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Fact] Claude Code reads AGENTS.md natively (v2.1.277+). — [Claude Code memory](https://code.claude.com/docs/en/memory). AGENTS.md was contributed by OpenAI to AAIF. — [SD Times](https://sdtimes.com/ai/linux-foundation-forms-agentic-ai-foundation-to-be-new-home-for-mcp-goose-and-agents-md/)
- [Finding] MCP Apps is an open spec (2026-01-26) that the OpenAI Apps SDK builds on. — [mcp.directory](https://mcp.directory/blog/mcp-apps-standard-vs-openai-apps-sdk-2026)
- [Fact] Claude memory can be transferred "between Claude and other AI services" (experimental). — [Claude Help 11817273](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)

### Inferences
- [Inference] Portable: methodology as SKILL.md (core fields), project conventions as AGENTS.md, tools and data as MCP. Locked-in: memory stores, project memory, output styles (Claude Code only), hooks, permission and approval UX, orchestration (Claude Code Projects, ChatGPT Work), and all collaboration-trace data. Any NB claim about cross-session evaluation therefore needs NB-owned (or user-exported) records, because no platform exposes collaboration traces in a portable form.
- [Inference] The B1 "platform-agnostic methodology" claim is technically feasible at the instruction layer today. Platform-agnostic adaptation and evaluation are not feasible without an NB-owned state store or a user-carried artifact (e.g. a profile file in the repo or project).

### Gaps
- The official agentskills.io adopter list could not be retrieved (dynamic page).

---

## Q7. Direct threats: do platforms already provide coaching, clarifying-question / problem-framing modes, "improve my prompt", learning modes, or feedback on how the user collaborates?

### Takeaway
Partly. Native **learning modes** exist on all three vendors (ChatGPT Study Mode Jul 2025, Gemini Guided Learning Aug 2025, Claude Learning Mode Apr 2025, plus Claude Code's Learning/Explanatory output styles). **"Improve my prompt/instructions"** exists narrowly: Gems "rewrite instructions", Claude Code `/doctor prompt-audit`, and skill-creator skills on Claude, OpenAI and Gemini. **Agent-initiated clarification** exists inside agents (ChatGPT Work asks questions and requests approvals; Claude auto-fix asks on ambiguous review comments; Claude Code plan mode; Gemini CLI plan mode). **Workflow capture from behaviour** exists (Claude skill recording; Gemini CLI skill-extraction inbox; Claude auto memory "from your corrections"). I found **no shipped feature** that frames the user's problem before execution as a first-class mode, or that **evaluates and feeds back on the human's collaboration quality** across tasks. Research suggests models rarely ask clarifying questions unprompted.

### Cited Findings
- [Fact] Claude Code **Learning** style: Claude "leaves small pieces of code for you to write yourself" at real design decisions, waits, and then gives an Insight on the user's code. **Explanatory** adds "Insight" blocks. Both are optional, session-wide and unenforced. — [Output styles](https://code.claude.com/docs/en/output-styles)
- [Finding] ChatGPT Study Mode (Jul 2025, all plans), Gemini Guided Learning (Aug 2025) and Claude Learning Mode (Apr 2025) all withhold direct answers in favour of guided questions. — [Glasp comparison](https://glasp.ai/articles/ai-study-modes-compared); [Tom's Guide](https://www.tomsguide.com/ai/claudes-new-learning-modes-take-on-chatgpts-study-mode-heres-what-they-do)
- [Fact] Gems: "Use Gemini to rewrite instructions". — [Google Help](https://support.google.com/gemini/answer/15146780). Claude Code `/doctor prompt-audit` audits instruction and config files. — [Claude Code memory](https://code.claude.com/docs/en/memory). Bundled `skill-creator` exists in Codex (SYSTEM) — [OpenAI](https://learn.chatgpt.com/docs/build-skills) — and in Gemini CLI v0.26.0 — [changelog](https://geminicli.com/docs/changelogs/)
- [Finding] ChatGPT Work: users "answer its questions… approve important actions". — [TNW](https://thenextweb.com/news/openai-chatgpt-work-agent-launch). Claude auto-fix: "If a reviewer's comment could be interpreted multiple ways… Claude asks you before acting." — [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web). Claude Code Projects docs include troubleshooting for "Threads guessed or stalled instead of asking", which admits that agents under-ask by default. — [Claude Code Projects](https://code.claude.com/docs/en/claude-projects.md)
- [Fact] Plan modes: Claude Code `plan` ("Edits stay blocked until you approve the plan") — [Permission modes](https://code.claude.com/docs/en/permission-modes.md); Gemini CLI Plan Mode, default from v0.34.0 (2026-03-17) — [changelog](https://geminicli.com/docs/changelogs/)
- [Fact] Workflow capture: Claude skill recording proposes a skill from a ~10 min recording — [Claude Help](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills); Gemini CLI `/memory` inbox reviews skills extracted during sessions (v0.39.0) — [changelog](https://geminicli.com/docs/changelogs/); Claude Code auto memory "based on your corrections and preferences" — [Claude Code memory](https://code.claude.com/docs/en/memory)
- [Finding] Clarification behaviour: a PCWorld test found ChatGPT (GPT-5.3 Instant) and Claude Sonnet 4.6 asked follow-up questions unprompted on a vague trip request while Gemini 3 Flash did not. A May 2026 paper ("Knowing but Not Showing") reportedly found clarifying questions rare across models, with Claude highest at about 5%. AskBench (Feb 2026) found models frequently answer underspecified prompts directly. — [PCWorld](https://www.pcworld.com/article/3093921/add-this-one-line-to-your-ai-prompts-for-faster-better-answers.html); [AskBench, alphaXiv 2602.11199](https://www.alphaxiv.org/abs/2602.11199) (the "~5%" figure comes via secondary summary and was not verified against the paper)
- [Finding] There is user-side demand for "ask me questions first" prompting, which blogs widely publish as a workaround. — [MarTech](https://martech.org/want-better-answers-from-ai-tell-it-to-ask-questions/); [Tom's Guide](https://www.tomsguide.com/ai/i-use-these-5-prompts-to-stop-ai-from-misreading-my-intent-and-i-get-more-accurate-responses-every-time)

### Inferences
- [Inference] The threat is precise, not total. Platforms have commoditised (a) learning and Socratic modes for study, (b) in-task clarification and approval inside agents, (c) instruction and skill authoring helpers, and (d) passive preference learning. They have not shipped (e) explicit **problem framing before execution** for work tasks (goal, constraints, acceptance criteria, hidden assumptions) as a mode, (f) **evaluation of outcome against user-defined acceptance criteria** across platforms, or (g) **feedback to the human on their own collaboration patterns** (e.g. "you under-specify acceptance criteria; you skip verification"). (e)–(g) are NB's defensible core for now.
- [Inference] Because each platform's learning and coaching modes target education (study) or coding practice (Learning style), "coaching for knowledge-work problem solving" sits in the gap between them. That gap is narrow and is the most likely to be absorbed next (see Q8).

### Gaps
- I found no vendor documentation of a general-chat "ask clarifying questions first" toggle (Nov 2026). Its absence is a finding but could be a search miss.
- I did not check whether ChatGPT Deep Research or Claude Research still ask clarifying questions before running (they did in 2025 per my training knowledge, which is unverified for Nov 2026).

---

## Q8. Shipped vs. roadmap; trajectory for the next 12–18 months, and the delegate / own / adapter / not-yet-reliable / likely-obsolete table

### Takeaway
Almost everything in NB's execution, context and memory layers is shipped GA or public beta as of Nov 2026. Beta or rolling-out items: Claude Code Projects (public beta, Pro/Max/Ultra only), Claude memory import/export (experimental), Claude skill recording (Mac Cowork only), and ChatGPT Skills in Business/Enterprise (beta as of Mar 2026). The trajectory is fast: in the past ~12 months each vendor shipped agents with goal-level decomposition, workflow capture, and memory learning from corrections. NB should own only problem framing, cross-platform outcome and collaboration evaluation, and human-capability feedback, and should expect even parts of those to be absorbed within 12–18 months.

### Cited Findings
- [Fact/Finding, dated] Shipped timeline: Apps SDK 2025-10-06; Agent Skills for Claude 2025-10-16 and open standard 2025-12-18; AAIF 2025-12-09; Codex/ChatGPT skills Dec 2025; Cowork GA 2026-04-09; Personal Intelligence beta 2026-01-14; Gemini CLI skills and plan mode Jan–Mar 2026; Antigravity CLI replacing Gemini CLI 2026-06-18; ChatGPT Work 2026-07-09; Claude org memory default-on for orgs from 2026-10-31; Claude Code Projects public beta (current). — sources as cited in Q1–Q6 ([OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/); [Vaughan](https://codex.danielvaughan.com/2026/05/05/agent-skills-open-standard-portable-skills-codex-cli-cross-agent/); [InfoQ](https://www.infoq.com/news/2025/12/agentic-ai-foundation); [Google blog](https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/); [TNW](https://thenextweb.com/news/openai-chatgpt-work-agent-launch); [Claude Help](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md); [Claude Code Projects](https://code.claude.com/docs/en/claude-projects.md))
- [Fact] Projects "aren't offered on Team or Enterprise plans yet". This is an explicit not-yet signal. — [Claude Code Projects](https://code.claude.com/docs/en/claude-projects.md)
- [Finding] Coverage frames ChatGPT Work as a direct response to Claude Cowork, which suggests rapid feature parity between the two vendors. — [Reworked](https://reworked.co/digital-workplace/openai-debuts-direct-claude-cowork-competitor-chatgpt-work/)

### Inferences
**Delegate / Own / Needs adapter / Not yet reliable / Likely obsolete (horizon = estimated time until platforms natively cover it well enough to erode NB value)** [Inference unless marked]

| Capability | Classification | Native evidence (Nov 2026) | Absorption risk horizon |
|---|---|---|---|
| Code/repo execution, cloning, test runs, sandboxing, PRs | **Delegate** | Claude Code cloud, Codex cloud, Jules ([1](https://code.claude.com/docs/en/claude-code-on-the-web), [2](https://learn.chatgpt.com/docs/cloud.md)) | Already absorbed |
| Background / long-running / scheduled tasks | **Delegate** | Cloud scheduled tasks, ChatGPT Work scheduled tasks ([1](https://code.claude.com/docs/en/overview), [2](https://thenextweb.com/news/openai-chatgpt-work-agent-launch)) | Already absorbed |
| Multi-agent orchestration / task decomposition | **Delegate** | Subagents, Claude Code Projects (beta), ChatGPT Work ([1](https://code.claude.com/docs/en/claude-projects.md)) | Already absorbed |
| Tool and data connectivity | **Delegate** (via MCP) | MCP, connectors, plugins directory ([1](https://learn.chatgpt.com/docs/build-skills)) | Already absorbed |
| Permission, approval and HITL gating of actions | **Delegate**, but NB **surfaces and explains** it | Permission modes, auto-review, plan mode ([1](https://code.claude.com/docs/en/permission-modes.md)) | Already absorbed |
| User/project memory store, inspect/edit/delete | **Delegate** (B6 holds) | Claude memory + project memory; ChatGPT project-only memory ([1](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)) | Already absorbed |
| Project-level instructions | **Delegate**; NB writes content into native slots (CLAUDE.md/AGENTS.md/project instructions) | ([1](https://code.claude.com/docs/en/memory)) | Already absorbed |
| Packaging NB methodology for each platform | **Needs adapter** (SKILL.md core + AGENTS.md + optional MCP) | Agent Skills cross-vendor; vendor extensions differ ([1](https://agentskills.io/home), [2](https://learn.chatgpt.com/docs/build-skills)) | Format stable; Google surface churn is a risk |
| Entry from pasted public repo URL | **Needs adapter / route to coding surface**; not reliable in plain chat | claude.ai chat fetch is partial; cloud sessions work ([1](https://claudeissues.com/issue/72032-bug-p0-regression-github-connector-is-authorized-at-account-level-but-unavailabl)) | 6–12 mo for chat apps to gain native repo reading (Hypothesis) |
| Cross-platform carry-over of user/project context | **Needs adapter** (user-held artifact or NB store) | Claude memory import/export is experimental only ([1](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.md)) | 12–24 mo (Hypothesis) |
| Workflow capture into reusable skills | **Likely obsolete as an NB feature** | Claude skill recording; Gemini skill-extraction inbox; skill-creator everywhere ([1](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills), [2](https://geminicli.com/docs/changelogs/)) | 0–6 mo |
| "Improve my prompt / instructions" | **Likely obsolete** | Gems rewrite; `/doctor prompt-audit` ([1](https://support.google.com/gemini/answer/15146780), [2](https://code.claude.com/docs/en/memory)) | 0–6 mo |
| Learning / Socratic modes (for study or coding practice) | **Likely obsolete as differentiation** | Study Mode, Guided Learning, Learning style ([1](https://code.claude.com/docs/en/output-styles)) | Already absorbed |
| In-task clarifying questions and plan review | **Delegate the mechanism; own the policy** (when to ask, what to ask) | Plan mode; ChatGPT Work questions; but models under-ask ([1](https://www.alphaxiv.org/abs/2602.11199)) | 6–12 mo |
| **Problem framing before execution** (real goal, constraints, assumptions, acceptance criteria) for knowledge-work tasks | **Own** | No dedicated native mode found | 12–18 mo (most at risk of NB's owned set; Projects "goal" + Work planning point this way) |
| **Workflow design choice across platforms** (which native capability or surface fits this problem) | **Own** | Platforms recommend only their own features, e.g. plugin suggestions in Claude sessions ([1](https://code.claude.com/docs/en/claude-code-on-the-web)) | Structurally durable (vendors won't recommend competitors) |
| **Outcome evaluation against user-defined acceptance criteria** | **Own** (method); delegate test/CI execution | Platforms verify code (tests, auto-fix) but not knowledge-work outcome vs intent | 12–18 mo for agent self-checks; independent evaluation is more durable |
| **Feedback on human collaboration quality and capability growth** | **Own**; **not yet reliable** (LLM-as-judge bias, few sessions) | None found natively | 18+ mo (Hypothesis); vendors' incentive is to reduce friction, not to coach |
| Adaptive guidance intensity (more/less challenge or autonomy) | **Own the policy**; delegate mechanism (output styles, permission modes, Proactive style) | Proactive/Concise/Learning styles exist as static presets ([1](https://code.claude.com/docs/en/output-styles)) | 12 mo for vendor "adaptive" presets (Hypothesis) |

- [Inference] Steelman of counter-thesis (a), "platforms absorb everything in 12–18 months": the evidence supports it for every row except cross-platform workflow choice, independent outcome evaluation, and human-collaboration feedback. Even problem framing is trending native (Claude Code Projects' "goal", ChatGPT Work decomposition). NB's durable wedge is the parts that platform vendors are structurally disinclined to build: neutral cross-platform advice, evaluation that is independent of the executing agent, and the human's own capability growth.
- [Inference] B3's boundary is mostly sound. Two corrections: (1) "Workflow Design" should be narrowed to *choosing and configuring native capabilities*, because generating workflows and skills is commoditised; (2) "Coaching" should not be built as a generic learning mode, which is already absorbed. It should be framing- and evaluation-driven coaching tied to a specific outcome.

### Gaps
- No vendor roadmap documents were found that state plans for collaboration-quality feedback or problem-framing modes, so absorption horizons above are [Hypothesis].
- Plan-by-plan availability matrices for ChatGPT Work and Antigravity CLI are unverified.
