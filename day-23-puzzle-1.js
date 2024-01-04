const fs = require("fs");

const STEEP_SLOPES = ["^", "v", ">", "<"];
const FOREST = "#";
const DIRECTIONS = [
  {
    offsetX: -1,
    offsetY: 0,
    fromStep: "<",
  },
  {
    offsetX: 1,
    offsetY: 0,
    fromStep: ">",
  },
  {
    offsetX: 0,
    offsetY: -1,
    fromStep: "^",
  },
  {
    offsetX: 0,
    offsetY: 1,
    fromStep: "v",
  },
];

const resultTest1 = solve(fs.readFileSync("./day-23-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-23-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const { start, end } = getStartAndEnd(matrix);
  let max = 0;

  const toSearch = [start];

  do {
    const currentNode = toSearch.pop();
    const { x: currentX, y: currentY, steps: currentSteps } = currentNode;
    if (currentX === end.x && currentY === end.y) {
      max = Math.max(max, currentSteps);
    }

    const newSteps = generateNewSteps(matrix, currentNode, end);
    if (newSteps.length) {
      toSearch.push(...newSteps);
      toSearch.sort((a, b) => a.score - b.score);
    }
  } while (toSearch.length);

  return max;
}

function getStartAndEnd(matrix) {
  const start = matrix[0].findIndex((x) => x !== FOREST);
  const end = matrix.at(-1).findIndex((x) => x !== FOREST);

  return {
    start: {
      x: start,
      y: 0,
      steps: 0,
      score: 0,
      path: { [`${start}-0`]: true },
      previousStep: undefined,
    },
    end: {
      x: end,
      y: matrix.length - 1,
    },
  };
}

function generateNewSteps(matrix, currentNode, endNode) {
  const {
    x: currentX,
    y: currentY,
    steps: currentSteps,
    previousStep,
  } = currentNode;

  const validSteps = [];
  for (const { offsetX, offsetY, fromStep } of DIRECTIONS) {
    const newX = currentX + offsetX;
    const newY = currentY + offsetY;
    const newTile = (matrix[newY] ?? [])[newX];
    if (!newTile) {
      continue;
    }

    if (newTile === FOREST) {
      continue;
    }

    if (STEEP_SLOPES.includes(previousStep) && fromStep !== previousStep) {
      continue;
    }

    const key = `${newX}-${newY}`;
    if (currentNode.path[key]) {
      continue;
    }

    const validStep = {
      x: newX,
      y: newY,
      steps: currentSteps + 1,
      path: {
        ...currentNode.path,
        [key]: true,
      },
      previousStep: STEEP_SLOPES.includes(newTile) ? newTile : undefined,
      score: 0,
    };

    validStep.score = getScore(validStep, endNode);
    validSteps.push(validStep);
  }

  return validSteps;
}

function getScore(currentNode, end) {
  return (
    currentNode.score -
    Math.abs(currentNode.x - end.x) -
    Math.abs(currentNode.y - end.y)
  );
}

function print(matrix, path) {
  for (const x of Object.keys(path)) {
    const [a, b] = x.split("-");
    matrix[b][a] = "O";
  }

  const q = matrix.map((x) => x.join("")).join("\n");

  console.log(q);
}
