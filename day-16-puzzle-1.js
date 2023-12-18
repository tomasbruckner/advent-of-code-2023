const fs = require("fs");

const DIRECTIONS = {
  NORTH: 1,
  WEST: 2,
  SOUTH: 3,
  EAST: 4,
};

const MOVE_MAP = {
  [DIRECTIONS.NORTH]: {
    "-": [
      { offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST },
      { offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST },
    ],
    "|": [{ offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH }],
    "/": [{ offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST }],
    "\\": [{ offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST }],
    ".": [{ offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH }],
  },
  [DIRECTIONS.WEST]: {
    "-": [{ offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST }],
    "|": [
      { offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH },
      { offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH },
    ],
    "/": [{ offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH }],
    "\\": [{ offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH }],
    ".": [{ offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST }],
  },
  [DIRECTIONS.SOUTH]: {
    "-": [
      { offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST },
      { offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST },
    ],
    "|": [{ offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH }],
    "/": [{ offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST }],
    "\\": [{ offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST }],
    ".": [{ offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH }],
  },
  [DIRECTIONS.EAST]: {
    "-": [{ offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST }],
    "|": [
      { offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH },
      { offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH },
    ],
    "/": [{ offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH }],
    "\\": [{ offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH }],
    ".": [{ offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST }],
  },
};

const resultTest1 = solve(fs.readFileSync("./day-16-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-16-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const energizedMatrix = getEnergizedMatrix(matrix);

  const result = calculateSolution(energizedMatrix);

  return result;
}

function getEnergizedMatrix(matrix) {
  const toSearch = [
    { x: 0, y: 0, direction: DIRECTIONS.EAST, symbol: matrix[0][0] },
  ];
  const visited = {
    0: {
      0: [DIRECTIONS.EAST],
    },
  };

  do {
    const currentNode = toSearch.pop();
    const newPaths = generateNewPaths(currentNode, matrix);
    for (const path of newPaths) {
      const { x: newX, y: newY, direction: newDirection } = path;
      if (!visited[newX]) {
        visited[newX] = {};
      }

      if (!visited[newX][newY]) {
        visited[newX][newY] = [];
      }

      if (!visited[newX][newY].includes(newDirection)) {
        visited[newX][newY].push(newDirection);
        toSearch.push(path);
      }
    }
  } while (toSearch.length);

  return visited;
}

function generateNewPaths(
  { x, y, symbol, direction: previousDirection },
  matrix
) {
  const moves = MOVE_MAP[previousDirection][symbol];
  const newPaths = [];

  for (const { offsetX, offsetY, direction } of moves) {
    const newX = x + offsetX;
    const newY = y + offsetY;
    const newSymbol = (matrix[newY] ?? [])[newX];

    if (!newSymbol) {
      continue;
    }

    newPaths.push({
      y: newY,
      x: newX,
      symbol: newSymbol,
      direction,
    });
  }

  return newPaths;
}

function calculateSolution(energizedMatrix) {
  let sum = 0;

  for (const key of Object.keys(energizedMatrix)) {
    sum += Object.keys(energizedMatrix[key]).length;
  }

  return sum;
}
