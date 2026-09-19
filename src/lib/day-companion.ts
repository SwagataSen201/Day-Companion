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

export function formatTime(time: string) {
  const [rawHour = "0", minute = "00"] = time.split(":");
  const hour = Number(rawHour);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${period}`;
}

export function endTime(time: string, duration: number) {
  const [rawHour = "0", rawMinute = "0"] = time.split(":");
  const date = new Date(2000, 0, 1, Number(rawHour), Number(rawMinute) + duration);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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