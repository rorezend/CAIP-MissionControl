import { FieldRole, Prisma, SolutionPlay, TargetType, TopicCategory } from "@prisma/client";
import { subDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { computeTrendingScore } from "@/lib/trending";
import { ContentBlock } from "@/lib/types";

export async function getTrendingTopics(limit = 6) {
  const topics = await prisma.topic.findMany({
    include: {
      author: true,
      comments: true,
    },
  });

  const ratings = await prisma.rating.findMany({ where: { targetType: TargetType.TOPIC } });
  const reactions = await prisma.reaction.findMany({ where: { targetType: TargetType.TOPIC } });

  return topics
    .map((topic) => {
      const topicRatings = ratings.filter((item) => item.targetId === topic.id);
      const avgRating =
        topicRatings.length > 0
          ? topicRatings.reduce((sum, item) => sum + item.value, 0) / topicRatings.length
          : 0;
      const topicReactions = reactions.filter((item) => item.targetId === topic.id).length;
      const score = computeTrendingScore({
        reactions: topicReactions,
        comments: topic.comments.length,
        avgRating,
        updatedAt: topic.lastUpdatedAt,
      });
      return {
        ...topic,
        avgRating,
        reactionCount: topicReactions,
        commentCount: topic.comments.length,
        trendingScore: score,
        changedRecently: topic.lastUpdatedAt >= subDays(new Date(), 7),
      };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

export async function searchEverything(query: string) {
  const whereContains = { contains: query, mode: Prisma.QueryMode.insensitive };

  const [topics, wikiPages, offers, dashboards] = await Promise.all([
    prisma.topic.findMany({
      where: { OR: [{ title: whereContains }, { excerpt: whereContains }, { tags: whereContains }] },
      take: 8,
    }),
    prisma.wikiPage.findMany({
      where: { OR: [{ title: whereContains }, { tags: whereContains }] },
      take: 8,
    }),
    prisma.offer.findMany({
      where: { OR: [{ name: whereContains }, { talkTrack: whereContains }, { owner: whereContains }] },
      take: 8,
    }),
    prisma.dashboard.findMany({
      where: { OR: [{ name: whereContains }, { tags: whereContains }, { description: whereContains }] },
      take: 8,
    }),
  ]);

  return { topics, wikiPages, offers, dashboards };
}

export async function getCommunityFeed(args?: {
  tab?: "Trending" | "Latest" | "My Bookmarks" | "My Contributions";
  sort?: "trending" | "rating" | "newest" | "discussed";
  categories?: TopicCategory[];
}) {
  const list = await getTrendingTopics(50);
  let filtered = [...list];

  if (args?.categories?.length) {
    filtered = filtered.filter((topic) => args.categories?.includes(topic.category));
  }

  if (args?.sort === "rating") {
    filtered.sort((a, b) => b.avgRating - a.avgRating);
  }

  if (args?.sort === "newest") {
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  if (args?.sort === "discussed") {
    filtered.sort((a, b) => b.commentCount - a.commentCount);
  }

  return filtered;
}

export async function getAgenda(role?: FieldRole) {
  const events = await prisma.event.findMany({ orderBy: { startsAt: "asc" }, take: 10 });
  if (!role) {
    return events;
  }
  return events.filter((event) => event.roleAudience.includes(role));
}

export async function getHomeLeadership() {
  const leadership = await prisma.leadershipPost.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
  return {
    primary: leadership.find((post) => post.featured) ?? leadership[0],
    secondary: leadership.filter((post) => !post.featured).slice(0, 3),
  };
}

export async function getQuickLinks() {
  return [
    { label: "Offer Navigator", href: "/offers", description: "Find the best-fit offer for each scenario." },
    { label: "Playbooks", href: "/plays", description: "Use role-ready discovery, objections, and talk tracks." },
    { label: "Dashboards Hub", href: "/dashboards", description: "Jump into ACR, pipeline, and program telemetry." },
    { label: "Skilling", href: "/community?category=SKILLING", description: "Required learning pathways and fast starts." },
  ];
}

export async function getLayoutBlocks(pageKey: string) {
  const config = await prisma.layoutConfig.findUnique({ where: { pageKey } });
  if (!config) {
    return [] as ContentBlock[];
  }
  return (config.blocks as ContentBlock[]).sort((a, b) => a.order - b.order);
}

export async function getTopicBySlug(slug: string) {
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        include: { author: true, replies: { include: { author: true } } },
        where: { parentId: null },
      },
    },
  });

  if (!topic) {
    return null;
  }

  const [ratings, reactions] = await Promise.all([
    prisma.rating.findMany({ where: { targetType: TargetType.TOPIC, targetId: topic.id } }),
    prisma.reaction.findMany({ where: { targetType: TargetType.TOPIC, targetId: topic.id } }),
  ]);

  return {
    ...topic,
    avgRating: ratings.length ? ratings.reduce((sum, item) => sum + item.value, 0) / ratings.length : 0,
    reactionSummary: {
      like: reactions.filter((item) => item.reaction === "LIKE").length,
      star: reactions.filter((item) => item.reaction === "STAR").length,
      rocket: reactions.filter((item) => item.reaction === "ROCKET").length,
    },
  };
}

export async function getWikiPages() {
  const pages = await prisma.wikiPage.findMany({ include: { author: true }, orderBy: { updatedAt: "desc" } });
  const ratings = await prisma.rating.findMany({ where: { targetType: TargetType.WIKI } });
  return pages.map((page) => {
    const score = ratings.filter((item) => item.targetId === page.id);
    return {
      ...page,
      avgRating: score.length ? score.reduce((sum, item) => sum + item.value, 0) / score.length : 0,
    };
  });
}

export async function getWikiPageBySlug(slug: string) {
  const page = await prisma.wikiPage.findUnique({
    where: { slug },
    include: {
      author: true,
      revisions: { include: { editor: true }, orderBy: { revisionNumber: "desc" } },
      comments: { include: { author: true } },
    },
  });

  if (!page) {
    return null;
  }

  const ratings = await prisma.rating.findMany({ where: { targetType: TargetType.WIKI, targetId: page.id } });
  return {
    ...page,
    avgRating: ratings.length ? ratings.reduce((sum, item) => sum + item.value, 0) / ratings.length : 0,
    contributors: Array.from(new Set(page.revisions.map((revision) => revision.editor.displayName))),
  };
}

export async function getOffers() {
  return prisma.offer.findMany({ include: { comments: { include: { author: true } } } });
}

export async function getOfferBySlug(slug: string) {
  return prisma.offer.findUnique({ where: { slug }, include: { comments: { include: { author: true } } } });
}

export async function getDashboards() {
  return prisma.dashboard.findMany({ include: { comments: { include: { author: true } } } });
}

export async function getLeadershipPosts() {
  return prisma.leadershipPost.findMany({ include: { comments: { include: { author: true } }, author: true }, orderBy: { createdAt: "desc" } });
}

export function offerNavigatorRecommend(scenario: string) {
  const normalized = scenario.toLowerCase();
  const rules: Array<{ offer: string; why: string; confidence: number; match: RegExp }> = [
    {
      offer: "Azure Frontier Offer",
      why: "Strong fit for early presales where customer needs a structured first-win motion.",
      confidence: 0.84,
      match: /(frontier|new logo|first win|pilot)/,
    },
    {
      offer: "Factory Acceleration",
      why: "Factory is ideal when delivery risk or speed to value is the primary blocker.",
      confidence: 0.88,
      match: /(delivery|implementation|acceleration|handoff|factory)/,
    },
    {
      offer: "Defender Attach Motion",
      why: "Security attach strategy aligns with M&M and risk conversations.",
      confidence: 0.79,
      match: /(security|defender|compliance|risk)/,
    },
    {
      offer: "Azure Offer Navigator",
      why: "Navigator helps route ambiguous scenarios to the right program stack.",
      confidence: 0.72,
      match: /(unsure|which offer|program|navigation|decision)/,
    },
  ];

  const matched = rules.filter((rule) => rule.match.test(normalized));

  if (matched.length > 0) {
    return matched.map(({ offer, why, confidence }) => ({ offer, why, confidence }));
  }

  return [
    {
      offer: "Azure Offer Navigator",
      why: "Default path when no deterministic keyword match appears.",
      confidence: 0.55,
    },
  ];
}

export const playCards: Array<{
  title: string;
  slug: string;
  play: SolutionPlay;
  talkTrack: string;
  discovery: string[];
  objections: string[];
  learning: string[];
}> = [
  {
    title: "Migrate & Modernize",
    slug: "migrate-modernize",
    play: SolutionPlay.MIGRATE_MODERNIZE,
    talkTrack: "Modernization is the shortest path to reliable AI-ready foundations and secure operations.",
    discovery: ["What blocks modernization today?", "Which workloads are highest friction?", "Where is security debt visible?"],
    objections: ["Too disruptive right now", "No budget this quarter", "Unclear ROI"],
    learning: ["Map top workloads", "Align migration wave", "Attach Defender motion"],
  },
  {
    title: "Unify Data Platform",
    slug: "unify-data-platform",
    play: SolutionPlay.UNIFY_DATA_PLATFORM,
    talkTrack: "Unified data platform is the prerequisite for trustworthy, scalable AI outcomes.",
    discovery: ["How many analytics silos exist?", "Where does governance break?", "What is the latency to insight?"],
    objections: ["We already have tools", "Integration will take too long", "Business doesn’t see urgency"],
    learning: ["Baseline data estate", "Align Fabric + DB story", "Define value milestones"],
  },
  {
    title: "AI Apps & Agents",
    slug: "ai-apps-agents",
    play: SolutionPlay.AI_APPS_AGENTS,
    talkTrack: "Build durable AI apps by combining Foundry, Fabric, and secure data foundations.",
    discovery: ["Which use cases have measurable value?", "What guardrails are required?", "How will success be measured?"],
    objections: ["Pilot fatigue", "Hallucination risk", "Security concerns"],
    learning: ["Define 2-value scenarios", "Use offer-backed launch", "Instrument adoption dashboard"],
  },
];
