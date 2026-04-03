import { recencyBoost } from "@/lib/utils";

export function computeTrendingScore(input: {
  reactions: number;
  comments: number;
  avgRating: number;
  updatedAt: Date;
}) {
  const base = input.reactions * 2 + input.comments * 3 + input.avgRating * 4;
  return Number((base * recencyBoost(input.updatedAt)).toFixed(2));
}
