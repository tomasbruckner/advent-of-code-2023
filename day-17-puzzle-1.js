const fs = require("fs");

const DIRECTIONS = {
  NORTH: 1,
  WEST: 2,
  SOUTH: 3,
  EAST: 4,
};

const MAX_STEPS = 3;

const MOVES = {
  [DIRECTIONS.NORTH]: [
    { offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST },
    { offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST },
    { offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH },
  ],
  [DIRECTIONS.WEST]: [
    { offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST },
    { offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH },
    { offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH },
  ],
  [DIRECTIONS.SOUTH]: [
    { offsetX: -1, offsetY: 0, direction: DIRECTIONS.WEST },
    { offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST },
    { offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH },
  ],
  [DIRECTIONS.EAST]: [
    { offsetX: 1, offsetY: 0, direction: DIRECTIONS.EAST },
    { offsetX: 0, offsetY: 1, direction: DIRECTIONS.SOUTH },
    { offsetX: 0, offsetY: -1, direction: DIRECTIONS.NORTH },
  ],
};

const resultTest1 = solve(fs.readFileSync("./day-17-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-17-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const matrix = input
    .split("\n")
    .map((x) => x.split("").map((x) => Number(x)));
  const result = getPath(matrix);

  return result;
}

function getPath(matrix) {
  const toSearch = [
    { x: 0, y: 0, steps: 0, score: 0, direction: DIRECTIONS.EAST },
  ];
  const visited = new Map();
  const endNode = { x: matrix[0].length - 1, y: matrix.length - 1 };
  const { x: finalX, y: finalY } = endNode;

  do {
    const currentNode = toSearch.pop();
    const newPaths = getNewPaths(currentNode, matrix, visited, endNode);
    for (const { x: newX, y: newY, score } of newPaths) {
      if (newX === finalX && newY === finalY) {
        return score;
      }
    }

    if (newPaths.length) {
      toSearch.push(...newPaths);
      toSearch.sort((a, b) => b.sortOrder - a.sortOrder);
    }
  } while (toSearch.length);

  return 0;
}

function getNewPaths(currentNode, matrix, visited, endNode) {
  const {
    x: currentX,
    y: currentY,
    steps: currentSteps,
    direction: currentDirection,
    score,
  } = currentNode;
  const newPaths = [];

  for (const { offsetX, offsetY, direction } of MOVES[currentDirection]) {
    const newSteps = currentDirection === direction ? currentSteps + 1 : 1;
    const newX = currentX + offsetX;
    const newY = currentY + offsetY;
    const nextMove = {
      x: newX,
      y: newY,
      direction,
      steps: newSteps,
    };
    const currentNodeScore = getScore(matrix, nextMove);
    const newScore = currentNodeScore + score;

    if (typeof currentNodeScore === "undefined") {
      continue;
    }

    const key = `${nextMove.x}-${nextMove.y}-${newSteps}-${direction}`;
    if (!visited.get(key)) {
      visited.set(key, true);
    } else {
      continue;
    }

    newPaths.push({
      ...nextMove,
      score: newScore,
      sortOrder:
        newScore + estimateStepsToEnd(newX, newY, endNode.x, endNode.y),
    });
  }

  return newPaths;
}

function getScore(matrix, { x, y, steps }) {
  if (steps > MAX_STEPS) {
    return;
  }

  return (matrix[y] ?? [])[x];
}

function estimateStepsToEnd(currentX, currentY, finalX, finalY) {
  return finalX - currentX + finalY - currentY;
}
