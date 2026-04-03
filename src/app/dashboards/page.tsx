import { Bookmark, Copy } from "lucide-react";

import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDashboards } from "@/lib/data";

export default async function DashboardsPage() {
  const dashboards = await getDashboards();

  return (
    <div className="space-y-7">
      <PageHeader
        label="Dashboards Hub"
        title="Execution telemetry in one place"
        description="Curated Power BI links across ACR, pipeline, offers, and field operations."
      />

      <Card>
        <h2 className="text-xl font-semibold text-white">Pipeline trend snapshot</h2>
        <p className="mt-1 text-sm text-neutral-400">Mock trend based on weekly milestone hygiene consistency.</p>
        <PipelineChart />
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((item) => (
          <Card key={item.id}>
            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
            <p className="mt-1 text-sm text-neutral-400">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.split(",").map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <a href={item.url} target="_blank" rel="noreferrer">Open dashboard</a>
              </Button>
              <Button size="sm" variant="secondary"><Copy className="mr-2 h-4 w-4" />Copy link</Button>
              <Button size="sm" variant="ghost"><Bookmark className="mr-2 h-4 w-4" />Bookmark</Button>
            </div>
            <div className="mt-4 space-y-2 rounded-xl border border-white/8 p-3">
              {item.comments.map((comment) => (
                <p key={comment.id} className="text-xs text-neutral-400">{comment.body}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
