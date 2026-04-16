/**
 * MSX Dataverse Collector — Account Info + Pipeline
 *
 * Calls the Dataverse OData API to resolve account names and fetch pipeline data.
 * Endpoint: https://microsoftsales.crm.dynamics.com/api/data/v9.2/
 */

import { getAccessToken } from "./auth";
import type { CollectorResult, AccountInfo, PipelineData, PipelineOpportunity, AuthContext } from "../types";

const DATAVERSE_URL = "https://microsoftsales.crm.dynamics.com/api/data/v9.2";
const DATAVERSE_SCOPE = "https://microsoftsales.crm.dynamics.com/.default";

async function queryDataverse(path: string, token: string): Promise<Record<string, unknown>[]> {
  const url = `${DATAVERSE_URL}/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dataverse query failed: ${res.status} — ${text.substring(0, 200)}`);
  }

  const data = await res.json();
  return data.value ?? [];
}

export async function collectAccountInfo(tpid: string, _auth: AuthContext): Promise<CollectorResult<AccountInfo>> {
  const token = await getAccessToken(DATAVERSE_SCOPE);
  if (!token) {
    return {
      status: "unavailable",
      data: null,
      sources: ["MSX Dataverse (no token)"],
      collectedAt: new Date().toISOString(),
      errorMessage: "Dataverse credentials not configured. Using mock data.",
    };
  }

  try {
    // Find account by TPID
    const accounts = await queryDataverse(
      `accounts?$filter=msp_tpid eq '${tpid}'&$select=name,msp_tpid,msp_industry&$top=1`,
      token
    );

    if (accounts.length === 0) {
      return {
        status: "unavailable",
        data: null,
        sources: ["MSX Dataverse"],
        collectedAt: new Date().toISOString(),
        errorMessage: `No account found for TPID ${tpid}`,
      };
    }

    const acct = accounts[0];
    return {
      status: "ok",
      data: {
        tpid,
        name: (acct.name as string) || `Account TPID ${tpid}`,
        industry: (acct["msp_industry@OData.Community.Display.V1.FormattedValue"] as string) || "Unknown",
        teamMembers: [], // Would need connection entity query for team members
      },
      sources: ["MSX Dataverse (Account entity)"],
      collectedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: "error",
      data: null,
      sources: ["MSX Dataverse"],
      collectedAt: new Date().toISOString(),
      errorMessage: err instanceof Error ? err.message : "Unknown Dataverse error",
    };
  }
}

export async function collectPipelineData(tpid: string, _auth: AuthContext): Promise<CollectorResult<PipelineData>> {
  const token = await getAccessToken(DATAVERSE_SCOPE);
  if (!token) {
    return {
      status: "unavailable",
      data: null,
      sources: ["MSX Dataverse (no token)"],
      collectedAt: new Date().toISOString(),
      errorMessage: "Dataverse credentials not configured. Using mock data.",
    };
  }

  try {
    // Fetch open opportunities for the account's TPID
    const opps = await queryDataverse(
      `opportunities?$filter=statecode eq 0 and parentaccountid/msp_tpid eq '${tpid}'` +
        `&$select=name,estimatedvalue,msp_salesstage,estimatedclosedate,msp_solutionarea` +
        `&$expand=parentaccountid($select=name)` +
        `&$orderby=estimatedvalue desc&$top=50`,
      token
    );

    const opportunities: PipelineOpportunity[] = opps.map((o) => ({
      name: (o.name as string) || "Unnamed",
      value: Number(o.estimatedvalue) || 0,
      stage: (o["msp_salesstage@OData.Community.Display.V1.FormattedValue"] as string) || "Unknown",
      closeDate: (o.estimatedclosedate as string) || "",
      solutionArea: (o["msp_solutionarea@OData.Community.Display.V1.FormattedValue"] as string) || "Unknown",
    }));

    const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);

    // Build stage summary
    const stageMap = new Map<string, { count: number; value: number }>();
    for (const opp of opportunities) {
      const existing = stageMap.get(opp.stage) || { count: 0, value: 0 };
      stageMap.set(opp.stage, { count: existing.count + 1, value: existing.value + opp.value });
    }

    const stageSummary = Array.from(stageMap.entries())
      .map(([stage, data]) => ({ stage, ...data }))
      .sort((a, b) => b.value - a.value);

    // Committed = Close stage; uncommitted = rest
    const committedValue = opportunities
      .filter((o) => o.stage.toLowerCase().includes("close"))
      .reduce((sum, o) => sum + o.value, 0);

    return {
      status: "ok",
      data: {
        totalValue: Math.round(totalValue),
        committedValue: Math.round(committedValue),
        uncommittedValue: Math.round(totalValue - committedValue),
        opportunities: opportunities.slice(0, 10), // Top 10 by value
        stageSummary,
      },
      sources: ["MSX Dataverse (Opportunity entity)"],
      collectedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: "error",
      data: null,
      sources: ["MSX Dataverse"],
      collectedAt: new Date().toISOString(),
      errorMessage: err instanceof Error ? err.message : "Unknown Dataverse error",
    };
  }
}
