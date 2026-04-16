/**
 * Token provider for Microsoft APIs (Power BI, Dataverse, Graph).
 *
 * Uses client-credentials flow via @azure/identity when configured,
 * or falls back to a static token from env var for dev/testing.
 */

const TENANT_ID = process.env.AZURE_AD_TENANT_ID;
const CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET;

interface TokenCache {
  token: string;
  expiresAt: number;
}

const cache: Record<string, TokenCache> = {};

/**
 * Get an access token for the given resource scope.
 * Returns null if credentials are not configured.
 */
export async function getAccessToken(scope: string): Promise<string | null> {
  // Check for a static token override (dev/testing)
  const envKey = `AZURE_TOKEN_${scope.replace(/[^a-zA-Z]/g, "_").toUpperCase()}`;
  const staticToken = process.env[envKey];
  if (staticToken) return staticToken;

  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    return null;
  }

  // Check cache
  const cached = cache[scope];
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  // Client credentials flow
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope,
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    console.error(`Token acquisition failed for scope ${scope}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  cache[scope] = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export function hasCredentials(): boolean {
  return !!(TENANT_ID && CLIENT_ID && CLIENT_SECRET);
}
