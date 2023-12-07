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

const WORD_NUMBER_MAP = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function solve(input) {
  const lines = input.split("\n");
  let sum = 0;

  for (const line of lines) {
    let firstNumberChar = "";
    let lastNumberChar = "";
    for (let i = 0; i < line.length; i++) {
      let foundNumber;
      const currentChar = line[i];

      if (NUMBER_MAP[currentChar]) {
        foundNumber = currentChar;
      } else {
        const restOfLine = line.substring(i);
        for (const k of Object.keys(WORD_NUMBER_MAP)) {
          if (restOfLine.startsWith(k)) {
            foundNumber = WORD_NUMBER_MAP[k];
            break;
          }
        }
      }

      if (typeof foundNumber === "undefined") {
        continue;
      }

      if (firstNumberChar === "") {
        firstNumberChar = foundNumber;
        lastNumberChar = foundNumber;
      } else {
        lastNumberChar = foundNumber;
      }
    }

    sum += Number(firstNumberChar + lastNumberChar);
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-1-input-test-2.txt", "utf-8"));
const resultFull = solve(fs.readFileSync("./day-1-input-full.txt", "utf-8"));

console.log(`Solution to test: ${resultTest}`);
console.log(`Solution to full: ${resultFull}`);
