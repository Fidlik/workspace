const width = 1080;
const height = 720;
const camera = { yaw: 0.55, distance: 9.8, elevation: 1.74, pitch: 0.071, focal: 1030 };
const sinYaw = Math.sin(camera.yaw);
const cosYaw = Math.cos(camera.yaw);
const sinPitch = Math.sin(camera.pitch);
const cosPitch = Math.cos(camera.pitch);

function project([x, y, z]) {
  const side = x * cosYaw - z * sinYaw;
  const up = y - camera.elevation;
  const forward = camera.distance - x * sinYaw - z * cosYaw;
  const depth = forward * cosPitch - up * sinPitch;
  const vertical = up * cosPitch + forward * sinPitch;
  return [width * 0.50 + camera.focal * side / depth, height * 0.54 - camera.focal * vertical / depth, depth];
}

function polygon(context, points, fill) {
  context.beginPath();
  for (const [index, [x, y]] of points.entries()) {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fillStyle = fill;
  context.fill();
}

function strokeLine(context, a, b, color, lineWidth) {
  context.beginPath();
  context.moveTo(a[0], a[1]);
  context.lineTo(b[0], b[1]);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
}

function tint(color, amount) {
  const target = amount < 0 ? 0 : 255;
  const strength = Math.abs(amount);
  const components = color.match(/\w\w/g).map(channel => Number.parseInt(channel, 16));
  return `rgb(${components.map(channel => Math.round(channel + (target - channel) * strength)).join(' ')})`;
}

// Each profile is a rectangular steel box; roof profiles follow the same pitch.
function profile(x, z, spanX, spanZ, base, top, color) {
  const footprint = [
    [x - spanX / 2, z - spanZ / 2], [x + spanX / 2, z - spanZ / 2],
    [x + spanX / 2, z + spanZ / 2], [x - spanX / 2, z + spanZ / 2],
  ];
  return { color, vertices: [base, top].flatMap(elevation => footprint.map(([x, z]) => [x, typeof elevation === 'function' ? elevation(z) : elevation, z])) };
}

function steelFaces({ vertices, color }) {
  // The camera sees the two positive sides and the bottom of the overhead beams.
  const faces = [
    { indices: [1, 2, 6, 5], shadow: -0.30, light: -0.10 },
    { indices: [2, 3, 7, 6], shadow: -0.11, light: 0.075 },
    { indices: [0, 1, 2, 3], shadow: -0.46, light: -0.31, overhead: true },
    { indices: [4, 5, 6, 7], shadow: 0.08, light: 0.23, overhead: false },
  ];
  return faces.filter(face => face.overhead === undefined || face.overhead === (vertices[4][1] > camera.elevation)).map(face => {
    const points = face.indices.map(index => project(vertices[index]));
    const depth = points.reduce((sum, point) => sum + point[2], 0) / points.length;
    return {
      depth,
      paint(context) {
        const [a, b, , d] = points;
        const cross = Math.hypot(d[0] - a[0], d[1] - a[1]);
        const along = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const across = along < cross ? b : d;
        const light = context.createLinearGradient(a[0], a[1], across[0], across[1]);
        light.addColorStop(0, tint(color, face.light + 0.065));
        light.addColorStop(0.07, tint(color, face.light));
        light.addColorStop(0.18, tint(color, face.light * 0.70));
        light.addColorStop(1, tint(color, face.shadow));
        polygon(context, points, light);
      },
    };
  });
}

function roofPanel(left, right, back, front, elevation) {
  const roofPoint = (x, z) => project([x, elevation(z), z]);
  const corners = [roofPoint(left, back), roofPoint(right, back), roofPoint(right, front), roofPoint(left, front)];
  const depth = corners.reduce((sum, point) => sum + point[2], 0) / corners.length;
  return {
    depth,
    paint(context) {
      const reflection = context.createLinearGradient(...corners[0].slice(0, 2), ...corners[2].slice(0, 2));
      reflection.addColorStop(0, 'rgba(221, 234, 230, .66)');
      reflection.addColorStop(0.47, 'rgba(198, 214, 207, .33)');
      reflection.addColorStop(1, 'rgba(239, 240, 225, .60)');
      polygon(context, corners, reflection);
      for (let x = left + 0.055; x < right; x += 0.055) {
        strokeLine(context, roofPoint(x, back), roofPoint(x, front), 'rgba(245, 249, 233, .30)', 0.8);
      }
      strokeLine(context, corners[2], corners[3], 'rgba(230, 237, 221, .75)', 2);
    },
  };
}

function paintShadows(context, profiles, posts, roofCorners) {
  const onGround = ([x, y, z]) => project([x + y * 0.73, 0, z + y * 0.26]);
  context.save();
  context.filter = 'blur(3px)';
  if (roofCorners) polygon(context, roofCorners.map(onGround), 'rgba(48, 51, 37, .13)');
  for (const { vertices } of profiles) {
    const [a, b, c, d, e, f, g, h] = vertices;
    const shadow = 'rgba(45, 48, 34, .15)';
    polygon(context, [a, b, f, e].map(onGround), shadow);
    polygon(context, [c, d, h, g].map(onGround), shadow);
    polygon(context, [e, f, g, h].map(onGround), shadow);
  }
  context.filter = 'blur(2px)';
  for (const [x, z] of posts) {
    const [px, py, depth] = project([x, 0, z]);
    context.beginPath();
    context.ellipse(px, py, 90 / depth, 30 / depth, 0, 0, 2 * Math.PI);
    context.fillStyle = 'rgba(41, 43, 32, .47)';
    context.fill();
  }
  context.restore();
}

export function renderPergola(canvas, { size, color, hasRoof }) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const [span, depth] = size.split('x').map(value => Number(value) / 1000);
  const left = -span / 2;
  const right = span / 2;
  const back = -depth / 2;
  const front = depth / 2;
  const roofHeight = z => 2.58 + z * 0.045;
  const roofTop = z => roofHeight(z) + 0.075;
  const posts = [[left, back], [right, back], [left, front], [right, front]];
  const frame = [];
  const columnWidth = 0.112;

  for (const [x, z] of posts) {
    frame.push(profile(x, z, columnWidth, columnWidth, 0.019, roofHeight(z) - 0.16, color));
    frame.push(profile(x, z, 0.19, 0.19, 0.002, 0.019, color));
  }
  for (const z of [back, front]) {
    frame.push(profile(0, z, span + columnWidth, 0.117, roofHeight(z) - 0.175, roofHeight(z), color));
  }
  const roofLeft = left - 0.066;
  const roofRight = right + 0.066;
  const roofBack = back - 0.09;
  const roofFront = front + 0.09;
  const bays = Math.ceil(span / 0.81);
  const bayWidth = (roofRight - roofLeft) / bays;
  const faces = [];
  for (let bay = 0; bay <= bays; bay++) {
    const x = roofLeft + bay * bayWidth;
    frame.push(profile(x, 0, bay === 0 || bay === bays ? 0.084 : 0.061, depth + 0.18, z => roofHeight(z) - 0.025, roofTop, color));
    if (hasRoof && bay < bays) faces.push(roofPanel(x, x + bayWidth, roofBack, roofFront, z => roofTop(z) + 0.021));
  }
  if (hasRoof) {
    frame.push(profile(0, roofFront, roofRight - roofLeft + 0.084, 0.028,
      z => roofTop(z) - 0.013, z => roofTop(z) + 0.029, color));
  }

  const roofCorners = hasRoof ? [[roofLeft, roofTop(roofBack), roofBack], [roofRight, roofTop(roofBack), roofBack], [roofRight, roofTop(roofFront), roofFront], [roofLeft, roofTop(roofFront), roofFront]] : null;
  context.clearRect(0, 0, width, height);
  paintShadows(context, frame, posts, roofCorners);
  faces.push(...frame.flatMap(steelFaces));
  faces.sort((a, b) => b.depth - a.depth);
  for (const face of faces) face.paint(context);
}
