"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function GlobalSearch({ className = "" }: { className?: string }) {
  return (
    <form action="/search" className={`relative ${className}`} role="search" aria-label="Global search">
      <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-neutral-500" aria-hidden />
      <Input
        name="q"
        placeholder="Search topics, wiki pages, offers, dashboards"
        className="pl-10"
        aria-label="Search topics, wiki pages, offers and dashboards"
      />
    </form>
  );
}
