import { MessageSquareWarning } from "lucide-react";

import { CopyToTeamsButton } from "@/components/common/copy-to-teams-button";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLeadershipPosts, getLayoutBlocks } from "@/lib/data";

export default async function LeadershipPage() {
  const [posts, blocks] = await Promise.all([getLeadershipPosts(), getLayoutBlocks("leadership")]);
  const featured = posts[0];

  const blockSet = new Set(blocks.map((item) => item.type));

  return (
    <div className="space-y-7">
      <PageHeader
        label="Leadership"
        title="Top of Mind"
        description="Monthly priorities, leadership emphasis, and field calls to action in one cadence-driven view."
      />

      {featured && (!blocks.length || blockSet.has("HeroBlock")) ? (
        <Card className="border-[#50E6FF]/20 bg-[#50E6FF]/5">
          <Badge>Featured priority</Badge>
          <h2 className="mt-2 text-3xl font-semibold text-white">{featured.title}</h2>
          <p className="mt-2 text-neutral-300">{featured.summary}</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            {featured.emphasisBullets.split("|").map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button>I need help applying this</Button>
            <CopyToTeamsButton title={featured.title} bullets={featured.emphasisBullets.split("|")} />
          </div>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {posts.slice(1).map((post) => (
          <Card key={post.id}>
            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">{post.callToAction}</p>
            <div className="mt-3 space-y-2">
              {post.comments.map((comment) => (
                <p key={comment.id} className="rounded-lg border border-white/8 px-3 py-2 text-xs text-neutral-400">
                  <MessageSquareWarning className="mr-1 inline h-3.5 w-3.5" />
                  {comment.body}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
