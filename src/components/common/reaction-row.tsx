import { ThumbsUp, Rocket, Star } from "lucide-react";

export function ReactionRow({ like, star, rocket }: { like: number; star: number; rocket: number }) {
  return (
    <div className="flex items-center gap-3 text-xs text-neutral-400" aria-label="Reactions summary">
      <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {like}</span>
      <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {star}</span>
      <span className="inline-flex items-center gap-1"><Rocket className="h-3.5 w-3.5" /> {rocket}</span>
    </div>
  );
}
