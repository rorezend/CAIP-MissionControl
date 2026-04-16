import Link from "next/link";
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  GENERATING: { icon: Loader2, color: "text-blue-400", label: "Generating" },
  DRAFT: { icon: FileText, color: "text-yellow-400", label: "Draft" },
  REVIEWED: { icon: CheckCircle, color: "text-green-400", label: "Reviewed" },
  EXPORTED: { icon: CheckCircle, color: "text-emerald-400", label: "Exported" },
  FAILED: { icon: AlertTriangle, color: "text-red-400", label: "Failed" },
};

export default async function BriefingsPage() {
  const briefings = await prisma.briefing.findMany({
    orderBy: { generatedAt: "desc" },
    include: { createdBy: true },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission Briefings</h1>
          <p className="mt-1 text-sm text-neutral-400">
            AI-generated Quarterly Business Reviews and account briefings
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
        <div className="grid gap-4">
          {briefings.map((b) => {
            const cfg = statusConfig[b.status] ?? statusConfig.DRAFT;
            const Icon = cfg.icon;
            return (
              <Link
                key={b.id}
                href={`/briefings/${b.id}`}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 transition hover:border-white/16 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/6">
                    <FileText className="h-5 w-5 text-[#50E6FF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{b.accountName}</h3>
                    <p className="text-xs text-neutral-500">
                      TPID {b.tpid} · {b.briefingType === "INTERNAL" ? "Internal" : "Customer-Facing"} ·{" "}
                      {b.generatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
