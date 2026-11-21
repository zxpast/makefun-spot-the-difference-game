// main.js — boots Lantern Harbor: builds the game on the stage canvas and
// stages screenshot states when the page is opened with ?shot=….
import { SpotDifferenceGame } from './game.js';

const canvas = document.getElementById('stage');
const game = new SpotDifferenceGame(canvas);

const params = new URLSearchParams(window.location.search);
if (params.has('shot')) {
  game.applyShotMode(params);
}
