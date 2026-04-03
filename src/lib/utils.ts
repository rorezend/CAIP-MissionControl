import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(input: string) {
  return input
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function recencyBoost(updatedAt: Date) {
  const now = new Date().getTime();
  const ageMs = Math.max(0, now - updatedAt.getTime());
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  const decay = Math.min(1, ageMs / fourteenDaysMs);
  return Number((1.8 - decay * 0.8).toFixed(2));
}
