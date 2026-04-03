import { PrismaClient, FieldRole, ModerationRole, TopicCategory, SolutionPlay, TargetType, ReactionType } from "@prisma/client";
import { subDays, addDays } from "date-fns";

const prisma = new PrismaClient();

const users = [
  { displayName: "Alex Chen", alias: "alexc", fieldRole: FieldRole.SSP, moderationRole: ModerationRole.Moderator, interests: "AI_APPS_AGENTS,UNIFY_DATA_PLATFORM" },
  { displayName: "Priya Raman", alias: "priyar", fieldRole: FieldRole.SE, moderationRole: ModerationRole.Contributor, interests: "MIGRATE_MODERNIZE,AI_APPS_AGENTS" },
  { displayName: "Jordan Lee", alias: "jordanl", fieldRole: FieldRole.CSA, moderationRole: ModerationRole.Contributor, interests: "UNIFY_DATA_PLATFORM" },
  { displayName: "Mei Ito", alias: "meii", fieldRole: FieldRole.SSP, moderationRole: ModerationRole.Contributor, interests: "AI_APPS_AGENTS" },
  { displayName: "Samir Patel", alias: "samirp", fieldRole: FieldRole.SE, moderationRole: ModerationRole.Reader, interests: "MIGRATE_MODERNIZE,UNIFY_DATA_PLATFORM" },
];

