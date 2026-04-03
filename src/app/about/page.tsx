import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="About CAIP"
        title="Mission and operating model"
        description="CAIP drives measurable business outcomes by aligning plays, offers, cadence, and field enablement."
      />
      <Card>
        <h2 className="text-2xl font-semibold text-white">How we execute</h2>
        <p className="mt-2 text-sm text-neutral-300">We combine unified platform positioning, offer discipline, milestone hygiene, and community-based coaching.</p>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold text-white">How to contribute</h2>
        <p className="mt-2 text-sm text-neutral-300">Create topics, improve wiki pages, comment with concrete examples, and bring blockers to calls.</p>
      </Card>
    </div>
  );
}
