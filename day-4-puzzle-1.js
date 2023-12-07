const fs = require("fs");

function solve(input) {
  let sum = 0;

  for (const line of input.split('\n')) {
    const winningMap = {}
    let gameSum = 0;
    const parts = line.match(/Card +\d+: +([\d ]+) \| ([\d ]+)/)
    if (!parts) {
      continue;
    }

    for (const winning of parts[1].split(/ +/)) {
      winningMap[winning] = true;
    }

    for (const clientNumber of parts[2].trim().split(/ +/)) {
      if (winningMap[clientNumber]) {
        gameSum = gameSum === 0 ? 1 : gameSum * 2;
      }
    }

    sum += gameSum;
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-4-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-4-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
