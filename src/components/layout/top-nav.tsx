"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MockUserSwitcher } from "@/components/layout/mock-user-switcher";

const links = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/wiki", label: "Wiki" },
  { href: "/offers", label: "Offers" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/plays", label: "Plays" },
  { href: "/leadership", label: "Leadership" },
  { href: "/about", label: "About" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#1a1a1a]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-white">
          <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
            <span className="h-2 w-2 bg-[#50E6FF]" />
            <span className="h-2 w-2 bg-[#E3008C]" />
            <span className="h-2 w-2 bg-[#FFB900]" />
            <span className="h-2 w-2 bg-[#00CC6A]" />
          </span>
          CAIP Mission Control
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/6 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <MockUserSwitcher />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Mission Control</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/8 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <MockUserSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
