import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { getOffers, getTrendingTopics, playCards } from "@/lib/data";

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return playCards.map((p) => ({ slug: p.slug }));
}

export default async function PlayDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const play = playCards.find((item) => item.slug === slug);

  if (!play) {
    notFound();
  }

  const [topics, offers] = await Promise.all([getTrendingTopics(20), getOffers()]);
  const bestTopics = topics.filter((item) => item.solutionPlay === play.play).slice(0, 4);
  const bestOffers = offers.filter((item) => item.solutionPlay === play.play).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader label="Play" title={play.title} description={play.talkTrack} />
      <Card>
        <h2 className="text-xl font-semibold text-white">Discovery questions</h2>
        <ul className="mt-2 space-y-2 text-sm text-neutral-300">
          {play.discovery.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Objections and rebuttals</h2>
        <ul className="mt-2 space-y-2 text-sm text-neutral-300">
          {play.objections.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Best community topics for this play</h2>
        <ul className="mt-2 space-y-2 text-sm text-neutral-300">
          {bestTopics.map((item) => (
            <li key={item.id}>- {item.title}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Best offers to pair</h2>
        <ul className="mt-2 space-y-2 text-sm text-neutral-300">
          {bestOffers.map((item) => (
            <li key={item.id}>- {item.name}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-white">Mini learning checklist</h2>
        <ul className="mt-2 space-y-2 text-sm text-neutral-300">
          {play.learning.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
