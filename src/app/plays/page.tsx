import Link from "next/link";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { playCards } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default function PlaysPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        label="Solution Plays + Motions"
        title="Role-ready play guidance"
        description="Discovery prompts, objections, and learning checklists mapped to the three primary plays."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {playCards.map((play) => (
          <Card key={play.slug}>
            <h2 className="text-xl font-semibold text-white">
              <Link href={`/plays/${play.slug}`}>{play.title}</Link>
            </h2>
            <p className="mt-2 text-sm text-neutral-400">{play.talkTrack}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
