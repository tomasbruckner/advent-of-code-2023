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

const OPEN = {
  X: ["-", "L", "J", "F", "7"],
  Y: ["|", "L", "J", "F", "7"],
};

const EMPTY = ".";
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

function getStartCharacter(paths, matrix) {
  const firstSymbol = matrix[paths[1].x][paths[1].y];
  const lastSymbol = matrix[paths.at(-1).y][paths.at(-1).x];
  console.log(firstSymbol, lastSymbol);

  if (
    DIRECTIONS.EAST.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.WEST.validSymbols.includes(lastSymbol)
  ) {
    return "-";
  }

  if (
    DIRECTIONS.NORTH.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.SOUTH.validSymbols.includes(lastSymbol)
  ) {
    return "|";
  }

  if (
    DIRECTIONS.EAST.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.SOUTH.validSymbols.includes(lastSymbol)
  ) {
    return "F";
  }

  if (
    DIRECTIONS.WEST.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.SOUTH.validSymbols.includes(lastSymbol)
  ) {
    return "J";
  }

  if (
    DIRECTIONS.NORTH.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.EAST.validSymbols.includes(lastSymbol)
  ) {
    return "L";
  }

  if (
    DIRECTIONS.WEST.validSymbols.includes(firstSymbol) &&
    DIRECTIONS.SOUTH.validSymbols.includes(lastSymbol)
  ) {
    return "7";
  }
}

function calculateSolution(paths, matrix) {
  // matrix[paths[0].x][paths[0].y] = getStartCharacter(paths, matrix);
  matrix[paths[0].x][paths[0].y] = 'F';

  paths.sort((a, b) => {
    if (a.x !== b.x) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });

  let sum = 0;
  const openX = {};
  const openY = {};
  const pathMap = paths.reduce((acc, { x, y }) => {
    acc[`${x}-${y}`] = matrix[x][y];

    return acc;
  }, {});

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const key = `${i}-${j}`;
      if (!pathMap[key]) {
        if (openX[j] && openY[i] && matrix[i][j] === EMPTY) {
          sum += 1;
        }
        continue;
      }

      const value = matrix[i][j];
      if (OPEN.X.includes(value)) {
        openX[j] = !openX[j];
      }

      if (OPEN.Y.includes(value)) {
        openY[i] = !openY[i];
      }
    }
  }

  return sum;
}

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const startNode = findStart(matrix);

  const finalCycle = search(startNode, matrix);
  const result = calculateSolution(finalCycle, matrix);

  return result;
}

// const resultTest3 = solve(
//   fs.readFileSync("./day-10-input-test-3.txt", "utf-8")
// );
// console.log(`Solution to test 3: ${resultTest3}`);

const resultTest4 = solve(
  fs.readFileSync("./day-10-input-test-4.txt", "utf-8")
);
console.log(`Solution to test 4: ${resultTest4}`);

// const resultTest5 = solve(
//   fs.readFileSync("./day-10-input-test-5.txt", "utf-8")
// );
// console.log(`Solution to test 5: ${resultTest5}`);

// const resultFull = solve(fs.readFileSync("./day-10-input-full.txt", "utf-8"));
// console.log(`Solution to full: ${resultFull}`);
