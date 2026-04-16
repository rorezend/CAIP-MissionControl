import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/briefings — list all briefings
export async function GET() {
  const briefings = await prisma.briefing.findMany({
    orderBy: { generatedAt: "desc" },
    include: { createdBy: true },
    take: 50,
  });

  return NextResponse.json(briefings);
}

// POST /api/briefings — create a new briefing
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tpid, industry, briefingType } = body;

  if (!tpid || !briefingType) {
    return NextResponse.json(
      { error: "tpid and briefingType are required" },
      { status: 400 }
    );
  }

  if (!["INTERNAL", "CUSTOMER_FACING", "BOTH"].includes(briefingType)) {
    return NextResponse.json(
      { error: "briefingType must be INTERNAL, CUSTOMER_FACING, or BOTH" },
      { status: 400 }
    );
  }

  // For now, use the first user as creator (replace with auth user later)
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json(
      { error: "No users found. Run prisma:seed first." },
      { status: 500 }
    );
  }

  // Create the briefing record in GENERATING status
  const briefing = await prisma.briefing.create({
    data: {
      tpid: String(tpid),
      accountName: `Account TPID ${tpid}`, // Will be resolved by the engine
      industry: industry || "",
      briefingType: briefingType as "INTERNAL" | "CUSTOMER_FACING" | "BOTH",
      status: "GENERATING",
      createdById: user.id,
    },
  });

  // TODO: Trigger async briefing generation engine here
  // For now, create placeholder sections and mark as DRAFT
  const sectionDefs =
    briefingType === "INTERNAL"
      ? [
          { sectionKey: "exec_summary", title: "Executive Summary", sortOrder: 0 },
          { sectionKey: "kpi_rag", title: "ACR → KPI → Executive Message", sortOrder: 1 },
          { sectionKey: "root_cause", title: "ACR Decline Root Cause (SL4 → SL2)", sortOrder: 2 },
          { sectionKey: "pipeline", title: "Pipeline & Execution Health", sortOrder: 3 },
          { sectionKey: "action_tracker", title: "Action Tracker", sortOrder: 4 },
        ]
      : briefingType === "CUSTOMER_FACING"
        ? [
            { sectionKey: "exec_summary", title: "Executive Summary", sortOrder: 0 },
            { sectionKey: "kpi_scorecard", title: "KPI Scorecard", sortOrder: 1 },
            { sectionKey: "root_cause", title: "Consumption Trend – Root Cause View", sortOrder: 2 },
            { sectionKey: "peer_comparison", title: "Industry Context: Peer Indicators", sortOrder: 3 },
            { sectionKey: "risks_opps", title: "Key Risks & Opportunities", sortOrder: 4 },
            { sectionKey: "action_plan", title: "Action Plan", sortOrder: 5 },
            { sectionKey: "forward_looking", title: "Looking Ahead", sortOrder: 6 },
          ]
        : [
            // BOTH — combined sections
            { sectionKey: "exec_summary_internal", title: "Executive Summary (Internal)", sortOrder: 0 },
            { sectionKey: "kpi_rag", title: "ACR → KPI → Executive Message", sortOrder: 1 },
            { sectionKey: "root_cause_internal", title: "ACR Decline Root Cause (SL4 → SL2)", sortOrder: 2 },
            { sectionKey: "pipeline", title: "Pipeline & Execution Health", sortOrder: 3 },
            { sectionKey: "action_tracker", title: "Action Tracker", sortOrder: 4 },
            { sectionKey: "exec_summary_external", title: "Executive Summary (Customer-Facing)", sortOrder: 10 },
            { sectionKey: "kpi_scorecard", title: "KPI Scorecard", sortOrder: 11 },
            { sectionKey: "root_cause_external", title: "Consumption Trend – Root Cause View", sortOrder: 12 },
            { sectionKey: "peer_comparison", title: "Industry Context: Peer Indicators", sortOrder: 13 },
            { sectionKey: "risks_opps", title: "Key Risks & Opportunities", sortOrder: 14 },
            { sectionKey: "forward_looking", title: "Looking Ahead", sortOrder: 15 },
          ];

  await prisma.briefingSection.createMany({
    data: sectionDefs.map((s) => ({
      briefingId: briefing.id,
      ...s,
      content: "Pending generation — connect MCP data sources to populate this section.",
    })),
  });

  // Mark as DRAFT (placeholder until async engine is wired)
  const updated = await prisma.briefing.update({
    where: { id: briefing.id },
    data: { status: "DRAFT" },
  });

  return NextResponse.json(updated, { status: 201 });
}
