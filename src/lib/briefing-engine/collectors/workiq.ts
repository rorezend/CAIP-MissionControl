/**
 * WorkIQ Collector — Workplace Intelligence via Microsoft Graph
 *
 * Queries the M365 Copilot / Graph API for meeting notes, themes,
 * and action items related to a customer account.
 *
 * Requires delegated (user) permissions — Graph API with user token.
 * Falls back to unavailable when no token is present.
 */

import { getAccessToken } from "./auth";
import type { CollectorResult, WorkplaceContext, AuthContext } from "../types";

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";

export async function collectWorkplaceContext(
  accountName: string,
  _auth: AuthContext
): Promise<CollectorResult<WorkplaceContext>> {
  const token = await getAccessToken(GRAPH_SCOPE);
  if (!token) {
    return {
      status: "unavailable",
      data: null,
      sources: ["Microsoft 365 (no token)"],
      collectedAt: new Date().toISOString(),
      errorMessage: "Graph API credentials not configured. Using mock data.",
    };
  }

  try {
    // Search for recent meetings mentioning the account
    const meetingsRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/events?` +
        `$filter=contains(subject,'${encodeURIComponent(accountName)}')&` +
        `$select=subject,start,bodyPreview&` +
        `$orderby=start/dateTime desc&` +
        `$top=10`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }
    );

    const recentMeetings: WorkplaceContext["recentMeetings"] = [];
    if (meetingsRes.ok) {
      const meetingsData = await meetingsRes.json();
      for (const evt of meetingsData.value ?? []) {
        recentMeetings.push({
          date: evt.start?.dateTime?.split("T")[0] ?? "",
          title: evt.subject ?? "Untitled meeting",
          summary: (evt.bodyPreview ?? "").substring(0, 200),
        });
      }
    }

    // Search emails mentioning the account
    const emailsRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?` +
        `$search="${encodeURIComponent(accountName)}"&` +
        `$select=subject,receivedDateTime,bodyPreview&` +
        `$orderby=receivedDateTime desc&` +
        `$top=10`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }
    );

    const keyThemes: string[] = [];
    if (emailsRes.ok) {
      const emailsData = await emailsRes.json();
      // Extract common themes from email subjects
      const subjects = (emailsData.value ?? []).map((e: Record<string, string>) => e.subject || "");
      keyThemes.push(...extractThemes(subjects));
    }

    return {
      status: recentMeetings.length > 0 || keyThemes.length > 0 ? "ok" : "stale",
      data: {
        recentMeetings,
        keyThemes: keyThemes.length > 0 ? keyThemes : ["No recent engagement themes detected"],
        openActions: [],
        risks: [],
      },
      sources: ["Microsoft Graph (Calendar + Mail)"],
      collectedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: "error",
      data: null,
      sources: ["Microsoft Graph"],
      collectedAt: new Date().toISOString(),
      errorMessage: err instanceof Error ? err.message : "Unknown Graph API error",
    };
  }
}

/** Extract themes from a list of email subjects (simple keyword extraction). */
function extractThemes(subjects: string[]): string[] {
  const keywords = new Map<string, number>();
  const stopWords = new Set([
    "re:", "fw:", "fwd:", "the", "a", "an", "and", "or", "is", "to", "from",
    "for", "in", "on", "at", "of", "with", "this", "that", "it", "be", "was",
    "are", "have", "has", "had", "will", "would", "could", "should",
  ]);

  for (const subject of subjects) {
    const words = subject.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      }
    }
  }

  return Array.from(keywords.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}
