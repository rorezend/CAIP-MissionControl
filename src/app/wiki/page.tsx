import Link from "next/link";

import { CopyToTeamsButton } from "@/components/common/copy-to-teams-button";
import { PageHeader } from "@/components/common/page-header";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getWikiPages } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function WikiPage() {
  const pages = await getWikiPages();

  return (
    <div className="space-y-7">
      <PageHeader
        label="Collaborative Wiki"
        title="Modular knowledge base with revision history"
        description="Edit markdown pages, track diffs by revision, and surface quality signals for governance."
      />

      <div className="flex flex-wrap gap-3">
        <Button>Edit with callout blocks</Button>
        <Button variant="outline">Create wiki page</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  <Link href={`/wiki/${page.slug}`}>{page.title}</Link>
                </h3>
                <p className="mt-1 text-sm text-neutral-400">Contributors: {page.author.displayName}</p>
              </div>
              {page.needsReview ? <Badge variant="warning">Needs review</Badge> : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RatingStars value={page.avgRating} />
              <Badge variant="secondary">Updated {new Date(page.updatedAt).toLocaleDateString()}</Badge>
              <CopyToTeamsButton title={page.title} bullets={["Wiki summary", "Key links placeholder"]} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
