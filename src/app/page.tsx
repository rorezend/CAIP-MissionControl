import {
  AgendaBlock,
  CTAButtonRow,
  HeroBlock,
  LeadershipBlock,
  NowShippingStrip,
  TopicGridBlock,
} from "@/components/blocks/mission-control-blocks";
import { RecentBriefings } from "@/components/blocks/recent-briefings";
import { GlobalSearch } from "@/components/layout/global-search";
import { getAgenda, getHomeLeadership, getLayoutBlocks, getQuickLinks, getTrendingTopics } from "@/lib/data";

export const dynamic = 'force-dynamic';

const nowShipping = [
  "AI + Data Go Big",
  "Pipeline / U2C hygiene and milestone rigor",
  "Azure Offer Navigator + AFO updates",
  "Factory / Concierge",
  "Community call highlights",
];

export default async function HomePage() {
  const [topics, agenda, leadership, links] = await Promise.all([
    getTrendingTopics(6),
    getAgenda(),
    getHomeLeadership(),
    getQuickLinks(),
  ]);
  const blocks = await getLayoutBlocks("home");

  const renderedBlocks = blocks.map((block) => {
    if (block.type === "HeroBlock") {
      return <HeroBlock key={block.type} />;
    }
    if (block.type === "NowShippingStrip") {
      return <NowShippingStrip key={block.type} items={nowShipping} />;
    }
    if (block.type === "TopicGridBlock") {
      return <TopicGridBlock key={block.type} topics={topics} />;
    }
    if (block.type === "AgendaBlock") {
      return <AgendaBlock key={block.type} events={agenda} />;
    }
    if (block.type === "LeadershipBlock" && leadership.primary) {
      return <LeadershipBlock key={block.type} primary={leadership.primary} secondary={leadership.secondary} />;
    }
    if (block.type === "CTAButtonRow") {
      return <CTAButtonRow key={block.type} links={links} />;
    }
    return null;
  });

  return (
    <div className="space-y-12">
      <GlobalSearch />
      {renderedBlocks.length > 0 ? renderedBlocks : <TopicGridBlock topics={topics} />}
      <RecentBriefings />
    </div>
  );
}
