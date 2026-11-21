// scenes.js — every picture is drawn in code, stroke by stroke, so the two
// panels are pixel-identical except for the differences each scene hides.
// paintScene(g, sceneId, variant) draws into a 560x420 context; variant 0 is
// the left picture, variant 1 the right picture. A difference is a small
// `if (v === 1)` branch inside the painter, so the pictures stay fair.

function ellipse(g, x, y, rx, ry) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
}

function circle(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

function skyGradient(g, stops) {
  const grad = g.createLinearGradient(0, 0, 0, 420);
  stops.forEach(([at, color]) => grad.addColorStop(at, color));
  g.fillStyle = grad;
  g.fillRect(0, 0, 560, 420);
}

function cloud(g, x, y, s) {
  g.fillStyle = 'rgba(255,255,255,0.92)';
  ellipse(g, x, y, 34 * s, 16 * s);
  ellipse(g, x - 24 * s, y + 6 * s, 22 * s, 12 * s);
  ellipse(g, x + 26 * s, y + 6 * s, 24 * s, 13 * s);
}

function gull(g, x, y, s) {
  g.strokeStyle = '#3a3a3a';
  g.lineWidth = 2.4 * s;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(x - 12 * s, y);
  g.quadraticCurveTo(x - 5 * s, y - 9 * s, x, y);
  g.quadraticCurveTo(x + 5 * s, y - 9 * s, x + 12 * s, y);
  g.stroke();
}

function star4(g, x, y, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y);
  g.quadraticCurveTo(x, y, x, y - r);
  g.fill();
}

