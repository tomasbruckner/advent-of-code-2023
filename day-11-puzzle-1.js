const fs = require("fs");

const GALAXY = "#";
const EMPTY = ".";

function expandMatrix(matrix) {
  const expandX = [];
  const expandY = [];

  for (let i = 0; i < matrix.length; i++) {
    let found = false;
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === GALAXY) {
        found = true;
        break;
      }
    }

    if (!found) {
      expandY.push(i);
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
      expandX.push(i);
    }
  }

  for (let i = 0; i < expandY.length; i++) {
    const newline = Array(matrix[0].length).fill(EMPTY);
    matrix.splice(expandY[i] + i, 0, newline);
  }

  for (let i = 0; i < expandX.length; i++) {
    for (let j = 0, length = matrix.length; j < length; j++) {
      matrix[j].splice(expandX[i] + i, 0, EMPTY);
    }
  }
}

function getPairs(matrix) {
  const pairs = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === GALAXY) {
        pairs.push([j, i]);
      }
    }
  }

  return pairs;
}

function solve(input) {
  const matrix = input.split("\n").map((x) => x.split(""));
  expandMatrix(matrix);
  const pairs = getPairs(matrix);

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
