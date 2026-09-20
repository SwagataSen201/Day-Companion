# Day Companion

Build a frontend-only, mobile-first web app prototype for an early-stage productivity product called Day Companion.

This is a product prototype, not a production application.

The goal is to demonstrate the core user experience clearly and realistically while keeping the implementation intentionally small and credit-efficient.

0. IMPORTANT BUILD INSTRUCTION

Before building, understand the full specification below.

Build the complete MVP experience in this first build.

Do not add features that are not explicitly requested.

Do not build backend infrastructure, authentication, databases, APIs, external integrations, AI features, analytics systems, or production infrastructure.

Do not generate unnecessary pages, components, libraries, assets, or complex animations.

Prefer simple reusable components and local mock data.

Use browser-native capabilities where possible.

Do not ask to add extra features after the core prototype is complete.

The prototype should be easy to modify later.

1. PRODUCT PURPOSE

The product helps adults who struggle with:

time awareness

transitions between activities

remembering routine tasks

getting started on important tasks

drifting into unplanned activities

The core product principle is:

"Reduce the mental effort required to manage the day."

The product is NOT a medical or ADHD treatment app.

Do not make medical claims.

Do not diagnose or label users as having ADHD.

The main product hypothesis is:

If users can clearly see what they should be doing now, what comes next, how much time remains, and receive a gentle transition cue, they may find it easier to stay on track.

2. CORE MVP EXPERIENCE

The prototype should demonstrate this complete flow:

Prepare tomorrow → Open app → See NOW → See NEXT → Receive transition cue → Start activity → Time is up → Complete / Continue / Skip → Earn stars → Move to next activity

The experience should feel like a calm day-navigation companion, not a traditional task-management dashboard.

3. PLATFORM CONTEXT — MOBILE FIRST

Design this product primarily as a mobile phone experience.

The primary viewport should be a modern smartphone in portrait orientation.

Do NOT design a desktop dashboard and then squeeze it onto mobile.

Think of the interface as a mobile app.

Use:

touch-friendly controls

large tap targets

simple navigation

large readable text

minimal scrolling on the main NOW screen

clear visual hierarchy

one primary action at a time

simple cards

generous spacing

predictable interaction patterns

Desktop/tablet responsiveness is still required, but mobile is the primary design target.

Do not use a desktop-style sidebar.

Do not create dense tables.

Do not create a large analytics dashboard.

W3C's accessibility guidance applies to mobile web applications and emphasizes considerations such as small screens, touch interaction, and different input methods.

4. VISUAL DESIGN — SOFT PASTEL YELLOW

Use a soft, warm pastel yellow visual identity.

The product should feel:

warm

calm

friendly

reassuring

lightweight

approachable

Color direction

Use a very light warm cream/yellow as the primary background.

Use slightly stronger pastel yellow for:

important cards

highlights

selected states

the cat assistant area

subtle decorative elements

Use white or very light neutral surfaces for major content cards.

Use a dark charcoal/warm dark brown for primary text.

Use a darker amber/brown tone for important buttons and interactive elements.

IMPORTANT ACCESSIBILITY RULE

Do NOT use pale yellow for important text.

Do NOT use low-contrast yellow-on-yellow combinations.

Do NOT communicate meaning through color alone.

Text and important UI elements must remain clearly readable.

Aim for WCAG 2.2 accessibility principles, including sufficient contrast and visible interactive states. W3C specifies a minimum 4.5:1 contrast ratio for normal text and 3:1 for meaningful non-text UI components under the relevant WCAG criteria.

The yellow palette should support the experience, not compromise readability.

5. GENERAL UI PRINCIPLES

Use:

generous whitespace

large readable typography

short sentences

clear headings

simple labels

large buttons

rounded but restrained cards

subtle shadows

minimal decoration

predictable layouts

consistent spacing

clear focus states

simple icons

Avoid:

visual clutter

excessive gradients

excessive glassmorphism

complex illustrations

excessive animations

tiny text

tiny buttons

unnecessary badges

excessive cards

complicated navigation

productivity-dashboard aesthetics

The product should feel calm rather than exciting.

The interface should help the user focus on the current activity.

W3C cognitive accessibility guidance recommends simple and conventional controls and clear labels/signposts so users can understand what things are and how to use them.

6. CAT VIRTUAL ASSISTANT

Use a small, friendly cat as the product's personality element.

The cat is NOT a chatbot.

Do not create a chat interface.

The cat's responsibilities are limited to:

welcoming the user

explaining what is happening now

explaining what comes next

giving transition reminders

acknowledging completion

giving brief encouragement

The cat should remain visually subtle.

Do not allow the cat to dominate the screen.

Place it consistently in a predictable location.

Example:

🐱

Good morning! ☀️

Ready to see what's ahead?

Buttons:

