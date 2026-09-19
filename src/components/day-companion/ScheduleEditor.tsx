import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Activity } from "@/lib/day-companion";
import { formatTime } from "@/lib/day-companion";

type ScheduleEditorProps = {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
  onSave: () => void;
};

export function ScheduleEditor({ activities, onChange, onSave }: ScheduleEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const update = (id: number, changes: Partial<Activity>) => {
    onChange(activities.map((activity) => (activity.id === id ? { ...activity, ...changes } : activity)));
  };

  const addActivity = () => {
    const activity: Activity = {
      id: Date.now(),
      name: "New activity",
      time: "12:00",
      duration: 30,
      icon: "✨",
    };
    onChange([...activities, activity]);
    setEditingId(activity.id);
  };

  return (
    <section aria-labelledby="prepare-title" className="pb-2">
      <div className="mb-6">
        <p className="mb-1 text-sm font-semibold text-primary">A gentle plan for later</p>
        <h1 id="prepare-title" className="font-display text-3xl font-bold">Prepare Tomorrow <span aria-hidden="true">🌙</span></h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Set up the day now, so tomorrow asks less of you.</p>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const editing = editingId === activity.id;
          return (
            <div key={activity.id} className="rounded-lg border bg-card p-4 shadow-soft">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${activity.id}`}>Activity name</Label>
                    <Input id={`name-${activity.id}`} value={activity.name} onChange={(event) => update(activity.id, { name: event.target.value })} className="mt-2 h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`time-${activity.id}`}>Start time</Label>
                      <Input id={`time-${activity.id}`} type="time" value={activity.time} onChange={(event) => update(activity.id, { time: event.target.value })} className="mt-2 h-12" />
                    </div>
                    <div>
                      <Label htmlFor={`duration-${activity.id}`}>Minutes</Label>
                      <Input id={`duration-${activity.id}`} type="number" min="5" step="5" value={activity.duration} onChange={(event) => update(activity.id, { duration: Number(event.target.value) || 5 })} className="mt-2 h-12" />
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setEditingId(null)}><Check aria-hidden="true" /> Done editing</Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="min-w-16">
                    <p className="font-bold">{formatTime(activity.time)}</p>
                    <p className="text-xs text-muted-foreground">{activity.duration} min</p>
                  </div>
                  <span className="text-xl" aria-hidden="true">{activity.icon}</span>
                  <p className="min-w-0 flex-1 font-semibold">{activity.name}</p>
                  <Button variant="ghost" size="iconTouch" aria-label={`Edit ${activity.name}`} onClick={() => setEditingId(activity.id)}><Pencil aria-hidden="true" /></Button>
                  <Button variant="ghost" size="iconTouch" aria-label={`Remove ${activity.name}`} onClick={() => onChange(activities.filter((item) => item.id !== activity.id))}><Trash2 aria-hidden="true" /></Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3">
        <Button variant="outline" size="lg" onClick={addActivity}><Plus aria-hidden="true" /> Add activity</Button>
        <Button size="lg" onClick={onSave}>Save Tomorrow</Button>
      </div>
    </section>
  );
}