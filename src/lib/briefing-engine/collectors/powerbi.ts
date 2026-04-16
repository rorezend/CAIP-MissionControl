/**
 * Power BI ACR Collector
 *
 * Queries the MSA (Microsoft Sales Analytics) Power BI semantic model
 * for ACR trend, top services, and growth rates.
 *
 * Known artifacts:
 *   MSA: 726c8fed-367a-4249-b685-e4e22ca82b3d (BICOE_Prod_BICore_Azure01 workspace)
 */

import { getAccessToken } from "./auth";
import type { CollectorResult, ACRData, ACRDataPoint, AuthContext } from "../types";

const MSA_ARTIFACT_ID = "726c8fed-367a-4249-b685-e4e22ca82b3d";
const PBI_SCOPE = "https://analysis.windows.net/powerbi/api/.default";
const PBI_API = "https://api.powerbi.com/v1.0/myorg";

interface PBIQueryResult {
  results?: Array<{
    tables?: Array<{
      rows?: Array<Record<string, unknown>>;
    }>;
  }>;
}

async function executeDaxQuery(artifactId: string, dax: string, token: string): Promise<Record<string, unknown>[]> {
  const url = `${PBI_API}/datasets/${artifactId}/executeQueries`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      queries: [{ query: dax }],
      serializerSettings: { includeNulls: true },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Power BI query failed: ${res.status} — ${text.substring(0, 200)}`);
  }

  const data: PBIQueryResult = await res.json();
  return data?.results?.[0]?.tables?.[0]?.rows ?? [];
}

function buildACRTrendQuery(tpid: string): string {
  return `
EVALUATE
SUMMARIZECOLUMNS(
  F_ACR[Fiscal_Month],
  KEEPFILTERS(TREATAS({"${tpid}"}, D_Account[TPID])),
  "ACR", [$ ACR]
)
ORDER BY F_ACR[Fiscal_Month]
  `.trim();
}

function buildTopServicesQuery(tpid: string): string {
  return `
EVALUATE
TOPN(
  8,
  SUMMARIZECOLUMNS(
    D_Service_Level[ServiceLevel4],
    KEEPFILTERS(TREATAS({"${tpid}"}, D_Account[TPID])),
    "ACR", [$ ACR]
  ),
  [ACR], DESC
)
ORDER BY [ACR] DESC
  `.trim();
}

function parseFiscalMonth(fm: string): string {
  // e.g. "FY26-Mar" → "Mar 2026"
  const match = fm?.match(/FY(\d{2})-(\w+)/);
  if (!match) return fm || "Unknown";
  const fy = parseInt(match[1]);
  const month = match[2];
  const calYear = month.match(/^(Jul|Aug|Sep|Oct|Nov|Dec)/) ? 2000 + fy - 1 : 2000 + fy;
  return `${month} ${calYear}`;
}

export async function collectACRData(tpid: string, _auth: AuthContext): Promise<CollectorResult<ACRData>> {
  const token = await getAccessToken(PBI_SCOPE);
  if (!token) {
    return {
      status: "unavailable",
      data: null,
      sources: ["Power BI MSA (no token)"],
      collectedAt: new Date().toISOString(),
      errorMessage: "Power BI credentials not configured. Using mock data.",
    };
  }

  try {
    // Run both queries in parallel
    const [trendRows, serviceRows] = await Promise.all([
      executeDaxQuery(MSA_ARTIFACT_ID, buildACRTrendQuery(tpid), token),
      executeDaxQuery(MSA_ARTIFACT_ID, buildTopServicesQuery(tpid), token),
    ]);

    if (trendRows.length === 0) {
      return {
        status: "unavailable",
        data: null,
        sources: ["Power BI MSA"],
        collectedAt: new Date().toISOString(),
        errorMessage: `No ACR data found for TPID ${tpid}`,
      };
    }

    // Parse trend data
    const trend: ACRDataPoint[] = trendRows.map((row) => ({
      month: parseFiscalMonth(row["F_ACR[Fiscal_Month]"] as string),
      acr: Math.round(Number(row["[ACR]"]) || 0),
    }));

    // Take last 6 months
    const recentTrend = trend.slice(-6);
    const current = recentTrend[recentTrend.length - 1]?.acr ?? 0;

    // Growth rates (day-normalized comparison)
    const m6ago = recentTrend[0]?.acr ?? current;
    const m3ago = recentTrend.length >= 4 ? recentTrend[recentTrend.length - 3]?.acr ?? current : current;
    const growthRate6M = m6ago > 0 ? Math.round(((current - m6ago) / m6ago) * 1000) / 10 : null;
    const growthRate3M = m3ago > 0 ? Math.round(((current - m3ago) / m3ago) * 1000) / 10 : null;

    // Parse top services
    const topServices = serviceRows.slice(0, 5).map((row) => ({
      name: (row["D_Service_Level[ServiceLevel4]"] as string) || "Unknown",
      acr: Math.round(Number(row["[ACR]"]) || 0),
      delta: 0, // Delta requires a second time-period query
    }));

    return {
      status: "ok",
      data: {
        current,
        trend: recentTrend,
        growthRate6M,
        growthRate3M,
        topServices,
      },
      sources: ["Power BI MSA (Microsoft Sales Analytics)"],
      collectedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: "error",
      data: null,
      sources: ["Power BI MSA"],
      collectedAt: new Date().toISOString(),
      errorMessage: err instanceof Error ? err.message : "Unknown Power BI error",
    };
  }
}
