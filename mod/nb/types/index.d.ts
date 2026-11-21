export type ColleagueState = 'idle' | 'thinking' | 'working' | 'asking' | 'overloaded' | 'verified'
export type Lang = 'en' | 'vi'
export type Level = 'quiet' | 'normal' | 'chatty'
export type Size = 'small' | 'larger' | 'unknown'

export type TaskDecisions = {
  /** The task's short name from `# Task: …`, or the folder name. */
  name: string
  size: Size
  /** Decisions 1 to 4, made or not: `Confirmed: yes` for 1 to 3, the user's accept or redo for 4. */
  made: [boolean, boolean, boolean, boolean]
  /** The user asked to skip this pause (`Confirmed: skipped`). */
  skipped: [boolean, boolean, boolean, boolean]
  /** Which decisions apply: small tasks have only 2 and 4. */
  applies: [boolean, boolean, boolean, boolean]
  /** Decision 4 says accepted. */
  accepted: boolean
  /** Decision 4 says redo. */
  redo: boolean
  /** The first decision that applies and is not made, 1..4, or null when all are made. */
  next: 1 | 2 | 3 | 4 | null
}

export type Usage = {
  contextPercent: number | null
  limit: { kind: string; percentUsed: number } | null
}

export type Bubble = { text: string; isStale: boolean }

declare module 'claude-code' {
  interface PluginState {
    nb: {
      /** What The Colleague's face shows. */
      state: ColleagueState
      /** Tool calls running now (more than two at once: overloaded). */
      busy: number
      /** The speech bubble's sentence. */
      bubble: Shaped<Bubble>
      /** Context fill and the closest rate limit. */
      usage: Shaped<Usage>
      /** The four decisions of the most recently edited task, or null when there is none. */
      task: Shaped<TaskDecisions | null>
      /** No me.md yet: the workspace's first run. */
      isFirstRun: boolean
      /** How much The Colleague talks (C14). Kept across sessions in $.store. */
      level: Level
      /** Language of the mod's own words. From me.md, or /nb-lang. */
      lang: Lang
      /** The ASCII scene behind the chat is on. */
      scene: boolean
      /** The one-time "what counts as done?" question was asked this session. */
      asked: boolean
    }
  }
}
