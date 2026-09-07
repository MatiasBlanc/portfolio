---
title: "ITF App: How did I scope a Taekwon-Do management prototype?"
description: "A Taekwon-Do product prototype focused on practitioner identity, dojang management, attendance, progression, and competition-day clarity."
lang: en
pubDate: 2026-07-20
status: en_progreso
tags:
  - React Native
  - Expo
  - Firebase
  - Zustand
  - Product Design
image: ../../assets/projects/itf-app.webp
imageAlt: "ITF App prototype showing practitioner and tournament interfaces"
---

> **Current stage:** functional product prototype. It is not an official ITF platform and does not yet replace federation or tournament infrastructure.

## The product question

Taekwon-Do practitioners interact with schools, instructors, federations, examinations, and tournaments, but the information is often spread across messages, spreadsheets, websites, and competition systems.

I started ITF App with a deliberately narrow question:

> Can one calm interface reduce the effort of belonging, managing, and competing inside the ITF ecosystem?

The first version is an institutional proof of concept designed to test that idea before building expensive infrastructure.

## Who the prototype serves

### Practitioners and competitors

They need quick answers about identity, grade, training progress, announcements, events, and what to do next during a competition.

### Instructors

They need simple tools for students, attendance, announcements, schedules, and progression—without turning every training session into administrative work.

## What is implemented

The current React Native application includes:

- authentication and role-aware navigation;
- practitioner profiles and a digital credential concept with QR support;
- dojang information, student views, and attendance flows;
- weekly training and graduation-progress interfaces;
- federation and school exploration;
- tournament feeds, ring views, and notification flows;
- light and dark themes with reusable, scalable UI primitives;
- Firebase services for authentication and selected dojang access;
- local state stores for theme, auth, and training interactions.

## The most important scope decision

The first concept tried to solve everything: registrations, brackets, scoring, payments, federation administration, and live operations. That looked ambitious, but it was poor product discipline.

Version 1 now treats those capabilities as **non-goals**. Tournament information and Live Mode can be demonstrated with temporary or simulated data while the underlying need is validated.

This change made the prototype better: fewer screens pretending to be finished, more attention on the workflows people repeat every week.

## Designing Live Mode around uncertainty

A competitor does not need another dense tournament dashboard. They need three answers:

1. Which ring matters to me?
2. How close is my call?
3. What should I do now?

That principle shapes the ring rows, priority states, and notification language. The value is not “real time” as a buzzword; it is reducing competition-day uncertainty.

## Architecture

- **React Native + Expo Router** provide one codebase for iOS, Android, and a web preview.
- **NativeWind** keeps the visual system consistent across screens.
- **Zustand** manages focused client-side stores without a large state framework.
- **Firebase Auth and Firestore** support the current authenticated prototype.
- **Reusable UI primitives** handle scalable text, touch targets, cards, inputs, sheets, and status cues.

## Honest limitations

The portfolio version previously described a production-grade international tournament platform with WebSockets, FastAPI, Redis, bracket generation, and live scoring. Those claims were ahead of the implementation.

Today, the honest description is stronger: **this is a well-defined prototype with real UI flows and a clear validation plan**. Official integrations, operational reliability, data governance, and live tournament synchronization still need to be proven.

## Next validation steps

- Test attendance and progression flows with instructors.
- Run a shadow pilot using anonymized competition data.
- Validate notification timing in a real venue with unreliable connectivity.
- Define privacy, role, and federation ownership rules before expanding the data model.
- Decide whether existing ITF systems can be integrated rather than replaced.

## Stack

- **Mobile:** React Native 0.81 and Expo 54
- **Navigation:** Expo Router
- **Data services:** Firebase Auth and Firestore
- **Client state:** Zustand and AsyncStorage
- **Styling:** NativeWind / Tailwind CSS
- **Notifications:** Expo Notifications
