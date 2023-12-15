const fs = require("fs");

const BOULDER = 'O';

function rotateMatrix(matrix) {
  const rotated = [];

  for (let i = 0; i < matrix[0].length; i++) {
    let newLine = ''
    for (let j = 0; j < matrix.length; j++) {
      newLine += matrix[j][i]
    }

    rotated.push(newLine);
  }

  return rotated;
}

function calculateSolution(matrix) {
  let sum = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const currentChar = matrix[i][j];
      if (currentChar === BOULDER) {
        sum += matrix[i].length - j;
      }
    }
  }

  return sum;
}

function solve(input) {
  const matrix = rotateMatrix(input.split("\n"));
  const leveredMatrix = []

  for (const line of matrix) {
    const parts = line.split('#');
    const newParts = [];
    for (const part of parts) {
      const sorted = [...part].sort().reverse()
      newParts.push(sorted.join(''))
    }


    leveredMatrix.push(newParts.join('#'))
  }

  const result = calculateSolution(leveredMatrix);

  return result;
}

const resultTest1 = solve(
  fs.readFileSync("./day-14-input-test.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-14-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
