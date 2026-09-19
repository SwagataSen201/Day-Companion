import {
  BookOpen,
  Coffee,
  Dumbbell,
  MoonStar,
  Salad,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  "Wake up": Sun,
  "Get ready": Sparkles,
  Breakfast: Coffee,
  Study: BookOpen,
  Break: Coffee,
  Lunch: Salad,
  Exercise: Dumbbell,
  Dinner: Utensils,
  "Wind down": MoonStar,
};

export function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Sparkles;
  return <Icon className={cn("size-6", className)} aria-hidden="true" />;
}