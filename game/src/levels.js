// levels.js — the three scenes and the exact spot of every hidden difference.
// Coordinates are in panel space (560 x 420) and match the painters in
// scenes.js; the same coordinates hit-test clicks on either picture.
export const LEVELS = [
  {
    id: 1,
    name: 'Harbor Dawn',
    tagline: 'A sunny fishing harbor — 7 differences, 3 minutes',
    timeLimit: 180,
    diffs: [
      { x: 468, y: 64, r: 45, label: 'Sun rays' },
      { x: 200, y: 92, r: 20, label: 'A gull' },
      { x: 95, y: 95, r: 20, label: 'Flag colour' },
      { x: 352, y: 356, r: 18, label: 'A buoy' },
      { x: 252, y: 300, r: 20, label: 'A jumping fish' },
      { x: 477, y: 200, r: 16, label: 'A coconut' },
      { x: 440, y: 332, r: 22, label: 'The fisherman' },
    ],
  },
  {
    id: 2,
    name: 'Night Market',
    tagline: 'Lantern stalls after dark — 8 differences, 4 minutes',
    timeLimit: 240,
    diffs: [
      { x: 452, y: 44, r: 16, label: 'A bright star' },
      { x: 285, y: 232, r: 20, label: 'Lantern colour' },
      { x: 110, y: 322, r: 26, label: 'The napping cat' },
      { x: 105, y: 171, r: 22, label: 'The stall sign' },
      { x: 297, y: 140, r: 18, label: 'A bunting flag' },
      { x: 146, y: 298, r: 16, label: 'A dumpling bowl' },
      { x: 420, y: 386, r: 20, label: 'Moon in the puddle' },
      { x: 330, y: 186, r: 22, label: 'The vendor’s hat' },
    ],
  },
  {
    id: 3,
    name: 'Moon Garden',
    tagline: 'A moonlit garden full of small secrets — 9 differences, 5 minutes',
    timeLimit: 300,
    diffs: [
      { x: 141, y: 134, r: 22, label: 'The owl’s eyes' },
      { x: 424, y: 334, r: 20, label: 'Mushroom colour' },
      { x: 300, y: 150, r: 14, label: 'A firefly' },
      { x: 230, y: 396, r: 14, label: 'A flower’s colour' },
      { x: 285, y: 395, r: 16, label: 'A snail' },
      { x: 482, y: 44, r: 16, label: 'A bright star' },
      { x: 420, y: 366, r: 26, label: 'Pond ripples' },
      { x: 91, y: 300, r: 18, label: 'A fence plank' },
      { x: 351, y: 201, r: 18, label: 'A butterfly' },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.diffs.length, 0);
}
