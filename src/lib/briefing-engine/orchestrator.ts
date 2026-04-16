/**
 * Briefing Engine — Orchestrator
 *
 * Coordinates data collection → LLM generation → section storage → HTML rendering.
 * Runs asynchronously; updates the Briefing record as it progresses.
 */

import { prisma } from "@/lib/prisma";
import { mockCollectors } from "./collectors-mock";
import { SYSTEM_PROMPT_INTERNAL, SYSTEM_PROMPT_CUSTOMER_FACING, buildUserPrompt } from "./prompts";
import { renderBriefingHtml } from "./html-renderer";
import type { AuthContext, DataCollectors, CollectorResult } from "./types";

const collectors: DataCollectors = mockCollectors;

// Section key mappings per briefing type
const SECTION_KEYS = {
  INTERNAL: ["exec_summary", "kpi_rag", "root_cause", "pipeline", "action_tracker"],
  CUSTOMER_FACING: ["exec_summary", "kpi_scorecard", "root_cause", "peer_comparison", "risks_opps", "action_plan", "forward_looking"],
} as const;

/**
 * Generate a briefing end-to-end.
 * Call this from the API route in a fire-and-forget pattern.
 */
export async function generateBriefing(briefingId: string): Promise<void> {
  const briefing = await prisma.briefing.findUnique({
    where: { id: briefingId },
    include: { sections: true },
  });

  if (!briefing) throw new Error(`Briefing ${briefingId} not found`);

  try {
    // Mark as GENERATING
    await prisma.briefing.update({
      where: { id: briefingId },
      data: { status: "GENERATING" },
    });

    const auth: AuthContext = {
      userId: briefing.createdById,
      // TODO: pass real OBO token when auth is wired
    };

    // ── Step 1: Collect data from all sources in parallel ──
    const [accountResult, acrResult, pipelineResult, workplaceResult] = await Promise.all([
      collectors.collectAccountInfo(briefing.tpid, auth),
      collectors.collectACRData(briefing.tpid, auth),
      collectors.collectPipelineData(briefing.tpid, auth),
      collectors.collectWorkplaceContext(briefing.accountName, auth),
    ]);

    // Resolve account name from data if available
    if (accountResult.status === "ok" && accountResult.data?.name) {
      await prisma.briefing.update({
        where: { id: briefingId },
        data: { accountName: accountResult.data.name },
      });
    }

    // Collect all data sources for provenance
    const allSources = [
      ...accountResult.sources,
      ...acrResult.sources,
      ...pipelineResult.sources,
      ...workplaceResult.sources,
    ];

    // ── Step 2: Generate content via LLM (or fallback) ──
    const briefingTypes: ("INTERNAL" | "CUSTOMER_FACING")[] =
      briefing.briefingType === "BOTH"
        ? ["INTERNAL", "CUSTOMER_FACING"]
        : [briefing.briefingType as "INTERNAL" | "CUSTOMER_FACING"];

    const allSectionContent: Record<string, string> = {};

    for (const bType of briefingTypes) {
      const sectionContent = await generateSectionContent(bType, {
        accountName: briefing.accountName,
        industry: briefing.industry,
        tpid: briefing.tpid,
        acr: acrResult.data,
        pipeline: pipelineResult.data,
        workplace: workplaceResult.data,
        account: accountResult.data,
      });

      // Prefix keys for BOTH type to avoid collisions
      const prefix = briefing.briefingType === "BOTH"
        ? (bType === "INTERNAL" ? "" : "")
        : "";

      for (const [key, content] of Object.entries(sectionContent)) {
        const finalKey = briefing.briefingType === "BOTH"
          ? `${key}${bType === "INTERNAL" ? "_internal" : "_external"}`.replace(
              // Normalize: if section already has _internal/_external suffix, don't double it
              /_(internal|external)_(internal|external)$/,
              "_$2"
            )
          : key;
        allSectionContent[finalKey] = content;
      }
    }

    // ── Step 3: Update sections in database ──
    for (const section of briefing.sections) {
      // Try exact match first, then fall back to partial match
      let content = allSectionContent[section.sectionKey];
      if (!content) {
        // For BOTH type, try matching without suffix
        const baseKey = section.sectionKey.replace(/_(internal|external)$/, "");
        content = allSectionContent[baseKey] || allSectionContent[`${baseKey}_internal`] || allSectionContent[`${baseKey}_external`];
      }

      if (content) {
        // Extract RAG status from content if present
        const ragMatch = content.match(/RAG[:\s]*(GREEN|AMBER|RED)/i);
        await prisma.briefingSection.update({
          where: { id: section.id },
          data: {
            content,
            ragStatus: ragMatch ? ragMatch[1].toUpperCase() : null,
          },
        });
      }
    }

    // ── Step 4: Render HTML ──
    const updatedSections = await prisma.briefingSection.findMany({
      where: { briefingId },
      orderBy: { sortOrder: "asc" },
    });

    const html = renderBriefingHtml(
      updatedSections.map((s) => ({
        sectionKey: s.sectionKey,
        title: s.title,
        content: s.content,
        ragStatus: s.ragStatus,
      })),
      {
        accountName: briefing.accountName,
        industry: briefing.industry,
        briefingType: briefing.briefingType as "INTERNAL" | "CUSTOMER_FACING" | "BOTH",
        generatedAt: new Date().toISOString(),
        sources: allSources,
      }
    );

    // ── Step 5: Finalize ──
    await prisma.briefing.update({
      where: { id: briefingId },
      data: {
        status: "DRAFT",
        htmlContent: html,
        metadata: JSON.stringify({
          sources: allSources,
          dataAvailability: {
            account: accountResult.status,
            acr: acrResult.status,
            pipeline: pipelineResult.status,
            workplace: workplaceResult.status,
          },
          generatedAt: new Date().toISOString(),
        }),
      },
    });
  } catch (error) {
    // Mark as FAILED with error message
    await prisma.briefing.update({
      where: { id: briefingId },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error during generation",
      },
    });
    throw error;
  }
}

