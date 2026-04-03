import { notFound } from "next/navigation";

import { CopyToTeamsButton } from "@/components/common/copy-to-teams-button";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getWikiPageBySlug } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const pages = await prisma.wikiPage.findMany({ select: { slug: true } });
  return pages.map((p) => ({ slug: p.slug }));
}

export default async function WikiDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getWikiPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const revisions = page.revisions;
  const latest = revisions[0];
  const previous = revisions[1];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold text-white">{page.title}</h1>
      <div className="flex flex-wrap items-center gap-3">
        <RatingStars value={page.avgRating} />
        <Badge variant={page.needsReview ? "warning" : "secondary"}>{page.needsReview ? "Needs review" : "Healthy"}</Badge>
        <Badge variant="secondary">Contributors: {page.contributors.join(", ")}</Badge>
      </div>
      <CopyToTeamsButton title={page.title} bullets={["Page summary", "Callouts", "Key links"]} />

      <Card>
        <article className="prose prose-invert max-w-none whitespace-pre-line text-sm text-neutral-300">{page.body}</article>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-white">Revision history</h2>
        <div className="mt-4 space-y-4">
          {revisions.map((revision) => (
            <div key={revision.id} className="rounded-xl border border-white/8 p-3">
              <p className="text-sm text-neutral-200">Revision {revision.revisionNumber}: {revision.summary}</p>
              <p className="text-xs text-neutral-500">Editor: {revision.editor.displayName}</p>
            </div>
          ))}
        </div>
      </Card>

      {latest && previous ? (
        <Card>
          <h2 className="text-2xl font-semibold text-white">Diff viewer (latest vs previous)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-neutral-400">Previous</p>
              <pre className="overflow-x-auto rounded-xl border border-white/8 bg-[#1a1a1a] p-3 text-xs text-neutral-400">{previous.bodySnapshot}</pre>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-neutral-400">Latest</p>
              <pre className="overflow-x-auto rounded-xl border border-[#50E6FF]/20 bg-[#50E6FF]/5 p-3 text-xs text-[#50E6FF]">{latest.bodySnapshot}</pre>
            </div>
          </div>
          <Separator className="my-4" />
          <Button>Restore previous version</Button>
        </Card>
      ) : null}
    </div>
  );
}