[Let's go]

[Not now]

Keep messages short.

Do not make the cat continuously talk.

7. SCREEN — PREPARE TOMORROW

Create a mobile screen called:

Prepare Tomorrow 🌙

Purpose:

Allow the user to prepare their next day before sleeping.

Allow the user to add:

activity name

start time

duration

Example:

8:00 AM
Wake up

8:15 AM
Get ready

9:00 AM
Breakfast

9:30 AM
Study

11:00 AM
Break

1:00 PM
Lunch

5:00 PM
Exercise

Buttons:

[+ Add activity]

[Save Tomorrow]

Allow the user to edit or remove sample activities.

Use local frontend state only.

Do NOT build:

AI schedule generation

calendar integration

account synchronization

backend storage

8. SCREEN — HOME / NOW

This is the most important screen in the entire prototype.

The user should understand the screen within a few seconds.

Show:

NOW

📚

Study

9:30 AM – 10:30 AM

32 minutes remaining

Then show:

NEXT

🍵

Break

10:30 AM

Also show a small cat message:

🐱

You're doing great.

Your next activity is a break.

Primary action:

[I'm working on it]

The screen must immediately answer:

What am I doing now?

How much time is left?

What happens next?

Do not show the complete day's schedule on this screen.

Do not show analytics.

Do not show productivity scores.

Do not show unnecessary statistics.

9. TRANSITION EXPERIENCE

The transition experience is one of the most important product experiments.

When the next activity is approaching, show a gentle transition card.

Example:

🐱

Study starts in 5 minutes.

Let's get ready:

☐ Put your phone away

☐ Get your study material

☐ Sit at your study space

Primary button:

[I'm ready]

The transition experience should be:

short

actionable

calm

specific

It should help the user move from one activity to another.

Do not create long instructions.

Do not use guilt.

Do not create a warning-heavy experience.

10. TIME-UP EXPERIENCE

When the simulated activity reaches its scheduled end:

Show a gentle visual notification.

Example:

🔔

Time's up

Study
9:30 – 10:30

Use a subtle bell animation.

If browser audio is available, play a short soft bell sound.

Do NOT create:

loud alarms

aggressive flashing

stressful animations

repeated notifications

Give the user three choices:

[Complete ⭐]

[Continue 10 min]

[Skip]

The user remains in control.

Never use guilt-inducing language such as:

"You failed."

"Your streak is broken."

"You are late."

11. COMPLETION + STARS

When the user selects:

Complete ⭐

Show:

Nice! 🎉

+2 ⭐

Then show:

NEXT

🍵

Break

10:30 AM

Button:

[Go to next activity]

Keep the reward system extremely lightweight.

Stars are only an experiment to encourage completion.

Do NOT build:

leaderboards

shops

virtual currency

badges

levels

social competition

complicated streak systems

achievement systems

12. AUDIO ASSISTANCE

Create a simple setting:

Audio assistance

ON / OFF

When enabled, important moments can also be represented through audio.

Examples:

"Study starts in five minutes."

"Time's up. Study is complete."

"Your next activity is lunch at 1 PM."

Audio should be:

contextual

brief

optional

Do not constantly speak.

Do not make audio the only way to understand the interface.

Every important piece of information must remain available visually.

13. DEMO DATA

Pre-populate the prototype with this sample day:

8:00 — Wake up

8:15 — Get ready

9:00 — Breakfast

9:30 — Study

10:30 — Break

11:00 — Study

1:00 — Lunch

5:00 — Exercise

7:00 — Dinner

10:30 — Wind down

Use local mock data.

The prototype should be immediately usable without requiring the user to create data first.

14. DEMO MODE

Because this is a prototype, the user must be able to demonstrate the time-based experience without actually waiting 30–60 minutes.

Create a small, unobtrusive Demo Mode control.

It can simulate time moving forward.

For example:

Demo Mode

[Next moment]

or

[Advance time]

This should allow the user to demonstrate:

normal NOW state

transition state

activity ending

time-up state

completion

next activity

Clearly label it as prototype/demo functionality.

Do not build a real scheduling engine.

15. PROTOTYPE INTERACTIONS

The prototype should support these interactions:

Open the app

See cat welcome

Enter the main experience

See NOW

See remaining time

See NEXT

Trigger transition reminder

Select "I'm ready"

Advance simulated time

Trigger time-up state

Select Complete

Receive stars

Move to next activity

Open Prepare Tomorrow

Add an activity

Edit an activity

Remove an activity

Save the schedule

Toggle Audio Assistance

All data can remain in frontend/local state.

No backend is required.

16. ACCESSIBILITY

Accessibility is part of the product concept.

Implement:

readable text

strong text/background contrast

large touch targets

clear labels

visible focus states

keyboard-accessible controls where applicable

screen-reader-friendly semantic structure

status information represented by text/icons as well as color

no color-only meaning

predictable interaction

minimal unnecessary motion

Do not rely on the pastel yellow palette alone to communicate information.

WCAG 2.2 applies to web content on mobile devices as well as desktop, and W3C has additional guidance for applying WCAG principles to mobile applications.

17. DO NOT BUILD

This is a frontend prototype.

Do NOT build:

backend

database

authentication

payments

user accounts

real Alexa integration

real calendar integration

wearable integration

AI schedule generation

AI chatbot

medical/ADHD diagnosis

social features

leaderboard

complex streaks

advanced analytics

productivity scoring

complicated gamification

real notification infrastructure

push notification backend

cloud data synchronization

unnecessary third-party APIs

Use local/mock data only.

18. PERFORMANCE + CREDIT DISCIPLINE

Keep the implementation lightweight.

Prefer:

existing UI components

CSS-based styling

simple CSS transitions

inline/simple icons

local mock data

reusable components

minimal dependencies

Do not generate unnecessary images.

Do not add external APIs.

Do not add unnecessary libraries.

Do not create complex animation systems.

Do not create functionality that is not required for demonstrating the MVP.

If an effect can be achieved with simple CSS, use CSS instead of adding another dependency.

The goal is a small functional prototype, not a production codebase.

19. FINAL PRODUCT FEEL

The final prototype should feel like:

A warm, calm mobile day companion that helps the user know what to do now, prepare for what comes next, and transition between activities with less mental effort.

It should NOT feel like:

a traditional to-do list

a calendar

a project-management tool

a productivity dashboard

a medical application

a chatbot

a game

The central design question for every screen is:

"What does the user need to know or do right now?"

Build the prototype around that principle.

Use clean reusable component structure so future iterations can modify individual screens without rebuilding the entire application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ae8cb00d-b1ec-4dee-b14e-715c243efd72).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
