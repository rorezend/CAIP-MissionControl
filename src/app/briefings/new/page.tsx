"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Users, Layers, Loader2 } from "lucide-react";

const industries = [
  "CPG / Retail",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing",
  "Energy & Utilities",
  "Media & Entertainment",
  "Technology / ISV",
  "Public Sector",
  "Other",
];

const templates = [
  {
    id: "INTERNAL",
    title: "Internal QBR",
    description:
      "Full MSFT-internal pack with raw ACR data, pipeline details, RAG scoring, SL2 root cause analysis, and action tracker.",
    icon: FileText,
    accent: "text-blue-400",
    borderSelected: "border-blue-500/60 bg-blue-500/[0.06]",
    borderDefault: "border-white/8 hover:border-blue-500/30",
  },
  {
    id: "CUSTOMER_FACING",
    title: "Customer-Facing Executive QBR",
    description:
      "Executive-ready briefing with anonymized peer benchmarking, infographic KPI cards, forward-looking AI themes, and transparency notes.",
    icon: Users,
    accent: "text-emerald-400",
    borderSelected: "border-emerald-500/60 bg-emerald-500/[0.06]",
    borderDefault: "border-white/8 hover:border-emerald-500/30",
  },
  {
    id: "BOTH",
    title: "Both Reports",
    description:
      "Generate internal and customer-facing briefings in a single run. Same data collection, two output formats.",
    icon: Layers,
    accent: "text-amber-400",
    borderSelected: "border-amber-500/60 bg-amber-500/[0.06]",
    borderDefault: "border-white/8 hover:border-amber-500/30",
  },
];

export default function NewBriefingPage() {
  const router = useRouter();
  const [tpid, setTpid] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = tpid.trim() && industry && selectedTemplate;

  async function handleGenerate() {
    if (!isReady) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/briefings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tpid: tpid.trim(),
          industry,
          briefingType: selectedTemplate,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create briefing");
      }

      const data = await res.json();
      router.push(`/briefings/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">New Mission Briefing</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Enter a customer TPID, select the industry vertical, and choose the report type.
        </p>
      </div>

      {/* TPID Input */}
      <div className="space-y-2">
        <label htmlFor="tpid" className="block text-sm font-medium text-neutral-300">
          Customer TPID
        </label>
        <input
          id="tpid"
          type="text"
          value={tpid}
          onChange={(e) => setTpid(e.target.value)}
          placeholder="e.g. 646983"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#50E6FF]/50 focus:outline-none focus:ring-1 focus:ring-[#50E6FF]/50"
        />
        <p className="text-xs text-neutral-500">
          The MSX Top Parent ID for the customer account.
        </p>
      </div>

      {/* Industry / Vertical Selector */}
      <div className="space-y-2">
        <label htmlFor="industry" className="block text-sm font-medium text-neutral-300">
          Industry / Vertical
        </label>
        <select
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#50E6FF]/50 focus:outline-none focus:ring-1 focus:ring-[#50E6FF]/50"
        >
          <option value="" className="bg-neutral-900 text-neutral-500">
            Select industry…
          </option>
          {industries.map((ind) => (
            <option key={ind} value={ind} className="bg-neutral-900 text-white">
              {ind}
            </option>
          ))}
        </select>
        <p className="text-xs text-neutral-500">
          Used for peer benchmarking context in the customer-facing report.
        </p>
      </div>

      {/* Report Type Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-300">Report Type</label>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id)}
                className={`flex flex-col items-start rounded-xl border-2 p-5 text-left transition ${
                  isSelected ? t.borderSelected : `bg-white/[0.02] ${t.borderDefault}`
                }`}
              >
                <Icon className={`h-6 w-6 ${isSelected ? t.accent : "text-neutral-500"}`} />
                <h3 className="mt-3 text-sm font-semibold text-white">{t.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!isReady || loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#50E6FF] px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#50E6FF]/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Briefing…
          </>
        ) : (
          <>
            Generate Briefing
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
