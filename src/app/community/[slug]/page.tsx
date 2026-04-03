import { notFound } from "next/navigation";

import { CopyToTeamsButton } from "@/components/common/copy-to-teams-button";
import { ReactionRow } from "@/components/common/reaction-row";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTopicBySlug } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const topics = await prisma.topic.findMany({ select: { slug: true } });
  return topics.map((t) => ({ slug: t.slug }));
}

export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Badge>{topic.category.replaceAll("_", " ")}</Badge>
      <h1 className="text-4xl font-semibold text-white">{topic.title}</h1>
      <p className="text-lg text-neutral-400">{topic.excerpt}</p>
      <div className="flex items-center gap-4">
        <RatingStars value={topic.avgRating} />
        <ReactionRow like={topic.reactionSummary.like} star={topic.reactionSummary.star} rocket={topic.reactionSummary.rocket} />
      </div>
      <CopyToTeamsButton title={topic.title} bullets={[topic.excerpt, topic.body]} />

      <Card>
        <article className="prose prose-invert max-w-none whitespace-pre-line text-sm text-neutral-300">{topic.body}</article>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Comments</h2>
        {topic.comments.map((comment) => (
          <Card key={comment.id} className="rounded-2xl">
            <p className="text-sm text-neutral-200">{comment.body}</p>
            <p className="mt-1 text-xs text-neutral-500">{comment.author.displayName}</p>
            {comment.replies.length > 0 ? (
              <div className="mt-3 space-y-2 border-l border-white/8 pl-3">
                {comment.replies.map((reply) => (
                  <p key={reply.id} className="text-xs text-neutral-400">
                    @{reply.author.alias}: {reply.body}
                  </p>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </section>
    </div>
  );
}
