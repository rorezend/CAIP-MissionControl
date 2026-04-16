"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

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

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  GENERATING: { icon: Loader2, color: "text-blue-400", label: "Generating" },
  DRAFT: { icon: CheckCircle, color: "text-emerald-400", label: "Draft Ready" },
  REVIEWED: { icon: CheckCircle, color: "text-green-400", label: "Reviewed" },
  EXPORTED: { icon: CheckCircle, color: "text-cyan-400", label: "Exported" },
  FAILED: { icon: AlertTriangle, color: "text-red-400", label: "Failed" },
};

export default function BriefingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBriefing = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefings/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setBriefing(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  // Poll every 2s while generating
  useEffect(() => {
    if (!briefing || briefing.status !== "GENERATING") return;
    const interval = setInterval(fetchBriefing, 2000);
    return () => clearInterval(interval);
  }, [briefing?.status, fetchBriefing]);

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
  const StatusIcon = statusConfig[briefing.status]?.icon || Clock;
  const statusColor = statusConfig[briefing.status]?.color || "text-neutral-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/briefings"
            className="mb-3 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition hover:text-neutral-300"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Briefings
          </Link>
          <h1 className="text-2xl font-bold text-white">{briefing.accountName}</h1>
          <p className="mt-1 text-sm text-neutral-400">
            TPID {briefing.tpid} &middot; {briefing.industry} &middot; {typeLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusColor}`}>
            <StatusIcon className={`h-4 w-4 ${briefing.status === "GENERATING" ? "animate-spin" : ""}`} />
            {statusConfig[briefing.status]?.label || briefing.status}
          </span>
          {isReady && (
            <a
              href={`/api/briefings/${briefing.id}?format=html`}
              download={`qbr-${briefing.accountName.toLowerCase().replace(/\s+/g, "-")}.html`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#50E6FF] px-4 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#50E6FF]/80"
            >
              <Download className="h-4 w-4" />
              Export HTML
            </a>
          )}
        </div>
      </div>

      {/* Generating Progress */}
      {briefing.status === "GENERATING" && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-blue-500/30" />
              <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-300">Generating your briefing&hellip;</p>
              <p className="text-xs text-blue-400/60">
                Collecting data and building sections. This may take 30&ndash;60 seconds.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {briefing.sections.map((section) => {
              const isDone = section.content && !section.content.includes("\u23f3");
              return (
                <div
                  key={section.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.03] text-neutral-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="h-3 w-3 shrink-0" />
                  ) : (
                    <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
                  )}
                  <span className="truncate">{section.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Failed Banner */}
      {briefing.status === "FAILED" && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          Generation failed: {briefing.errorMessage || "Unknown error"}
        </div>
      )}

      {/* Sections */}
      {isReady && briefing.sections.length > 0 && (
        <div className="space-y-6">
          {briefing.sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                {section.ragStatus && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
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
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HTML Preview */}
      {isReady && briefing.htmlContent && (
        <details className="group rounded-xl border border-white/8 bg-white/[0.02]">
          <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-neutral-300 transition hover:text-white">
            &#9654; Preview Full HTML Report
          </summary>
          <div className="border-t border-white/8 p-1">
            <iframe
              srcDoc={briefing.htmlContent}
              className="h-[700px] w-full rounded-lg"
              title="Briefing Preview"
              sandbox=""
            />
          </div>
        </details>
      )}

      {/* Metadata */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-6 py-4">
        <p className="text-xs text-neutral-600">
          Created by {briefing.createdBy.displayName} &middot;{" "}
          <Clock className="inline h-3 w-3" />{" "}
          {new Date(briefing.generatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
