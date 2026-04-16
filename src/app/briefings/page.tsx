import Link from "next/link";
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, Loader2, Users, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  GENERATING: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10", label: "Generating" },
  DRAFT: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Ready" },
  REVIEWED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", label: "Reviewed" },
  EXPORTED: { icon: CheckCircle, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Exported" },
  FAILED: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
};

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  INTERNAL: { icon: FileText, label: "Internal", color: "text-blue-400 bg-blue-500/10" },
  CUSTOMER_FACING: { icon: Users, label: "Customer-Facing", color: "text-emerald-400 bg-emerald-500/10" },
  BOTH: { icon: Layers, label: "Both", color: "text-amber-400 bg-amber-500/10" },
};

export default async function BriefingsPage() {
  const briefings = await prisma.briefing.findMany({
    orderBy: { generatedAt: "desc" },
    include: { createdBy: true, sections: { select: { id: true } } },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission Briefings</h1>
          <p className="mt-1 text-sm text-neutral-400">
            AI-generated QBRs and account briefings &middot; {briefings.length} total
          </p>
        </div>
        <Link
          href="/briefings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#50E6FF] px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#50E6FF]/80"
        >
          <Plus className="h-4 w-4" />
          New Briefing
        </Link>
      </div>

      {briefings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] py-20">
          <FileText className="h-12 w-12 text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-neutral-300">No briefings yet</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Generate your first QBR briefing by entering a TPID.
          </p>
          <Link
            href="/briefings/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/12"
          >
            <Plus className="h-4 w-4" />
            Create Briefing
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {briefings.map((b) => {
            const status = statusConfig[b.status] ?? statusConfig.DRAFT;
            const type = typeConfig[b.briefingType] ?? typeConfig.INTERNAL;
            const StatusIcon = status.icon;
            const TypeIcon = type.icon;
            const sectionCount = b.sections.length;
            const timeAgo = getTimeAgo(b.generatedAt);

            return (
              <Link
                key={b.id}
                href={`/briefings/${b.id}`}
                className="group flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 transition hover:border-white/16 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#50E6FF]/20 to-[#50E6FF]/5">
                    <FileText className="h-5 w-5 text-[#50E6FF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#50E6FF] transition">
                      {b.accountName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
                        TPID {b.tpid}
                      </span>
                      {b.industry && (
                        <span className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] text-neutral-500">
                          {b.industry}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${type.color}`}>
                        <TypeIcon className="h-2.5 w-2.5" />
                        {type.label}
                      </span>
                      <span className="text-[10px] text-neutral-600">
                        {sectionCount} sections · {timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color} ${status.bg}`}>
                  <StatusIcon className={`h-3 w-3 ${b.status === "GENERATING" ? "animate-spin" : ""}`} />
                  {status.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}
