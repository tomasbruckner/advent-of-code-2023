const fs = require("fs");

const BOULDER = "O";

const DIRECTIONS = {
  NORTH: 1,
  WEST: 2,
  SOUTH: 3,
  EAST: 4,
};

const NUMBER_OF_CYCLES = 1_000_000_000;

const resultTest1 = solve(fs.readFileSync("./day-14-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-14-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const matrix = input.split("\n");
  const finalMatrix = getFinalMatrix(matrix);
  const result = calculateSolution(finalMatrix.split("\n"));

  return result;
}

function getFinalMatrix(matrix) {
  let count = 0;
  const map = new Map();
  map[matrix.join("\n")] = count;
  const reverseMap = new Map();
  reverseMap[count] = matrix.join("\n");
  let m = getTransposedMatrix(matrix);

  do {
    count += 1;
    m = slide(m, DIRECTIONS.NORTH);
    m = getTransposedMatrix(m);
    m = slide(m, DIRECTIONS.WEST);
    m = getTransposedMatrix(m);
    m = slide(m, DIRECTIONS.SOUTH);
    m = getTransposedMatrix(m);
    m = slide(m, DIRECTIONS.EAST);

    const mapKey = m.join("\n");
    if (map[mapKey]) {
      const startOfCycle = map[mapKey];
      const indexInCycle = (NUMBER_OF_CYCLES - startOfCycle) % (count - startOfCycle);

      return reverseMap[startOfCycle + indexInCycle];
    }

    map[mapKey] = count;
    reverseMap[count] = mapKey;
    m = getTransposedMatrix(m);
  } while (true);
}

function getTransposedMatrix(matrix) {
  const rotated = [];

  for (let i = 0; i < matrix[0].length; i++) {
    let newLine = "";
    for (let j = 0; j < matrix.length; j++) {
      newLine += matrix[j][i];
    }

    rotated.push(newLine);
  }

  return rotated;
}

function slide(matrix, direction) {
  const newMatrix = [];

  for (const line of matrix) {
    const parts = line.split("#");
    const newParts = [];
    for (const part of parts) {
      let sorted = [...part].sort();
      if (direction === DIRECTIONS.NORTH || direction === DIRECTIONS.WEST) {
        sorted = sorted.reverse();
      }

      newParts.push(sorted.join(""));
    }

    newMatrix.push(newParts.join("#"));
  }

  return newMatrix;
}

function calculateSolution(matrix) {
  let sum = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const currentChar = matrix[i][j];
      if (currentChar === BOULDER) {
        sum += matrix.length - i;
      }
    }
  }

  return sum;
}
