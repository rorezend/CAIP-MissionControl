/**
 * Collector Factory — Routes between real API collectors and mock data.
 *
 * Uses real collectors when API credentials are available;
 * falls back to mock data otherwise (graceful degradation).
 *
 * Each collector independently checks for its required credentials,
 * so you might get real ACR data with mock pipeline data if only
 * Power BI credentials are configured.
 */

import { hasCredentials } from "./auth";
import { collectACRData } from "./powerbi";
import { collectAccountInfo, collectPipelineData } from "./dataverse";
import { collectWorkplaceContext } from "./workiq";
import { mockCollectors } from "../collectors-mock";
import type { DataCollectors, CollectorResult, AuthContext } from "../types";

/**
 * Smart collectors that try real APIs first, then fall back to mocks.
 * Each collector is independent — one can succeed while another falls back.
 */
export const liveCollectors: DataCollectors = {
  async collectAccountInfo(tpid, auth) {
    const result = await collectAccountInfo(tpid, auth);
    if (result.status === "ok") return result;

    // Fall back to mock, but tag the sources
    console.log(`[collectors] Account info unavailable for TPID ${tpid}, using mock. Reason: ${result.errorMessage}`);
    const mock = await mockCollectors.collectAccountInfo(tpid, auth);
    mock.sources = [...result.sources, ...mock.sources];
    return mock;
  },

  async collectACRData(tpid, auth) {
    const result = await collectACRData(tpid, auth);
    if (result.status === "ok") return result;

    console.log(`[collectors] ACR data unavailable for TPID ${tpid}, using mock. Reason: ${result.errorMessage}`);
    const mock = await mockCollectors.collectACRData(tpid, auth);
    mock.sources = [...result.sources, ...mock.sources];
    return mock;
  },

  async collectPipelineData(tpid, auth) {
    const result = await collectPipelineData(tpid, auth);
    if (result.status === "ok") return result;

    console.log(`[collectors] Pipeline data unavailable for TPID ${tpid}, using mock. Reason: ${result.errorMessage}`);
    const mock = await mockCollectors.collectPipelineData(tpid, auth);
    mock.sources = [...result.sources, ...mock.sources];
    return mock;
  },

  async collectWorkplaceContext(accountName, auth) {
    const result = await collectWorkplaceContext(accountName, auth);
    if (result.status === "ok") return result;

    console.log(`[collectors] Workplace context unavailable for ${accountName}, using mock. Reason: ${result.errorMessage}`);
    const mock = await mockCollectors.collectWorkplaceContext(accountName, auth);
    mock.sources = [...result.sources, ...mock.sources];
    return mock;
  },
};

/**
 * Get the appropriate collectors based on configuration.
 * Returns live collectors (with mock fallback) when any credentials are configured,
 * or pure mock collectors otherwise.
 */
export function getCollectors(): DataCollectors {
  if (hasCredentials()) {
    console.log("[collectors] Using live collectors with mock fallback");
    return liveCollectors;
  }
  console.log("[collectors] No API credentials configured — using mock collectors");
  return mockCollectors;
}
