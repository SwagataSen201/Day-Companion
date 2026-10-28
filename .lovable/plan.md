# Day Companion Plus — Safe, Phased Enhancement

## 1. Current implementation (verified by reading the code)

1. **Schedule representation** — `Activity { id, name, time ("HH:MM"), duration (minutes), icon }` in `src/lib/day-companion.ts`; the working list lives as `activities` state in `src/routes/index.tsx`, seeded with `sampleActivities` (the full demo day, 08:00 Wake up → 22:30 Wind down).
2. **NOW / NEXT selection** — `getScheduleState(activities, now, resolvedIds, extensions)` sorts activities by start time, compares against real clock minutes, and returns `slots`, `current` (first activity whose window contains now and is not yet resolved), `next` (first future start), `justEnded` (ended ≤15 min ago), `remainingMinutes`, `progress`.
3. **Time progression & Demo Mode** — `useNow()` returns the real device clock, refreshed every 15 s and on tab focus. A stage machine (`welcome → active → transition → ready → timeup → reward`) auto-advances with the real clock. Demo Mode's **Next moment** button walks the *stages* forward (`nextDemoStage`); **Reset demo** clears resolution/extension state. Demo advances presentation state only — it never fakes the clock, so everything stays derived from `now` plus state.
4. **Complete / Continue / Skip / stars** — Complete and Skip add the focus activity's id to `resolvedIds` (Complete also awards +2 stars); Continue adds +10 to `extensions[activityId]`, which `getScheduleState` adds to that activity's end time. `focus = current ?? justEnded`.
5. **Prepare Tomorrow** — `ScheduleEditor` receives `activities` + `onChange` from `index.tsx`; add/edit/remove mutate the list, Save shows a 2.4 s toast. All state is in-memory; the project has no persistence layer.
6. **Audio assistance** — optional Switch; `speak()` (speechSynthesis) and `playSoftBell()` are no-ops when off.
7. **Integration points with minimal disruption** — the NOW card in `ActiveStage` (inside `src/routes/index.tsx`) is where secondary actions belong; `getScheduleState` already centralizes all timing math, so schedule-affecting behavior should be expressed there, not in UI code.

## 2. Smallest safe Phase 1

Add a **"Help me start"** outline button inside the existing NOW card (below the progress bar, above the primary "I'm working on it" button, visually secondary). Tapping it swaps the card's lower half for one predefined first step + a "Back" control. Everything is local UI state inside `ActiveStage`; no schedule, star, or stage changes.

## 3. Phased plan (exact order)

### Phase 1 — Help Me Start
- `src/lib/day-companion.ts`: add a `firstStepSuggestions` map keyed by activity name (Study, Exercise, Get ready, Breakfast, Lunch, Dinner, Wake up, Break, Wind down) and `firstStepFor(name)` returning a suggestion or a generic fallback ("Gather what you need, then take the first small step.").
- `src/routes/index.tsx` (`ActiveStage` only): local `showSuggestion` state; when on, render the suggestion in place of the progress row with a **Back** button; primary action untouched.
- No changes to schedule, rewards, demo, or audio.

### Phase 2 — My Day Changed
- `src/lib/day-companion.ts`: extend `getScheduleState` with an optional `shifts: Record<number, number>` (minutes added to an activity's **start and end**) — same pattern as the existing `extensions`. Add suggestion text builders.
- `src/routes/index.tsx`: new `shifts` state (cleared by Reset demo); secondary **"My day changed"** action on the NOW screen opens a new component.
- New `src/components/day-companion/MyDayChanged.tsx`: three options, each showing a concrete suggestion **before** anything changes, with Accept / Dismiss:
  1. **I'm running late** → shows the current + next activity with proposed new times (+20 min shift applied to the current activity and every later one). Accept applies those shifts; original times are never mutated — dismissing or Reset restores instantly.
  2. **I need a break** → offers a 15-minute pause: shows the next activity's current and proposed start time. Accept shifts only the next activity.
  3. **This task is taking longer** → reuses the existing Continue-10-minutes mechanic (extension on the focus activity) and shows what's next.
- Explicit confirm required for every change; no silent edits, no guilt language. Works with Demo Mode because all times are computed from `now` + state.

### Phase 3 — Today's Priorities
- `src/routes/index.tsx`: new `priorities: string[]` state (max 3).
- New `src/components/day-companion/PrioritiesCard.tsx`: compact card on the NOW screen below the main flow (above Demo Mode) — short list, text input + Add button, remove button per item, counter "2 of 3". Fully optional; never touches schedule, stars, or stages. In-memory only (the project has no persistence layer, so none is added).

## 4. Files changed per phase
- **Phase 1:** `src/lib/day-companion.ts`, `src/routes/index.tsx`
- **Phase 2:** `src/lib/day-companion.ts`, `src/routes/index.tsx`, new `src/components/day-companion/MyDayChanged.tsx`
- **Phase 3:** `src/routes/index.tsx`, new `src/components/day-companion/PrioritiesCard.tsx`
- No dependency, style-system, or navigation changes in any phase.

## 5. Regression testing
No unit-test suite exists in the project, so verification is browser-based (Playwright at phone viewport, scripts under `/tmp/browser/day-companion/`) plus the build log. Re-run the full existing flow after each phase: welcome → NOW/NEXT → remaining time → transition checklist → time-up → Complete / Continue / Skip → +2 stars → next activity → Prepare Tomorrow add/edit/remove/save → audio toggle → Demo Mode advance and reset → mobile layout and focus states.

Phase-specific checks:
- **P1:** correct suggestion for Study; generic fallback for an unsuggested name (added via Prepare Tomorrow); Back returns to normal card; stars, schedule, and stage unchanged.
- **P2:** each of the three options shows its suggestion; Dismiss leaves schedule and demo state untouched; Accept applies only the confirmed shift and the new times show on screen; Reset demo clears shifts; progression still works.
- **P3:** add up to 3, blocked at 3 (input disabled with clear message), remove works, empty state reads "Optional — what matters most today?"; schedule and NOW layout unaffected.

## 6. Assumptions & limitations
- Times stay time-of-day based (no cross-midnight scheduling); shifts therefore also work near midnight only modulo 24 h — acceptable for the prototype.
- Shifts apply forward from the moment of acceptance; activities already completed are untouched.
- No persistence: priorities, shifts, and resolutions reset on reload — matching the existing prototype behavior.
- Phase 2 "running late" shifts are a prototype-grade adjustment, not a rescheduling engine.

## 7. Initial implementation vs. future possibilities
- **Now:** predefined suggestions, single confirmed shift mechanism, optional in-memory priorities — all frontend, no AI, no backend, no new dependencies.
- **Later (out of scope):** persistence across sessions, learned/personalized first steps, multi-option rescheduling, priority-activity linking.
