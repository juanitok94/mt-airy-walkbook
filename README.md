# Mount Airy Walkbook

A digital walking passport for N Main Street — Mount Airy, NC's
Mayberry-famous main drag.

Twelve stops. One street. Walk it.

## What this is

A warmly narrated walking guide and passport game built on the
Camino de Santiago pilgrim passport model. Collect stamps at each
of the 12 core stops along N Main Street, from Snappy Lunch's
pork chop counter to the granite porch of the Will Monday House.
Walk them all and become a True Local.

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
- shops.json — 12 stops, 8 layers, full data model
- layers.json — layer definitions
- trivia.json — per-stop trivia

Community corrections welcome via PR to the JSON files.

## Design principles

- Steve Krug: Don't Make Me Think
- Camino de Santiago: personal, directional, earned
- Hygge: warmth without friction

## Hashtags

#MtAiryWalkbook #TrueLocal

## Credits

- **Hero image:** "First Baptist Church 714 North Main Street downtown Mount Airy NC" by UNC Libraries Commons, [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:First_Baptist_Church_714_North_Main_Street_downtown_Mount_Airy_NC.jpg).