const topicSeeds: Array<[string, TopicCategory, SolutionPlay]> = [
  ["Foundry + Fabric + SQL: Unified pitch in 7 minutes", TopicCategory.AI_DATA_GO_BIG, SolutionPlay.AI_APPS_AGENTS],
  ["Top objections on GenAI TCO and how to answer", TopicCategory.OBJECTION_HANDLING, SolutionPlay.AI_APPS_AGENTS],
  ["U2C milestone hygiene checklist that actually sticks", TopicCategory.PIPELINE_U2C, SolutionPlay.MIGRATE_MODERNIZE],
  ["AFO nomination packet: what blocks approval", TopicCategory.OFFERS_PROGRAMS, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["Azure Offer Navigator scenarios for SSP discovery", TopicCategory.OFFERS_PROGRAMS, SolutionPlay.AI_APPS_AGENTS],
  ["Factory handoff playbook for week-1 acceleration", TopicCategory.FACTORY_CONCIERGE, SolutionPlay.MIGRATE_MODERNIZE],
  ["Concierge engagement triggers by opportunity stage", TopicCategory.FACTORY_CONCIERGE, SolutionPlay.MIGRATE_MODERNIZE],
  ["Business value storyline template: CDO + CFO", TopicCategory.BUSINESS_VALUE, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["Compete quick hits vs point AI startups", TopicCategory.COMPETE, SolutionPlay.AI_APPS_AGENTS],
  ["Copilot + data estate modernization narrative", TopicCategory.BUSINESS_VALUE, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["How we rescue late-stage deals with milestone rigor", TopicCategory.PIPELINE_U2C, SolutionPlay.MIGRATE_MODERNIZE],
  ["ECIF/ACO usage patterns with strongest conversion", TopicCategory.OFFERS_PROGRAMS, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["Agentic SDLC: where field teams get stuck", TopicCategory.AGENTS, SolutionPlay.AI_APPS_AGENTS],
  ["Fabric ops agents concept demo notes", TopicCategory.AGENTS, SolutionPlay.AI_APPS_AGENTS],
  ["How to frame Defender attach in M&M motion", TopicCategory.OFFERS_PROGRAMS, SolutionPlay.MIGRATE_MODERNIZE],
  ["Value articulation examples for board-ready slides", TopicCategory.BUSINESS_VALUE, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["Skilling sprint: 14-day plan for new SSPs", TopicCategory.SKILLING, SolutionPlay.AI_APPS_AGENTS],
  ["Process anti-patterns in opportunity reviews", TopicCategory.PROCESS, SolutionPlay.MIGRATE_MODERNIZE],
  ["Customer proof points for AI + Data Go Big", TopicCategory.AI_DATA_GO_BIG, SolutionPlay.AI_APPS_AGENTS],
  ["Ask: best script for first executive call?", TopicCategory.OBJECTION_HANDLING, SolutionPlay.UNIFY_DATA_PLATFORM],
  ["WinWire summary checklist for Apps that Matter", TopicCategory.PROCESS, SolutionPlay.AI_APPS_AGENTS],
  ["How to position databases as platform backbone", TopicCategory.AI_DATA_GO_BIG, SolutionPlay.UNIFY_DATA_PLATFORM],
];

const offers = [
  "Azure Frontier Offer",
  "Azure Offer Navigator",
  "Factory Acceleration",
  "Concierge FastTrack",
  "ECIF Co-Sell Support",
  "ACO Consumption Kickstart",
  "Defender Attach Motion",
  "Data Estate Modernization Catalyst",
  "Apps That Matter Booster",
  "Fabric Adoption Sprint",
  "Migration Landing Zone Boost",
  "Industry Value Workshop",
];

const dashboards = [
  ["ACR Velocity Board", "ACR"],
  ["Pipeline U2C Health", "Pipeline"],
  ["Program Utilization Heatmap", "Programs"],
  ["IAR Weekly Signals", "IAR"],
  ["MSXi Account Pulse", "MSXi"],
  ["Offer Mix Performance", "Programs"],
  ["Milestone Compliance Radar", "Pipeline"],
  ["Factory Throughput Monitor", "Programs"],
  ["AI + Data Play Momentum", "ACR"],
  ["Skilling Completion Tracker", "Programs"],
];

const wikiPages = [
  "How to run a milestone review",
  "How to pick the right offer",
  "Compete quick hits",
  "Customer value narrative starter",
  "Foundry/Fabric/DB positioning summary",
  "How to submit an Apps that Matter WinWire",
  "U2C hygiene rubric",
  "Objection handling library",
  "Role-based discovery guide",
  "Offer artifact checklist",
  "Community call facilitation kit",
  "Dashboard interpretation starter",
];

const leadershipPosts = [
  "Top of Mind: Platform wins through integrated AI story",
  "Top of Mind: U2C discipline is everyone’s job",
  "Top of Mind: Use offers early, not late",
  "Top of Mind: Business value narrative quality bar",
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.bookmark.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.wikiRevision.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.wikiPage.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.dashboard.deleteMany();
  await prisma.leadershipPost.deleteMany();
  await prisma.event.deleteMany();
  await prisma.layoutConfig.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers = [];
  for (const user of users) {
    createdUsers.push(await prisma.user.create({ data: user }));
  }

  const topics = [];
  for (let i = 0; i < topicSeeds.length; i += 1) {
    const [title, category, play] = topicSeeds[i];
    const author = createdUsers[i % createdUsers.length];
    topics.push(
      await prisma.topic.create({
        data: {
          title,
          slug: slugify(title),
          excerpt: `${title} - field tested notes and practical actions.`,
          body: `## Why this matters\n${title}\n\n## What to do next\n- Align to priority motions\n- Use offers intentionally\n- Share what worked in the community call`,
          category,
          solutionPlay: play,
          tags: "ai,data,offers,pipeline,field",
          isQuestion: title.startsWith("Ask:"),
          whatChanged: i % 3 === 0 ? "Added new objection handling examples from March calls." : "Refined checklist and nomination guidance.",
          featured: i < 6,
          lastUpdatedAt: subDays(new Date(), i),
          createdAt: subDays(new Date(), i + 4),
          authorId: author.id,
        },
      }),
    );
  }

  const createdOffers = [];
  for (let i = 0; i < offers.length; i += 1) {
    const name = offers[i];
    createdOffers.push(
      await prisma.offer.create({
        data: {
          slug: slugify(name),
          name,
          eligibility: "Qualified opportunity with customer commitment and defined executive sponsor.",
          solutionPlay: [SolutionPlay.AI_APPS_AGENTS, SolutionPlay.UNIFY_DATA_PLATFORM, SolutionPlay.MIGRATE_MODERNIZE][i % 3],
          stage: i % 2 === 0 ? "Presales" : "Post-sales",
          fundingType: i % 2 === 0 ? "Incentive" : "Engineering support",
          roiNotes: "Prioritize opportunities with measurable 6-month value path.",
          owner: `${createdUsers[i % createdUsers.length].displayName} (Field Programs)`,
          talkTrack: "Use this program to reduce execution friction and accelerate customer outcomes.",
          nominationSteps: "1) Validate scenario 2) Confirm artifacts 3) Submit in tracker 4) Review in weekly cadence.",
          requiredArtifacts: "Executive summary, architecture sketch, value hypothesis, timeline.",
          faq: "Q: Can this combine with other funding motions? A: Yes, with milestone alignment.",
        },
      }),
    );
  }

  const createdDashboards = [];
  for (let i = 0; i < dashboards.length; i += 1) {
    const [name, tag] = dashboards[i];
    createdDashboards.push(
      await prisma.dashboard.create({
        data: {
          slug: slugify(name),
          name,
          description: `${name} helps teams monitor performance and identify gaps quickly.`,
          owner: createdUsers[i % createdUsers.length].displayName,
          tags: `${tag},Field,CAIP`,
          url: `https://contoso.powerbi.com/${slugify(name)}`,
        },
      }),
    );
  }

  const createdWikiPages = [];
  for (let i = 0; i < wikiPages.length; i += 1) {
    const title = wikiPages[i];
    const page = await prisma.wikiPage.create({
      data: {
        slug: slugify(title),
        title,
        tags: "playbook,wiki,execution",
        body: `# ${title}\n\n> Tip: Keep this page practical and role-specific.\n\n## Checklist\n- Gather opportunity context\n- Align to play and offer\n- Publish summary to community`,
        needsReview: i % 4 === 0,
        featuredHome: i < 3,
        authorId: createdUsers[i % createdUsers.length].id,
      },
    });

    await prisma.wikiRevision.create({
      data: {
        revisionNumber: 1,
        titleSnapshot: page.title,
        tagsSnapshot: page.tags,
        bodySnapshot: page.body,
        summary: "Initial version",
        editorId: page.authorId,
        wikiPageId: page.id,
      },
    });

    await prisma.wikiRevision.create({
      data: {
        revisionNumber: 2,
        titleSnapshot: page.title,
        tagsSnapshot: `${page.tags},reviewed`,
        bodySnapshot: `${page.body}\n\n## Latest updates\n- Added practical examples from field calls.`,
        summary: "Added recent call examples",
        editorId: createdUsers[(i + 1) % createdUsers.length].id,
        wikiPageId: page.id,
      },
    });

    createdWikiPages.push(page);
  }

  const createdLeadership = [];
  for (let i = 0; i < leadershipPosts.length; i += 1) {
    createdLeadership.push(
      await prisma.leadershipPost.create({
        data: {
          title: leadershipPosts[i],
          summary: "Weekly framing to sharpen execution quality and consistency.",
          body: "Focus on platform differentiation, offer utilization, and milestone rigor to improve conversion and customer value.",
          emphasisBullets: "Platform matters|Run milestone hygiene weekly|Use offers proactively|Raise community signal quality",
          callToAction: "Bring one live opportunity and one blocker to the community call.",
          featured: i === 0,
          authorId: createdUsers[0].id,
        },
      }),
    );
  }

  const events = [
    ["SSP Community Call", "Share objections, wins, and asks", 2, "SSP", "Community"],
    ["SE Office Hours", "Offer fitting and architecture Q&A", 4, "SE", "Office Hours"],
    ["CSA Enablement Sprint", "Deployment blockers and handoff patterns", 6, "CSA", "Enablement"],
    ["Top of Mind Weekly", "Leadership priorities and field CTA", 8, "SSP,SE,CSA", "Leadership"],
    ["Pipeline Hygiene Review", "U2C milestone quality checkpoint", 10, "SSP,SE", "Pipeline"],
  ] as const;

  for (const [title, description, days, roleAudience, eventType] of events) {
    await prisma.event.create({ data: { title, description, startsAt: addDays(new Date(), days), roleAudience, eventType } });
  }

  for (const topic of topics) {
    for (let i = 0; i < 3; i += 1) {
      const user = createdUsers[(i + 1) % createdUsers.length];
      await prisma.comment.create({
        data: {
          body: i === 0 ? "This helped in my last customer exec prep." : i === 1 ? "Added this to our account plan template." : "Can someone share one concrete example?",
          authorId: user.id,
          topicId: topic.id,
          createdAt: subDays(new Date(), i),
        },
      });

      await prisma.rating.create({ data: { userId: user.id, targetType: TargetType.TOPIC, targetId: topic.id, value: 4 + (i % 2) } });
      await prisma.reaction.create({ data: { userId: user.id, targetType: TargetType.TOPIC, targetId: topic.id, reaction: [ReactionType.LIKE, ReactionType.STAR, ReactionType.ROCKET][i % 3] } });
      if (i === 0) {
        await prisma.bookmark.create({ data: { userId: user.id, targetType: TargetType.TOPIC, targetId: topic.id } });
      }
    }
  }

  for (const page of createdWikiPages) {
    for (let i = 0; i < 2; i += 1) {
      const user = createdUsers[(i + 2) % createdUsers.length];
      await prisma.rating.create({ data: { userId: user.id, targetType: TargetType.WIKI, targetId: page.id, value: 4 + i } });
    }
  }

  for (const offer of createdOffers) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.comment.create({
      data: {
        body: "Best used when nomination artifacts are drafted before deal review.",
        authorId: user.id,
        offerId: offer.id,
      },
    });
  }

  for (const dashboard of createdDashboards) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.comment.create({
      data: {
        body: "Use filter by quarter and play to isolate conversion trends quickly.",
        authorId: user.id,
        dashboardId: dashboard.id,
      },
    });
  }

  for (const post of createdLeadership) {
    await prisma.comment.create({
      data: {
        body: "I need help applying this in two enterprise accounts this week.",
        authorId: createdUsers[1].id,
        leadershipPostId: post.id,
      },
    });
    await prisma.rating.create({ data: { userId: createdUsers[2].id, targetType: TargetType.LEADERSHIP, targetId: post.id, value: 5 } });
  }

  await prisma.layoutConfig.create({
    data: {
      pageKey: "home",
      title: "Home Layout",
      blocks: [
        { type: "HeroBlock", order: 1 },
        { type: "NowShippingStrip", order: 2 },
        { type: "TopicGridBlock", order: 3 },
        { type: "AgendaBlock", order: 4 },
        { type: "LeadershipBlock", order: 5 },
        { type: "CTAButtonRow", order: 6 },
      ],
    },
  });

  await prisma.layoutConfig.create({
    data: {
      pageKey: "leadership",
      title: "Leadership Layout",
      blocks: [
        { type: "HeroBlock", order: 1 },
        { type: "QuoteBlock", order: 2 },
        { type: "ChecklistBlock", order: 3 },
        { type: "FAQBlock", order: 4 },
      ],
    },
  });

  console.log("Seed complete: users, topics, offers, dashboards, wiki pages, comments, ratings, reactions, layouts.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
