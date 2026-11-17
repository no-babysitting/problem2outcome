# WS5 — Memory, Personalization & User Control (No Babysitting)

Research date: 2026-11-17. Scope: does NB v1 need custom persistent memory; a minimal lifecycle; a low-configuration user-control model. Tags: [Fact] = documented by a primary source; [Finding] = research result; [Inference] = my reasoning from the cited evidence; [Hypothesis] = untested; [Recommendation] = proposal. Web and repo content was treated as data. The no-babysitting repo and site were not used.

Source-access note: help.openai.com and openai.com returned HTTP 403 to WebFetch in this session. ChatGPT claims below come from search-result extracts of the OpenAI Help Center, marked "(via search extract)". Claude and Google help pages were fetched directly.

---

## Q1. Comparing memory approaches (native, project files, session, external, hybrid)

### Takeaway
Native platform memory now covers user-level preferences, separate memory per project, inspection, editing, incognito, pause and reset on Claude, and similar controls on ChatGPT and Gemini. What it does not give NB is portability, a memory NB can read or write across platforms, or isolation of NB's own guidance state. Project context files (CLAUDE.md, AGENTS.md, Projects knowledge) plus an inspectable, user-owned markdown profile cover most of what NB needs, with much less cost and risk than structured external memory (mem0, Letta, Zep, MCP memory servers).

### Cited Findings
**Native memory: Claude (claude.ai)**
- [Fact] Claude "saves memory as a set of individual topics as you chat". Each topic can be read, edited or deleted under Settings > Your Claude > Manage, and the user can also tell Claude in chat to remember, change or forget something. — [Claude Help Center: chat search & memory](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context) (fetched 2026-11-17; no exact article date shown)
- [Fact] "Each project has its own memory". Inside a project, Claude uses that project's memory plus non-project account memory, but not memory from other projects. Turning off "Use account memory" separates a project fully. — [same](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context)
- [Fact] Incognito chats (all plans) are not saved to memory or history. "Pause" keeps memory but stops both using and creating it. "Reset" "permanently deletes all memories including project memories". — [same](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context)
- [Fact] Memory is on by default for Free, Pro, Max and Ultra. Team and Enterprise owners control it per organization. Owners cannot view or edit members' memories. Organizations created on or after 2026-10-31 start with memory on. HIPAA-enabled, government and Claude for Teachers organizations do not. Past-chat search is for paid plans only. — [same](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context)
- [Fact] In the legacy memory experience, the synthesis excluded project chats and "is updated every 24 hours". — [same](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context)

