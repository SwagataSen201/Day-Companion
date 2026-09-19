import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, ChevronRight, Clock3, FastForward, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell, type AppView } from "@/components/day-companion/AppShell";
import { CatNote } from "@/components/day-companion/CatNote";
import { ScheduleEditor } from "@/components/day-companion/ScheduleEditor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  endTime,
  formatTime,
  playSoftBell,
  sampleActivities,
  speak,
  type Activity,
} from "@/lib/day-companion";

type Stage = "welcome" | "active" | "transition" | "ready" | "timeup" | "reward";

const fallbackCurrent: Activity = { id: -1, time: "09:30", name: "Study", duration: 60, icon: "📚" };
const fallbackNext: Activity = { id: -2, time: "10:30", name: "Break", duration: 30, icon: "🍵" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Day Companion — Know what comes next" },
      { name: "description", content: "A warm, calm way to see what to do now, what comes next, and move through your day." },
      { property: "og:title", content: "Day Companion — Know what comes next" },
      { property: "og:description", content: "A warm, calm way to see what to do now, what comes next, and move through your day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DayCompanion,
});

function DayCompanion() {
  const [view, setView] = useState<AppView>("now");
  const [stage, setStage] = useState<Stage>("welcome");
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [stars, setStars] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [transitionTasks, setTransitionTasks] = useState([false, false, false]);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);

  const current = activities[currentIndex] ?? fallbackCurrent;
  const next = activities[currentIndex + 1] ?? activities[0] ?? fallbackNext;

  useEffect(() => {
    if (stage !== "welcome") stageHeadingRef.current?.focus();
  }, [stage]);

  const announceStage = (nextStage: Stage) => {
    setStage(nextStage);
    if (nextStage === "transition") {
      speak(`${next.name} starts in five minutes. Let's get ready.`, audioEnabled);
    }
    if (nextStage === "timeup") {
      playSoftBell(audioEnabled);
      speak(`Time's up. ${current.name} is complete.`, audioEnabled);
    }
  };

  const resetDemo = () => {
    setCurrentIndex(Math.min(3, Math.max(activities.length - 2, 0)));
    setStage("active");
    setStars(0);
    setTransitionTasks([false, false, false]);
  };

  const completeActivity = () => {
    setStars((value) => value + 2);
    announceStage("reward");
  };

  const moveToNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, Math.max(activities.length - 1, 0)));
    setTransitionTasks([false, false, false]);
    setStage("active");
    speak(`Your next activity is ${next.name} at ${formatTime(next.time)}.`, audioEnabled);
  };

  const saveSchedule = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <AppShell view={view} onViewChange={setView} stars={stars}>
      {view === "prepare" ? (
        <>
          <ScheduleEditor activities={activities} onChange={setActivities} onSave={saveSchedule} />
          <p className="sr-only" role="status" aria-live="polite">{saved ? "Tomorrow's schedule saved." : ""}</p>
          {saved && (
            <div className="fixed bottom-24 left-1/2 z-20 flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-app" role="status">
              <Check className="size-4" aria-hidden="true" /> Tomorrow is ready
            </div>
          )}
        </>
      ) : stage === "welcome" ? (
        <Welcome onStart={() => setStage("active")} onLater={() => setView("prepare")} />
      ) : (
        <NowExperience
          stage={stage}
          current={current}
          next={next}
          audioEnabled={audioEnabled}
          onAudioChange={setAudioEnabled}
          transitionTasks={transitionTasks}
          onTaskChange={(index, checked) => setTransitionTasks((tasks) => tasks.map((task, taskIndex) => taskIndex === index ? checked : task))}
          onStageChange={announceStage}
          onComplete={completeActivity}
          onNext={moveToNext}
          onSkip={moveToNext}
          onReset={resetDemo}
          headingRef={stageHeadingRef}
        />
      )}
    </AppShell>
  );
}

