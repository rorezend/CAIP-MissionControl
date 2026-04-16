import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/briefings/[id] — get briefing details or export HTML
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const format = request.nextUrl.searchParams.get("format");

  const briefing = await prisma.briefing.findUnique({
    where: { id },
    include: {
      createdBy: true,
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  // If format=html, return the HTML content directly (no forced download for browser preview)
  if (format === "html" && briefing.htmlContent) {
    return new NextResponse(briefing.htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return NextResponse.json(briefing);
}

// DELETE /api/briefings/[id] — delete briefing and its sections
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const briefing = await prisma.briefing.findUnique({ where: { id } });
  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  // Delete sections first (cascade), then briefing
  await prisma.briefingSection.deleteMany({ where: { briefingId: id } });
  await prisma.briefing.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
