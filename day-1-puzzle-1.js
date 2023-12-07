const fs = require("fs");

const NUMBER_MAP = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
};

function solve(input) {
  const lines = input.split("\n");
  let sum = 0;

  for (const line of lines) {
    let firstNumberChar = "";
    let lastNumberChar = "";
    for (let i = 0; i < line.length; i++) {
      const currentChar = line[i];
      if (!NUMBER_MAP[currentChar]) {
        continue;
      }

      if (firstNumberChar === "") {
        firstNumberChar = currentChar;
        lastNumberChar = currentChar;
      } else {
        lastNumberChar = currentChar;
      }
    }

    console.log(`${line} ${Number(firstNumberChar + lastNumberChar)}`);
    sum += Number(firstNumberChar + lastNumberChar);
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-1-input-test-1.txt", "utf-8"));
const resultFull = solve(fs.readFileSync("./day-1-input-full.txt", "utf-8"));

console.log(`Solution to test: ${resultTest}`);
console.log(`Solution to full: ${resultFull}`);
