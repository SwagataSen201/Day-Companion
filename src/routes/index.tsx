import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, ChevronRight, Clock3, FastForward, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell, type AppView } from "@/components/day-companion/AppShell";
import { CatNote } from "@/components/day-companion/CatNote";
import { ScheduleEditor } from "@/components/day-companion/ScheduleEditor";
import { ActivityIcon } from "@/components/day-companion/ActivityIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useNow } from "@/hooks/use-now";
import {
  endTime,
  formatClock,
  formatDayLabel,
  formatTime,
  getScheduleState,
  playSoftBell,
  sampleActivities,
  speak,
  type Activity,
  type ScheduleSlot,
} from "@/lib/day-companion";

type Stage = "welcome" | "active" | "transition" | "ready" | "timeup" | "reward";

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
  const [resolvedIds, setResolvedIds] = useState<number[]>([]);
  const [extensions, setExtensions] = useState<Record<number, number>>({});
  const [stars, setStars] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [transitionTasks, setTransitionTasks] = useState([false, false, false]);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const now = useNow();

  const schedule = useMemo(
    () => (now ? getScheduleState(activities, now, resolvedIds, extensions) : null),
    [activities, now, resolvedIds, extensions],
  );

  const current = schedule?.current ?? null;
  const next = schedule?.next ?? null;
  const justEnded = schedule?.justEnded ?? null;
  const focus = current ?? justEnded;

  useEffect(() => {
    if (stage !== "welcome") stageHeadingRef.current?.focus();
  }, [stage]);

  const announceStage = (nextStage: Stage) => {
    setStage(nextStage);
    if (nextStage === "transition" && next) {
      speak(`${next.activity.name} starts in five minutes. Let's get ready.`, audioEnabled);
    }
    if (nextStage === "timeup" && focus) {
      playSoftBell(audioEnabled);
      speak(`Time's up. ${focus.activity.name} is complete.`, audioEnabled);
    }
  };

  // Follow the real clock: move into the transition cue and the time-up moment automatically.
  useEffect(() => {
    if (!schedule || view !== "now") return;
    if (stage === "active" && schedule.current && schedule.remainingMinutes !== null && schedule.remainingMinutes <= 5) {
      announceStage("transition");
      return;
    }
    if ((stage === "active" || stage === "transition" || stage === "ready") && !schedule.current && schedule.justEnded) {
      announceStage("timeup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, stage, view]);

  const resetDemo = () => {
    setStage("active");
    setStars(0);
    setResolvedIds([]);
    setExtensions({});
    setTransitionTasks([false, false, false]);
  };

  const resolveFocus = () => {
    if (focus) setResolvedIds((ids) => [...ids, focus.activity.id]);
  };

  const completeActivity = () => {
    resolveFocus();
    setStars((value) => value + 2);
    announceStage("reward");
  };

  const continueTenMinutes = () => {
    if (focus) setExtensions((values) => ({ ...values, [focus.activity.id]: (values[focus.activity.id] ?? 0) + 10 }));
    setStage("active");
  };

  const moveToNext = () => {
    resolveFocus();
    setTransitionTasks([false, false, false]);
    setStage("active");
    if (next) speak(`Your next activity is ${next.activity.name} at ${formatTime(next.activity.time)}.`, audioEnabled);
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
        <Welcome now={now} onStart={() => setStage("active")} onLater={() => setView("prepare")} />
      ) : (
        <NowExperience
          stage={stage}
          now={now}
          current={current}
          focus={focus}
          next={next}
          remainingMinutes={schedule?.remainingMinutes ?? null}
          progress={schedule?.progress ?? 0}
          audioEnabled={audioEnabled}
          onAudioChange={setAudioEnabled}
          transitionTasks={transitionTasks}
          onTaskChange={(index, checked) => setTransitionTasks((tasks) => tasks.map((task, taskIndex) => taskIndex === index ? checked : task))}
          onStageChange={announceStage}
          onComplete={completeActivity}
          onContinue={continueTenMinutes}
          onNext={moveToNext}
          onSkip={moveToNext}
          onReset={resetDemo}
          headingRef={stageHeadingRef}
        />
      )}
    </AppShell>
  );
}

function Welcome({ now, onStart, onLater }: { now: Date | null; onStart: () => void; onLater: () => void }) {
  const hour = now?.getHours() ?? 9;
  const greeting = hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!";
  return (
    <section className="flex min-h-[calc(100dvh-12.5rem)] flex-col justify-center" aria-labelledby="welcome-title">
      <div className="mb-8 flex justify-center" aria-hidden="true">
        <div className="grid size-24 place-items-center rounded-full bg-highlight text-5xl shadow-soft">🐱</div>
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm font-bold text-primary">{now ? formatDayLabel(now) : ""}</p>
        <h1 id="welcome-title" className="font-display text-4xl font-bold">{greeting} <span aria-hidden="true">{hour < 18 ? "☀️" : "🌙"}</span></h1>
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
  now: Date | null;
  current: ScheduleSlot | null;
  focus: ScheduleSlot | null;
  next: ScheduleSlot | null;
  remainingMinutes: number | null;
  progress: number;
  audioEnabled: boolean;
  onAudioChange: (enabled: boolean) => void;
  transitionTasks: boolean[];
  onTaskChange: (index: number, checked: boolean) => void;
  onStageChange: (stage: Stage) => void;
  onComplete: () => void;
  onContinue: () => void;
  onNext: () => void;
  onSkip: () => void;
  onReset: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
};

function NowExperience(props: NowExperienceProps) {
  const { stage, now, current, focus, next, remainingMinutes, progress, audioEnabled, onAudioChange, onStageChange, onReset, headingRef } = props;
  const stageLabel = stage === "transition" ? "Transition reminder" : stage === "ready" ? "Ready to begin" : stage === "timeup" ? "Time's up" : stage === "reward" ? "Activity complete" : "Current activity";

  return (
    <section aria-labelledby="now-title">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            {now ? `${formatDayLabel(now)} · ${formatClock(now)}` : "Your day, made lighter"}
          </p>
          <h1 id="now-title" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-3xl font-bold outline-none">{stageLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="audio-assistance" className="text-xs leading-4 text-muted-foreground">Audio<br />assistance</Label>
          <Switch id="audio-assistance" checked={audioEnabled} onCheckedChange={onAudioChange} aria-label="Audio assistance" className="h-7 w-12 [&>span]:size-6 data-[state=checked]:[&>span]:translate-x-5" />
        </div>
      </div>

      {stage === "active" && (
        <ActiveStage
          current={current}
          next={next}
          remainingMinutes={remainingMinutes}
          progress={progress}
          onWorking={() => onStageChange("transition")}
        />
      )}
      {(stage === "transition" || stage === "ready") && <TransitionStage {...props} />}
      {stage === "timeup" && <TimeUpStage focus={focus} onComplete={props.onComplete} onContinue={props.onContinue} onSkip={props.onSkip} />}
      {stage === "reward" && <RewardStage next={next} onNext={props.onNext} />}

      <div className="mt-6 rounded-lg border border-dashed bg-muted/60 p-3" aria-label="Prototype demo controls">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Demo mode</p>
            <p className="text-xs text-muted-foreground">Preview the next moment</p>
          </div>
          <Button variant="outline" onClick={() => onStageChange(nextDemoStage(stage))}>
            <FastForward aria-hidden="true" /> Next moment
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="mt-1 w-full" onClick={onReset}><RotateCcw aria-hidden="true" /> Reset demo</Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{stageLabel}</p>
    </section>
  );
}

type ActiveStageProps = {
  current: ScheduleSlot | null;
  next: ScheduleSlot | null;
  remainingMinutes: number | null;
  progress: number;
  onWorking: () => void;
};

function ActiveStage({ current, next, remainingMinutes, progress, onWorking }: ActiveStageProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5 shadow-soft">
        <p className="text-xs font-extrabold uppercase text-primary">Now</p>
        {current ? (
          <>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-highlight text-primary"><ActivityIcon name={current.activity.name} className="size-8" /></div>
              <div>
                <h2 className="font-display text-3xl font-bold">{current.activity.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{formatTime(current.activity.time)} – {formatTime(endTime(current.activity.time, current.activity.duration))}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-bold"><Clock3 className="size-4" aria-hidden="true" /> {remainingMinutes ?? 0} min remaining</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="mt-3 h-2.5" aria-label={`${progress} percent of the activity complete`} />
          </>
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-secondary text-2xl" aria-hidden="true">🍃</div>
            <div>
              <h2 className="font-display text-2xl font-bold">No scheduled activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">This time is yours.</p>
            </div>
          </div>
        )}
      </div>

      <NextActivity slot={next} />
      <CatNote>
        {current ? (
          <>
            <p className="font-bold">You&apos;re doing great.</p>
            <p>{next ? `Your next activity is ${next.activity.name.toLowerCase()}.` : "Nothing else is scheduled today."}</p>
          </>
        ) : (
          <>
            <p className="font-bold">A little space in your day.</p>
            <p>{next ? `${next.activity.name} comes up at ${formatTime(next.activity.time)}.` : "Nothing else is scheduled today."}</p>
          </>
        )}
      </CatNote>
      <Button size="lg" className="w-full" onClick={onWorking}>I&apos;m working on it</Button>
    </div>
  );
}

function NextActivity({ slot }: { slot: ScheduleSlot | null }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="grid size-12 place-items-center rounded-lg bg-secondary text-primary">
        {slot ? <ActivityIcon name={slot.activity.name} /> : <Clock3 className="size-5" aria-hidden="true" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-extrabold uppercase text-muted-foreground">Next</p>
        <h2 className="text-lg font-bold">{slot ? slot.activity.name : "Nothing scheduled"}</h2>
      </div>
      {slot && <p className="text-sm font-bold">{formatTime(slot.activity.time)}</p>}
    </div>
  );
}

function TransitionStage({ stage, next, transitionTasks, onTaskChange, onStageChange }: NowExperienceProps) {
  const nextName = next?.activity.name ?? "your next activity";
  const prompts = nextName === "Break"
    ? ["Finish the sentence you're on", "Put your study material aside", "Stand up and stretch"]
    : ["Put your phone away", `Get what you need for ${nextName.toLowerCase()}`, "Move to your next space"];

  return (
    <div className="space-y-4">
      <CatNote className="py-5">
        <p className="text-lg font-bold">{next ? `${next.activity.name} starts at ${formatTime(next.activity.time)}.` : "Your day is winding down."}</p>
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

function TimeUpStage({ focus, onComplete, onContinue, onSkip }: { focus: ScheduleSlot | null; onComplete: () => void; onContinue: () => void; onSkip: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div className="rounded-lg border bg-card p-7 shadow-soft">
        <Bell className="animate-gentle-bell mx-auto size-11 text-primary" aria-hidden="true" />
        <h2 className="mt-4 font-display text-3xl font-bold">Time&apos;s up</h2>
        <p className="mt-4 text-xl font-bold">{focus ? focus.activity.name : "No scheduled activity"}</p>
        {focus && (
          <p className="mt-1 text-sm text-muted-foreground">{formatTime(focus.activity.time)} – {formatTime(endTime(focus.activity.time, focus.activity.duration))}</p>
        )}
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

function RewardStage({ next, onNext }: { next: ScheduleSlot | null; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-highlight p-7 text-center shadow-soft">
        <p className="text-4xl" aria-hidden="true">🎉</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Nice!</h2>
        <p className="mt-2 text-xl font-extrabold text-primary">+2 ⭐</p>
      </div>
      <CatNote><p className="font-bold">You did it.</p><p>Take a breath before what&apos;s next.</p></CatNote>
      <NextActivity slot={next} />
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
