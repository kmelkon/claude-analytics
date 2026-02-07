// ── Stats Cache ──

export interface DailyActivity {
  date: string;
  messageCount: number;
  sessionCount: number;
  toolCallCount: number;
}

export interface DailyModelTokens {
  date: string;
  tokensByModel: Record<string, number>;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  costUSD: number;
}

export interface StatsCache {
  version: number;
  lastComputedDate: string;
  dailyActivity: DailyActivity[];
  dailyModelTokens: DailyModelTokens[];
  modelUsage: Record<string, ModelUsage>;
  totalSessions: number;
  totalMessages: number;
  longestSession: {
    sessionId: string;
    duration: number;
    messageCount: number;
    timestamp: string;
  };
  firstSessionDate: string;
  hourCounts: Record<string, number>;
}

// ── Sessions ──

export interface SessionEntry {
  sessionId: string;
  fullPath: string;
  fileMtime: number;
  firstPrompt: string;
  messageCount: number;
  created: string;
  modified: string;
  gitBranch: string;
  projectPath: string;
  isSidechain: boolean;
}

export interface SessionsIndex {
  version: number;
  entries: SessionEntry[];
  originalPath: string;
}

export interface ProjectSessions {
  projectDirName: string;
  projectPath: string;
  sessions: SessionEntry[];
}

// ── History ──

export interface HistoryEntry {
  display: string;
  pastedContents: Record<string, unknown>;
  timestamp: number;
  project?: string;
  sessionId?: string;
}

// ── Transcript ──

export interface TranscriptMessage {
  type: "user" | "assistant" | "summary";
  sessionId?: string;
  message?: {
    role: string;
    content: Array<{ type: string; text?: string; name?: string }>;
    model?: string;
  };
  timestamp?: string;
  summary?: string;
}

export interface CondensedTranscript {
  sessionId: string;
  turns: Array<{ role: string; text: string }>;
  messageCount: number;
}

// ── Analyzers ──

export interface ActivityAnalysis {
  heatmapData: Array<{ date: string; count: number }>;
  streaks: { current: number; longest: number; currentStart: string };
  weekdayDistribution: number[];
  hourDistribution: number[];
  totalDays: number;
  activeDays: number;
  avgMessagesPerActiveDay: number;
  peakDay: { date: string; count: number };
  totalMessages: number;
  totalSessions: number;
  totalToolCalls: number;
}

export interface ProjectAnalysis {
  name: string;
  path: string;
  sessionCount: number;
  messageCount: number;
  firstUsed: string;
  lastUsed: string;
  durationMs: number;
}

export interface CostAnalysis {
  totalCost: number;
  costByModel: Record<
    string,
    { input: number; cacheRead: number; cacheWrite: number; output: number; total: number }
  >;
  dailyCost: Array<{ date: string; cost: number }>;
  totalTokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  tokensByModel: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }>;
}

// ── LLM Facets ──

export interface SessionFacet {
  sessionId: string;
  taskType: string;
  complexity: string;
  userBehavior: {
    providedContext: boolean;
    iteratedOnSolution: boolean;
    testedResult: boolean;
    usedPlanMode: boolean;
    pastedErrors: boolean;
    scopeCreep: boolean;
  };
  toolsLeveraged: string[];
  outcome: string;
  keyTopic: string;
  antiPatterns: string[];
  goodPractices: string[];
}

export interface InsightItem {
  title: string;
  detail: string;
  evidence?: string;
  suggestion?: string;
  howToUse?: string;
}

export interface AtAGlance {
  whatsWorking: string;
  whatsHindering: string;
  quickWins: string;
  ambitiousWorkflows: string;
}

export interface LLMSynthesis {
  atAGlance: AtAGlance;
  impressiveThings: InsightItem[];
  whereThingsGoWrong: InsightItem[];
  featuresToTry: InsightItem[];
}

// ── Dashboard Data ──

export interface DashboardData {
  generatedAt: string;
  activity: ActivityAnalysis;
  projects: ProjectAnalysis[];
  costs: CostAnalysis;
  sessions: SessionEntry[];
  llm?: LLMSynthesis;
  facets?: SessionFacet[];
}
