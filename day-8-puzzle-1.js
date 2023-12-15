const fs = require("fs");

function solve(input) {
  const allLines = input.split("\n");
  const moves = allLines[0];

  const map = {};
  for (let i = 2; i < allLines.length; i++) {
    const parts = allLines[i].match(/(\w+) = \((\w+), (\w+)\)/);
    if (!parts) {
      continue;
    }

    map[parts[1]] = {
      L: parts[2],
      R: parts[3],
    };
  }

  let result = 0;
  let currentNode = "AAA";
  let moveIndex = 0;
  do {
    const currentMove = moves[moveIndex];
    currentNode = map[currentNode][currentMove]; 
    result += 1;
    moveIndex = (moveIndex + 1) % moves.length;
  } while (currentNode !== "ZZZ");

  return result;
}

const resultTest1 = solve(fs.readFileSync("./day-8-input-test-1.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultTest2 = solve(fs.readFileSync("./day-8-input-test-2.txt", "utf-8"));
console.log(`Solution to test 2: ${resultTest2}`);

const resultFull = solve(fs.readFileSync("./day-8-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
