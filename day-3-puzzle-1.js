const fs = require("fs");

const NUMBERS = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  0: true,
};

const NOT_SYMBOLS = {
  ".": true,
  "undefined": true,
};

const DIRECTION_MATRIX = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function checkHasSymbol(matrix, x, y) {
  for (const [xOffset, yOffset] of DIRECTION_MATRIX) {
    const symbolToCheck = (matrix.at(xOffset + x) ?? []).at(yOffset + y);

    if (!NOT_SYMBOLS[symbolToCheck] && !NUMBERS[symbolToCheck]) {
      return true;
    }
  }

  return false;
}

function getSum(number, hasSymbol) {
  if (!hasSymbol) {
    return 0;
  }

  return Number(number);
}

function solve(input) {
  let sum = 0;
  const matrix = input.split("\n").map((x) => x.split(""));

  for (let i = 0; i < matrix.length; i++) {
    let hasSymbol = false;
    let currentNumber = "";
    for (let j = 0; j < matrix[i].length; j++) {
      let currentChar = matrix[i][j];
      if (NUMBERS[currentChar]) {
        currentNumber += currentChar;
        hasSymbol ||= checkHasSymbol(matrix, i, j);
        continue;
      }

        sum += getSum(currentNumber, hasSymbol);
        currentNumber = "";
        hasSymbol = false;
    }

    sum += getSum(currentNumber, hasSymbol);
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-3-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-3-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
