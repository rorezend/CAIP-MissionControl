"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Trash2,
  LayoutDashboard,
  List,
  ExternalLink,
} from "lucide-react";

interface BriefingSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  ragStatus: string | null;
  sortOrder: number;
}

interface Briefing {
  id: string;
  tpid: string;
  accountName: string;
  industry: string;
  briefingType: string;
  status: string;
  htmlContent: string;
  errorMessage: string | null;
  generatedAt: string;
  createdBy: { displayName: string };
  sections: BriefingSection[];
}

type Tab = "dashboard" | "sections";

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  GENERATING: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10", label: "Generating" },
  DRAFT: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Ready" },
  REVIEWED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", label: "Reviewed" },
  EXPORTED: { icon: CheckCircle, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Exported" },
  FAILED: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
};

export default function BriefingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [regenerating, setRegenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBriefing = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefings/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setBriefing(data);
      setLoading(false);
      if (data.status !== "GENERATING") setRegenerating(false);
    } catch {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  // Poll while generating
  useEffect(() => {
    if (!briefing || briefing.status !== "GENERATING") return;
    const interval = setInterval(fetchBriefing, 2000);
    return () => clearInterval(interval);
  }, [briefing?.status, fetchBriefing]);

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch(`/api/briefings/${id}/regenerate`, { method: "POST" });
      if (res.ok) fetchBriefing();
      else setRegenerating(false);
    } catch {
      setRegenerating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/briefings/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/briefings");
      else setDeleting(false);
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#50E6FF]" />
      </div>
    );
  }

  if (!briefing) {
    return <div className="py-20 text-center text-neutral-500">Briefing not found.</div>;
  }

  const typeLabel =
    briefing.briefingType === "INTERNAL"
      ? "Internal QBR"
      : briefing.briefingType === "CUSTOMER_FACING"
        ? "Customer-Facing Executive QBR"
        : "Internal + Customer-Facing QBR";

  const isReady = ["DRAFT", "REVIEWED", "EXPORTED"].includes(briefing.status);
  const cfg = statusConfig[briefing.status] || statusConfig.DRAFT;
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/briefings"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition hover:text-neutral-300"
          >
            <ArrowLeft className="h-3 w-3" />
            All Briefings
          </Link>
          <h1 className="truncate text-2xl font-bold text-white">{briefing.accountName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="rounded bg-white/6 px-2 py-0.5 font-mono">TPID {briefing.tpid}</span>
            <span className="rounded bg-white/6 px-2 py-0.5">{briefing.industry}</span>
            <span className="rounded bg-white/6 px-2 py-0.5">{typeLabel}</span>
            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium ${cfg.color} ${cfg.bg}`}>
              <StatusIcon className={`h-3 w-3 ${briefing.status === "GENERATING" ? "animate-spin" : ""}`} />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {isReady && (
            <>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-neutral-300 transition hover:bg-white/8 disabled:opacity-40"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
                Regenerate
              </button>
              <a
                href={`/api/briefings/${briefing.id}?format=html`}
                download={`qbr-${briefing.accountName.toLowerCase().replace(/\s+/g, "-")}.html`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#50E6FF] px-3 py-2 text-xs font-semibold text-[#1a1a1a] transition hover:bg-[#50E6FF]/80"
              >
                <Download className="h-3.5 w-3.5" />
                Export HTML
              </a>
            </>
          )}
          <div className="relative">
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {showDeleteConfirm && (
              <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-white/10 bg-neutral-900 p-3 shadow-xl">
                <p className="text-xs text-neutral-300">Delete this briefing permanently?</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-40"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded bg-white/10 px-3 py-1 text-xs text-neutral-300 hover:bg-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generating Progress */}
      {briefing.status === "GENERATING" && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-blue-300">Generating briefing&hellip;</p>
              <p className="text-xs text-blue-400/60">Collecting data and building sections (30–60s)</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {briefing.sections.map((section) => {
              const isDone = section.content && !section.content.includes("\u23f3");
              return (
                <div
                  key={section.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.03] text-neutral-500"
                  }`}
                >
                  {isDone ? <CheckCircle className="h-3 w-3 shrink-0" /> : <Loader2 className="h-3 w-3 shrink-0 animate-spin" />}
                  <span className="truncate">{section.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Failed Banner */}
      {briefing.status === "FAILED" && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <span className="text-sm text-red-400">Generation failed: {briefing.errorMessage || "Unknown error"}</span>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 rounded bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/30"
          >
            <RefreshCw className={`h-3 w-3 ${regenerating ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {/* Tab Bar */}
      {isReady && (
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "bg-white/10 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard Preview
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "sections"
                ? "bg-white/10 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <List className="h-4 w-4" />
            Sections ({briefing.sections.length})
          </button>
          <a
            href={`/api/briefings/${briefing.id}?format=html`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs text-neutral-500 transition hover:text-neutral-300"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Full Report
          </a>
        </div>
      )}

      {/* Dashboard Tab — Full HTML preview as hero */}
      {isReady && activeTab === "dashboard" && briefing.htmlContent && (
        <div className="overflow-hidden rounded-xl border border-white/8 bg-white shadow-lg">
          <iframe
            srcDoc={briefing.htmlContent}
            className="h-[800px] w-full"
            title="Briefing Dashboard"
            sandbox=""
          />
        </div>
      )}

      {/* Sections Tab — Raw content cards */}
      {isReady && activeTab === "sections" && briefing.sections.length > 0 && (
        <div className="space-y-4">
          {briefing.sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-white">{section.title}</h2>
                {section.ragStatus && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      section.ragStatus === "GREEN"
                        ? "bg-green-500/20 text-green-400"
                        : section.ragStatus === "AMBER"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : section.ragStatus === "RED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-neutral-500/20 text-neutral-400"
                    }`}
                  >
                    {section.ragStatus}
                  </span>
                )}
              </div>
              <div className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-neutral-400">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Footer */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-5 py-3">
        <p className="text-xs text-neutral-600">
          Created by {briefing.createdBy.displayName} &middot;{" "}
          {new Date(briefing.generatedAt).toLocaleString()} &middot; {briefing.sections.length} sections
          {briefing.htmlContent ? ` · ${Math.round(briefing.htmlContent.length / 1024)}KB HTML` : ""}
        </p>
      </div>
    </div>
  );
}
