/**
 * Briefing Engine — Data Collector Types
 *
 * Each collector returns a standardized envelope with status, provenance,
 * and structured data. This allows graceful degradation when sources are
 * unavailable and clear audit trails for what data informed each briefing.
 */

export type CollectorStatus = "ok" | "unavailable" | "forbidden" | "stale" | "error";

export interface CollectorResult<T> {
  status: CollectorStatus;
  data: T | null;
  sources: string[];       // provenance: what data source(s) were queried
  collectedAt: string;     // ISO timestamp
  errorMessage?: string;
}

// ── Account Info ──────────────────────────────────────────────

export interface AccountInfo {
  tpid: string;
  name: string;
  industry: string;
  teamMembers: { name: string; role: string }[];
}

// ── ACR / Consumption Data ────────────────────────────────────

export interface ACRDataPoint {
  month: string;
  acr: number;
  target?: number;
}

export interface ACRData {
  current: number;
  trend: ACRDataPoint[];
  growthRate6M: number | null;
  growthRate3M: number | null;
  topServices: { name: string; acr: number; delta: number }[];
}

// ── Pipeline Data ─────────────────────────────────────────────

export interface PipelineOpportunity {
  name: string;
  value: number;
  stage: string;
  closeDate: string;
  solutionArea: string;
}

export interface PipelineData {
  totalValue: number;
  committedValue: number;
  uncommittedValue: number;
  opportunities: PipelineOpportunity[];
  stageSummary: { stage: string; count: number; value: number }[];
}

// ── Workplace Context (from WorkIQ) ───────────────────────────

export interface WorkplaceContext {
  recentMeetings: { date: string; title: string; summary: string }[];
  keyThemes: string[];
  openActions: { action: string; owner: string; dueDate?: string }[];
  risks: string[];
}

// ── Collector Interface ───────────────────────────────────────

export interface AuthContext {
  userId: string;
  accessToken?: string;     // OBO token for downstream APIs
  userPrincipalName?: string;
}

export interface DataCollectors {
  collectAccountInfo(tpid: string, auth: AuthContext): Promise<CollectorResult<AccountInfo>>;
  collectACRData(tpid: string, auth: AuthContext): Promise<CollectorResult<ACRData>>;
  collectPipelineData(tpid: string, auth: AuthContext): Promise<CollectorResult<PipelineData>>;
  collectWorkplaceContext(accountName: string, auth: AuthContext): Promise<CollectorResult<WorkplaceContext>>;
}
