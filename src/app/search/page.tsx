import { PageHeader } from "@/components/common/page-header";

export default async function SearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Global Search"
        title="Search everything"
        description="Unified lookup across Topics, Wiki, Offers, and Dashboards."
      />
      <p className="text-sm text-neutral-400">Enter a query from the top search bar.</p>
    </div>
  );
}
