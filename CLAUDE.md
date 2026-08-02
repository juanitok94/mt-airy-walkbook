# Mount Airy Walkbook — Claude Code Project Brief
> John Kean · Peachy Kean DevOps LLC · Asheville, NC
> Last updated: August 2, 2026

## What This Is
Mount Airy Walkbook is a mobile-first digital walking passport
for N Main Street, Mount Airy, NC. 11 core stops, south to north.
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

## The 11 Core Stops (south to north)
| # | Shop | Street Side |
|---|------|-------------|
| 1 | Snappy Lunch | East |
| 2 | Floyd's City Barber Shop | East |
| 3 | Opie's Candy Store | East |
| 4 | Pages Books & Coffee | East |
| 5 | Barney's Cafe | East |
| 6 | Thirsty Souls Community Brewing | West |
| 7 | Kate's Cocktail Lounge | Unconfirmed — _todo |
| 8 | The Balladeer Hotel | West |
| 9 | Andy Griffith Museum | East |
| 10 | Angry Troll Brewing | East |
| 11 | Will Monday House | East |

Stops 1–5 (zone: "north") are the "Mayberry Core" section.
Stops 6–11 (zone: "south") are "The Second Life" section.
The zone field drives the section split on the passport and stop
pages — it does not describe geographic north/south position.

Kate's Cocktail Lounge (Stop 7) was added August 2, 2026 — a real,
21+ crafted cocktail lounge at 235 Market St, next door to Thirsty
Souls in the Market Street Arts & Entertainment District. Its
coordinates, streetSide, and hours are placeholder/estimated pending
an on-site visit (see its `_todo` field in shops.json). Its `hygge`
flag is set to `false` but that was NOT a considered editorial
decision — it's an open question for John on whether it belongs in
the Songbook Five.

## Bonus/Directory Stops
None currently. shops.json ships only the 11 core stops
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
- ✅ Photo zone restored on stop pages with graceful missing-file
  fallback (src/components/ShopPhoto.tsx)
- ✅ Kate's Cocktail Lounge added as Stop 7 (11 core stops total);
  all hardcoded "10 stops" references converted to derive from
  shops.json's actual core-stop count instead
- ⬜ Photo library — zero real shop photos exist on disk yet
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
- badges.json thresholds (1/4/7/10) and the "complete" badge's
  description ("...All ten.") still target the old 10-stop count.
  With Kate's Cocktail Lounge added, the walk is now 11 stops, so
  the "complete" badge now fires one stop early (at 10/11) and its
  copy is inaccurate. Left untouched deliberately — rescaling these
  requires a human decision on whether to bump the top threshold to
  11 or leave it as an earlier "you basically made it" milestone.
  Confirm with John before touching badges.json.

## Photo Library
Photos location: public/images/shops/
Naming convention: {shop-id}-exterior.jpg,
{shop-id}-interior.jpg, {shop-id}-interior-2.jpg

Last verified against the actual filesystem on August 2, 2026 —
**zero shop photos currently exist on disk.** Every filename below
was previously marked ✅ based only on being listed in shops.json's
`photos` arrays, which was never checked against public/images/shops/.
That was wrong. The stop page now falls back to a placeholder
(src/components/ShopPhoto.tsx, styled with the --color-stone /
--color-espresso tokens from globals.css) whenever a referenced
file is missing, so this gap is cosmetic, not broken — but it does
mean no stop currently has a real photo live on the site.

### Current Inventory
None. public/images/shops/ contains one file, `haywood-famous.jpg`,
which is an orphaned leftover from the Haywood Hoppers template —
it isn't referenced by any shop in this fork's shops.json and isn't
a Mount Airy business. Safe to delete once confirmed, otherwise
harmless (nothing links to it).

### Still Needed (referenced in shops.json, missing on disk)
- thirsty-souls-interior.jpg
- thirsty-souls-detail.jpg
- balladeer-hotel-exterior.jpg
- balladeer-hotel-interior.jpg
- balladeer-hotel-interior-2.jpg
- balladeer-hotel-interior-3.jpg
- will-monday-house-exterior.jpg
- will-monday-house-exterior-2.jpg
- will-monday-house-detail.jpg

### Still Needed (no shops.json entry yet either)
- kates-cocktail-lounge-exterior.jpg
- kates-cocktail-lounge-interior.jpg
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

All of the above require an in-person photo walk or owner-supplied
images — do not source stock or AI-generated photos of these real,
named, operating businesses.
