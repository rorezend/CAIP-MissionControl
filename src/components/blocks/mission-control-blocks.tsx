import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, MessageSquareMore } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingStars } from "@/components/common/rating-stars";
import { PixelLogo } from "@/components/blocks/pixel-logo";

/* Small pixel-art decoration used in Build-style layouts */
function PixelDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-grid grid-cols-3 gap-[3px] ${className}`} aria-hidden>
      <span className="h-1.5 w-1.5 bg-[#50E6FF]" />
      <span className="h-1.5 w-1.5 bg-transparent" />
      <span className="h-1.5 w-1.5 bg-[#E3008C]" />
      <span className="h-1.5 w-1.5 bg-transparent" />
      <span className="h-1.5 w-1.5 bg-[#FFB900]" />
      <span className="h-1.5 w-1.5 bg-transparent" />
      <span className="h-1.5 w-1.5 bg-[#00CC6A]" />
      <span className="h-1.5 w-1.5 bg-transparent" />
      <span className="h-1.5 w-1.5 bg-[#50E6FF]" />
    </span>
  );
}

export function HeroBlock() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-black px-6 py-16 md:px-12 md:py-24">
      {/* Pixel decoration — top-right */}
      <div className="absolute right-6 top-6 grid grid-cols-4 gap-1" aria-hidden>
        <span className="h-2 w-2 bg-[#50E6FF]" />
        <span className="h-2 w-2 bg-[#E3008C]" />
        <span className="h-2 w-2 bg-[#FFB900]" />
        <span className="h-2 w-2 bg-[#00CC6A]" />
        <span className="h-2 w-2 bg-[#E3008C]" />
        <span className="h-2 w-2 bg-transparent" />
        <span className="h-2 w-2 bg-transparent" />
        <span className="h-2 w-2 bg-[#50E6FF]" />
        <span className="h-2 w-2 bg-[#FFB900]" />
        <span className="h-2 w-2 bg-transparent" />
        <span className="h-2 w-2 bg-[#00CC6A]" />
        <span className="h-2 w-2 bg-transparent" />
      </div>
      {/* Pixel decoration — bottom-left */}
      <div className="absolute bottom-6 left-6 grid grid-cols-3 gap-1" aria-hidden>
        <span className="h-2 w-2 bg-transparent" />
        <span className="h-2 w-2 bg-[#00CC6A]" />
        <span className="h-2 w-2 bg-[#50E6FF]" />
        <span className="h-2 w-2 bg-[#FFB900]" />
        <span className="h-2 w-2 bg-transparent" />
        <span className="h-2 w-2 bg-[#E3008C]" />
      </div>

      <div className="flex flex-col items-center text-center">
        <PixelLogo />
        <p className="mt-10 font-mono text-lg text-[#50E6FF] md:text-xl">
          Now shipping:
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-[#50E6FF] md:text-5xl">
          CAIP Mission Control
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-400 md:text-xl">
          Execute faster across Plays, Offers, Pipeline, and Agents. One place for the field.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/community">Explore Topics</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/offers">Find an Offer</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboards">View Dashboards</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function NowShippingStrip({ items }: { items: string[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Now shipping highlights">
      {items.map((item) => (
        <Card key={item} className="p-4">
          <p className="text-sm font-medium text-neutral-200">{item}</p>
        </Card>
      ))}
    </section>
  );
}

export function TopicGridBlock({
  topics,
}: {
  topics: Array<{
    id: string;
    title: string;
    slug: string;
    tags: string;
    author: { displayName: string };
    avgRating: number;
    commentCount: number;
    lastUpdatedAt: Date;
    whatChanged: string | null;
    changedRecently: boolean;
  }>;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <PixelDots />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#50E6FF]">Community</p>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Trending in the Community</h2>
          <p className="mt-1 text-sm text-neutral-400">What field peers are reading, rating, and discussing now.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/community">
            Open hub <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.id} className="transition hover:border-white/15">
            <CardHeader>
              <CardTitle className="text-lg leading-snug">
                <Link href={`/community/${topic.slug}`} className="hover:text-[#50E6FF]">
                  {topic.title}
                </Link>
              </CardTitle>
              <CardDescription>By {topic.author.displayName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-2">
                {topic.tags
                  .split(",")
                  .slice(0, 3)
                  .map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <div className="flex items-center justify-between">
                <RatingStars value={topic.avgRating} />
                <span className="text-xs text-neutral-500">{topic.commentCount} comments</span>
              </div>
              {topic.changedRecently && topic.whatChanged ? (
                <p className="mt-3 rounded-lg border border-[#50E6FF]/20 bg-[#50E6FF]/5 p-2 text-xs text-[#50E6FF]">
                  What changed: {topic.whatChanged}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-neutral-500">Updated {format(topic.lastUpdatedAt, "MMM d")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AgendaBlock({
  events,
}: {
  events: Array<{ id: string; title: string; description: string; startsAt: Date; roleAudience: string; eventType: string }>;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <PixelDots />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#50E6FF]">Agenda</p>
      </div>
      <h2 className="text-3xl font-semibold text-white md:text-4xl">Upcoming</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id} className="transition hover:border-white/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-white">{event.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{event.description}</p>
                <p className="mt-2 text-xs text-neutral-500">Role focus: {event.roleAudience}</p>
              </div>
              <Badge variant="secondary">{event.eventType}</Badge>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#50E6FF]">
              <CalendarDays className="h-4 w-4" />
              {format(event.startsAt, "EEE, MMM d")}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function LeadershipBlock({
  primary,
  secondary,
}: {
  primary: { id: string; title: string; summary: string; emphasisBullets: string };
  secondary: Array<{ id: string; title: string; summary: string }>;
}) {
  const bullets = primary.emphasisBullets.split("|");
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <PixelDots />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#50E6FF]">Leadership</p>
      </div>
      <h2 className="text-3xl font-semibold text-white md:text-4xl">Top of Mind</h2>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{primary.title}</CardTitle>
            <CardDescription>{primary.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-neutral-200">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <MessageSquareMore className="mt-0.5 h-4 w-4 text-[#50E6FF]" />
                  {bullet}
                </li>
              ))}
            </ul>
            <Button className="mt-5" asChild>
              <Link href="/leadership">Open leadership page</Link>
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {secondary.map((item) => (
            <Card key={item.id}>
              <h3 className="text-sm font-medium text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-neutral-400">{item.summary}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTAButtonRow({ links }: { links: Array<{ label: string; href: string; description: string }> }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <PixelDots />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#50E6FF]">Quick links</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Card key={link.label} className="transition hover:border-white/15">
            <h3 className="text-lg font-semibold text-white">{link.label}</h3>
            <p className="mt-1 text-sm text-neutral-400">{link.description}</p>
            <Button className="mt-4" variant="secondary" asChild>
              <Link href={link.href}>Get started</Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
