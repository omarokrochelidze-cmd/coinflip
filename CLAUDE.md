# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page coin-flip betting game built with plain HTML/CSS/JavaScript — no framework, no build step, no dependencies. The player picks side A or B, places a bet (from a starting balance of 1000 ₾), and flips a 3D-animated coin. UI is multilingual (Georgian default, plus English and Russian).

## Running

Open `index.html` directly in a browser, or serve the folder over HTTP (e.g. `python -m http.server`). There is no build, test, or lint tooling — edits are reflected on page reload.

## Files

- `index.html` — markup. **Most of its size is 4 inline base64 WebP images** (coin faces / side buttons) on a few very long lines; the actual DOM structure is small. Elements are wired to handlers via inline `onclick` attributes.
- `style.css` — all styling, including the 3D coin scene and animations. **Also dominated by 2 large inline base64 images** (background art); real selectors are few. Edit the readable rules, not the data URIs.
- `game.js` — all game logic.

## Architecture notes

Everything hangs together through **global state in `game.js` + DOM ids referenced by string**. There is no module system or central render loop; functions mutate globals and poke specific elements by id.

- **State** lives in module-level globals: `balance`, `chosen` (selected side, `'A'`/`'B'`/`null`), `spinning` (re-entrancy guard), `history`, `roundNum`, `coinAngle` (persisted rotation so each flip continues from where the last ended), `lang`, `soundEnabled`.
- **The id contract is implicit and must stay in sync** between HTML and JS: e.g. `coin`, `balDisplay`, `btnA`/`btnB`, `betInput`, `flipBtn`, `resultBox`, `histList`, `soundBtn`/`soundIcon`. Renaming an id requires changing both files. Note the HTML uses `btnA`/`btnB` while the logical sides are `'A'`/`'B'`.
- **Flip animation** (`doFlip`) runs via `requestAnimationFrame`. The outcome (`landed`) is decided up front with `Math.random()`; the target `rotateY` is then computed so the coin lands showing the correct face (face-A at 0° mod 360, face-B at 180° mod 360), padding with a half-turn when needed. Easing is hand-rolled (`coinEase`, `yOff` vertical hop, `sc` scale pulse). Balance/history/result only update in the final frame when `p>=1`.
- **Re-entrancy**: `spinning` blocks input during a flip; all interactive handlers early-return while it's true, and the relevant controls are also `disabled` and re-enabled at animation end.
- **Bankruptcy reset**: when `balance` hits 0, it auto-resets to 1000 after a delay.
- **i18n**: `LANGS` holds per-language strings keyed by `ka`/`en`/`ru`; `t(key)` looks them up against the current `lang` and falls back to the key. `setLang` toggles the active button and re-renders history. Result/error messages always go through `t()`.
- **Audio** is synthesized at runtime with the Web Audio API (`playTone` building click/spin/win/lose cues) — no audio files. All cues respect the `soundEnabled` flag; `resumeAC()` unlocks the AudioContext on first user gesture.
- **History** keeps only the last 5 rounds (`history.shift()`), rendered newest-first.

When adding a feature, follow the existing pattern: a global for state, an id on the element, an `onclick` (or direct `getElementById`) wiring, and a guard against `spinning` for anything interactive.
