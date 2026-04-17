import Link from "next/link";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { offerNavigatorRecommend, getOffers } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const offers = await getOffers();
  const recommendations: ReturnType<typeof offerNavigatorRecommend> = [];

  return (
    <div className="space-y-7">
      <PageHeader
        label="Programs & Offers Finder"
        title="Find the right offer quickly"
        description="Use deterministic helper rules, then inspect details with positioning talk track and nomination guidance."
      />

      <Card>
        <h2 className="text-xl font-semibold text-white">Offer Navigator helper</h2>
        <form className="mt-3 flex flex-col gap-3 sm:flex-row" role="search">
          <Input name="scenario" placeholder="Describe scenario (e.g. security concern on migration deal)" />
          <Button type="submit">Recommend offers</Button>
        </form>
        <div className="mt-4 space-y-2">
          {recommendations.map((item) => (
            <div key={item.offer} className="rounded-xl border border-white/8 p-3">
              <p className="font-medium text-white">{item.offer}</p>
              <p className="text-sm text-neutral-400">{item.why}</p>
              <p className="text-xs text-[#50E6FF]">Confidence: {(item.confidence * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <h3 className="text-lg font-semibold text-white">
              <Link href={`/offers/${offer.slug}`}>{offer.name}</Link>
            </h3>
            <p className="mt-2 text-sm text-neutral-400">{offer.eligibility}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{offer.solutionPlay.replaceAll("_", " ")}</Badge>
              <Badge variant="secondary">{offer.stage}</Badge>
              <Badge variant="secondary">{offer.fundingType}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
