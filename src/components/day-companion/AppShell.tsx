import { CalendarPlus, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type AppView = "now" | "prepare";

type AppShellProps = {
  children: ReactNode;
  view: AppView;
  onViewChange: (view: AppView) => void;
  stars: number;
};

export function AppShell({ children, view, onViewChange, stars }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background md:my-8 md:min-h-[calc(100dvh-4rem)] md:overflow-hidden md:rounded-xl md:border md:shadow-app">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-5">
        <button
          type="button"
          className="rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => onViewChange("now")}
          aria-label="Go to Now"
        >
          <span className="block font-display text-lg font-bold">Day Companion</span>
          <span className="block text-xs text-muted-foreground">One moment at a time</span>
        </button>
        <div className="flex min-h-11 items-center gap-1.5 rounded-full bg-highlight px-3 text-sm font-bold" aria-label={`${stars} stars earned`}>
          <Sparkles className="size-4" aria-hidden="true" />
          {stars} <span aria-hidden="true">⭐</span>
        </div>
      </header>

      <div className="flex-1 px-5 py-6">{children}</div>

      <nav className="sticky bottom-0 grid grid-cols-2 border-t bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur" aria-label="Primary navigation">
        <Button
          variant={view === "now" ? "navActive" : "nav"}
          className="h-14 flex-col gap-1"
          onClick={() => onViewChange("now")}
          aria-current={view === "now" ? "page" : undefined}
        >
          <Sparkles className="size-5" aria-hidden="true" />
          Now
        </Button>
        <Button
          variant={view === "prepare" ? "navActive" : "nav"}
          className="h-14 flex-col gap-1"
          onClick={() => onViewChange("prepare")}
          aria-current={view === "prepare" ? "page" : undefined}
        >
          <CalendarPlus className="size-5" aria-hidden="true" />
          Tomorrow
        </Button>
      </nav>
    </div>
  );
}