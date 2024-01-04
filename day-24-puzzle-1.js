const fs = require("fs");

const MIN_COORDINATE_TEST = 7;
const MAX_COORDINATE_TEST = 27;

const MIN_COORDINATE_FULL = 200_000_000_000_000;
const MAX_COORDINATE_FULL = 400_000_000_000_000;

const resultTest1 = solve(
  fs.readFileSync("./day-24-input-test.txt", "utf-8"),
  MIN_COORDINATE_TEST,
  MAX_COORDINATE_TEST
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(
  fs.readFileSync("./day-24-input-full.txt", "utf-8"),
  MIN_COORDINATE_FULL,
  MAX_COORDINATE_FULL
);
console.log(`Solution to full: ${resultFull}`);

function solve(input, minCoordinate, maxCoordinate) {
  const points = [];

  for (const line of input.split("\n")) {
    const parts = line.match(
      /(\d+), +(\d+), +(\d+) +@ +(-?\d+), +(-?\d+), +(-?\d+)/
    );
    if (!parts) {
      continue;
    }

    const x = Number(parts[1]);
    const y = Number(parts[2]);
    const z = Number(parts[3]);
    const vX = Number(parts[4]);
    const vY = Number(parts[5]);
    const vZ = Number(parts[6]);
    points.push({
      x,
      y,
      z,
      vX,
      vY,
      vZ,
    });
  }

  let result = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (isIntersectino(points[i], points[j], minCoordinate, maxCoordinate)) {
        result += 1;
      }
    }
  }

  return result;
}

/*
xA + vxA*t = xB + vxB*s
yA + vyA*t = yB + vyB*s
*/
function isIntersectino(pointA, pointB, minCoordinate, maxCoordinate) {
  const { x: xA, y: yA, vX: vXA, vY: vYA } = pointA;
  const { x: xB, y: yB, vX: vXB, vY: vYB } = pointB;

  let t = (vYB * (xB - xA) - vXB * (yB - yA)) / (vXA * vYB - vXB * vYA);
  let s = (vYA * (xB - xA) - vXA * (yB - yA)) / (vXA * vYB - vXB * vYA);

  if (t < 0 || s < 0) {
    return false;
  }

  const intersectionX = xA + t * vXA;
  const intersectionY = yA + t * vYA;

  return (
    intersectionX >= minCoordinate &&
    intersectionX <= maxCoordinate &&
    intersectionY >= minCoordinate &&
    intersectionY <= maxCoordinate
  );
}
