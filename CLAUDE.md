# Mount Airy Walkbook — Claude Code Project Brief
> John Kean · Peachy Kean DevOps LLC · Asheville, NC
> Last updated: August 2, 2026

## What This Is
Mount Airy Walkbook is a mobile-first digital walking passport
for N Main Street, Mount Airy, NC. 10 core stops, south to north.
Users walk the street, stamp each stop, discover the hidden
Songbook Five collection. No auth, no login, localStorage only.

Theme: granite, Mayberry, and the town's music heritage —
"Built on granite, rewritten in brick, remembered in song."

## Live URLs
- Production: mt-airy-walkbook.vercel.app
- Repo: github.com/juanitok94/mt-airy-walkbook
- Local: localhost:3000 (npm run dev in C:\mt-airy-walkbook)

## Tech Stack
- Next.js 16 App Router
- TypeScript (strict)
- Tailwind CSS 4
- localStorage for all user state
- Vercel for deployment (auto-deploy on git push)

## Design Principles — Non-Negotiable
1. Hygge — warmth, slowness, belonging
2. Camino — journey, earned progress, south to north
3. Krug — don't make me think, clarity first
4. Mobile-first — primary user is holding a phone
   on N Main Street. Desktop is graceful enhancement only.
5. Human first — if it feels like a generic app,
   it's wrong. It should feel like Mount Airy.

## Color System — Do Not Change
Source of truth: src/app/globals.css (`:root` custom properties).
- Parchment background — --color-parchment: #FAF6F0
- Espresso dark — --color-espresso: #2A1810
- Gold accent — --color-gold: #B8893A
- Rust primary — --color-rust: #8B3A2E
- Ink (body text) — --color-ink: #1F1A14
- Sage — --color-sage: #3F5E3A — used as the lodging layer color
  (layers.json) and The Balladeer Hotel's badge/sello color
  (badges.json "regular" tier, shops.json selloColor)
- Stone — --color-stone: #A89F94 — defined but not currently
  referenced elsewhere in the codebase

## Typography — Do Not Change
- Playfair Display — headings (font-serif)
- Crimson Pro — body text (font-serif)
- IBM Plex Mono — labels, UI elements (font-mono)

## Two ICPs
1. TOURISTS — visiting Mount Airy for Mayberry nostalgia and
   Andy Griffith history, want authentic local experiences,
   not just gift shops. Respond to discovery, walking, feeling
   like an insider rather than a bus-tour visitor.
2. BUSINESS OWNERS — independent shop owners on N Main who
   want foot traffic and to feel proud of being featured,
   not marketed at.

## The 10 Core Stops (south to north)
| # | Shop | Street Side |
|---|------|-------------|
| 1 | Snappy Lunch | East |
| 2 | Floyd's City Barber Shop | East |
| 3 | Opie's Candy Store | East |
| 4 | Pages Books & Coffee | East |
| 5 | Barney's Cafe | East |
| 6 | Thirsty Souls Community Brewing | West |
| 7 | The Balladeer Hotel | West |
| 8 | Andy Griffith Museum | East |
| 9 | Angry Troll Brewing | East |
| 10 | Will Monday House | East |

Stops 1–5 (zone: "north") are the "Mayberry Core" section.
Stops 6–10 (zone: "south") are "The Second Life" section.
The zone field drives the section split on the passport and stop
pages — it does not describe geographic north/south position.

## Bonus/Directory Stops
None currently. shops.json ships only the 10 core stops
(all `passportType: "core"`) — there is no bonus/directory
layer of additional businesses yet, unlike the template project
this was forked from.

## Core Stop Eligibility Rule
A shop must be open minimum 5 days per week to qualify
as a core passport stop.

## The Songbook Five
A hidden collection of 5 stops where time slows down (the
`hygge: true` flag in shops.json): Snappy Lunch, Floyd's City
Barber Shop, Thirsty Souls Community Brewing, The Balladeer
Hotel, and Will Monday House. Do not modify hygge flags in
shops.json without confirming with John first.

## File Structure
src/
  app/
    page.tsx          — homepage
    map/page.tsx      — interactive map
    passport/         — stamp collection
    stop/[slug]/      — individual stop pages
  data/
    shops.json        — canonical data, source of truth
    layers.json        — map filter layers
    badges.json        — achievement badges
    trivia.json        — trivia questions per stop
  lib/
    stamps.ts         — localStorage stamp logic

## Standing Rules for Claude Code
1. Always check TypeScript compiles before finishing
   (npx tsc --noEmit)
2. Never modify shops.json stop numbers or core/bonus
   status without explicit confirmation from John
3. Never change colors, fonts, or design tokens
4. Mobile-first — test layout at 390px width thinking
5. Always localhost review before git push
6. Commit message format:
   feat: for new features
   fix: for corrections
   refactor: for restructuring

## Current Build Status (August 2, 2026)
- ✅ Homepage
- ✅ Passport page
- ✅ Stop pages (individual)
- ✅ Map page with flip toggle
- ✅ Mobile-first card upgrade
- ✅ streetSide field added to all shops
- ✅ Share button on stop pages
- ✅ Progressive disclosure on stop pages
- ✅ Map bottom sheet popup with spring animation
- ✅ Sample one-pager and unified showcase for SMB pitch
- ✅ Legacy Haywood Hoppers strings replaced with Mount Airy content
- ⬜ Photo library — most stops still need exterior/interior photos
- ⬜ _todo fields in shops.json — hours, ownership, and detail
  fact-checking still needed for most stops
- ⬜ Dark mode (post user testing)
- ⬜ Progress visualization on passport page

## Known Follow-Ups (not yet in scope)
- map/page.tsx still references "Riverview Dr" and "Patton Ave"
  as secondary street labels, and the flip toggle reads
  "East → / West →" — these are leftover from the template
  project's east-west road layout and haven't been re-mapped
  to N Main Street's actual cross streets. Needs real Mount
  Airy street data before fixing — don't guess coordinates.

## Photo Library
Photos location: public/images/shops/
Naming convention: {shop-id}-exterior.jpg,
{shop-id}-interior.jpg, {shop-id}-interior-2.jpg

### Current Inventory
- thirsty-souls-interior.jpg ✅
- thirsty-souls-detail.jpg ✅
- balladeer-hotel-exterior.jpg ✅
- balladeer-hotel-interior.jpg ✅
- balladeer-hotel-interior-2.jpg ✅
- balladeer-hotel-interior-3.jpg ✅
- will-monday-house-exterior.jpg ✅
- will-monday-house-exterior-2.jpg ✅
- will-monday-house-detail.jpg ✅

### Still Needed
- snappy-lunch-exterior.jpg
- snappy-lunch-interior.jpg
- floyds-barber-exterior.jpg
- floyds-barber-interior.jpg
- opies-candy-exterior.jpg
- opies-candy-interior.jpg
- pages-books-exterior.jpg
- pages-books-interior.jpg
- barneys-cafe-exterior.jpg
- barneys-cafe-interior.jpg
- andy-griffith-museum-exterior.jpg
- andy-griffith-museum-interior.jpg
- angry-troll-exterior.jpg
- angry-troll-interior.jpg
