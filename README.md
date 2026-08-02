# Mount Airy Walkbook

A digital walking passport for N Main Street — Mount Airy, NC's
Mayberry-famous main drag.

Ten stops. One street. Walk it.

## What this is

A warmly narrated walking guide and passport game built on the
Camino de Santiago pilgrim passport model. Collect stamps at each
of the 10 core stops along N Main Street, from Snappy Lunch's
pork chop counter to the granite porch of the Will Monday House.
Earn your True Local badge.

Built on granite, rewritten in brick, remembered in song.

## Stack

- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS 4
- Static JSON data layer
- localStorage for stamp state

## Run locally

git clone https://github.com/juanitok94/mt-airy-walkbook.git
cd mt-airy-walkbook
npm install
npm run dev

Open http://localhost:3000

## Data

All business data lives in /src/data/
- shops.json — 10 stops, 8 layers, full data model
- layers.json — layer definitions
- badges.json — badge tiers
- trivia.json — per-stop trivia

Community corrections welcome via PR to the JSON files.

## Design principles

- Steve Krug: Don't Make Me Think
- Camino de Santiago: personal, directional, earned
- Hygge: warmth without friction

## Hashtags

#MtAiryWalkbook #TrueLocal