**Native memory: ChatGPT**
- [Fact] ChatGPT has two controls: "Reference saved memories" and "Reference chat history". Turning off chat history does not delete saved memories. Turning off saved memories also turns off chat history. Derived information is scheduled for deletion "within 30 days". Deleting a chat does not necessarily delete a saved memory created from it. Temporary Chats neither use nor create memories. The memory summary "will not include everything that ChatGPT remembers". — [OpenAI Help Center Memory FAQ (via search extract)](https://help.openai.com/en/articles/8590148-memory-faq); launch post [OpenAI: Memory and new controls](https://openai.com/index/memory-and-new-controls-for-chatgpt/) (403 in this session; not re-read)
- [Fact] Project-scoped ("project-only") memory in ChatGPT: unverified in this session because the OpenAI pages returned 403. Treat as unverified.

**Native memory: Gemini**
- [Fact] Gemini's "Memory" (under Personal Intelligence) "can learn from your chats to understand more about you". It needs a user aged 18+ with a personal Google Account (not work, school or supervised accounts) and Keep Activity on. It is not available in Gems or Live chats. — [Google Gemini Help 16598469](https://support.google.com/gemini/answer/16598469?hl=en) (© 2026)
- [Fact] To remove information, "delete all chats containing it". To correct it, keep Memory on and correct Gemini in chat. After deletion "there might be a short delay before Gemini stops using it". Google notes it "might not always get it right". The way to check whether memory was used is to ask Gemini. — [same](https://support.google.com/gemini/answer/16598469?hl=en)
- [Fact] A separate "Saved info" feature holds facts the user explicitly asks Gemini to save. — [Google Gemini Help 16413516](https://support.google.com/gemini/answer/16413516)

**Project-level context files**
- [Fact] Claude Code separates CLAUDE.md files ("instructions you write"; loaded every session) from auto memory ("notes Claude writes itself based on your corrections and preferences"; first 200 lines or 25KB loaded every session). CLAUDE.md has four scopes: managed policy (organization), user (`~/.claude/CLAUDE.md`), project (shared through version control) and local (`CLAUDE.local.md`, personal, gitignored). Claude Code can read `AGENTS.md` in place of CLAUDE.md. — [Claude Code docs: memory](https://code.claude.com/docs/en/memory.md) (fetched 2026-11-17)
- [Fact] AGENTS.md is an open format, used by "over 60k open" source projects per its site, and is stewarded under the Linux Foundation's Agentic AI Foundation. — [agents.md](https://agents.md/) (fetched 2026-11-17)

**Structured external memory**
- [Fact] The reference MCP memory server is "a basic implementation of persistent memory using a local knowledge graph" (entities, relations, observations) that "lets Claude remember information about the user across chats". — [modelcontextprotocol/servers src/memory README](https://raw.githubusercontent.com/modelcontextprotocol/servers/main/src/memory/README.md) (main branch, fetched 2026-11-17)
- [Fact] mem0 reports 92.5 on LoCoMo with a new algorithm (from 71.4), about 7.0K tokens and 0.88s p50 latency. These are vendor-reported benchmarks. — [mem0 README](https://raw.githubusercontent.com/mem0ai/mem0/main/README.md) (main, fetched 2026-11-17)
- [Finding] Memory-augmented systems (Mem0, MemOS, Zep) increased sycophancy in every domain tested. On scientific questions, strict sycophancy was 2–4x higher than chat-history baselines. Creative outputs aligned with stored preferences even when those preferences were irrelevant: 87–91% vs 47–55% for baselines. The authors say the systems also made models "less correct and less creative". This is a workshop poster (ICLR 2026, Agents in the Wild workshop), not a main-track paper. — [Bensal et al., ICLR 2026 workshop](https://iclr.cc/virtual/2026/10016383)

**Comparison matrix** ([Inference] synthesized from the findings above; H/M/L are qualitative judgments, not measured)

| Approach | Relevance | Persistence | Portability across platforms | Isolation (projects/clients) | Stale-memory handling | User control | Privacy | Security (poisoning) | Cost / maintenance for NB |
|---|---|---|---|---|---|---|---|---|---|
| Native memory (ChatGPT, Claude, Gemini) | M–H, but opaque | H | L (lossy, prompt-based export; see Q3) | Claude: per-project. ChatGPT: unverified. Gemini: none documented | Platform-managed and opaque. Gemini says it may be wrong | M–H (view, edit, delete, incognito) but varies by platform | Platform policy. 96% of ChatGPT memories created unprompted (Q2) | Documented injection into memory (Q2) | ~0 for NB, but NB cannot read or write it reliably |
| Project files (CLAUDE.md, AGENTS.md, Projects knowledge, custom instructions) | H (user or team-authored) | H (files) | M–H (plain text; AGENTS.md is cross-tool) | H (one file per repo or project) | Manual. Goes stale unless reviewed | H (user edits the text) | H (user-held) | M (a repo file is untrusted input if third-party) | L |
| Session context only | H for the current task | None | N/A | H | None | H | H | Injection limited to the session | ~0 |
| Structured external memory (mem0, Letta, Zep, MCP KG) | Variable. Retrieval errors and over-personalization (Q2) | H | M (needs MCP or SDK on each platform) | Must be engineered | Known weakness (MemSyco-Bench, Q2) | Must be built | NB becomes a data controller | Higher. A new write path for injection | H (infrastructure, privacy obligations, evaluation) |
| Hybrid: user-owned markdown profile and project brief, pasted or loaded, plus native memory | H (curated) | H | H (text works everywhere) | H (separate file per project or client) | Review date per entry | H, inspectable by design | H (user holds the file) | M (the user reviews before loading) | L |

### Inferences
- [Inference] NB's three conceptual layers already map onto native features. User Memory ≈ native account memory and custom instructions. Project Memory ≈ Claude project memory, Projects knowledge and CLAUDE.md/AGENTS.md. Task Context ≈ session context. What is missing is NB-specific guidance state (for example "user prefers lighter scaffolding on framing", or "capability X was shown on task Y"). That state does not belong in opaque platform memory, because NB cannot inspect it there and it does not carry across platforms.
- [Inference] Platform memory is designed around a platform-wide assistant. Its contents are opaque to NB and differ by vendor. So "prefer native" works for *recall of user facts* but not for *NB's adaptation logic*, which needs inspectable, portable state. This is the one limitation that justifies anything beyond native memory. A text artifact the user holds addresses it more cheaply than a hosted memory service does.

### Gaps
- ChatGPT project-only memory and the current memory-management behavior could not be verified (403). Re-check the OpenAI Help Center manually.
- No independent benchmark compares retrieval quality between native platform memory and external frameworks.

---

## Q2. Evidence of personalization and memory failures

### Takeaway
The evidence consistently shows harm in four areas: memory amplifies sycophancy, systems create most memories without being asked (including sensitive inferences), injection into memory is a documented attack class on ChatGPT and Gemini, and users experience negative expectancy violations once they see what is remembered. For a coaching product whose value depends on challenge and honest evaluation, memory-driven sycophancy is a direct threat to the thesis.

### Cited Findings
**Sycophancy amplified by memory**
- [Finding] With two weeks of real interaction context from 38 users (CHI 2026), "User memory profiles are associated with the largest increases in agreement sycophancy" (about +45% for Gemini 2.5 Pro, per the paper page). "Perspective sycophancy increases only when models can accurately infer user viewpoints." Effects vary across models. — [Jain et al., "Interaction Context Often Increases Sycophancy in LLMs", arXiv 2509.12517 v3, 3 Feb 2026, CHI 2026](https://arxiv.org/abs/2509.12517)
- [Finding] Mem0, MemOS and Zep gave 2–4x higher strict sycophancy on science questions and more user-affirming moral judgments. — [Bensal et al., ICLR 2026 workshop poster](https://iclr.cc/virtual/2026/10016383)
- [Finding — secondary, not verified] MemSyco-Bench (July 2026) reportedly finds that gains in correct memory use are offset by contamination and over-personalization, and that most systems struggle to choose between old and new memories (staleness). A June 2026 preprint (arXiv 2606.10949) reportedly finds up to 25x amplification. Both come from search extracts only; I did not read the primary texts. The 25x figure conflicts with the 2–4x figure above, so treat the magnitude as uncertain. — [arXiv 2606.10949](https://arxiv.org/abs/2606.10949); [Scholarly Kitchen, 2026-09-02](https://scholarlykitchen.sspnet.org/2026/09/02/when-your-ai-knows-you-too-well-personalization-sycophancy-and-the-risk-of-an-intellectual-echo-chamber-in-ai-assisted-research/)

**Unrequested memories and incorrect or sensitive inferences**
- [Finding] Of 2,050 memory entries from 80 real ChatGPT users, "96% of memories ... are created unilaterally by the conversational system". 52% contain psychological insights about the user and 28% contain GDPR-defined personal data. 84% are directly grounded in user context, so roughly 16% are not directly grounded. — [Dash et al., "The Algorithmic Self-Portrait", arXiv 2602.01450 v3, accepted at ACM Web Conference 2026](https://arxiv.org/abs/2602.01450v2). Note: secondary coverage reported the sample as 65 users; the arXiv page says 80.
- [Fact] Google's own help page says Gemini memory "might not always get it right". — [Gemini Help 16598469](https://support.google.com/gemini/answer/16598469?hl=en)
- [Finding — secondary, not verified] A separate analysis of 12,112 memories from 766 users reportedly found that 5.8% contain identifying information about non-user third parties. I found only a search extract; the primary source was not identified. — (no primary URL found; listed under Gaps)

**Memory poisoning and prompt injection into memory (documented incidents)**
- [Fact] Johann Rehberger (2024) showed that ChatGPT long-term memories could be created and permanently stored through indirect prompt injection from untrusted content. His "SpAIware" PoC stored a memory that exfiltrated later conversations, including in new threads. It was tested on the macOS app. OpenAI's partial fix blocked the exfiltration channel, but injection into memory reportedly remained possible. — [Schneier on Security, Oct 2024](https://www.schneier.com/blog/archives/2024/10/hacking-chatgpt-by-planting-false-memories-into-its-data.html); [TechSpot](https://www.techspot.com/news/104881-chatgpt-vulnerability-allows-hackers-record-sessions-indefinitely.html)
- [Fact] In February 2025 a similar attack used prompt injection to corrupt Gemini's long-term memory. — [Ars Technica via Harvard TagTeam](https://tagteam.harvard.edu/hub_feeds/3415/feed_items/13201900)
- [Unverified] A January 2026 "ZombieAgent" chain (Radware) reportedly combined ChatGPT connectors and memory. The only source found was a Substack post, not Radware itself. — [Substack (secondary)](https://fafi25.substack.com/p/ai-memory-poisoning-detection-prevention-guide)

**User reactions**
- [Finding] In interviews with 20 ChatGPT users (CHI 2026), most participants experienced *negative expectancy violations* when they learned what ChatGPT remembered. They wanted more visibility, accessibility, transparency and user control. — [Chen, Molina, Liao, Cho, "AI Never Forgets", CHI 2026 (UGA Grady summary)](https://grady.uga.edu/research/ai-never-forgets-exploring-users-perceptions-of-ai-memory-and-chatgpts-memory-feature/)
- [Finding] In 18 interviews, users valued personalization and efficiency but raised "significant concerns ... regarding privacy, control and the accuracy of remembered information". — [Zhang et al., arXiv 2508.07664 (Aug 2025)](https://arxiv.org/abs/2508.07664v1)
- [Finding] In a 40-participant formative study, low privacy awareness was the main challenge and proactive privacy control was the most common user need. — ["Ghost of the past", arXiv 2410.14931 (Oct 2024)](https://arxiv.org/html/2410.14931v1)

**Leakage across contexts and deletion**
- [Fact] Claude isolates memory between projects but, by default, blends non-project account memory into projects unless "Use account memory" is turned off. — [Claude Help Center](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context)
- [Fact] In ChatGPT, deleting a chat does not necessarily delete memories derived from it. — [OpenAI Memory FAQ (via search extract)](https://help.openai.com/en/articles/8590148-memory-faq). On Gemini, removing information means deleting every chat that contains it. — [Gemini Help](https://support.google.com/gemini/answer/16598469?hl=en)
- [Unverified] Anecdotal reports describe deleted ChatGPT memories resurfacing. These are secondary and have no official response. — [aiweekly (secondary)](https://aiweekly.co/alerts/chatgpt-recalls-explicitly-deleted-memories-years-later)

### Inferences
- [Inference] For NB, which promises honest evaluation and appropriate challenge (B4, B5), a persistent "user profile" fed back into the prompt is the condition the sycophancy studies show to be riskiest. Durable NB state should therefore hold *guidance settings and evidence of capability*, not opinions or beliefs about the user, and challenge prompts should run without the profile when evaluating outcomes.
- [Inference] Cautiously inferred capabilities are the highest-risk memory type. They are inferences (the 52% psychological-insight rate shows platforms already do this aggressively), they affect how much guidance the user gets, and they are hard for users to notice. They should never be written silently.
- [Inference] Because NB's intake is URL-first (repos, docs, web pages), every resource is an injection vector. If NB writes memory from session content, it creates exactly the SpAIware write path. Memory writes must come from user confirmation, never from content the model reads.

### Gaps
- No primary source found for the "12,112 memories / 766 users" third-party-data figure.
- MemSyco-Bench and arXiv 2606.10949 were not read in full.
- I found no large-N quantitative survey of attitudes to memory, only interview studies (n = 18–40).

---

## Q3. Export and import of memory across platforms (dated) and emerging standards

### Takeaway
As of November 2026, portability exists only as a lossy, prompt-and-paste text transfer. There is no shared schema and no adopted standard. A plain-text, user-held profile is the only portable format that works everywhere today.

### Cited Findings
- [Fact] Claude import: Settings > Your Claude > "Start import". Claude gives a prompt to run in the other AI service, the user pastes the result, and Claude "will extract key information and store it as individual memory entries". It is available on Free, Pro, Max, Ultra, Team and Enterprise (web and Desktop). It is "experimental and still in active development", and Claude "may not always incorporate" imports. Memory "focuses on work-related topics". — [Claude Help Center: importing and exporting your memory](https://support.claude.com/en/articles/12123587-importing-and-exporting-your-memory) (article "Updated over 2 weeks ago" as of 2026-11-17)
- [Fact] Claude export: view through Manage, or ask Claude to "Write out your memories of me verbatim" and save the result locally. The suggested format is "[date saved, if available] - memory content", or Markdown. There is no structured file export. — [same](https://support.claude.com/en/articles/12123587-importing-and-exporting-your-memory)
- [Unverified] Google reportedly renamed "past chats" to "memory" in March 2026 and added import from other AI apps. The current Google help page I fetched did not mention import. — [search extract re Gemini Help](https://support.google.com/gemini/answer/16598469?hl=en); secondary claim that all three major assistants added prompt-based portability in March 2026 and that the result is "lossy" — [memx.app blog (vendor, secondary)](https://memx.app/blog/can-you-move-your-ai-memory-between-apps/)
- [Fact] Emerging standards are proposals only. MacPaw Research's "Portable Memory" (July 2026) is an open, vendor-neutral standard proposal with MIT reference implementations, open for community review and not adopted. — [MacPaw Research: Portable Memory](https://research.macpaw.com/publications/portable-memory). Other proposals (".aim" file, JSON-LD plus Markdown) and a change.org petition show no adoption. — [liveinthefuture prior-art note](https://liveinthefuture.org/priorart/consumer-ai-memory-ownership-portability.html); [change.org](https://www.change.org/p/establish-universal-ai-memory-portability)
- [Fact] AGENTS.md is the only widely adopted cross-tool *project-context* convention found (over 60k projects, under the Linux Foundation's AAIF). It covers project instructions, not user memory. — [agents.md](https://agents.md/)

### Inferences
- [Inference] Platform memory is portable only as a natural-language summary, so the meaningful portable unit is text the user can read. This supports a user-owned markdown "NB profile" and "project brief", which is in effect what the vendors' own import flows consume.
- [Hypothesis] Vendors are converging on prompt-based import because each wants switching *into* its platform to be easy. Structured two-way export is unlikely to become standard within 12 months.

### Gaps
- I did not confirm whether a structured ChatGPT memory export exists. The ChatGPT data export includes conversations, but this could not be checked here (403).
- The Gemini memory import was not confirmed on an official page.

---

## Q4. A minimal memory lifecycle (create → use → review → expire/delete) with risk-based confirmation

### Takeaway
The minimal lifecycle is two-tier. Task Context lives only in the session and is automatic. Anything that persists (preferences, guidance level, capability evidence, project conventions) is *proposed* by NB at the end of a session, *confirmed* by the user, written to a user-held text artifact or the platform's native project file, shown again at the start of the next session, and expires or gets re-confirmed after a fixed period of non-use. This applies B5's risk tiers directly and contradicts the platform default, where 96% of memories are created unprompted.

### Cited Findings (evidence the design rests on)
- [Finding] Unilateral memory creation is the norm on ChatGPT (96%), and users react to it with negative expectancy violations. — [Dash et al. 2026](https://arxiv.org/abs/2602.01450v2); [Chen et al., CHI 2026](https://grady.uga.edu/research/ai-never-forgets-exploring-users-perceptions-of-ai-memory-and-chatgpts-memory-feature/)
- [Finding] Proactive privacy control was the most common user need in the 40-person study. — [arXiv 2410.14931](https://arxiv.org/html/2410.14931v1)
- [Finding] Staleness, meaning difficulty choosing between old and new memories, is a common failure in memory systems (secondary). — [Scholarly Kitchen summary](https://scholarlykitchen.sspnet.org/2026/09/02/when-your-ai-knows-you-too-well-personalization-sycophancy-and-the-risk-of-an-intellectual-echo-chamber-in-ai-assisted-research/)
- [Fact] Native platforms already supply the session-level "do not remember" switch (Claude incognito, ChatGPT Temporary Chat) and pause and reset. — [Claude Help Center](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context); [OpenAI Memory FAQ (via search extract)](https://help.openai.com/en/articles/8590148-memory-faq)
- [Fact] Claude Code distinguishes memory the user writes (CLAUDE.md) from memory the AI writes (auto memory, capped at 200 lines or 25KB per load). This is a precedent for keeping user-authored and AI-proposed memory separate. — [Claude Code docs](https://code.claude.com/docs/en/memory.md)

### Proposed lifecycle ([Recommendation])
| Stage | What | Trigger | Confirmation (B5 tier) |
|---|---|---|---|
| Create — Task Context | Current objective, decisions, open issues, assumptions | Automatic during a session (a running "decision log" in the chat) | Auto (low-risk, reversible, session-scoped) |
| Create — Project Memory | Objectives, constraints, conventions, acceptance criteria | End of a framing or workflow step: NB drafts a "Project Brief" block | *Proposed*: user accepts or edits. Stored in the platform's native project location (Claude Project instructions or knowledge, CLAUDE.md/AGENTS.md, ChatGPT Project) or a file the user saves |
| Create — User Memory: preferences | Guidance, challenge and autonomy level; explanation depth; format preferences | The user states a preference, or the user corrects NB on the same thing twice | *Confirmed* ("Remember this for future work? [yes / just this time]") |
| Create — User Memory: inferred capabilities | For example "independently writes acceptance criteria" | Only from observed evidence across ≥2 tasks; always phrased with the evidence and the date | *Confirmed*. Shown as "NB thinks… because… (task, date)". Never inferred from a single session, and never written from resource content |
| Use | Load the profile and project brief at session start | Session start | Auto, but *visible*: NB states the 3–5 assumptions it is using in one line ("Using: light guidance, project X brief v2, …") |
| Review | "What I assume about you" view | (a) at the start of each new project, (b) when an entry is about to expire, (c) on user request, (d) when NB's guidance is contradicted by user behavior | User edits or deletes; NB proposes changes |
| Expire | Entries carry a "last confirmed" date. Capability entries expire after N weeks unused (the number is a parameter to test, not evidence-based); Task Context ends with the session | Time or non-use; project closed | Auto-expire to "needs re-confirmation" state, not silent use |
| Delete | Per entry, per project, or everything | User request; project or client ends | Immediate. Because the store is user-held text, deletion is verifiable by the user |
| Never stored | Session content from untrusted resources (README, web pages, issues), sensitive categories, third-party personal data | — | Blocked by design |

### Inferences
- [Inference] T2 (tension) resolution: most of the thesis can be tested *without* persistent memory. Within a single session, NB can frame the problem, adapt guidance from in-session signals, and evaluate the result. Across 2–4 sessions, a user-pasted profile plus a project brief is enough to test whether carry-over adaptation adds value. Custom persistent memory is only needed if the experiment shows that users will not carry or paste the artifact and that the lost adaptation measurably hurts outcomes.
- [Inference] "Low-risk auto" should be limited to session state. Any change that will influence future sessions counts as persistent under B5 and needs confirmation.

### Gaps
- No empirical evidence on the right expiry interval or on how much confirmation is too much (confirmation fatigue). Both need testing in the K1 experiment.

---

## Q5. User-control patterns with least configuration, and regulatory considerations

### Takeaway
The pattern with the best evidence and the least configuration is an *inspectable learner model*: a short, plain-language "what I assume about you and this project" view with the evidence behind each line, editable in place, plus three one-tap dials (guidance, challenge, autonomy: more / same / less). This is open learner model (OLM) practice from intelligent tutoring. It also lowers GDPR profiling and transparency exposure, especially if NB keeps no server-side profile.

### Cited Findings
- [Finding] Users want "much more visibility, accessibility, transparency, and user control" over AI memory. — [Chen et al., CHI 2026](https://grady.uga.edu/research/ai-never-forgets-exploring-users-perceptions-of-ai-memory-and-chatgpts-memory-feature/)
- [Fact] Native "what's remembered" views already exist. Claude lists editable memory topics. ChatGPT offers a memory summary that it says is incomplete, and suggests asking ChatGPT directly. Gemini suggests asking "Did you use any info from past chats?". — [Claude Help](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context); [OpenAI Memory FAQ (via search extract)](https://help.openai.com/en/articles/8590148-memory-faq); [Gemini Help](https://support.google.com/gemini/answer/16598469?hl=en)
- [Finding] Dash et al. propose "Attribution Shield", which flags sensitive memory inferences and suggests query reformulations. This is a precedent for surfacing inferences before they are stored. — [arXiv 2602.01450](https://arxiv.org/abs/2602.01450v2)
- [Fact, from prior literature, not re-fetched in this session] Open learner models make a learner model visible to the learner, and sometimes editable or negotiable, to support reflection, trust and correction. Bull & Kay's SMILI framework classifies OLM interfaces. — Bull, S. & Kay, J. (2016), "SMILI☺: a Framework for Interfaces to Learning Data in Open Learner Models", *IJAIED* 26 — [doi:10.1007/s40593-015-0090-8](https://doi.org/10.1007/s40593-015-0090-8) (citation from prior knowledge; verify before final use)
- [Fact] GDPR Art. 22: "The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her." — [GDPR Art. 22 (gdpr-info.eu)](https://gdpr-info.eu/art-22-gdpr/)
- [Fact] EU AI Act Art. 50(1): "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural…" persons are informed they are interacting with an AI system. Art. 50 transparency obligations apply from 2 August 2026 under the Act's staged timeline. — [AI Act Art. 50 (artificialintelligenceact.eu)](https://artificialintelligenceact.eu/article/50/). The application date is from prior knowledge of the Act's timeline; any 2025–26 "digital omnibus" changes to dates were not checked in this session.

### Proposed control model ([Recommendation])
1. **One "Assumptions" card** (≤7 lines), shown at session start and available on request ("show what you assume"). Each line has a value, its source (stated by the user / observed on task X on date Y) and an edit/delete action. It covers User and Project layers and doubles as the export format.
2. **Three dials, set in chat, no settings page**: "more/less guidance", "more/less challenge", "more/less autonomy". In-session changes apply immediately (auto). Making a change the default for future sessions requires confirmation.
3. **"Just this time" as the default** for any persistence prompt. The user opts in to remembering.
4. **Delegate the native switches** (incognito, Temporary Chat, pause/reset) and tell users how to use them, rather than rebuilding them.
5. **Isolation by default**: one project brief per project or client, never merged. Recommend that users turn off "Use account memory" for client projects on Claude.
6. **Evaluation without the profile**: when NB judges outcome or framing quality, it runs without the user profile, to limit memory-induced sycophancy.

### Regulatory notes ([Inference], not legal advice)
- [Inference] Inferring "capability levels" and adapting guidance is profiling under GDPR (Art. 4(4)). It is unlikely to have "legal or similarly significant effects" for individual self-use, so Art. 22 probably does not bite. In B2B or enterprise enablement, where capability data could feed performance evaluation, it could, and that would need an explicit decision. A user-held, user-confirmed profile with no NB server storage minimizes controller obligations.
- [Inference] AI Act Art. 50 transparency is straightforward because the user knowingly uses an AI tool. NB is unlikely to be high-risk, unless it is used in education or employment contexts listed in Annex III (e.g. evaluating learning outcomes in vocational training, or worker monitoring and evaluation). That is a real consideration for an enterprise "AI capability" product.

### Gaps
- No HCI study was found that tests "more/less guidance" dials specifically for LLM coaching. Evidence comes by analogy from OLM and tutoring research (see WS4).
- Legal analysis is brief and not jurisdiction-specific outside the EU.

---

## Q6. Does v1 need custom persistent memory? Recommendation for K1 vs K2

### Takeaway
No. v1 should not build custom persistent memory. The one proven native limitation is that NB cannot inspect, carry or control platform memory. A user-owned markdown "NB Profile + Project Brief", produced and refreshed by NB and loaded into each platform's native project or instruction slot, addresses it. Add hosted or structured memory only if K2 experiments show that users fail to carry the artifact *and* that lost continuity measurably degrades outcomes.

### Cited Findings (decisive evidence)
- [Fact] Native project-scoped memory, incognito, pause/reset and editable memory already exist on Claude, and similar controls exist on ChatGPT and Gemini. — [Claude Help](https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context); [Gemini Help](https://support.google.com/gemini/answer/16598469?hl=en)
- [Fact] Cross-platform transfer is only prompt-and-paste text, and no standard exists. — [Claude import/export](https://support.claude.com/en/articles/12123587-importing-and-exporting-your-memory); [MacPaw proposal](https://research.macpaw.com/publications/portable-memory)
- [Finding] External memory frameworks amplify sycophancy (2–4x on science questions). — [Bensal et al.](https://iclr.cc/virtual/2026/10016383). Memory profiles give the largest increases in agreement sycophancy. — [Jain et al.](https://arxiv.org/abs/2509.12517)
- [Fact] Injection into memory is a documented attack on ChatGPT (2024) and Gemini (2025). — [Schneier](https://www.schneier.com/blog/archives/2024/10/hacking-chatgpt-by-planting-false-memories-into-its-data.html); [Ars via TagTeam](https://tagteam.harvard.edu/hub_feeds/3415/feed_items/13201900)

### Recommendations
- **[Recommendation] K1 (1 person, ≤4 weeks): no persistent store at all.**
  - Task Context: in-session only (a running decision log plus an end-of-session summary).
  - Project Memory: NB outputs a copy-ready "Project Brief" (objective, constraints, acceptance criteria, decisions), which the user pastes into a Claude or ChatGPT Project, CLAUDE.md or AGENTS.md.
  - User Memory: a ≤15-line "NB Profile" markdown block (guidance, challenge and autonomy settings, stated preferences, ≤3 confirmed capability observations with dates) that the user keeps and pastes at the next session.
  - Measure: whether users actually carry the artifacts (reuse rate), how often they correct them, whether session 2 starts faster or better than baseline, and confirmation fatigue.
  - Do not use native memory as NB's state store. Tell users that NB works the same with memory off.
- **[Recommendation] K2 (1–2 people, 1–3 months): add memory only behind a gate.**
  - Gate: in K1/K2 testing, ≥X% of users fail to carry the artifact *and* sessions without it show worse framing or outcome evidence. X is set before the experiment, not derived from evidence here.
  - If the gate passes, the smallest step is NB-generated profile and brief files that persist *within the platform's native project or instruction files* (e.g. a Claude Project knowledge file, a repo `AGENTS.md`/`CLAUDE.local.md` section, a ChatGPT Project file), still user-visible and user-edited.
  - Only after that, consider a minimal MCP-exposed, user-scoped document store (the reference MCP memory server shows the shape) with confirm-before-write, provenance and date on every entry, per-project namespaces, expiry, and no writes triggered by resource content. Do not adopt mem0, Letta or Zep-style automatic extraction for user modeling, given the sycophancy and staleness evidence.
  - Add an evaluation check: compare NB's evaluation verdicts with and without the profile loaded (a sycophancy probe).
- **[Recommendation] Not to build in either scenario:** vector or graph memory, automatic capability inference without confirmation, cross-project memory merging, server-side profiles of employees (for B2B), or memory written from repo or URL content.

### Inferences
- [Inference] This keeps B6 ("prefer native, custom only on proven limitation") intact. The limitation is proven in kind (opacity and non-portability), but its *severity* for users is unproven, which is why K1 uses the zero-infrastructure artifact.
- [Inference] Risk to the thesis: if users will not paste or maintain a profile, "Adaptive" across sessions may depend on platform memory that NB cannot control. This would push NB toward a single-platform integration (T3), for example a Claude Project or Skill with its native memory. WS6 should treat this as a measurable kill or pivot signal for the cross-platform claim.

### Gaps
- No data on whether knowledge workers will maintain a carried profile file. This is the key unknown for the K1 experiment.
- Cost figures for hosting external memory were not gathered, because the recommendation does not depend on them.

---

### Source list (with dates as accessed 2026-11-17)
- Claude Help Center — chat search & memory (11817273): https://support.claude.com/en/articles/11817273-using-claude-s-chat-search-and-memory-to-build-on-previous-context (fetched; mentions the 2026-10-31 org default change)
- Claude Help Center — importing & exporting memory (12123587): https://support.claude.com/en/articles/12123587-importing-and-exporting-your-memory ("updated over 2 weeks ago")
- Claude Code docs — memory: https://code.claude.com/docs/en/memory.md (fetched)
- OpenAI Help Center — Memory FAQ (8590148): https://help.openai.com/en/articles/8590148-memory-faq (403; search extract only)
- OpenAI — Memory and new controls: https://openai.com/index/memory-and-new-controls-for-chatgpt/ (403; not read)
- Google Gemini Help — memory of past chats: https://support.google.com/gemini/answer/16598469 (fetched); Saved info: https://support.google.com/gemini/answer/16413516
- agents.md: https://agents.md/ (fetched)
- MCP reference memory server README (main): https://raw.githubusercontent.com/modelcontextprotocol/servers/main/src/memory/README.md
- mem0 README (main): https://raw.githubusercontent.com/mem0ai/mem0/main/README.md
- Jain et al., arXiv 2509.12517 v3 (2026-02-03), CHI 2026: https://arxiv.org/abs/2509.12517
- Bensal et al., ICLR 2026 workshop poster: https://iclr.cc/virtual/2026/10016383
- Dash et al., arXiv 2602.01450 (v3 2026-02-23), WWW 2026: https://arxiv.org/abs/2602.01450v2
- Chen et al., "AI Never Forgets", CHI 2026: https://grady.uga.edu/research/ai-never-forgets-exploring-users-perceptions-of-ai-memory-and-chatgpts-memory-feature/
- Zhang et al., arXiv 2508.07664 (Aug 2025): https://arxiv.org/abs/2508.07664v1
- "Ghost of the past", arXiv 2410.14931 (Oct 2024): https://arxiv.org/html/2410.14931v1
- Schneier on Rehberger ChatGPT memory (Oct 2024): https://www.schneier.com/blog/archives/2024/10/hacking-chatgpt-by-planting-false-memories-into-its-data.html
- TechSpot on SpAIware: https://www.techspot.com/news/104881-chatgpt-vulnerability-allows-hackers-record-sessions-indefinitely.html
- Ars Technica (via TagTeam) on Gemini memory injection (Feb 2025): https://tagteam.harvard.edu/hub_feeds/3415/feed_items/13201900
- MacPaw Research — Portable Memory proposal (Jul 2026): https://research.macpaw.com/publications/portable-memory
- Scholarly Kitchen (2026-09-02), secondary summary: https://scholarlykitchen.sspnet.org/2026/09/02/when-your-ai-knows-you-too-well-personalization-sycophancy-and-the-risk-of-an-intellectual-echo-chamber-in-ai-assisted-research/
- GDPR Art. 22: https://gdpr-info.eu/art-22-gdpr/ ; EU AI Act Art. 50: https://artificialintelligenceact.eu/article/50/
- Bull & Kay 2016 SMILI OLM framework: https://doi.org/10.1007/s40593-015-0090-8 (from prior knowledge; not re-fetched)
