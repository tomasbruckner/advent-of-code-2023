const fs = require("fs");

const DIRECTIONS = {
  NORTH: {
    offsetX: -1,
    offsetY: 0,
    validSymbols: ["|", "7", "F", "S"],
  },
  SOUTH: {
    offsetX: 1,
    offsetY: 0,
    validSymbols: ["|", "L", "J", "S"],
  },
  EAST: {
    offsetX: 0,
    offsetY: 1,
    validSymbols: ["-", "7", "J", "S"],
  },
  WEST: {
    offsetX: 0,
    offsetY: -1,
    validSymbols: ["-", "F", "L", "S"],
  },
};

const PIPE_MAP = {
  "|": [DIRECTIONS.NORTH, DIRECTIONS.SOUTH],
  "-": [DIRECTIONS.EAST, DIRECTIONS.WEST],
  L: [DIRECTIONS.NORTH, DIRECTIONS.EAST],
  J: [DIRECTIONS.NORTH, DIRECTIONS.WEST],
  7: [DIRECTIONS.SOUTH, DIRECTIONS.WEST],
  F: [DIRECTIONS.EAST, DIRECTIONS.SOUTH],
  S: [DIRECTIONS.NORTH, DIRECTIONS.EAST, DIRECTIONS.WEST, DIRECTIONS.SOUTH],
};

const START = "S";

function findStart(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === START) {
        return { x: i, y: j };
      }
    }
  }
}

function isCycle(node) {
  const { x, y, path } = node;

  for (let i = 0; i < path.length; i++) {
    const { x: pathX, y: pathY } = path[i];

    if (pathX === x && pathY === y) {
      return true;
    }
  }

  return false;
}

function search(startNode, matrix) {
  const { x: startX, y: startY } = startNode;
  const nodesToSearch = [{ ...startNode, symbol: START, depth: 1, path: [] }];

  do {
    const currentNode = nodesToSearch.pop();
    const {
      x: currentX,
      y: currentY,
      symbol: currentSymbol,
      depth: currentDepth,
      path: currentPath,
    } = currentNode;

    if (startX === currentX && startY === currentY && currentDepth > 1) {
      return currentDepth;
    }

    for (let i = 0; i < PIPE_MAP[currentSymbol].length; i++) {
      const { offsetX, offsetY, validSymbols } = PIPE_MAP[currentSymbol][i];
      const newX = currentX + offsetX;
      const newY = currentY + offsetY;
      const newSymbol = (matrix[newX] ?? [])[newY];
      if (!validSymbols.includes(newSymbol)) {
        continue;
      }

      if (isCycle({ x: currentX, y: currentY, path: currentPath })) {
        continue;
      }

      nodesToSearch.push({
        x: newX,
        y: newY,
        symbol: newSymbol,
        depth: currentDepth + 1,
        path: [...currentPath, { x: currentX, y: currentY }],
      });
    }
  } while (nodesToSearch.length);

  return 0;
}

function calculateSolution(depth) {
  return Math.floor(depth / 2);
}

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const startNode = findStart(matrix);

  const finalCycle = search(startNode, matrix);

  const result = calculateSolution(finalCycle);
  return result;
}

const resultTest1 = solve(
  fs.readFileSync("./day-10-input-test-1.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultTest2 = solve(
  fs.readFileSync("./day-10-input-test-2.txt", "utf-8")
);
console.log(`Solution to test 2: ${resultTest2}`);

const resultFull = solve(fs.readFileSync("./day-10-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
