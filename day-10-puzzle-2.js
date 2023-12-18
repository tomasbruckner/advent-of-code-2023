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

// in some cases S is not the corner
// we assume it is, but to have more general solutions
// you should modify the logic in function calculateSolution
// to check if S is or is not the corner
const CORNERS = ["L", "J", "7", "F", "S"];

const resultTest3 = solve(
  fs.readFileSync("./day-10-input-test-3.txt", "utf-8")
);
console.log(`Solution to test 3: ${resultTest3}`);

const resultTest4 = solve(
  fs.readFileSync("./day-10-input-test-4.txt", "utf-8")
);
console.log(`Solution to test 4: ${resultTest4}`);

const resultTest5 = solve(
  fs.readFileSync("./day-10-input-test-5.txt", "utf-8")
);
console.log(`Solution to test 5: ${resultTest5}`);

const resultFull = solve(fs.readFileSync("./day-10-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const startNode = findStart(matrix);

  const finalCycle = search(startNode, matrix);
  const result = calculateSolution(finalCycle, matrix);

  return result;
}

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
      return currentPath;
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

function calculateSolution(paths, matrix) {
  const points = paths.filter(({ x, y }) => CORNERS.includes(matrix[x][y]));
  const area = calculateArea(points);

  // pick's theorem
  return area - paths.length / 2 + 1;
}

// shoelace
function calculateArea(points) {
  const normalizedPoints = [...points, points[0]]
  let sumA = 0;
  let sumB = 0;
  for (let i = 1; i < normalizedPoints.length; i++) {
    const { x: y, y: x } = normalizedPoints[i - 1];
    const { x: nextY, y: nextX } = normalizedPoints[i];

    sumA += x * nextY;
    sumB += y * nextX;
  }

  return Math.abs(sumA - sumB) / 2;
}
