import { cn } from "@/lib/utils";

type CatNoteProps = {
  children: React.ReactNode;
  className?: string;
};

export function CatNote({ children, className }: CatNoteProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg bg-companion px-4 py-3", className)}>
      <span className="text-2xl" role="img" aria-label="Day Companion cat">
        🐱
      </span>
      <div className="pt-0.5 text-sm leading-6 text-foreground">{children}</div>
    </div>
  );
}