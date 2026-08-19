---
title: "FECHITAT — Official National Taekwon-Do Federation Portal"
description: "High-performance institutional web portal for the Chilean Federation of Traditional Taekwon-Do. Interactive dojo locator, event calendars, and verified rank registry."
pubDate: 2026-08-01
status: "en_progreso"
tags:
  - Astro
  - React
  - TypeScript
  - TailwindCSS
  - Leaflet
image: /project-fechitat.webp
imageAlt: "FECHITAT Official Website homepage and interactive dojo map"
---

## Project Overview

**FECHITAT** (Federación Chilena de Taekwon-Do Tradicional) is the governing body for traditional ITF Taekwon-Do in Chile. This project replaces an outdated legacy presence with a modern, high-speed digital hub that serves national schools, practitioners, instructors, and prospective students.

The goal: **maximize institutional credibility, simplify member discovery through geolocation, and deliver blazing-fast page loads on mobile devices.**

---

## What I Built

### 1. Interactive Dojo & School Directory
- Integrated interactive mapping (Leaflet / OpenStreetMap) allowing users across the country to locate certified academies, view certified black-belt instructors, and contact schools directly via WhatsApp and direct links.
- Filterable by region, city, and instructor certification.

### 2. High-Performance Web Architecture (Astro + React)
- Leveraged Astro's **Island Architecture** to ship zero client-side JavaScript by default, only hydrating interactive islands (search, map, and dynamic filters).
- Achieved **100/100 Core Web Vitals (Lighthouse score)** on Performance, Accessibility, Best Practices, and SEO.

### 3. Institutional Publishing & Tournament Board
- Markdown-based editorial workflow enabling federation directors to publish official announcements, seminar dates, national rankings, and rules without technical friction.

---

## Technical Highlights & Results

* 🚀 **Sub-second Initial Load**: Zero JS payload on static informational pages ensures instant loading even on 3G cellular connections.
* 📱 **Mobile-First UX**: Responsive layouts engineered with TailwindCSS, custom touch targets, and high contrast for accessibility.
* 🔍 **Comprehensive SEO & Meta Tags**: Automated OpenGraph images, structured schema markup, and sitemaps for top rankings in martial arts queries across Chile.

---

## Tech Stack

* **Framework**: Astro 5 (Static Site Generation + Hydration Islands)
* **UI Components**: React, TypeScript, TailwindCSS v4
* **Mapping**: Leaflet / Custom Geolocation Markers
* **Deployment**: Vercel Edge Network