// ---------------------------------------------------------------- scene 1
// Harbor Dawn — a sunny fishing harbor: lighthouse, palm, sailboat, rowboat.
export function paintHarbor(g, v) {
  skyGradient(g, [[0, '#ffe9a8'], [0.55, '#ffc978'], [1, '#ff9d5c']]);
  // Sun. Difference 1: the left sun wears rays, the right one does not.
  g.fillStyle = '#fff3b0';
  circle(g, 468, 64, 34);
  g.fillStyle = '#ffe27a';
  circle(g, 468, 64, 26);
  if (v === 0) {
    g.strokeStyle = '#ffdf6b';
    g.lineWidth = 5;
    g.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(468 + Math.cos(a) * 40, 64 + Math.sin(a) * 40);
      g.lineTo(468 + Math.cos(a) * 52, 64 + Math.sin(a) * 52);
      g.stroke();
    }
  }
  cloud(g, 120, 70, 1);
  cloud(g, 300, 48, 0.8);
  cloud(g, 430, 122, 0.65);
  // Gulls. Difference 2: the gull at (200,92) flies only on the left.
  if (v === 0) gull(g, 200, 92, 1);
  gull(g, 262, 70, 0.9);
  gull(g, 342, 112, 0.8);

  // Sand strip, then the sea.
  g.fillStyle = '#f2d8a0';
  g.fillRect(0, 282, 560, 20);
  const sea = g.createLinearGradient(0, 302, 0, 420);
  sea.addColorStop(0, '#3d9db5');
  sea.addColorStop(1, '#16607e');
  g.fillStyle = sea;
  g.fillRect(0, 302, 560, 118);
  g.strokeStyle = 'rgba(255,255,255,0.5)';
  g.lineWidth = 2;
  [322, 348, 378, 402].forEach((y, i) => {
    g.beginPath();
    for (let x = 20 + i * 30; x < 550; x += 90) {
      g.moveTo(x, y);
      g.quadraticCurveTo(x + 22, y - 5, x + 45, y);
    }
    g.stroke();
  });

  // Lighthouse on the sand, left side.
  g.fillStyle = '#fdf6e3';
  g.fillRect(56, 168, 52, 120);
  g.fillStyle = '#e2574c';
  g.fillRect(56, 196, 52, 16);
  g.fillRect(56, 240, 52, 16);
  g.fillStyle = '#33415c';
  g.fillRect(50, 156, 64, 14); // gallery
  g.fillStyle = '#ffd97a';
  g.fillRect(62, 132, 40, 26); // lamp room
  g.fillStyle = '#33415c';
  g.beginPath();
  g.moveTo(58, 132);
  g.lineTo(82, 112);
  g.lineTo(106, 132);
  g.closePath();
  g.fill();
  // Flag on the lamp room. Difference 3: red on the left, teal on the right.
  g.strokeStyle = '#33415c';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(82, 112);
  g.lineTo(82, 88);
  g.stroke();
  g.fillStyle = v === 0 ? '#e2574c' : '#2a9d8f';
  g.beginPath();
  g.moveTo(82, 88);
  g.lineTo(108, 94);
  g.lineTo(82, 102);
  g.closePath();
  g.fill();
  // Lighthouse door + window.
  g.fillStyle = '#33415c';
  g.fillRect(74, 262, 16, 26);
  g.fillStyle = '#7ec8e3';
  g.fillRect(72, 222, 20, 14);

  // Crates by the lighthouse.
  g.fillStyle = '#b07a3e';
  g.fillRect(118, 268, 22, 20);
  g.fillStyle = '#c98f4e';
  g.fillRect(142, 272, 18, 16);
  g.strokeStyle = '#7a5222';
  g.lineWidth = 2;
  g.strokeRect(118, 268, 22, 20);
  g.strokeRect(142, 272, 18, 16);

  // Palm tree on the right sand.
  g.strokeStyle = '#7a5222';
  g.lineWidth = 9;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(502, 288);
  g.quadraticCurveTo(494, 240, 480, 198);
  g.stroke();
  g.strokeStyle = '#2f7d4f';
  g.lineWidth = 7;
  [[-1, -0.4], [-0.4, -0.9], [0.3, -1], [0.9, -0.55], [1, 0.1]].forEach(([dx, dy]) => {
    g.beginPath();
    g.moveTo(480, 198);
    g.quadraticCurveTo(480 + dx * 42, 198 + dy * 34, 480 + dx * 62, 198 + dy * 52);
    g.stroke();
  });
  // Coconuts. Difference 6: three on the left, two on the right.
  g.fillStyle = '#6b4423';
  circle(g, 470, 204, 6);
  circle(g, 484, 208, 6);
  if (v === 0) circle(g, 477, 196, 6);

  // Sailboat in the middle of the sea.
  g.fillStyle = '#8a5a2b';
  g.beginPath();
  g.moveTo(238, 316);
  g.lineTo(306, 316);
  g.lineTo(292, 334);
  g.lineTo(250, 334);
  g.closePath();
  g.fill();
  g.strokeStyle = '#5d3a17';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(272, 316);
  g.lineTo(272, 262);
  g.stroke();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.moveTo(272, 264);
  g.lineTo(272, 312);
  g.lineTo(302, 312);
  g.closePath();
  g.fill();
  g.fillStyle = '#ffdf6b';
  g.beginPath();
  g.moveTo(268, 270);
  g.lineTo(268, 312);
  g.lineTo(244, 312);
  g.closePath();
  g.fill();

  // Rowboat on the right. Difference 7: a fisherman rows only on the left.
  g.fillStyle = '#a34d2d';
  g.beginPath();
  g.moveTo(414, 344);
  g.lineTo(466, 344);
  g.lineTo(456, 358);
  g.lineTo(424, 358);
  g.closePath();
  g.fill();
  if (v === 0) {
    g.fillStyle = '#ffd97a';
    circle(g, 440, 330, 9); // head
    g.fillStyle = '#2a6f97';
    g.fillRect(431, 338, 18, 8); // shoulders
    g.strokeStyle = '#5d3a17';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(452, 336);
    g.lineTo(478, 318);
    g.stroke(); // oar
  }

  // Buoy. Difference 4: it bobs only on the left.
  if (v === 0) {
    g.fillStyle = '#e2574c';
    g.beginPath();
    g.arc(352, 356, 11, Math.PI, 0);
    g.fill();
    g.fillRect(341, 356, 22, 6);
    g.fillStyle = '#ffffff';
    g.fillRect(341, 360, 22, 4);
  }

  // Jumping fish. Difference 5: it leaps only on the left.
  if (v === 0) {
    g.fillStyle = '#7ec8e3';
    g.beginPath();
    g.ellipse(250, 300, 12, 6, -0.5, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(260, 296);
    g.lineTo(270, 290);
    g.lineTo(268, 300);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(250, 312, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  }
}

// ---------------------------------------------------------------- scene 2
// Night Market — lantern stalls under string lights, a cat, a puddle.
export function paintMarket(g, v) {
  skyGradient(g, [[0, '#141b33'], [0.6, '#27355c'], [1, '#3a2f5e']]);
  // Stars. Difference 1: the bright star by the moon shines only left.
  const stars = [[60, 50], [150, 36], [240, 60], [330, 34], [410, 70], [90, 110], [520, 130], [200, 26]];
  stars.forEach(([x, y]) => star4(g, x, y, 4, '#ffe9a8'));
  if (v === 0) star4(g, 452, 44, 8, '#fff6c9');
  // Moon.
  g.fillStyle = '#fdf6d8';
  circle(g, 500, 58, 27);
  g.fillStyle = '#e8dcb0';
  circle(g, 490, 50, 6);
  circle(g, 508, 66, 4);

  // String lights across the top.
  g.strokeStyle = '#0c1226';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0, 96);
  g.quadraticCurveTo(280, 150, 560, 96);
  g.stroke();
  for (let i = 0; i < 11; i++) {
    const x = 28 + i * 50;
    const y = 96 + Math.sin((i / 10) * Math.PI) * 34;
    g.strokeStyle = '#0c1226';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x, y - 12);
    g.lineTo(x, y);
    g.stroke();
    g.fillStyle = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff'][i % 4];
    circle(g, x, y + 5, 7);
  }

  // Bunting flags. Difference 5: the flag at (250,120) hangs only left.
  const bunt = ['#e2574c', '#ffd93d', '#2a9d8f', '#ff8fab', '#4d96ff'];
  for (let i = 0; i < 9; i++) {
    if (v === 1 && i === 4) continue;
    const x = 60 + i * 55;
    g.fillStyle = bunt[i % 5];
    g.beginPath();
    g.moveTo(x, 128);
    g.lineTo(x + 34, 128);
    g.lineTo(x + 17, 152);
    g.closePath();
    g.fill();
  }
  g.strokeStyle = '#0c1226';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(40, 128);
  g.lineTo(530, 128);
  g.stroke();

  // Ground.
  g.fillStyle = '#2b2a3a';
  g.fillRect(0, 330, 560, 90);
  g.fillStyle = '#3a3850';
  for (let i = 0; i < 8; i++) g.fillRect(20 + i * 68, 352, 44, 6);

  // Stalls: left food, center lanterns, right toys.
  paintStall(g, 30, 180, 150, '#c96f2e', '#ffd93d');
  paintStall(g, 205, 180, 150, '#2a6f97', '#ff8fab');
  paintStall(g, 380, 180, 150, '#5b7a3a', '#9fd8c9');

  // Left stall sign. Difference 4: BAKSO on the left, SOTO on the right.
  g.fillStyle = '#fdf6e3';
  g.fillRect(52, 158, 106, 26);
  g.fillStyle = '#7a2e1d';
  g.font = 'bold 17px "Trebuchet MS", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(v === 0 ? 'BAKSO' : 'SOTO', 105, 172);

  // Food bowls on the left counter. Difference 6: three bowls left, two right.
  g.fillStyle = '#fdf6e3';
  ellipse(g, 70, 300, 16, 7);
  ellipse(g, 108, 300, 16, 7);
  if (v === 0) ellipse(g, 146, 300, 16, 7);
  g.fillStyle = '#e2574c';
  circle(g, 70, 296, 5);
  circle(g, 108, 296, 5);
  if (v === 0) circle(g, 146, 296, 5);

  // Lanterns on the center stall. Difference 2: the middle lantern is red
  // on the left, green on the right.
  g.fillStyle = '#ff6b6b';
  ellipse(g, 250, 232, 13, 17);
  g.fillStyle = v === 0 ? '#e2574c' : '#2a9d8f';
  ellipse(g, 285, 232, 13, 17);
  g.fillStyle = '#ffd93d';
  ellipse(g, 320, 232, 13, 17);
  g.fillStyle = '#7a5222';
  g.fillRect(246, 212, 8, 5);
  g.fillRect(281, 212, 8, 5);
  g.fillRect(316, 212, 8, 5);

  // Vendor behind the center stall. Difference 8: his straw hat only left.
  g.fillStyle = '#f2c89b';
  circle(g, 330, 196, 12);
  g.fillStyle = '#2a6f97';
  g.fillRect(312, 208, 36, 26);
  if (v === 0) {
    g.fillStyle = '#e8c96a';
    ellipse(g, 330, 186, 22, 7);
    g.fillStyle = '#c9a13b';
    ellipse(g, 330, 183, 11, 5);
  }

  // Toys on the right stall: balls and a kite.
  g.fillStyle = '#ff8fab';
  circle(g, 420, 292, 11);
  g.fillStyle = '#4d96ff';
  circle(g, 452, 294, 11);
  g.fillStyle = '#ffd93d';
  circle(g, 486, 292, 11);
  g.fillStyle = '#ff6b6b';
  g.beginPath();
  g.moveTo(470, 220);
  g.lineTo(492, 236);
  g.lineTo(470, 252);
  g.lineTo(448, 236);
  g.closePath();
  g.fill();

  // Cat on a crate, left foreground. Difference 3: it naps only on the left.
  if (v === 0) {
    g.fillStyle = '#8a5a2b';
    g.fillRect(84, 330, 52, 34);
    g.strokeStyle = '#5d3a17';
    g.lineWidth = 2;
    g.strokeRect(84, 330, 52, 34);
    g.fillStyle = '#3a3a3a';
    ellipse(g, 110, 324, 20, 11);
    circle(g, 128, 312, 9);
    g.beginPath();
    g.moveTo(122, 305);
    g.lineTo(124, 296);
    g.lineTo(129, 304);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(130, 305);
    g.lineTo(133, 296);
    g.lineTo(137, 304);
    g.closePath();
    g.fill();
    g.strokeStyle = '#3a3a3a';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(92, 326);
    g.quadraticCurveTo(76, 322, 74, 310);
    g.stroke();
  }

  // Puddle with a moon reflection. Difference 7: the reflection only left.
  g.fillStyle = '#4d6a8f';
  ellipse(g, 420, 386, 62, 12);
  if (v === 0) {
    g.fillStyle = 'rgba(253,246,216,0.85)';
    ellipse(g, 420, 386, 16, 5);
  }
}