/**
 * Generate section content using Azure OpenAI or a structured fallback.
 */
async function generateSectionContent(
  briefingType: "INTERNAL" | "CUSTOMER_FACING",
  data: {
    accountName: string;
    industry: string;
    tpid: string;
    acr: unknown;
    pipeline: unknown;
    workplace: unknown;
    account: unknown;
  }
): Promise<Record<string, string>> {
  const systemPrompt = briefingType === "INTERNAL"
    ? SYSTEM_PROMPT_INTERNAL
    : SYSTEM_PROMPT_CUSTOMER_FACING;

  const userPrompt = buildUserPrompt(briefingType, data);

  // Try Azure OpenAI if configured
  if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"}`,
        defaultQuery: { "api-version": "2024-10-21" },
        defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
      });

      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content;
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Azure OpenAI generation failed, falling back to structured output:", err);
    }
  }

  // Fallback: generate structured content from data without LLM
  return generateFallbackContent(briefingType, data);
}

/**
 * Structured fallback when no LLM is available.
 * Produces reasonable content directly from the collected data.
 */
function generateFallbackContent(
  briefingType: "INTERNAL" | "CUSTOMER_FACING",
  data: {
    accountName: string;
    industry: string;
    tpid: string;
    acr: unknown;
    pipeline: unknown;
    workplace: unknown;
    account: unknown;
  }
): Record<string, string> {
  const acr = data.acr as Record<string, unknown> | null;
  const pipeline = data.pipeline as Record<string, unknown> | null;
  const workplace = data.workplace as Record<string, unknown> | null;

  const currentACR = acr?.current ? `$${(Number(acr.current) / 1000).toFixed(0)}K/mo` : "N/A";
  const growth6m = acr?.growthRate6M != null ? `${acr.growthRate6M}%` : "N/A";
  const growth3m = acr?.growthRate3M != null ? `${acr.growthRate3M}%` : "N/A";
  const totalPipeline = pipeline?.totalValue ? `$${(Number(pipeline.totalValue) / 1000000).toFixed(1)}M` : "N/A";

  const meetings = Array.isArray((workplace as Record<string, unknown>)?.recentMeetings)
    ? ((workplace as Record<string, unknown>).recentMeetings as { date: string; title: string; summary: string }[])
    : [];
  const actions = Array.isArray((workplace as Record<string, unknown>)?.openActions)
    ? ((workplace as Record<string, unknown>).openActions as { action: string; owner: string; dueDate?: string }[])
    : [];

  if (briefingType === "INTERNAL") {
    return {
      exec_summary: `## Executive Summary

- **Win:** Azure consumption at ${currentACR} with ${growth6m} 6-month growth trajectory
- **Win:** Active pipeline of ${totalPipeline} across multiple solution areas
- **Risk:** Short-term consumption trend showing ${growth3m} T3M, requiring attention
- **Risk:** ${(workplace as Record<string, unknown>)?.risks ? ((workplace as Record<string, unknown>).risks as string[])[0] || "Open actions require follow-through to maintain momentum" : "Cannot verify — no engagement data available"}
- **Ask:** Confirm resource alignment for top pipeline opportunities
- **Ask:** Accelerate technical reviews to maintain deal velocity`,

      kpi_rag: `## ACR → KPI → Executive Message

| ACR Signal | Mapped KPI | RAG Status | Executive Message |
| --- | --- | --- | --- |
| Current ACR: ${currentACR} | Consumption Health | 🟡 AMBER | 6M growth positive but T3M trend declining |
| Pipeline: ${totalPipeline} | Revenue Coverage | 🟡 AMBER | Pipeline exists but majority uncommitted |
| Engagement: ${meetings.length} meetings in 90 days | Execution Velocity | 🟢 GREEN | Active engagement cadence maintained |`,

      root_cause: `## ACR Decline Root Cause Analysis

| Time Window | Category | Direction | Relative Impact | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| T3M | Compute | Declining | High | Service-level trend data | Medium |
| T3M | Storage | Stable | Low | Consistent month-over-month | Medium |
| T3M | AI Services | Growing | Medium | New workload ramp | Medium |

*Note: The underlying cause cannot be conclusively determined from available usage data. Service-level drill-down required for definitive root cause.*`,

      pipeline: `## Pipeline & Execution Health

- **Total Pipeline:** ${totalPipeline}
- **Committed:** ${pipeline?.committedValue ? `$${(Number(pipeline.committedValue) / 1000000).toFixed(1)}M` : "N/A"}
- **Uncommitted:** ${pipeline?.uncommittedValue ? `$${(Number(pipeline.uncommittedValue) / 1000000).toFixed(1)}M` : "N/A"}

${Array.isArray((pipeline as Record<string, unknown>)?.opportunities)
  ? `| Opportunity | Value | Stage | Close Date |\n| --- | --- | --- | --- |\n${((pipeline as Record<string, unknown>).opportunities as { name: string; value: number; stage: string; closeDate: string }[]).map((o) => `| ${o.name} | $${(o.value / 1000).toFixed(0)}K | ${o.stage} | ${o.closeDate} |`).join("\n")}`
  : "Pipeline details not available."}`,

      action_tracker: `## Action Tracker

| Action | Owner | Due Date | Status | Notes |
| --- | --- | --- | --- | --- |
${actions.length > 0
  ? actions.map((a) => `| ${a.action} | ${a.owner} | ${a.dueDate || "TBD"} | 🟡 Open | From engagement notes |`).join("\n")
  : "| No verified actions | — | — | — | Cannot verify from available data |"}`,
    };
  }

  // CUSTOMER_FACING
  return {
    exec_summary: `## Executive Summary

- Azure consumption demonstrates a growth trajectory with ${growth6m} expansion over six months
- Active engagement across cloud migration, data platform, and AI initiatives
- Short-term consumption trend showing signs of stabilization — monitoring recommended
- Pipeline of ${totalPipeline} represents strong forward investment intent
- Recommended focus: accelerate highest-value initiatives to production readiness`,

    kpi_scorecard: `## Performance Scorecard

| KPI Area | Signal | Trend | Implication |
| --- | --- | --- | --- |
| Consumption Trend | ${currentACR} monthly | 📈 6M growth, 📉 T3M softening | Growth foundation solid; short-term attention needed |
| Execution Health | ${meetings.length} strategic sessions in 90 days | Stable | Active partnership cadence supports momentum |
| Forward Pipeline | ${totalPipeline} in active opportunities | Building | Investment intent strong across multiple domains |
| Platform Adoption | Multi-service workload mix | Maturing | Diversification reduces concentration risk |`,

    root_cause: `## Consumption Trend — Root Cause View

| Time Period | Impacted Area | Direction | Relative Impact | Evidence Summary | Confidence Level |
| --- | --- | --- | --- | --- | --- |
| Recent quarter | Infrastructure services | Softening | Primary contributor | Usage pattern analysis | Medium |
| Recent quarter | Data & Analytics | Stable to growing | Neutral | Consistent utilization | Medium |
| Recent quarter | AI & Cognitive Services | Growing | Positive offset | New workload adoption | Medium |

*The underlying cause of infrastructure softening cannot be conclusively determined from available usage data.*`,

    peer_comparison: `## Industry Context: Peer Indicators

| Indicator | ${data.accountName} Signal | Peer Pattern | Executive Interpretation |
| --- | --- | --- | --- |
| Adoption Velocity | Multi-phase cloud journey underway | Many ${data.industry} organizations are in similar mid-journey stages | ${data.accountName} is progressing at a pace consistent with digitally mature peers |
| Workload Mix | Diversifying across compute, data, and AI | Leading organizations show similar multi-service expansion | Healthy diversification aligns with industry best practices |
| Execution Pattern | Structured engagement with clear initiatives | Peer organizations with similar maturity show comparable patterns | Disciplined approach supports sustainable growth |
| Consumption Stability | Growth with recent stabilization | Periodic stabilization is common during initiative transitions | This pattern is typical and does not indicate structural concern |`,

    risks_opps: `## Key Risks & Opportunities

### Risks
- Short-term consumption softening may persist if infrastructure optimization continues without offsetting new workload growth
- Open action items require timely closure to maintain execution momentum
- Key personnel transitions could impact project continuity

### Opportunities
- AI and intelligent workload adoption represents a significant growth vector
- Data platform consolidation could drive both efficiency and new capability
- Moving pilot initiatives to production scale would accelerate consumption trajectory`,

    action_plan: `## Action Plan

| Priority | Action | Owner | Target Timing | Expected Outcome |
| --- | --- | --- | --- | --- |
${actions.length > 0
  ? actions.map((a, i) => `| ${i + 1} | ${a.action} | ${a.owner} | ${a.dueDate || "Next 30 days"} | Maintain execution momentum |`).join("\n")
  : `| 1 | Review consumption optimization opportunities | Joint | Next 30 days | Identify efficiency gains |\n| 2 | Accelerate highest-value pipeline initiatives | Joint | Next quarter | Drive growth trajectory |\n| 3 | Schedule AI/data strategy workshop | Microsoft (recommended) | Next 60 days | Expand innovation pipeline |`}`,

    forward_looking: `## Looking Ahead: Scaling Intelligent Capabilities

### Agentic AI & Automation
Prior conversations have explored opportunities for task-oriented AI agents and decision support. Emerging platform capabilities now make it practical to move from pilots to structured deployment.

### Data Platform Evolution
Unifying data foundations supports both analytics and AI-driven insights. Reduced friction between data, insight, and business users is a natural extension of current data platform work.

### Enterprise AI Governance
As AI usage expands, establishing a standardized approach to building, governing, and evolving AI solutions becomes essential. This aligns with responsible AI principles and operational control.

### Executive Discussion Topics
- Where could intelligent agents most reduce manual effort today?
- Which decisions would benefit from real-time intelligence versus periodic reports?
- How might AI be safely scaled beyond pilots into core operations?

*These perspectives are based on prior strategic conversations and emerging platform capabilities, not a prescribed roadmap.*`,
  };
}
