import { Badge } from "@/components/ui/badge";

/* Small pixel-art decoration for section headings */
function PixelAccent() {
  return (
    <span className="inline-grid grid-cols-3 gap-[3px] mr-2" aria-hidden>
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

export function PageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <PixelAccent />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#50E6FF]">{label}</p>
      </div>
      <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
      <p className="max-w-3xl text-base text-neutral-400 md:text-lg">{description}</p>
    </section>
  );
}
