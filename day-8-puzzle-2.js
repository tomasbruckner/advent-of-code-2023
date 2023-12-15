const fs = require("fs");

function findGCD(a, b) {
  return b === 0 ? a : findGCD(b, a % b);
}

function findLCM(a, b) {
  return (a * b) / findGCD(a, b);
}

function findSolution(numberList) {
  let lcm = numberList[0];

  for (let i = 1; i < numberList.length; i++) {
    lcm = findLCM(lcm, numberList[i]);
  }

  return lcm;
}

function solve(input) {
  const allLines = input.split("\n");
  const moves = allLines[0];
  const startingPaths = [];

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

    if (parts[1].endsWith("A")) {
      startingPaths.push(parts[1]);
    }
  }

  const cycles = [];
  for (let i = 0; i < startingPaths.length; i++) {
    let currentNode = startingPaths[i];
    let steps = 0;
    let moveIndex = 0;
    do {
      const currentMove = moves[moveIndex];
      currentNode = map[currentNode][currentMove];

      steps += 1;
      moveIndex = (moveIndex + 1) % moves.length;
    } while (!currentNode.endsWith("Z"));

    cycles.push(steps);
  }

  const result = findSolution(cycles);

  return result;
}

const resultTest = solve(fs.readFileSync("./day-8-input-test-3.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-8-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
