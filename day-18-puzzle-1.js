const fs = require("fs");

const MOVES = {
  R: {
    offsetX: 1,
    offsetY: 0,
  },
  L: {
    offsetX: -1,
    offsetY: 0,
  },
  U: {
    offsetX: 0,
    offsetY: -1,
  },
  D: {
    offsetX: 0,
    offsetY: 1,
  },
};

const resultTest1 = solve(fs.readFileSync("./day-18-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-18-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  let points = [{ x: 0, y: 0 }];
  let previousX = 0;
  let previousY = 0;

  for (const line of input.split("\n")) {
    const parts = line.match(/^(\w) (\d+)/);
    if (!parts) {
      continue;
    }

    const { offsetX, offsetY } = MOVES[parts[1]];
    const numberOfMoves = Number(parts[2]);

    previousX += offsetX * numberOfMoves;
    previousY += offsetY * numberOfMoves;
    points.push({ x: previousX, y: previousY });
  }

  const reverse = points[0].x > 0;
  points = reverse ? points.reverse() : points;
  const result = calculateResult(points);

  return result;
}

// Pick's theorem
// A (area) = i (interior points) + b (boundary points) / 2 - 1
// i = A - b/2 + 1
//
// We want i + b
// result = i + b = A + b/2 + 1
function calculateResult(points) {
  const area = calculateArea(points);
  const boundaryPoints = calculateBoundaryPoints(points);

  return area + boundaryPoints + 1;
}

// shoelace
function calculateArea(points) {
  let sumA = 0;
  let sumB = 0;

  for (let i = 1; i < points.length; i++) {
    const { x, y } = points[i - 1];
    const { x: nextX, y: nextY } = points[i];

    sumA += x * nextY;
    sumB += y * nextX;
  }

  return Math.abs(sumA - sumB) / 2;
}

function calculateBoundaryPoints(points) {
  let sum = 0;
  let previousX = 0;
  let previousY = 0;
  for (const { x, y } of points) {
    sum += Math.abs(previousX - x) + Math.abs(previousY - y);
    previousX = x;
    previousY = y;
  }

  return sum / 2;
}
