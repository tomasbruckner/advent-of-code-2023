// Inspired by https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21

const fs = require("fs");

const START = "S";
const WALL = "#";

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const MAX_STEPS_FULL = 26_501_365;

const resultFull = solve(
  fs.readFileSync("./day-21-input-full.txt", "utf-8"),
  MAX_STEPS_FULL
);
console.log(`Solution to full: ${resultFull}`);

function solve(input, maxSteps) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const startNode = findStart(matrix);
  const mapWidth = matrix.length;
  const remainderSteps = maxSteps % mapWidth;
  const stepsInDiagonal = Math.floor(mapWidth * 1.5) - 1;
  const numberOfRepeats = Math.floor(MAX_STEPS_FULL / mapWidth) - 1;
  const evenRepeats = (numberOfRepeats + 1) ** 2;
  const oddRepeats = numberOfRepeats ** 2;
  const stepsInEven = getSteps(matrix, startNode, 2 * mapWidth);
  const stepsInOdd = getSteps(matrix, startNode, 2 * mapWidth + 1);
  const top = getSteps(
    matrix,
    { x: startNode.x, y: mapWidth - 1 },
    mapWidth - 1
  );
  const bottom = getSteps(matrix, { x: startNode.x, y: 0 }, mapWidth - 1);
  const left = getSteps(
    matrix,
    { x: mapWidth - 1, y: startNode.y },
    mapWidth - 1
  );
  const right = getSteps(matrix, { x: 0, y: startNode.y }, mapWidth - 1);

  const littleTriangles =
    getSteps(matrix, { x: 0, y: mapWidth - 1 }, remainderSteps - 1) +
    getSteps(matrix, { x: mapWidth - 1, y: mapWidth - 1 }, remainderSteps - 1) +
    getSteps(matrix, { x: 0, y: 0 }, remainderSteps - 1) +
    getSteps(matrix, { x: mapWidth - 1, y: 0 }, remainderSteps - 1);
  const bigTriangles =
    getSteps(matrix, { x: 0, y: mapWidth - 1 }, stepsInDiagonal) +
    getSteps(matrix, { x: mapWidth - 1, y: mapWidth - 1 }, stepsInDiagonal) +
    getSteps(matrix, { x: 0, y: 0 }, stepsInDiagonal) +
    getSteps(matrix, { x: mapWidth - 1, y: 0 }, stepsInDiagonal);

  return (
    evenRepeats * stepsInEven +
    oddRepeats * stepsInOdd +
    (top + bottom + left + right) +
    (numberOfRepeats + 1) * littleTriangles +
    numberOfRepeats * bigTriangles
  );
}

function getSteps(matrix, startNode, maxSteps) {
  const cache = new Map();
  const toSearch = [{ ...startNode, steps: 0 }];
  do {
    const current = toSearch.shift();
    for (const direction of DIRECTIONS) {
      const newNode = getNewNode(matrix, current, direction, maxSteps);
      if (!newNode) {
        continue;
      }

      const even = newNode.steps % 2;
      const key = `${newNode.x}-${newNode.y}-${even}`;

      if (!cache.get(key)) {
        cache.set(key, even);
        toSearch.push(newNode);
      }
    }
  } while (toSearch.length);

  const maxStepsOdd = maxSteps % 2;
  let result = 0;
  for (const value of cache.values()) {
    if (maxStepsOdd === value) {
      result++;
    }
  }

  return result;
}

function findStart(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x] === START) {
        return { x, y };
      }
    }
  }
}

function getNewNode(matrix, node, direction, maxSteps) {
  const { x, y, steps } = node;

  if (steps === maxSteps) {
    return;
  }

  const [offsetX, offsetY] = direction;
  const newX = x + offsetX;
  const newY = y + offsetY;
  const currentTile = (matrix[newY] ?? [])[newX];

  if (!currentTile || currentTile === WALL) {
    return;
  }

  return { x: newX, y: newY, steps: steps + 1 };
}
