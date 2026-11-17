# WS6: Demand Evidence and Validation Strategy for "No Babysitting" (Adaptive Problem-to-Outcome Collaboration Layer)

Research date: 2026-11-17. Scope: demand signals by segment (S1 developers, S2 semi-technical knowledge workers, S3 non-technical knowledge workers), business-model implications, minimal validation design for K1 (1 person, ≤4 weeks, ≤10 users) and K2 (1–2 people, 1–3 months), kill/pivot criteria. Tags: [Fact] = stated by a primary source; [Finding] = result of a study or survey; [Inference] = my reasoning from cited material; [Hypothesis] = untested proposition; [Recommendation] = proposed action.

Source-quality note: several figures below come from secondary coverage, not the primary PDF. Each one is flagged "secondary". A few items come from my prior knowledge of well-known studies and are flagged "(prior knowledge, verify)". I did not re-fetch those in this session.

---

## Q1. Demand evidence: do knowledge workers want to improve AI collaboration skills, or only want results? (by segment; who pays)

### Takeaway
The evidence points to demand for **outcomes and for removing verification/supervision pain**, not for "getting better at collaborating with AI" as a goal in itself. The demand for *skill-building* is real, but it is mostly an **organisational/enterprise** demand: companies buy it, through L&D / AI-enablement budgets. Individuals rarely buy it, and Microsoft's 2026 data says organisational factors explain about twice as much of AI impact as individual behaviour. S1 shows the sharpest, most specific pain ("almost right" output, review burden, "babysitting" agents). That pain is already a crowded vendor theme. S2 has the best mix of ambiguous problems and measurable deliverables, but the evidence for it is thinner. For S3 the evidence suggests low use, not unmet demand.

### Cited Findings

