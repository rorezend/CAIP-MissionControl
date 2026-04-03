import Link from "next/link";

import { CopyToTeamsButton } from "@/components/common/copy-to-teams-button";
import { PageHeader } from "@/components/common/page-header";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCommunityFeed } from "@/lib/data";

const categories = [
  "AI_DATA_GO_BIG",
  "OFFERS_PROGRAMS",
  "PIPELINE_U2C",
  "FACTORY_CONCIERGE",
  "BUSINESS_VALUE",
  "OBJECTION_HANDLING",
  "AGENTS",
  "SKILLING",
  "PROCESS",
  "COMPETE",
] as const;

export default async function CommunityPage() {
  const feed = await getCommunityFeed({
    tab: "Trending",
    sort: "trending",
  });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Community Hub"
        title="Collaborate on what wins in the field"
        description="Ratings, reactions, threaded comments, and fast topic creation in one place."
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <Button key={item} variant="secondary" size="sm" asChild>
            <Link href={`/community?category=${item}`}>{item.replaceAll("_", " ")}</Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Create topic</Button>
        <Button variant="outline">Ask the community</Button>
      </div>

      <Tabs defaultValue="Trending">
        <TabsList>
          <TabsTrigger value="Trending">Trending</TabsTrigger>
          <TabsTrigger value="Latest">Latest</TabsTrigger>
          <TabsTrigger value="My Bookmarks">My Bookmarks</TabsTrigger>
          <TabsTrigger value="My Contributions">My Contributions</TabsTrigger>
        </TabsList>

        <TabsContent value="Trending" className="space-y-4">
          {feed.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/community/${topic.slug}`}>{topic.title}</Link>
                    </CardTitle>
                    <p className="mt-1 text-sm text-neutral-400">{topic.excerpt}</p>
                  </div>
                  {topic.changedRecently ? <Badge>What changed</Badge> : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex flex-wrap gap-2">
                  {topic.tags.split(",").slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <RatingStars value={topic.avgRating} />
                  <p className="text-xs text-neutral-500">{topic.commentCount} comments</p>
                  <CopyToTeamsButton
                    title={topic.title}
                    bullets={[
                      topic.excerpt,
                      `Author: ${topic.author.displayName}`,
                      `Trending score: ${topic.trendingScore.toFixed(1)}`,
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
