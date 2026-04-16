/**
 * Mock Data Collectors — returns realistic placeholder data.
 * Replace each function with real MCP/PBI/WorkIQ calls when OBO auth is wired.
 */

import type {
  AuthContext,
  CollectorResult,
  AccountInfo,
  ACRData,
  PipelineData,
  WorkplaceContext,
  DataCollectors,
} from "./types";

function result<T>(data: T, sources: string[]): CollectorResult<T> {
  return { status: "ok", data, sources, collectedAt: new Date().toISOString() };
}

function unavailable<T>(source: string, reason: string): CollectorResult<T> {
  return {
    status: "unavailable",
    data: null,
    sources: [source],
    collectedAt: new Date().toISOString(),
    errorMessage: reason,
  };
}

export const mockCollectors: DataCollectors = {
  async collectAccountInfo(tpid, _auth) {
    // TODO: Replace with MSX MCP get_account_overview call
    return result<AccountInfo>(
      {
        tpid,
        name: `Account TPID ${tpid}`,
        industry: "Not resolved",
        teamMembers: [
          { name: "Account Executive", role: "AE" },
          { name: "Solution Specialist", role: "SSP" },
          { name: "Cloud Solution Architect", role: "CSA" },
        ],
      },
      ["mock-data"]
    );
  },

  async collectACRData(tpid, _auth) {
    // TODO: Replace with Power BI DAX query via MSA/MSXi
    const months = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
    const baseACR = 1100000 + Math.random() * 200000;

    return result<ACRData>(
      {
        current: Math.round(baseACR),
        trend: months.map((month, i) => ({
          month,
          acr: Math.round(baseACR * (0.95 + i * 0.018 + (Math.random() - 0.5) * 0.03)),
          target: Math.round(baseACR * (1 + i * 0.02)),
        })),
        growthRate6M: 8.8,
        growthRate3M: -1.8,
        topServices: [
          { name: "Virtual Machines", acr: Math.round(baseACR * 0.35), delta: -12000 },
          { name: "Azure SQL Database", acr: Math.round(baseACR * 0.18), delta: 5000 },
          { name: "Azure Kubernetes Service", acr: Math.round(baseACR * 0.12), delta: 8000 },
          { name: "Storage Accounts", acr: Math.round(baseACR * 0.10), delta: -3000 },
          { name: "Azure OpenAI Service", acr: Math.round(baseACR * 0.08), delta: 15000 },
        ],
      },
      ["mock-data (Power BI MSA)"]
    );
  },

  async collectPipelineData(tpid, _auth) {
    // TODO: Replace with MSX MCP get_account_overview pipeline section
    return result<PipelineData>(
      {
        totalValue: 3420000,
        committedValue: 950000,
        uncommittedValue: 2470000,
        opportunities: [
          { name: "Cloud Migration Phase 2", value: 1090000, stage: "Develop & Prove", closeDate: "2026-06-30", solutionArea: "Azure" },
          { name: "Data Platform Modernization", value: 505000, stage: "Solution Envisioning", closeDate: "2026-09-30", solutionArea: "Azure" },
          { name: "AI/ML Proof of Concept", value: 250000, stage: "Qualify", closeDate: "2026-08-15", solutionArea: "Azure" },
          { name: "M365 Copilot Expansion", value: 180000, stage: "Close", closeDate: "2026-05-15", solutionArea: "Modern Work" },
        ],
        stageSummary: [
          { stage: "Qualify", count: 8, value: 850000 },
          { stage: "Solution Envisioning", count: 6, value: 720000 },
          { stage: "Develop & Prove", count: 4, value: 1250000 },
          { stage: "Close", count: 3, value: 600000 },
        ],
      },
      ["mock-data (MSX Dataverse)"]
    );
  },

  async collectWorkplaceContext(accountName, _auth) {
    // TODO: Replace with WorkIQ ask_work_iq calls
    return result<WorkplaceContext>(
      {
        recentMeetings: [
          { date: "2026-04-10", title: "Monthly Business Review", summary: "Discussed cloud migration timeline and budget approval for Phase 2." },
          { date: "2026-03-28", title: "Technical Architecture Review", summary: "Reviewed AKS cluster design for production workloads." },
          { date: "2026-03-15", title: "Executive Sponsor Check-in", summary: "CTO expressed interest in AI/ML use cases for supply chain optimization." },
        ],
        keyThemes: [
          "Cloud migration acceleration",
          "AI/ML pilot for supply chain",
          "Data platform consolidation",
          "Cost optimization on existing workloads",
        ],
        openActions: [
          { action: "Share AKS architecture reference doc", owner: "Microsoft", dueDate: "2026-04-20" },
          { action: "Provide AI/ML readiness assessment proposal", owner: "Microsoft", dueDate: "2026-04-30" },
          { action: "Confirm budget allocation for Phase 2", owner: "Customer", dueDate: "2026-05-01" },
        ],
        risks: [
          "Phase 2 budget approval delayed — may slip Q1 close target",
          "Key technical contact transitioning to new role",
        ],
      },
      ["mock-data (Workplace Intelligence)"]
    );
  },
};