function Welcome({ onStart, onLater }: { onStart: () => void; onLater: () => void }) {
  return (
    <section className="flex min-h-[calc(100dvh-12.5rem)] flex-col justify-center" aria-labelledby="welcome-title">
      <div className="mb-8 flex justify-center" aria-hidden="true">
        <div className="grid size-24 place-items-center rounded-full bg-highlight text-5xl shadow-soft">🐱</div>
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm font-bold text-primary">Saturday, 19 September</p>
        <h1 id="welcome-title" className="font-display text-4xl font-bold">Good morning! <span aria-hidden="true">☀️</span></h1>
        <p className="mx-auto mt-4 max-w-xs text-lg leading-7 text-muted-foreground">Ready to see what’s ahead?</p>
      </div>
      <div className="mt-10 grid gap-3">
        <Button size="lg" onClick={onStart}>Let&apos;s go <ChevronRight aria-hidden="true" /></Button>
        <Button variant="ghost" size="lg" onClick={onLater}>Not now</Button>
      </div>
    </section>
  );
}

type NowExperienceProps = {
  stage: Stage;
  current: Activity;
  next: Activity;
  audioEnabled: boolean;
  onAudioChange: (enabled: boolean) => void;
  transitionTasks: boolean[];
  onTaskChange: (index: number, checked: boolean) => void;
  onStageChange: (stage: Stage) => void;
  onComplete: () => void;
  onNext: () => void;
  onSkip: () => void;
  onReset: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
};

function NowExperience(props: NowExperienceProps) {
  const { stage, current, next, audioEnabled, onAudioChange, onStageChange, onReset, headingRef } = props;
  const stageLabel = stage === "transition" ? "Transition reminder" : stage === "ready" ? "Ready to begin" : stage === "timeup" ? "Time's up" : stage === "reward" ? "Activity complete" : "Current activity";

  return (
    <section aria-labelledby="now-title">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Your day, made lighter</p>
          <h1 id="now-title" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-3xl font-bold outline-none">{stageLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="audio-assistance" className="text-xs leading-4 text-muted-foreground">Audio<br />assistance</Label>
          <Switch id="audio-assistance" checked={audioEnabled} onCheckedChange={onAudioChange} aria-label="Audio assistance" className="h-7 w-12 [&>span]:size-6 data-[state=checked]:[&>span]:translate-x-5" />
        </div>
      </div>

      {stage === "active" && <ActiveStage current={current} next={next} onWorking={() => onStageChange("transition")} />}
      {(stage === "transition" || stage === "ready") && <TransitionStage {...props} />}
      {stage === "timeup" && <TimeUpStage current={current} onComplete={props.onComplete} onContinue={() => onStageChange("active")} onSkip={props.onSkip} />}
      {stage === "reward" && <RewardStage next={next} onNext={props.onNext} />}

      <div className="mt-6 rounded-lg border border-dashed bg-muted/60 p-3" aria-label="Prototype demo controls">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Demo mode</p>
            <p className="text-xs text-muted-foreground">Simulate the next moment</p>
          </div>
          <Button variant="outline" onClick={() => onStageChange(nextDemoStage(stage))}>
            <FastForward aria-hidden="true" /> Advance time
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="mt-1 w-full" onClick={onReset}><RotateCcw aria-hidden="true" /> Reset demo</Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{stageLabel}</p>
    </section>
  );
}

