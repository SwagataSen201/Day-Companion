# Day Companion MVP Prototype

## Goal
Build a frontend-only, mobile-first prototype that demonstrates the full day-navigation loop with local mock data and no production infrastructure.

## Experience to build
- Begin with a brief cat welcome, then enter the main **Now** view.
- Keep **Now** focused on the current activity, remaining time, next activity, one primary action, audio setting, and a clearly labeled compact demo control.
- Let demo progression move through: normal activity → five-minute transition checklist → ready state → time-up choice → completion reward → next activity.
- Support **Complete**, **Continue 10 min**, and **Skip** without guilt-oriented language.
- Show the lightweight `+2 stars` celebration and move forward to the next sample activity.
- Add a **Prepare Tomorrow** view containing the supplied sample schedule, with add, inline edit, remove, and save interactions.

## Visual direction
- Use the specified soft cream and pastel-yellow identity with white/light-neutral surfaces, dark warm text, and amber-brown actions.
- Use a calm, compact phone-app composition with restrained rounded cards, subtle shadows, generous spacing, and no dashboard styling.
- Keep the cat as a small, consistent personality cue using a simple emoji treatment; no generated imagery or chat interface.
- Scale gracefully to tablet and desktop by centering a phone-width primary experience rather than introducing a sidebar.

## Interaction and accessibility
- Use existing accessible buttons, switches, checkboxes, inputs, and labels with at least 44px touch targets.
- Provide semantic headings, a single main landmark, visible focus rings, strong contrast, text plus icons for statuses, and live announcements for changing moments.
- Respect reduced-motion preferences; animate only the time-up bell subtly.
- Implement optional browser speech for transition/time-up/next cues, plus a short synthesized soft bell when permitted; all information remains visible.
- Keep all state in memory for this prototype and initialize it with the complete supplied demo day.

## Technical implementation
- Add small reusable product components for the app shell, cat note, activity summary, demo control, and editable schedule row.
- Model the prototype as a compact finite set of UI stages so demo progression is deterministic and easy to modify.
- Keep both primary views inside the `/` experience with simple bottom navigation, avoiding unnecessary routes and dependencies.
- Define all colors, typography, shadows, and motion as semantic tokens/utilities in the global design system.
- Update the root document metadata and the `/` page metadata with unique Day Companion titles and descriptions.

## Validation
- Check the complete interaction sequence in the running preview.
- Verify add/edit/remove/save, audio toggle, demo progression, focus behavior, mobile layout, desktop centering, and reduced-motion-friendly styling.
