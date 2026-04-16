import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBriefing } from "@/lib/briefing-engine/orchestrator";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/briefings/[id]/regenerate — re-run generation
export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const briefing = await prisma.briefing.findUnique({ where: { id } });
  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  if (briefing.status === "GENERATING") {
    return NextResponse.json({ error: "Already generating" }, { status: 409 });
  }

  // Reset status and clear old content
  await prisma.briefing.update({
    where: { id },
    data: {
      status: "GENERATING",
      htmlContent: "",
      errorMessage: "",
    },
  });

  // Reset all sections
  await prisma.briefingSection.updateMany({
    where: { briefingId: id },
    data: { content: "\u23f3 Generating\u2026", ragStatus: null },
  });

  // Fire-and-forget
  generateBriefing(id).catch((err) => {
    console.error(`Briefing regeneration failed for ${id}:`, err);
  });

  return NextResponse.json({ id, status: "GENERATING" });
}
