# 🏮 Lantern Harbor — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zxpast/makefun-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zxpast/makefun-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Referral code: `6hmpy1rq`**

An original spot-the-difference game for the [make.fun](https://make.fun)
bounty **best-spot-the-difference-game-20261121-0451**. Two pictures hang side
by side in an old harbor gallery — nearly identical, but not quite. Find every
hidden difference before the lanterns burn down.

## Play

Open `game/index.html` in a desktop browser (or serve `game/` with any static
server — `node serve.ts` opens it at http://localhost:8080). No network, no
build step, no install.

- **Click** a difference on either picture to circle it — found markers appear
  on both pictures, with a counter of how many remain.
- **3 scenes, 24 differences**: Harbor Dawn (7), Night Market (8), Moon
  Garden (9). Each scene is drawn in code, stroke by stroke, so the two
  panels are identical except for the hidden differences.
- **Timer** per scene (3–5 minutes). Wrong clicks cost 5 seconds; hints cost
  10 seconds and are limited to 3 per scene. Clearing a scene earns a time
  bonus; finishing all three crowns you Harbor Master.
- **Keyboard**: `H` hint · `R` restart scene · `M` sound · `1–3` jump to a
  scene · `N` next scene · `Esc` back to title.
- **Sounds** are synthesized live with WebAudio — no audio files.

## Layout

| Path | What it is |
|---|---|
| `main.ts` | Node 22 program (stdlib only) that hands the entry in: copies `game/` + `screenshots/` to `/output` and writes `dossier.json` |
| `game/index.html` | The game page |
| `game/styles.css` | Layout + HUD styling |
| `game/src/main.js` | Bootstrap + screenshot staging (`?shot=`) |
| `game/src/game.js` | State machine, clicks, timer, hints, scoring, overlays |
| `game/src/render.js` | Panel compositing, found markers, hint pulse, miss flashes |
| `game/src/scenes.js` | The three scenes, drawn procedurally on canvas |
| `game/src/levels.js` | Level data: names, timers, difference coordinates |
| `game/src/audio.js` | Synthesized WebAudio sounds |
| `vendor/makefun-game.ts` | make.fun dossier library, copied from the kit unchanged |
| `screenshots/` | Real renders of the game's own code |

## Verify

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Run it twice and compare — the two runs write byte-identical output.

## License

MIT — see [LICENSE](LICENSE).
