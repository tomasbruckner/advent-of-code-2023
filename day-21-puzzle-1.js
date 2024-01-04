const fs = require("fs");

const START = "S";
const WALL = "#";

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const MAX_STEPS_TEST = 6;
const MAX_STEPS_FULL = 64;

const resultTest1 = solve(
  fs.readFileSync("./day-21-input-test.txt", "utf-8"),
  MAX_STEPS_TEST
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(
  fs.readFileSync("./day-21-input-full.txt", "utf-8"),
  MAX_STEPS_FULL
);
console.log(`Solution to full: ${resultFull}`);

function solve(input, maxSteps) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const startNode = findStart(matrix);

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

  let result = 0;
  for (const value of cache.values()) {
    if (!value) {
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