**Adoption and the skills gap (cross-segment)**
- [Finding] BCG "AI at Work 2025: Momentum Builds, But Gaps Remain" (June 2025; >10,600 workers, 11 countries). Frontline regular GenAI use has stalled at 51% (52% the year before). Leaders and managers are above 75%. Only ~36% of employees feel adequately trained. 18% of regular AI users received no training at all — [BCG](https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain); figures via secondary coverage [Unleash](https://www.unleash.ai/artificial-intelligence/bcgs-ai-at-work-2025-report-four-takeaways-for-hr-leaders/), [IDM](https://idm.net.au/node/15229)
- [Finding] In the same BCG survey, people with >5 hours of training were 79% regular users, versus 67% for those with <5 hours. Access to in-person training and **a coach** is associated with higher regular use. This is correlational and could reflect selection — [BCG](https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain) (secondary: [Unleash](https://www.unleash.ai/artificial-intelligence/bcgs-ai-at-work-2025-report-four-takeaways-for-hr-leaders/))
- [Finding] Microsoft Work Trend Index 2026 (published 2026-05-05; 20,000 full-time knowledge workers **who already use AI at work**, 10 markets; Edelman DXI, fielded Feb–Apr 2026; plus 105k Copilot Chat telemetry samples):
  - 66% say AI lets them spend more time on high-value work; 58% produce work they couldn't a year ago (80% among "Frontier Professionals", 16% of users).
  - The top "human skills" named are **quality control of AI output (50%)** and **critical thinking (46%)**.
  - 86% treat AI output as a starting point.
  - Frontier vs. non-Frontier: 53% vs. 33% "pause to decide what AI vs. humans should do"; 43% vs. 30% deliberately do some work without AI to keep their skills sharp.
  - **Organisational factors account for 67% of associated AI impact vs. 32% for individual mindset/behaviour** (associations, not causal). Only 26% say leadership is aligned on AI.

  — [Microsoft WTI 2026](https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization)
- [Finding] Microsoft WTI 2025 (April 2025; 31,000 workers, 31 markets, plus LinkedIn and M365 telemetry). Upskilling was leaders' top priority for the next 12–18 months (47%), slightly ahead of expanding capacity with AI (45%) — [Microsoft WTI 2025](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born). Secondary write-ups report "82% of leaders say AI skills are essential, 60% of employees say they lack them" — [Daily Guardian](https://dailyguardian.com.ph/?p=396610). **Unverified** against the primary report.
- [Finding] (prior knowledge, verify) Microsoft/LinkedIn WTI 2024 (May 2024; 31,000 people, 31 countries): 75% of knowledge workers used GenAI at work, 78% of users brought their own AI tools (BYOAI), and only 39% of users had received AI training from their company — [Microsoft WTI 2024](https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part)
- [Finding] Pew (survey 7–13 Oct 2024, published 2025-02-25; 5,273 employed US adults):
  - 63% of US workers don't use AI much or at all in their job, and ~55% rarely or never use chatbots at work.
  - Among users, the top uses are research (57%), editing (52%) and drafting (47%).
  - Among regular users, 54% found chatbots highly helpful for speed and only 41% for quality.
  - Half say their employer neither encourages nor discourages chatbot use.

  — [Pew Research](https://www.pewresearch.org/social-trends/2025/02/25/workers-experience-with-ai-chatbots-in-their-jobs/)
- [Finding] A later Pew data point (Sept 2025): 21% of workers say at least some of their work involves AI, up from 16% — [Pew via search summary](https://www.pewresearch.org/social-trends/2025/02/25/u-s-workers-are-more-worried-than-hopeful-about-future-ai-use-in-the-workplace/). **Unverified** (the figure was not on the fetched page).

**What people actually do with ChatGPT/Claude (results vs. learning)**
- [Finding] OpenAI/NBER "How People Use ChatGPT" (NBER WP 34255, Sept 2025; 1.5M conversations, consumer plans only):
  - The split is 49% "Asking", 40% "Doing" and 11% "Expressing".
  - OpenAI says "Asking" is growing and more highly rated (an advisor/decision-support use).
  - About 30% of consumer usage is work-related.
  - Writing is the most common work task; coding is relatively niche on consumer ChatGPT.

  — [OpenAI](https://openai.com/index/how-people-are-using-chatgpt/)
- [Finding] Anthropic Economic Index, "Economic Primitives" (2026-01-15; data from 13–20 Nov 2025):
  - On Claude.ai, augmentation was 52% and automation 45%.
  - "Directive" (hand-off) conversations went 27% (Jan 2025) → 39% (Aug 2025) → 32% (Nov 2025). The Nov rise in augmentation was **driven mainly by task iteration rather than learning**.
  - On the 1P API, 64% of conversations are directive and ~¾ are automation.
  - Claude.ai traffic is 46% work.
  - The education level of users' prompts correlates r≈0.925 with the education level of Claude's responses: **output sophistication tracks input sophistication**.
  - On the API, success falls from ~60% (sub-hour tasks) to ~45% (5+ hour tasks).

  — [Anthropic Economic Index Jan 2026](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)
- [Finding] Anthropic Economic Index, 5th report (2026-03-24, Feb 2026 data): augmentation was 53% of Claude.ai conversations — [AI News summary](https://www.artificialintelligence-news.com/news/anthropic-report-economic-index-summary-key-points-2026/). Secondary outlets report that experienced Claude users succeed more often and that the gap widens over time — [The Decoder](https://the-decoder.com/anthropics-new-data-shows-ai-skill-builds-over-time-and-that-could-widen-the-inequality-gap/); [PPC Land ("~10% more")](https://ppc.land/experienced-claude-users-succeed-10-more-and-the-gap-is-widening/). Another summary puts the experience effect at ~4 percentage points. **The sources conflict on the size, and I did not verify it against Anthropic's primary page.**

**S1, developers: the "babysitting"/verification pain is explicit and measured**
- [Finding] Stack Overflow Developer Survey 2025 (released 2025-07-29):
  - **66%** name "AI solutions that are almost right, but not quite" as their top frustration.
  - 45% say debugging AI-generated code takes more time.
  - Only ~3% "highly trust" AI output.
  - Trust in accuracy fell. Sources disagree on the exact figure: 29% per [Stack Overflow blog](https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/) vs. 33% (down from 43%) per [VentureBeat](https://venturebeat.com/ai/stack-overflow-data-reveals-the-hidden-productivity-tax-of-almost-right-ai-code). InfoWorld reports 46% actively distrust accuracy — [InfoWorld](https://www.infoworld.com/article/4031673/).
- [Finding] METR RCT (July 2025; arXiv 2507.09089): 16 experienced OSS developers worked on 246 tasks in repos they knew well (~5 years average experience), with tasks randomised to AI-allowed or AI-disallowed. **With AI they were 19% slower.** They predicted a 24% speed-up beforehand and still believed in a 20% speed-up afterwards. The authors warn against generalising beyond this setting — [arXiv](https://arxiv.org/pdf/2507.09089); [InfoWorld](https://www.infoworld.com/article/4020931/ai-coding-tools-can-slow-down-seasoned-developers-by-19.html)
- [Finding] A CMU analysis of practitioner discourse (including 1,837 Reddit threads on code review) reports that agents now generate code faster than humans can review it, which makes review the delivery bottleneck — [alphaXiv 2607.07980](https://www.alphaxiv.org/abs/2607.07980.md)
- [Finding] "Stop babysitting your agents" is already a **vendor marketing frame** and a common blog genre. Examples:
  - [Unblocked](https://getunblocked.com/blog/stop-babysitting-your-agents) says babysitting persists because output isn't mergeable without context.
  - [WorkOS "agents babysitting agents"](https://workos.com/blog/agents-babysitting-agents).
  - [Substack: "How I stopped babysitting Claude Code"](https://xr0am.substack.com/p/how-i-stopped-babysitting-claude) uses hooks and AI self-review.
  - [Product Hunt discussion](https://www.producthunt.com/p/pushary/do-you-actually-let-your-ai-agents-run-unattended-or-do-you-babysit-every-step).
  - HN: [Ask HN: Do you have any evidence that agentic coding works?](https://hn.svelte.dev/item/46691243).

**S2/S3, semi- and non-technical knowledge workers: evidence from experiments**
- [Finding] Dell'Acqua et al. / P&G "Cybernetic Teammate" (NBER WP 33641, 2025; pre-registered field RCT, 776 professionals):
  - Individuals with AI matched teams without AI (+0.37 SD vs. the baseline).
  - AI-enabled groups saved 12–16% of time, and the R&D/commercial expertise silos blurred.
  - Less experienced staff with AI performed comparably to teams that included experienced members.
  - Models used: GPT-4/4o.

  — [NBER w33641](https://www.nber.org/system/files/working_papers/w33641/w33641.pdf); [One Useful Thing](https://www.oneusefulthing.org/p/the-cybernetic-teammate)
- [Finding] (prior knowledge, verify) Dell'Acqua et al. "Navigating the Jagged Technological Frontier" (HBS WP 24-013, Sept 2023; 758 BCG consultants):
  - For tasks inside the AI frontier, consultants with AI completed more tasks, faster, at higher quality.
  - For a task outside the frontier, they were ~19 percentage points less likely to be correct.
  - A "GPT + prompt-engineering overview" arm did somewhat better than GPT-only on in-frontier tasks.

  This is the closest RCT evidence that (a) *knowing where AI is weak* matters (Capability Blindness / Evaluation Gap), and (b) light training adds a modest increment — [HBS](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700)
- [Finding] A writer who hears from many students and readers says they often "just don't know what to use these systems for", and notes that many people may genuinely lack use cases — [Sean Trott](https://seantrott.substack.com/p/how-i-use-and-dont-use-chatgpt). This is anecdotal. I found **no** high-quality Reddit thread quote for S2/S3 framing pain within the budget (see Gaps).

**Who pays, for what (the AI-enablement / training market)**
- [Fact] Section (sectionai.com) sells enterprise "AI proficiency" programmes:
  - What it sells: certification, a "ProfAI" coaching platform, usage dashboards, AI workforce benchmarking, customised coaching and forward-deployed consultants.
  - It claims 70%+ completion and NPS 68.

  — [Section](https://www.sectionai.com/sandbox/home-page); [Greg Shove on ProfAI](https://www.sectionai.com/blog/ai-in-2025). Third-party pages cite ~$750/seat for teams under 100 — [hackceleration](https://hackceleration.com/training/best/ai-for-business). **Unverified**; Section does not publish enterprise prices.
- [Fact] There is recent seed funding for **enterprise AI-adoption / fluency** startups, all B2B:
  - Scholé AI raised $3M (Jan 2026; adaptive, role-based AI training; pilots with Swisscom, Decathlon, Coop) — [Training Industry](https://trainingindustry.com/press-release/artificial-intelligence/schole-ai-raises-3m-to-transform-workforce-learning-in-the-age-of-ai/).
  - Certifyde raised $2M (Apr 2026; AI fluency credentials; self-reported 40–70% productivity gains, unverified) — [Pulse2](https://pulse2.com/certifyde-closes-2-million-seed-round-to-scale-ai-adoption-platform-for-enterprise-and-government/).
  - Expertise AI raised CA$3.2M (Sept 2026; AI fluency plus agent deployment for traditional industries) — [Cantech Letter](https://www.cantechletter.com/newswires/expertise-ai-raises-ca3-2-million-to-close-the-ai-adoption-gap-in-traditional-industries/).
  - Multiverse reportedly raised $70M at $2.1B for AI upskilling. Date not confirmed — [Enterprise DNA](https://enterprisedna.co/resources/news/multiverse-70m-ai-upskilling-workforce-2026).
- [Finding] A consumer prompt-optimisation tool failed: PromptPerfect (Jina AI) is reported to be shutting down. One account says new signups close June 2026 and the service goes offline 2026-09-01, after Elastic acquired Jina (Oct 2025). Another claims it went quiet in May 2025. There is no official postmortem, and the main sources are competitor blogs — [promptbuilder.cc](https://promptbuilder.cc/blog/promptperfect-shutting-down-alternatives-2026); [DEV](https://dev.to/lukefryer4/promptperfect-is-dead-i-compared-every-alternative-so-you-dont-have-to-38o8). **The dates conflict.**

### Inferences
- [Inference] "Users want results, not better collaboration skills" (counter-thesis b) is **largely supported for individuals**:
  - Usage is dominated by Asking/Doing for practical outcomes ([OpenAI](https://openai.com/index/how-people-are-using-chatgpt/)).
  - The Nov-2025 augmentation rise was iteration, not learning ([Anthropic](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)).
  - No source found shows individuals paying for "AI collaboration coaching".
  - Skill-building demand shows up as an **employer** purchase (BCG, Section, Scholé, Certifyde, Multiverse).

  Implication: NB should sell and measure **outcomes**, with capability growth as a side effect ("learning by doing"). Positioning it as coaching is the wrong lead.
- [Inference] There is indirect evidence that *collaboration skill matters to outcomes*:
  - Output sophistication tracks input sophistication (r≈0.93).
  - Success drops on longer tasks.
  - Experienced users reportedly succeed more (size disputed).
  - Frontier users are more likely to deliberately split AI and human work.
  - Inside vs. outside the "jagged frontier" changes correctness.

  This supports the *mechanism* behind the Problem-Framing, Capability-Blindness and Evaluation gaps. It does **not** show that a third-party layer can deliver that skill better than native platforms or training.
- [Inference] Microsoft's "67% organisational vs 32% individual" association weakens a pure individual-tool thesis. If impact is mostly organisational (manager modelling, quality standards, permission to experiment), an individual coaching layer attacks the smaller lever. A B2B "team workflow + quality-standard" angle may fit the evidence better.
- [Inference] Segment pain ranking from the evidence:
  - **S1** has the most specific and best-measured pain: "almost right" output (66%), review bottleneck, METR's perception gap. But "stop babysitting" is already a crowded vendor message (WS1 overlap). Its pain is execution/verification more than problem framing.
  - **S2** is the best match for *ambiguous problem → verifiable deliverable*. "Asking" is the growing, higher-rated category, and the P&G/BCG RCTs (consultants, product/commercial staff) show large effects and the frontier risk. Direct community evidence is thin.
  - **S3** has the lowest usage (Pew: 63% use little or none; BCG frontline plateau at 51%). The binding constraint looks like awareness/permission/use-case discovery, which employers address through L&D. **Low competition in S3 is more likely a weak-demand signal than a gap** (supported by Pew and BCG plateau data; [Hypothesis] it still needs testing).
- [Inference] METR's perception gap (believed +20% faster, measured −19%) means **self-reported productivity is not valid evidence** for NB's value. Validation must measure time and quality objectively.

### Gaps
- No primary source found that asks users directly "do you want to get better at working with AI, or just get the result?". The closest proxies are training-satisfaction/adequacy figures (BCG 36%) and leader–employee skill gaps (secondary only). This could be resolved cheaply by adding that question to K1 screening interviews.
- I could not retrieve verbatim, linkable Reddit quotes from r/ChatGPT, r/ClaudeAI or r/ExperiencedDevs on framing/"don't know what AI can do" within the tool budget. Search engines surfaced blogs and secondary coverage instead. The report writer should not cite specific Reddit quotes from these notes.
- No individual (B2C) willingness-to-pay data for AI-collaboration coaching was found. No credible postmortem was found for an AI-coaching startup (PromptPerfect has no official postmortem).
- The size of the Anthropic "experience/learning-curve" effect is unverified (10% vs. ~4pp in secondary sources).
- Primary verification is still needed for the WTI 2025 "82%/60%" figures, the WTI 2024 "39% trained" figure, the HBS jagged-frontier numbers and Section pricing.
- Enterprise AI-training market size: no credible primary figure was collected; I did not invent one.

---

## Q2. Business-model implications (free / freemium / B2B / enterprise AI enablement)

### Takeaway
The only clearly evidenced payer for "helping people work better with AI" is the **enterprise** (L&D / AI-enablement / transformation budgets), buying seats, certification, dashboards and coaching (Section, Scholé, Certifyde, Multiverse). Consumer prompt-improvement tools have weak survival evidence (PromptPerfect), and native platforms keep adding guidance features for free. A free or open methodology (Skill/instructions) works for **distribution and validation**, not revenue. If NB targets a paid model, the validation has to measure what an enterprise buyer pays for: outcome quality, time, adoption/reuse and a credible measurement of capability.

### Cited Findings
- [Fact] Enterprise AI-proficiency vendors sell bundles of curriculum, coaching (including AI coaching, e.g. "ProfAI"), dashboards/benchmarking and consultants. Prices are custom-quoted; third-party pages cite ~$750/seat (unverified) — [Section](https://www.sectionai.com/sandbox/home-page); [hackceleration](https://hackceleration.com/training/best/ai-for-business)
- [Fact] 2026 seed rounds in this space are B2B, and several sell "adaptive"/"role-based" personalised AI training, which is close to NB's "adaptive coaching" language — [Scholé AI](https://trainingindustry.com/press-release/artificial-intelligence/schole-ai-raises-3m-to-transform-workforce-learning-in-the-age-of-ai/); [Certifyde](https://pulse2.com/certifyde-closes-2-million-seed-round-to-scale-ai-adoption-platform-for-enterprise-and-government/); [Expertise AI](https://www.cantechletter.com/newswires/expertise-ai-raises-ca3-2-million-to-close-the-ai-adoption-gap-in-traditional-industries/)
- [Finding] Usage in enterprises correlates with training hours and coach access (BCG 2025), which is the commercial argument enablement vendors use — [BCG](https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain)
- [Finding] Organisational factors (manager modelling, quality standards, experimentation support) are associated with 67% of AI impact. Manager modelling is associated with a +17pt lift in reported AI value and +30pt in trust in agentic AI — [Microsoft WTI 2026](https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization)
- [Finding] A consumer prompt-optimisation product (PromptPerfect) is reportedly shutting down after an acquisition, with no public postmortem — [promptbuilder.cc](https://promptbuilder.cc/blog/promptperfect-shutting-down-alternatives-2026)

### Inferences
- [Inference] How each model changes the recommendation:
  - **Free / open (methodology as a Skill/instructions):** maximum reach and cheapest to validate. Revenue is ~0, and it is easy for platforms or forks to absorb. Success metric: voluntary reuse and organic sharing. Best for S1 (communities, plugin/skill marketplaces).
  - **Freemium individual:** needs a felt per-task payoff, because there is no evidence individuals pay for coaching. It competes with the $20/month native plans the user already pays for. Weakest evidence base. Only viable if NB demonstrably saves time on high-value deliverables (S2 consultants/PMs/analysts with billable or visible outputs).
  - **B2B team:** the buyer is a team lead or practice lead (e.g. a consulting practice, product org). The value story is "standardised problem-framing + verification workflow → fewer reworked deliverables". It fits the WTI finding that org-level norms (quality standards, manager modelling) drive impact.
  - **Enterprise AI enablement:** the largest evidenced budget, but crowded (Section, Multiverse, Scholé, Certifyde, plus consultancies and the platforms' own enterprise enablement teams). It requires dashboards and proof of capability gains, procurement and security review. That is not feasible for K1 and only partly feasible for K2.
- [Inference] The B2B/enterprise framing changes the **validation unit**. Beyond "did this user get a better deliverable", the evidence also needs to show "would a manager pay to roll this out across a team, and can we show it on a dashboard without a heavy evaluation system?". That pulls B4 (four evaluation dimensions) toward the buyer's metrics: rework, time, quality rating, reuse.
- [Recommendation] Treat the business model as an explicit assumption in validation:
  - Run K1 as free/concierge.
  - In K1 exit interviews, ask Mom-Test-style questions about current spend and who approves AI tools/training, rather than hypothetical "would you pay".
  - In K2, test one paid signal: a paid pilot with a team lead, or a pre-commitment.

### Gaps
- No verified per-seat price benchmarks (Section's figures are third-party). No WTP data for individual AI coaching. No data on enterprise renewal/retention for AI-fluency vendors (are these one-off training buys or recurring?).
- Not researched within budget: whether OpenAI/Anthropic enterprise plans bundle free enablement/academy content that would undercut paid enablement (WS2 may cover platform academies).

---

## Q3. Minimal, rigorous validation design (K1 and K2)

### Takeaway
[Recommendation] **K1:** a **Concierge / Wizard-of-Oz MVP** run on 6–10 S2 users (optionally with 2–3 S1 users as a contrast). Use a **within-subject, counterbalanced** comparison: each user does one real, ambiguous task with their normal ChatGPT/Claude use and one comparable task with NB guidance delivered by hand (the founder acting as the "layer"). Blind expert rating of the deliverables, objective time logging, and a check two weeks later for **voluntary unassisted reuse**. Do **not** build a URL-first prototype or a cross-platform test in K1.

**K2:** turn what worked in the concierge sessions into a **Portable Workflow Prototype** (a Skill / project instructions / kickoff prompt). Test it unassisted with ~15–30 users across 2–3 tasks each, with one cross-platform arm (Claude vs. ChatGPT) only if portability is a live hypothesis. Add URL-first only if K1 shows that S1/S2 tasks centre on repos. With n≤10, the experiment can only detect **large** effects, so it is a go/no-go signal test, not proof of an effect size.

### Cited Findings
- [Finding] Perceived productivity can have the opposite sign from measured productivity (METR: believed +20%, measured −19%). Time must therefore be measured with logs or timestamps, not self-report — [METR arXiv 2507.09089](https://arxiv.org/pdf/2507.09089)
- [Finding] METR used **within-developer randomisation at the task level** (each task randomly assigned AI-allowed or not, on real repo issues), with 16 participants and 246 tasks. This is the template for small-n, real-task designs: many tasks per person beats many people with one task each — [METR](https://arxiv.org/pdf/2507.09089)
- [Finding] Field RCTs with knowledge workers rated outputs with blinded expert graders on standard deviations of quality (P&G: +0.37 SD individual with AI). This supports blind expert rating as the outcome-quality metric — [NBER w33641](https://www.nber.org/system/files/working_papers/w33641/w33641.pdf)
- [Finding] (prior knowledge, verify) The jagged-frontier study shows **task selection** decides whether AI helps or harms (≈19pp worse outside the frontier). Task difficulty and type is therefore the main confounder and must be balanced across conditions — [HBS WP 24-013](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700)
- [Finding] Task success varies strongly with task length (Anthropic: ~60% → ~45% on the API from sub-hour to 5h+ tasks), which is another reason to match tasks on size — [Anthropic Economic Index Jan 2026](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)
- [Fact] (prior knowledge, verify) Methodology references:
  - Concierge MVP: manually delivering the service to early customers before automating it. Classic example: Food on the Table, in Ries, *The Lean Startup* (2011).
  - Wizard-of-Oz prototyping: a human simulates the system behind the interface. Kelley, "An iterative design methodology for user-friendly natural language office information applications", ACM TOIS 1984.
  - *The Mom Test* (Fitzpatrick, 2013): ask about past behaviour and current spend, not hypothetical future use.
  - JTBD "switch" interviews: reconstruct the timeline of a real past purchase or switch (Moesta / Christensen).

  — [Mom Test](https://www.momtestbook.com/); [Kelley 1984, ACM](https://dl.acm.org/doi/10.1145/357417.357420)

### Inferences / Recommendations

**Validation unit [Recommendation].** One real, somewhat ambiguous work task the participant actually needs done within the next two weeks. The participant supplies the task (this avoids artificial tasks and tests real demand). The session runs the chain ambiguous ask → framed problem statement → objective + acceptance criteria → chosen approach → workflow executed on the participant's own ChatGPT/Claude → deliverable that someone other than the participant can check. Every step leaves an artefact (framing note, criteria, transcript, deliverable), so evaluation can be done after the fact.

**Experiment options assessed**

| Option | What it proves | What it cannot prove | Cost | K1? | K2? |
|---|---|---|---|---|---|
| Concierge / Wizard-of-Oz (the founder is the "layer", user executes on their own platform) | Whether the *methodology* (framing, workflow design, verification) improves outcomes over baseline; which steps users value; the friction tolerated | Scalability; whether an *automated* layer can match a human coach (human-coach effect inflates results) | Low (founder time ~1–2 h/session) | **Yes: primary** | Keep as the control/comparison |
| Portable Workflow Prototype (Skill / Project instructions / kickoff prompt) | Whether the method survives **without a human**; voluntary reuse; native-platform fit | Hosted UX; deep adaptivity across sessions | Low–medium | Optional at the end, only if concierge succeeds (≤2 users) | **Yes: primary** |
| URL-first Prototype | Entry-point friction for repo/doc-centred users; context acquisition | Value of the method itself (confounded with UX) | Medium–high (hosting, security, injection handling) | **No** | Only if K1 tasks are repo-centred (S1/tech-lead) |
| Cross-platform validation (same method on Claude and ChatGPT) | Portability (B1, T3) | Demand | Medium | **No** | Optional arm, n small |

[Inference] Concierge comes first because it isolates the **thesis** (does the method help?) from **implementation/UX** (can we deliver it in software?). Starting with URL-first would mix thesis failure with entry-point failure.

**Design [Recommendation]**
- *Within-subject, counterbalanced (AB/BA).* Each participant brings two comparable real tasks. Assign NB vs. baseline by coin flip, so half do NB first. This controls for between-person skill variance, which dominates at small n.
- Baseline = the same person on a comparable task, "work as you normally would with ChatGPT/Claude", with no coaching.
- Optional K2 extension: add a third "best-practice handout" arm (static vendor prompting guide) to test whether NB beats a cheap static alternative. This directly addresses counter-theses (a) and (c).
- *Between-subject* only in K2, if n≥20 and there are concerns about carry-over (learning) effects.
- *Expected carry-over:* the NB-first → baseline-second order will contaminate the baseline (the user keeps the framing habit). Analyse order effects explicitly. A positive carry-over is itself evidence for the "capability development" claim, but it shrinks the measured A/B difference.

**Metrics [Recommendation], tied to B4 dimensions; no composite score**

| Dimension | Metric | Method | Notes |
|---|---|---|---|
| Task outcome | Deliverable quality on a 1–7 anchored rubric derived from the task's own acceptance criteria; pass/fail on each criterion; rework needed | **Blind expert rating** (1–2 domain raters who don't know the condition; deliverables anonymised) + recipient/stakeholder rating where possible | LLM-as-judge only as a secondary check (WS4 covers its biases) |
| Time/effort | Wall-clock active time, number of turns, number of corrections/re-prompts | Screen/timestamp logs, transcript counts | **Not self-report** (METR perception gap) |
| Framing quality | Clear objective, explicit constraints, verifiable acceptance criteria present before execution (checklist) | Rated from artefacts by a blind rater | Risk: the NB condition produces these artefacts by design (measurement bias). Rate *final deliverable fit to real need* too |
| Collaboration quality | Verification actions taken (tests, source checks), delegation appropriateness, number of "almost right" iterations | Transcript coding | Coding scheme needs a pilot on 2 sessions |
| Satisfaction / friction | Single-item "worth the extra effort?" + NASA-TLX-style effort item; perceived vs measured time delta | Post-task survey | Expect a novelty/Hawthorne inflation |
| **Voluntary reuse** (primary demand signal) | Unprompted use of the method/workflow on a new task within 14 days; asks for the Skill/template; referrals | Follow-up check-in; artefact evidence (screenshot/transcript) | The strongest signal: behaviour, not opinion |
| Capability across later tasks | On a third task done unassisted, do framing/verification behaviours appear? | Same rubric, blind | Only a weak signal in K1; needs K2 |

**Confounders and mitigations [Recommendation]**
- *Task difficulty/type:* participant pre-rates both tasks on size and familiarity; reject pairs whose ratings differ too much; record the task type (inside/outside the AI frontier).
- *Learning/order:* counterbalance and report by order.
- *Novelty/Hawthorne:* the baseline session is also observed (same logging, same researcher presence); weight the 14-day reuse metric over in-session satisfaction.
- *Concierge human-coach effect:* the founder's skill inflates results. Script the coaching moves (a fixed protocol of question types), log every intervention, and treat the K2 unassisted prototype as the real test.
- *Selection bias:* recruits from AI-enthusiast communities are already near-Frontier users and have the least headroom. Recruit a mix, and record self-rated AI usage frequency and Frontier-type behaviours (the WTI 2026 items) at intake.
- *Rater bias:* blind raters; for K1, at least 2 raters on a subset to check agreement.

**Sample-size realism [Inference]**
- With a paired design and n=10, a standard power calculation (paired t-test, α=0.05 two-sided, 80% power) detects only effects of about dz≈1.0, i.e. very large effects. K1 therefore cannot establish a moderate effect.
- Pre-register **decision thresholds** instead of significance. Example: "NB deliverable rated better by blind raters in ≥7 of 10 pairs AND ≥4 of 10 users voluntarily reuse within 14 days". A sign-test framing is honest at this n.
- K2, with ~20–30 users × 2–3 tasks each and a mixed-effects analysis, gets closer to detecting moderate effects. It is still exploratory.
- Doing more tasks per person (as METR did) is cheaper than recruiting more people.

**Sequencing [Recommendation]**
- **K1 (≤4 weeks, ≤10 users):**
  - Week 1: 8–12 Mom-Test/JTBD interviews about past ambiguous tasks with AI, current spend and who pays. This also screens for real tasks.
  - Weeks 2–3: 6–10 concierge A/B sessions (2 tasks each).
  - Week 4: blind rating plus the 14-day reuse check (this may run into week 5).
  - Deliverables: go/narrow/stop decision, the method steps users valued, the friction points.
- **K2 (1–3 months):**
  - Month 1: K1, plus codify the method into a portable Skill / project instructions / kickoff prompt.
  - Month 2: unassisted prototype with 15–30 users; a static-guide control arm; one cross-platform arm.
  - Month 3: capability follow-up on a third task, a paid-pilot or pre-commit test with 1–2 team leads, and the URL-first prototype only if repo-centred tasks dominate.

**What each evidence type validates [Inference]**
- Desk research covers demand context and the counter-theses (this note).
- Concierge tests whether the method creates value at all.
- The portable prototype tests whether value survives without a human and fits native platforms.
- Real behaviour (reuse, paid pilot) tests demand and willingness to pay.

### Gaps
- I did not retrieve recent methodological papers on small-n within-subject HCI/AI-assistance experiments, or test–retest reliability data for expert rubrics. The sample-size statement is a standard statistical approximation, not a sourced figure.
- I did not check whether METR published a 2026 follow-up with newer models, which could change the S1 baseline expectation.
- LLM-as-judge reliability is deferred to WS4.

---

## Q4. Kill/pivot criteria and distribution (separating thesis, segment, UX, implementation and distribution failure)

### Takeaway
[Recommendation] Pre-register thresholds before K1, and attribute each failure to the layer it disproves. Concierge results test the **thesis**. Segment contrasts test the **segment**. Unassisted prototype results test **UX/implementation**. Recruitment and reuse spread test **distribution**. The distribution evidence suggests:
- S1 is reached through communities and Skill/plugin marketplaces, where the "stop babysitting" message is crowded.
- S2 is reached through practitioner communities and team leads.
- S3 is reached mainly through employer L&D channels, which are B2B sales motions that are out of scope for K1.

### Cited Findings
- [Finding] "Stop babysitting your agents" is already a positioning used by developer-tool vendors and bloggers (Unblocked, WorkOS, Substack). The S1 message space is crowded — [Unblocked](https://getunblocked.com/blog/stop-babysitting-your-agents); [WorkOS](https://workos.com/blog/agents-babysitting-agents); [Substack](https://xr0am.substack.com/p/how-i-stopped-babysitting-claude)
- [Finding] Enterprise AI-proficiency vendors reach buyers through enterprise sales (pilots with named enterprises, certification, dashboards, forward-deployed consultants) — [Section](https://www.sectionai.com/sandbox/home-page); [Scholé AI](https://trainingindustry.com/press-release/artificial-intelligence/schole-ai-raises-3m-to-transform-workforce-learning-in-the-age-of-ai/)
- [Finding] Usage plateaus where employer support is missing: only ~25% of frontline staff report leadership support (BCG), and 50% of US workers say their employer is neutral on chatbots (Pew). S3 access is mediated by the employer — [BCG](https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain) (secondary: [Unleash](https://www.unleash.ai/artificial-intelligence/bcgs-ai-at-work-2025-report-four-takeaways-for-hr-leaders/)); [Pew](https://www.pewresearch.org/social-trends/2025/02/25/workers-experience-with-ai-chatbots-in-their-jobs/)
- [Finding] Developers keep asking humans when they distrust AI (75%), which signals a human-verification habit an outside tool must fit into — [Stack Overflow 2025 via search summary](https://stackoverflow.blog/2025/07/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/)

### Kill / pivot criteria [Recommendation]. All thresholds are proposals to pre-register, not empirically derived.

| Failure mode | Signal (K1 unless noted) | Failure type it implicates | Action |
|---|---|---|---|
| Weak demand | <5 of 10–12 interviewees can describe a recent ambiguous AI task that went badly and cost them real time or quality; or recruitment of 10 qualified users takes >2 weeks through warm channels | Segment, or thesis if consistent across segments | Swap segment (S2↔S1) once; if it is still weak → reconsider the premise |
| Weak differentiation vs. native platforms | Blind raters prefer the NB deliverable in ≤5 of 10 pairs, **or** (K2) NB doesn't beat the static best-practice handout / native features (e.g. platform planning or clarifying-question modes) | Thesis (if concierge fails); implementation (if only the prototype fails) | If concierge fails → stop or pivot. If only the prototype fails → fix the codification |
| Coaching friction > benefit | Median "worth the extra effort" ≤ neutral; NB sessions take substantially longer with no quality gain; users skip framing steps | UX (if outcomes improved) or thesis (if they didn't) | Cut the framing to a minimal default; let users opt into depth (B5) |
| No outcome improvement | No quality, rework or time gain on objective measures even when users report satisfaction (perceived vs measured gap, cf. METR) | Thesis | Stop the "outcome" claim; consider an education-only/B2B-training pivot (crowded) |
| Cost > value | Concierge effort per session can't plausibly be automated (K2 prototype reproduces <~half of the concierge gain); or the value is only felt on rare, high-stakes tasks | Implementation / business model | Narrow to high-value task types or a B2B service |
| Weak portability | (K2) The same method works on one platform but not the other, or needs heavy platform-specific adapters | Implementation (architecture), *not* thesis | Go single-platform first; drop the platform-agnostic claim for v1 (T3) |
| No voluntary reuse | <3 of 10 users reuse the method unprompted within 14 days, despite positive ratings | Thesis or UX: a novelty effect | Strong kill signal for a standalone product; consider embedding into the team workflow (B2B) |
| Distribution failure | (K2) The method is valued, but organic sharing or marketplace installs stay negligible, and team leads won't pilot | Distribution | Change channel (community → team-lead B2B), not the thesis |

[Inference] Thesis failure vs. implementation failure: a positive concierge result followed by a failed prototype means the method works but the software or UX didn't carry it, so that is not a reason to abandon the product. A negative concierge result with blind raters is the strongest evidence against the thesis. One failed prototype ≠ a dead product.

**Distribution channels by segment [Inference]**
- **S1:** dev communities (HN, r/ClaudeAI, r/ExperiencedDevs), Skill/plugin marketplaces, GitHub. Cheap to reach, but crowded with "stop babysitting" tooling (WS1), so a distinct message is needed. Problem framing for S1 is probably a weaker hook than verification.
- **S2:** PM/BA/consulting communities, newsletters, and **team leads/practice leads** as the buyer for a B2B team motion. Reachable for K1 through a warm network. Moderate competition from enterprise enablement vendors that target "all employees" rather than workflow outcomes.
- **S3:** mainly through employer L&D/AI-enablement (BCG and Pew show employer mediation). That needs enterprise sales, which is outside K1/K2 capacity → [Recommendation] defer S3.

### Gaps
- No data on install-to-active conversion or retention for Claude Skills / ChatGPT GPT/App marketplaces, so marketplace distribution potential is unquantified (WS2/WS3 may cover marketplace mechanics).
- No credible postmortems of AI-coaching startups failing on distribution were found. PromptPerfect's closure has no official explanation.
- The thresholds in the kill table are judgement-based proposals. No literature benchmark for "reuse rate ≥ X%" in this category was found.
