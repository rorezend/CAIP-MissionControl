import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getOfferBySlug } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const offers = await prisma.offer.findMany({ select: { slug: true } });
    return offers.map((o) => ({ slug: o.slug }));
  } catch {
    return [];
  }
}

export default async function OfferDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader label="Offer Detail" title={offer.name} description={offer.eligibility} />
      <div className="flex flex-wrap gap-2">
        <Badge>{offer.solutionPlay.replaceAll("_", " ")}</Badge>
        <Badge variant="secondary">Owner: {offer.owner}</Badge>
      </div>
      <Card>
        <h2 className="text-xl font-semibold text-white">Positioning talk track</h2>
        <p className="mt-2 text-sm text-neutral-300">{offer.talkTrack}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Eligibility checklist</h2>
        <p className="mt-2 text-sm text-neutral-300">{offer.eligibility}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Nomination steps</h2>
        <p className="mt-2 text-sm text-neutral-300 whitespace-pre-line">{offer.nominationSteps}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Required artifacts</h2>
        <p className="mt-2 text-sm text-neutral-300">{offer.requiredArtifacts}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">FAQ</h2>
        <p className="mt-2 text-sm text-neutral-300">{offer.faq}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Community tips & gotchas</h2>
        <div className="mt-3 space-y-2">
          {offer.comments.map((comment) => (
            <p key={comment.id} className="text-sm text-neutral-300">{comment.body} - {comment.author.displayName}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}