function paintStall(g, x, y, w, post, awning) {
  g.fillStyle = post;
  g.fillRect(x, y, 10, 150);
  g.fillRect(x + w - 10, y, 10, 150);
  g.fillStyle = '#8a5a2b';
  g.fillRect(x, y + 108, w, 12);
  g.fillStyle = '#c98f4e';
  g.fillRect(x, y + 108, w, 5);
  // Striped awning.
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i % 2 === 0 ? awning : '#fdf6e3';
    g.fillRect(x - 8 + i * (w + 16) / 5, y - 18, (w + 16) / 5, 22);
  }
  g.fillStyle = 'rgba(0,0,0,0.18)';
  g.fillRect(x, y + 120, w, 30);
}

// ---------------------------------------------------------------- scene 3
// Moon Garden — an owl in the old tree, a pond, mushrooms, fireflies.
export function paintGarden(g, v) {
  skyGradient(g, [[0, '#10182e'], [0.6, '#1d2c4d'], [1, '#2c3a5e']]);
  // Stars. Difference 6: the brightest star shines only on the left.
  const stars = [[40, 40], [130, 30], [220, 52], [310, 28], [380, 60], [70, 90], [250, 96], [180, 130]];
  stars.forEach(([x, y]) => star4(g, x, y, 4, '#cfe0ff'));
  if (v === 0) star4(g, 482, 44, 8, '#ffffff');
  // Big moon.
  g.fillStyle = '#f4ead2';
  circle(g, 470, 72, 40);
  g.fillStyle = '#ddd2ae';
  circle(g, 456, 60, 8);
  circle(g, 482, 84, 6);
  circle(g, 468, 88, 4);

  // Old tree on the left.
  g.strokeStyle = '#4a3520';
  g.lineWidth = 16;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(84, 330);
  g.quadraticCurveTo(80, 250, 92, 180);
  g.stroke();
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(88, 220);
  g.quadraticCurveTo(120, 190, 150, 168);
  g.stroke();
  g.beginPath();
  g.moveTo(86, 240);
  g.quadraticCurveTo(56, 210, 44, 180);
  g.stroke();
  g.fillStyle = '#2f7d4f';
  ellipse(g, 92, 150, 66, 42);
  ellipse(g, 140, 168, 44, 30);
  ellipse(g, 48, 168, 40, 28);
  g.fillStyle = '#3a9155';
  ellipse(g, 100, 132, 40, 24);

  // Owl on the branch. Difference 1: wide-awake eyes left, sleepy eyes right.
  g.fillStyle = '#7a5a3a';
  ellipse(g, 140, 138, 20, 24);
  circle(g, 124, 118, 8);
  circle(g, 156, 118, 8);
  g.beginPath();
  g.moveTo(118, 112);
  g.lineTo(121, 102);
  g.lineTo(126, 111);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(152, 112);
  g.lineTo(155, 102);
  g.lineTo(160, 111);
  g.closePath();
  g.fill();
  if (v === 0) {
    g.fillStyle = '#ffffff';
    circle(g, 133, 134, 6);
    circle(g, 149, 134, 6);
    g.fillStyle = '#1a1a1a';
    circle(g, 133, 134, 3);
    circle(g, 149, 134, 3);
  } else {
    g.strokeStyle = '#1a1a1a';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(128, 134);
    g.quadraticCurveTo(133, 138, 138, 134);
    g.stroke();
    g.beginPath();
    g.moveTo(144, 134);
    g.quadraticCurveTo(149, 138, 154, 134);
    g.stroke();
  }
  g.fillStyle = '#e8a33d';
  g.beginPath();
  g.moveTo(138, 142);
  g.lineTo(144, 142);
  g.lineTo(141, 148);
  g.closePath();
  g.fill();

  // Fence along the bottom left. Difference 8: a plank is missing on right.
  g.fillStyle = '#6b4423';
  g.fillRect(28, 296, 150, 8);
  for (let i = 0; i < 6; i++) {
    if (v === 1 && i === 2) continue;
    const x = 32 + i * 26;
    g.fillRect(x, 282, 14, 44);
    g.beginPath();
    g.moveTo(x, 282);
    g.lineTo(x + 7, 274);
    g.lineTo(x + 14, 282);
    g.closePath();
    g.fill();
  }

  // Stone path through the middle.
  g.fillStyle = '#8d8578';
  [[252, 306], [282, 326], [258, 348], [288, 368], [264, 390]].forEach(([x, y]) => {
    ellipse(g, x, y, 26, 12);
  });
  // Snail on the path. Difference 5: it crawls only on the left.
  if (v === 0) {
    g.fillStyle = '#c96f2e';
    g.beginPath();
    g.arc(285, 392, 9, Math.PI, 0);
    g.fill();
    g.strokeStyle = '#8a4a1d';
    g.lineWidth = 1.6;
    g.beginPath();
    g.arc(285, 392, 5, Math.PI, 0);
    g.stroke();
    g.fillStyle = '#e8d8b0';
    ellipse(g, 292, 400, 10, 4);
  }

  // Pond, bottom right.
  g.fillStyle = '#2a6f97';
  ellipse(g, 440, 368, 92, 30);
  g.fillStyle = '#3d9db5';
  ellipse(g, 440, 366, 78, 24);
  // Ripples. Difference 7: rings ripple only on the left.
  if (v === 0) {
    g.strokeStyle = 'rgba(255,255,255,0.75)';
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(420, 366, 18, 6, 0, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.ellipse(420, 366, 30, 10, 0, 0, Math.PI * 2);
    g.stroke();
  }
  // Lily pads.
  g.fillStyle = '#2f7d4f';
  ellipse(g, 480, 372, 16, 7);
  ellipse(g, 398, 378, 12, 5);

  // Mushrooms by the pond. Difference 2: red caps left, purple caps right.
  const cap = v === 0 ? '#e2574c' : '#8e6cc8';
  [[412, 330], [436, 338]].forEach(([x, y]) => {
    g.fillStyle = '#fdf6e3';
    g.fillRect(x - 3, y, 6, 12);
    g.fillStyle = cap;
    g.beginPath();
    g.arc(x, y, 12, Math.PI, 0);
    g.fill();
    g.fillStyle = '#ffffff';
    circle(g, x - 5, y - 6, 2);
    circle(g, x + 4, y - 8, 2);
  });

  // Fireflies. Difference 3: the firefly at (300,150) glows only left.
  const flies = [[210, 210], [250, 180], [330, 230], [380, 190], [180, 260]];
  flies.forEach(([x, y]) => {
    g.fillStyle = 'rgba(255, 230, 120, 0.35)';
    circle(g, x, y, 10);
    g.fillStyle = '#ffe678';
    circle(g, x, y, 3.5);
  });
  if (v === 0) {
    g.fillStyle = 'rgba(255, 230, 120, 0.35)';
    circle(g, 300, 150, 10);
    g.fillStyle = '#ffe678';
    circle(g, 300, 150, 3.5);
  }

  // Butterfly. Difference 9: it flutters only on the left.
  if (v === 0) {
    g.fillStyle = '#ff8fab';
    ellipse(g, 344, 200, 8, 11);
    ellipse(g, 358, 200, 8, 11);
    g.fillStyle = '#5d3a17';
    g.fillRect(349, 192, 3, 18);
  }

  // Flower bed along the bottom. Difference 4: one bloom is pink on the
  // left, yellow on the right.
  const blooms = [[170, 396], [200, 400], [230, 396], [330, 398], [360, 394]];
  blooms.forEach(([x, y], i) => {
    g.strokeStyle = '#2f7d4f';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x, y + 4);
    g.lineTo(x, y + 14);
    g.stroke();
    const color = i === 2 ? (v === 0 ? '#ff8fab' : '#ffd93d') : ['#ff6b6b', '#ffd93d', '#c77dff', '#ff8fab', '#4d96ff'][i];
    g.fillStyle = color;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(g, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 4);
    }
    g.fillStyle = '#fff3b0';
    circle(g, x, y, 3.5);
  });
}

export function paintScene(g, sceneId, variant) {
  if (sceneId === 1) paintHarbor(g, variant);
  else if (sceneId === 2) paintMarket(g, variant);
  else paintGarden(g, variant);
}
