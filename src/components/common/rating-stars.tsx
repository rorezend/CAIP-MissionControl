import { Star } from "lucide-react";

export function RatingStars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1" aria-label={`Average rating ${value.toFixed(1)} out of 5`}>
      {new Array(5).fill(0).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rounded ? "fill-[#FFB900] text-[#FFB900]" : "text-neutral-600"}`}
          aria-hidden
        />
      ))}
      <span className="ml-1 text-xs text-neutral-400">{value.toFixed(1)}</span>
    </div>
  );
}
