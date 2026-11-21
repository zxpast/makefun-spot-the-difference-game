// Lantern Harbor — make.fun program/v1 entrypoint (Node 22, stdlib only).
//
// Hands the game in: copies game/ and screenshots/ from this repository into
// the output directory and writes dossier.json there with the vendored
// make.fun library, so the sealed scorer can check the entry byte for byte.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The run is deterministic: it copies files as they are and the dossier is a
// pure function of those files, so two runs write identical bytes.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so stale files can never leak in.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const gameSrc = join(repoRoot, 'game');
const shotsSrc = join(repoRoot, 'screenshots');
cpSync(gameSrc, join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsSrc)) {
  cpSync(shotsSrc, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, as the kit's gate states them: the dossier text holds at
// most 160 KiB of source, at most 4 screenshots of at most 256 KiB each, and
// game/ at most 993 files and 48 MiB with paths under 1000 bytes.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
