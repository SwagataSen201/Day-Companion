export type Activity = {
  id: number;
  name: string;
  time: string;
  duration: number;
  icon: string;
};

export const sampleActivities: Activity[] = [
  { id: 1, time: "08:00", name: "Wake up", duration: 15, icon: "☀️" },
  { id: 2, time: "08:15", name: "Get ready", duration: 45, icon: "🪥" },
  { id: 3, time: "09:00", name: "Breakfast", duration: 30, icon: "🥣" },
  { id: 4, time: "09:30", name: "Study", duration: 60, icon: "📚" },
  { id: 5, time: "10:30", name: "Break", duration: 30, icon: "🍵" },
  { id: 6, time: "11:00", name: "Study", duration: 120, icon: "📚" },
  { id: 7, time: "13:00", name: "Lunch", duration: 60, icon: "🥗" },
  { id: 8, time: "17:00", name: "Exercise", duration: 60, icon: "🏃" },
  { id: 9, time: "19:00", name: "Dinner", duration: 60, icon: "🍲" },
  { id: 10, time: "22:30", name: "Wind down", duration: 30, icon: "🌙" },
];

export function toMinutes(time: string) {
  const [rawHour = "0", rawMinute = "0"] = time.split(":");
  return Number(rawHour) * 60 + Number(rawMinute);
}

function dateFromMinutes(minutes: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setMinutes(minutes);
  return date;
}

const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" });

export function formatClock(date: Date) {
  return timeFormatter.format(date);
}

export function formatDayLabel(date: Date) {
  return dayFormatter.format(date);
}

export function formatTime(time: string) {
  return timeFormatter.format(dateFromMinutes(toMinutes(time)));
}

export function endTime(time: string, duration: number) {
  const total = (toMinutes(time) + duration) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export type ActivityState = "completed" | "now" | "upcoming";

export type ScheduleSlot = {
  activity: Activity;
  start: number;
  end: number;
  state: ActivityState;
};

export type ScheduleState = {
  slots: ScheduleSlot[];
  current: ScheduleSlot | null;
  next: ScheduleSlot | null;
  justEnded: ScheduleSlot | null;
  remainingMinutes: number | null;
  progress: number;
};

/** Compares the device's current time against the user's schedule data. */
export function getScheduleState(
  activities: Activity[],
  now: Date,
  resolvedIds: number[] = [],
  extensions: Record<number, number> = {},
): ScheduleState {
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const slots: ScheduleSlot[] = [...activities]
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
    .map((activity) => {
      const start = toMinutes(activity.time);
      const end = start + activity.duration + (extensions[activity.id] ?? 0);
      const state: ActivityState = minutes >= end ? "completed" : minutes >= start ? "now" : "upcoming";
      return { activity, start, end, state };
    });

  const current = slots.find((slot) => slot.state === "now" && !resolvedIds.includes(slot.activity.id)) ?? null;
  const next = slots.find((slot) => slot.start > minutes) ?? null;
  const recentlyEnded = slots.filter(
    (slot) => slot.state === "completed" && minutes - slot.end <= 15 && !resolvedIds.includes(slot.activity.id),
  );
  const justEnded = recentlyEnded.length > 0 ? recentlyEnded[recentlyEnded.length - 1]! : null;

  return {
    slots,
    current,
    next,
    justEnded,
    remainingMinutes: current ? Math.max(0, Math.ceil(current.end - minutes)) : null,
    progress: current ? Math.min(100, Math.max(0, Math.round(((minutes - current.start) / (current.end - current.start)) * 100))) : 0,
  };
}



export function speak(message: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export function playSoftBell(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.5);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.75);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.8);
}