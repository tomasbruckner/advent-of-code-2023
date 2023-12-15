const fs = require("fs");

const GALAXY = "#";
const EXPAND_COEFFICIENT = 1000000-1;

function getExpanded(matrix) {
  const expandX = {};
  const expandY = {};

  for (let i = 0; i < matrix.length; i++) {
    let found = false;
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === GALAXY) {
        found = true;
        break;
      }
    }

    if (!found) {
      expandY[i] = true;
    }
  }

  for (let i = 0; i < matrix[0].length; i++) {
    let found = false;
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][i] === GALAXY) {
        found = true;
        break;
      }
    }

    if (!found) {
      expandX[i] = true;
    }
  }

  return {
    expandX,
    expandY,
  };
}

function getPairs(matrix, { expandX, expandY }) {
  const pairs = [];
  let offsetY = 0;
  for (let i = 0; i < matrix.length; i++) {
    let offsetX = 0;
  
    if (expandY[i]) {
      offsetY += EXPAND_COEFFICIENT;
    }

    for (let j = 0; j < matrix[i].length; j++) {
      if (expandX[j]) {
        offsetX += EXPAND_COEFFICIENT;
      }

      if (matrix[i][j] === GALAXY) {
        pairs.push([j + offsetX, i + offsetY]);
      }
    }
  }

  return pairs;
}

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  const expanded = getExpanded(matrix);
  const pairs = getPairs(matrix, expanded);

  let result = 0;
  for (let i = 0; i < pairs.length - 1; i++) {
    const [x1, y1] = pairs[i];
    for (let j = i + 1; j < pairs.length; j++) {
      const [x2, y2] = pairs[j];
      result += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
  }

  return result;
}

const resultTest1 = solve(
  fs.readFileSync("./day-11-input-test-1.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-11-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
