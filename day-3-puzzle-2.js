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
  undefined: true,
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

function addNumber({ currentNumber, hasSymbol, numberList, x, y }) {
  if (!hasSymbol) {
    return 0;
  }

  return numberList.push({
    x,
    y,
    number: currentNumber,
  });
}

function calculateSum(numberList, starList) {
  let sum = 0;

  for (const { x: starX, y: starY, adjacentNumberList } of starList) {
    for (const { x: numberX, y: numberY, number } of numberList) {
      const starMinX = numberX - 1;
      const starMaxX = numberX + 1;
      const starMinY = numberY - number.length;
      const starMaxY = numberY + 1;


      if (
        starX >= starMinX &&
        starX <= starMaxX &&
        starY >= starMinY &&
        starY <= starMaxY
      ) {
        adjacentNumberList.push(number);
      }
    }
  }


  for (const { adjacentNumberList, x, y } of starList) {
    if (adjacentNumberList.length === 2) {
      sum += Number(adjacentNumberList[0]) * Number(adjacentNumberList[1]);
    }
  }

  return sum;
}

function solve(input) {
  const numberList = [];
  const starList = [];

  const matrix = input.split("\n").map((x) => x.split(""));

  for (let i = 0; i < matrix.length; i++) {
    let hasSymbol = false;
    let currentNumber = "";
    for (let j = 0; j < matrix[i].length; j++) {
      let currentChar = matrix[i][j];

      if (currentChar === "*") {
        starList.push({
          x: i,
          y: j,
          adjacentNumberList: [],
        });
      }

      if (NUMBERS[currentChar]) {
        currentNumber += currentChar;
        hasSymbol ||= checkHasSymbol(matrix, i, j);
        continue;
      }

      addNumber({ currentNumber, hasSymbol, numberList, x: i, y: j - 1 });
      currentNumber = "";
      hasSymbol = false;
    }

    addNumber({
      currentNumber,
      hasSymbol,
      numberList,
      x: i,
      y: matrix[i].length - 1,
    });
  }

  const sum = calculateSum(numberList, starList);

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-3-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-3-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
