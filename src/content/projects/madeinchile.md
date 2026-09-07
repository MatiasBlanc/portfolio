---
title: "Made in Chile: How did I build a directory for Chilean software?"
description: "A community directory that helps Chilean technology projects earn their first useful visits, feedback, and connections without waiting to be discovered abroad."
lang: en
pubDate: 2026-08-24
status: en_progreso
tags:
  - Astro
  - React
  - Supabase
  - TypeScript
  - Product Design
image: ../../assets/projects/madeinchile.webp
imageAlt: "Made in Chile directory homepage with search and project listings"
liveUrl: "https://madeinchile.tech"
---

> **In one sentence:** Made in Chile turns scattered local launches into a searchable place where people can discover who is building what—and visit the actual product.

## Why I built it

Chilean developers regularly launch useful tools, SaaS products, libraries, and experiments. Most are shared once on a personal account and then disappear into the timeline.

Global platforms help mature products distribute worldwide, but they are not designed to answer a local question:

> What software is being built by people in Chile right now?

Made in Chile is my attempt to answer it with more context than a spreadsheet and less noise than a social feed.

## The product loop

The directory has four core actions:

1. a visitor searches or filters projects;
2. they open a dedicated project page;
3. they continue to the creator's product;
4. a builder submits another project to the catalogue.

Everything else should strengthen that loop. Features that do not improve discovery, trust, or submission quality are secondary.

## What I designed and built

I own the product design and implementation, including:

- the project taxonomy and submission model;
- server-rendered pages in Astro;
- React islands for search, filters, forms, and interactive cards;
- Supabase persistence and access policies;
- project detail pages and share actions;
- image processing and fallbacks;
- likes with optimistic feedback;
- sitemap, structured metadata, `llms.txt`, and social previews;
- unit and Playwright end-to-end test foundations.

## Search should survive a copied URL

Filters are useful only if visitors can share what they found. The search state is synchronized with URL parameters, so a filtered view can be bookmarked, copied, and revisited instead of existing only inside React state.

A keyboard shortcut opens search for desktop users, while touch interactions remain explicit on mobile. This is a small example of the product principle I use throughout the site: **speed for frequent users must not hide the path from first-time users**.

## Server-rendered foundation, interactive edges

The catalogue and detail pages benefit from server rendering: projects are indexable, links have meaningful metadata, and initial content does not wait for a client bundle.

React is reserved for interactions that need immediate feedback:

- search and category filters;
- submission validation;
- likes;
- project actions;
- newsletter and modal flows.

This avoids treating the whole directory as a single-page application just because some cards are interactive.

## Trust is the real data model

A community directory becomes useless if entries are stale, misleading, or impossible to verify. The submission form therefore needs more than a name and a URL. A project should communicate:

- the problem it solves;
- its current stage;
- who created it;
- how to try it;
- which category actually describes it.

Zod validates the form shape, but technical validation is only the first layer. Editorial review still matters. A valid URL can point to a weak or deceptive submission.

## A visual identity people can place

The interface uses Chilean red, blue, and white without turning every surface into a flag. A row of small pennants creates a recognizable local rhythm; the rest of the UI stays dark, quiet, and focused on projects.

The goal was not to make a government portal or a patriotic campaign. It was to make a technology product that clearly belongs to a place.

> Local identity works best as a shared coordinate, not as decoration pasted onto the product.

## What launching taught me

I initially spent too much effort on platform completeness: reactions, featured placements, submission states, and visual polish. The constraint was not missing software. It was catalogue quality.

A directory with fewer projects and strong profiles is more useful than a large import of unexplained links. That changed the roadmap toward:

- improving project descriptions;
- making acceptance criteria visible;
- checking stale links;
- highlighting lessons and builders, not only logos;
- measuring outbound discovery rather than vanity traffic.

## Current limitations

- Moderation still depends heavily on manual judgment.
- Categories will need revision as the catalogue grows.
- Likes indicate interest, not project quality.
- The platform needs a clear policy for inactive or abandoned entries.
- I have not yet demonstrated that featured placement produces useful outcomes for creators.
- Community governance is still more aspiration than implemented process.

## Next steps

1. Publish transparent submission and moderation guidelines.
2. Add freshness checks and let creators update their own entries safely.
3. Measure successful outbound visits while preserving visitor privacy.
4. Interview listed builders about whether the directory produced useful contact.
5. Build editorial collections around problems—education, public services, developer tools—not only categories.

## Stack

- **Framework:** Astro 7 with server rendering
- **Interactive UI:** React 19
- **Data:** Supabase
- **Validation:** Zod and React Hook Form
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest and Playwright
- **Deployment:** Vercel