function ActiveStage({ current, next, onWorking }: { current: Activity; next: Activity; onWorking: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5 shadow-soft">
        <p className="text-xs font-extrabold uppercase text-primary">Now</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-highlight text-3xl" aria-hidden="true">{current.icon}</div>
          <div>
            <h2 className="font-display text-3xl font-bold">{current.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{formatTime(current.time)} – {formatTime(endTime(current.time, current.duration))}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-bold"><Clock3 className="size-4" aria-hidden="true" /> 32 minutes remaining</span>
          <span className="text-muted-foreground">47%</span>
        </div>
        <Progress value={47} className="mt-3 h-2.5" aria-label="47 percent of the activity complete" />
      </div>

      <NextActivity activity={next} />
      <CatNote><p className="font-bold">You&apos;re doing great.</p><p>Your next activity is {next.name.toLowerCase()}.</p></CatNote>
      <Button size="lg" className="w-full" onClick={onWorking}>I&apos;m working on it</Button>
    </div>
  );
}

function NextActivity({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="grid size-12 place-items-center rounded-lg bg-secondary text-2xl" aria-hidden="true">{activity.icon}</div>
      <div className="flex-1">
        <p className="text-xs font-extrabold uppercase text-muted-foreground">Next</p>
        <h2 className="text-lg font-bold">{activity.name}</h2>
      </div>
      <p className="text-sm font-bold">{formatTime(activity.time)}</p>
    </div>
  );
}

function TransitionStage({ stage, next, transitionTasks, onTaskChange, onStageChange }: NowExperienceProps) {
  const prompts = next.name === "Break"
    ? ["Finish the sentence you're on", "Put your study material aside", "Stand up and stretch"]
    : ["Put your phone away", `Get what you need for ${next.name.toLowerCase()}`, "Move to your next space"];

  return (
    <div className="space-y-4">
      <CatNote className="py-5">
        <p className="text-lg font-bold">{next.name} starts in 5 minutes.</p>
        <p>Let&apos;s get ready.</p>
      </CatNote>
      <div className="rounded-lg border bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl font-bold">A few small steps</h2>
        <div className="mt-4 space-y-2">
          {prompts.map((prompt, index) => (
            <label key={prompt} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-muted">
              <Checkbox checked={transitionTasks[index] ?? false} onCheckedChange={(checked) => onTaskChange(index, checked === true)} className="size-6" />
              <span className={transitionTasks[index] ? "text-muted-foreground line-through" : "font-semibold"}>{prompt}</span>
            </label>
          ))}
        </div>
      </div>
      {stage === "ready" && <p className="rounded-md bg-secondary px-4 py-3 text-center text-sm font-bold" role="status"><Check className="mr-2 inline size-4" aria-hidden="true" />You&apos;re ready when the moment comes.</p>}
      <Button size="lg" className="w-full" onClick={() => onStageChange(stage === "transition" ? "ready" : "timeup")}>
        {stage === "transition" ? "I'm ready" : "Continue"}
      </Button>
    </div>
  );
}

function TimeUpStage({ current, onComplete, onContinue, onSkip }: { current: Activity; onComplete: () => void; onContinue: () => void; onSkip: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div className="rounded-lg border bg-card p-7 shadow-soft">
        <Bell className="animate-gentle-bell mx-auto size-11 text-primary" aria-hidden="true" />
        <h2 className="mt-4 font-display text-3xl font-bold">Time&apos;s up</h2>
        <p className="mt-4 text-xl font-bold">{current.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatTime(current.time)} – {formatTime(endTime(current.time, current.duration))}</p>
      </div>
      <CatNote><p>You decide what feels right now.</p></CatNote>
      <div className="grid gap-3">
        <Button size="lg" onClick={onComplete}>Complete <span aria-hidden="true">⭐</span></Button>
        <Button variant="outline" size="lg" onClick={onContinue}>Continue 10 min</Button>
        <Button variant="ghost" size="lg" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
}

function RewardStage({ next, onNext }: { next: Activity; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-highlight p-7 text-center shadow-soft">
        <p className="text-4xl" aria-hidden="true">🎉</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Nice!</h2>
        <p className="mt-2 text-xl font-extrabold text-primary">+2 ⭐</p>
      </div>
      <CatNote><p className="font-bold">You did it.</p><p>Take a breath before what&apos;s next.</p></CatNote>
      <NextActivity activity={next} />
      <Button size="lg" className="w-full" onClick={onNext}>Go to next activity <ChevronRight aria-hidden="true" /></Button>
    </div>
  );
}

function nextDemoStage(stage: Stage): Stage {
  if (stage === "active") return "transition";
  if (stage === "transition") return "ready";
  if (stage === "ready") return "timeup";
  if (stage === "timeup") return "reward";
  return "active";
}