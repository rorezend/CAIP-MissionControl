import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BriefingDetailPage({ params }: Props) {
  const { id } = await params;

  const briefing = await prisma.briefing.findUnique({
    where: { id },
    include: {
      createdBy: true,
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!briefing) notFound();

  const typeLabel = briefing.briefingType === "INTERNAL" ? "Internal QBR" : "Customer-Facing Executive QBR";
  const isReady = briefing.status === "DRAFT" || briefing.status === "REVIEWED" || briefing.status === "EXPORTED";

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
            TPID {briefing.tpid} · {typeLabel} · Generated{" "}
            {briefing.generatedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {isReady && (
            <a
              href={`/api/briefings/${briefing.id}?format=html`}
              download={`qbr-${briefing.accountName.toLowerCase().replace(/\s+/g, "-")}.html`}
              className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/12"
            >
              <Download className="h-4 w-4" />
              Export HTML
            </a>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {briefing.status === "GENERATING" && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
          <p className="text-sm text-blue-300">
            Briefing is being generated. This may take a few minutes…
          </p>
        </div>
      )}

      {briefing.status === "FAILED" && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          Generation failed: {briefing.errorMessage || "Unknown error"}
        </div>
      )}

      {/* Sections */}
      {isReady && briefing.sections.length > 0 && (
        <div className="space-y-6">
          {briefing.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
            >
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
              <div className="prose prose-invert mt-4 max-w-none text-sm text-neutral-300">
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
            Preview Full HTML Report
          </summary>
          <div className="border-t border-white/8 p-1">
            <iframe
              srcDoc={briefing.htmlContent}
              className="h-[600px] w-full rounded-lg bg-white"
              title="Briefing Preview"
              sandbox=""
            />
          </div>
        </details>
      )}

      {/* Metadata */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-6 py-4">
        <p className="text-xs text-neutral-600">
          Created by {briefing.createdBy.displayName} ·{" "}
          <Clock className="inline h-3 w-3" />{" "}
          {briefing.generatedAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
