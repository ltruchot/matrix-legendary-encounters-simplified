# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A radically simplified, web-playable adaptation of the board game *Legendary Encounters: The Matrix* (Upper Deck, 2023), built for a 5-minute discovery booth. The deliverable is **game design** (rules + data + a playable prototype), not a software product. Core design rule that drives everything: **only the icons on the real cards count, never the (English) card text** — ★ = recruit/buy, claw (griffure) = attack, the bottom-right number = cost. The game is played with the **real physical cards from the box**, so every card used in the prototype must actually exist in the set. The repo is mostly French (docs, comments, UI strings); keep that language when editing prose.

### Hard constraint: no hallucinated cards

A strong client requirement: card data must come from the **213 official card images** (downloaded from legendarycardgame.com/matrix into `assets/cards/`, ~129 MB, versioned in the repo) and OCR'd into `data/`. Never invent a card, stat, or icon — trace it back to a real image. The corollary, since the game is physical: only cards that exist in the box may appear in the prototype.

## Commands

```bash
npm install                       # installs Playwright (only dependency, dev-only)

node prototype/sim.js final       # balance check: win-rate & turn count per difficulty × player count
node prototype/sim.js grid [hand] [unplug] [spoon] [cap] [grace]   # boss × time-track win-rate grid
node prototype/sim.js tune|strats|oracle|npdiag                    # other balancing analyses
node prototype/sim.js             # default: parameter sweep for configs in the 55–78% win band

node tests/e2e.js                 # Playwright: plays real games via DOM clicks, writes screenshots to tests/shots/
```

There is no build step and no app server script. To play or run e2e tests, serve the repo root over HTTP yourself (e.g. `python3 -m http.server 8137`) — `tests/e2e.js` hardcodes `http://localhost:8137/prototype/`. Opening `prototype/index.html` directly via `file://` also works for manual play. `npm test` is not configured (placeholder that exits 1).

## Architecture

Three layers, no framework, no bundler — plain HTML/CSS/JS and static data.

- **`prototype/index.html`** — the actual game. A single self-contained file: all CSS, all game state (`let G`), and all rules live inline in the `<script>` at the bottom. State is one mutable object re-rendered wholesale by `render()` on every action; "Recommencer le tour" works by `JSON.stringify`-snapshotting `G` at `startTurn()`. Card art is referenced from `../assets/cards/*.jpg` by filename.
- **`prototype/sim.js`** — a Node Monte-Carlo simulator/tuner (4000+ games/config) used to balance the game. It reimplements the same rules headlessly and reports win rates. **Critical:** the game constants (`MARKET_POOL`, `ENEMY_POOL`, starter deck, difficulty boss HP / time track, hand size, buy-time cost/cap) are **duplicated** between `index.html` and `sim.js`. They are kept in sync by hand — when you change any balance number or card, edit **both files** or the simulator stops describing the real game.
- **`prototype/cartes-a-sortir.html`** — a static visual checklist of exactly which physical cards to pull from the box. Mirrors the same curated card list.

### Data

- **`data/cards.json` / `data/cards.csv`** — the full 213-card dataset OCR'd from the official card images. This is reference/source data; the prototype does **not** load it at runtime — instead it embeds a small *hand-curated, hand-verified* subset of cards as JS literals. Trust the prototype/sim literals over the raw dataset: the JSON `_meta` warns that OCR may confuse ★ (recruit) with claw (attack) and that only the starters + ~13 market cards have been manually verified.
- **`assets/cards/*.jpg`** — the 213 card images; filenames are the join key between the dataset and the embedded card lists.

### Game model (shared rules, v3)

Co-op deckbuilder, 1–3 players (hotseat). Each turn an agent may arrive (cap 2 on the table), the player draws a 5-card hand, plays cards to pool ★/claw, spends claw to kill agents or hit the boss and ★ to recruit **one** market card per turn (→ goes to the **discard pile**) or buy time (3★ → +1 Time Track, max 3/game). Each agent still alive at end of turn drains the Time Track by 1; Time Track hitting 0 = loss, boss HP hitting 0 = win. Difficulty = real boss card + starting Time Track position (facile/normal/difficile).

Two mechanics carry identity/coop flavor and are kept balance-neutral by design (verified in sim):
- **Avatars** — each player incarnates a hero (Neo/Trinity/Morpheus/Niobe/Crew). The market is exactly **5 heroes × 3 cards** (cost ≥2); a player's own hero's cards cost **1★ less** (min 1). `HEROES`/`MARKET_POOL` carry an `h` hero tag; `ecost(card, hero)` applies the discount.
- **Léguer (bequeath)** — give 1 card from your hand to the next player; it lands in their **hand** (playable, they play 6 that turn), at the cost of the giver playing one fewer. Solo = keep it for your next turn. Implemented via a per-player `gift[]` consumed in `startTurn`.

When you change card icons/values, the source of truth is the **card image** under `assets/cards/` — verify by eye (the OCR dataset confuses ★↔claw). The current 15-card market was eye-verified; mirror any change in both `index.html` (`MARKET_POOL`) and `sim.js` (`HERO_MARKET`).

## Conventions

- French for docs, comments, and all user-facing UI text.
- `docs/00`–`06` are the design source of truth (essence, iconography, core rules, variants, exact card selection, playtest/balancing, data+prototype). Read the relevant doc before changing rules or card composition.
- Official Upper Deck rulebooks live under `assets/rulebooks/` and are **gitignored** (copyright) — not present in fresh clones. Community references are in `bgg-files/`.
