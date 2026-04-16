"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const devUsers = [
  { alias: "alexc", name: "Alex Chen", role: "SSP" },
  { alias: "priyar", name: "Priya Raman", role: "SE" },
  { alias: "jordanl", name: "Jordan Lee", role: "CSA" },
];

export default function DevLoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleLogin(alias: string) {
    setLoading(alias);
    await signIn("credentials", { alias, callbackUrl: "/" });
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Dev Login</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Select a mock user to sign in (development only).
        </p>
      </div>

      <div className="space-y-3">
        {devUsers.map((user) => (
          <button
            key={user.alias}
            onClick={() => handleLogin(user.alias)}
            disabled={loading !== null}
            className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-[#50E6FF]/40 hover:bg-white/[0.06] disabled:opacity-50"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0078D4] text-sm font-bold text-white">
              {user.name.split(" ").map((p) => p[0]).join("")}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">{user.name}</div>
              <div className="text-xs text-neutral-400">{user.role} · {user.alias}</div>
            </div>
            {loading === user.alias && (
              <span className="ml-auto text-xs text-[#50E6FF]">Signing in…</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
