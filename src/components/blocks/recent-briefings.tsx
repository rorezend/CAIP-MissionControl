import Link from "next/link";
import { FileText, ArrowRight, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusIcons: Record<string, { icon: typeof CheckCircle; color: string }> = {
  GENERATING: { icon: Loader2, color: "text-blue-400" },
  DRAFT: { icon: CheckCircle, color: "text-emerald-400" },
  REVIEWED: { icon: CheckCircle, color: "text-green-400" },
  EXPORTED: { icon: CheckCircle, color: "text-cyan-400" },
  FAILED: { icon: AlertTriangle, color: "text-red-400" },
};

export async function RecentBriefings() {
  const briefings = await prisma.briefing.findMany({
    orderBy: { generatedAt: "desc" },
    take: 3,
  });

  if (briefings.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#50E6FF]" />
          Recent Briefings
        </h3>
        <Link
          href="/briefings"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {briefings.map((b) => {
          const status = statusIcons[b.status] ?? statusIcons.DRAFT;
          const Icon = status.icon;
          return (
            <Link
              key={b.id}
              href={`/briefings/${b.id}`}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5 transition hover:bg-white/[0.06]"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-200 truncate">{b.accountName}</p>
                <p className="text-[10px] text-neutral-500">
                  TPID {b.tpid} · {b.briefingType === "INTERNAL" ? "Internal" : "Customer"} ·{" "}
                  {b.generatedAt.toLocaleDateString()}
                </p>
              </div>
              <Icon
                className={`h-3.5 w-3.5 shrink-0 ml-2 ${status.color} ${
                  b.status === "GENERATING" ? "animate-spin" : ""
                }`}
              />
            </Link>
          );
        })}
      </div>
      <Link
        href="/briefings/new"
        className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 py-2 text-xs text-neutral-500 transition hover:border-[#50E6FF]/30 hover:text-[#50E6FF]"
      >
        + New Briefing
      </Link>
    </div>
  );
}
