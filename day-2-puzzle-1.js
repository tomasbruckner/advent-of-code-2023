const fs = require("fs");

const MAXIMUM_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

function getGameId(line) {
  const parts = line.match(/Game (\d+): (.+)/);
  if (!parts) {
    return 0;
  }

  const currentId = Number(parts[1]);
  const currentGames = parts[2];

  for (const game of currentGames.split(";")) {
    for (const cube of game.split(/,/)) {
      const cubeParts = cube.trim().split(/ /);
      const numberOfCubes = cubeParts[0];
      const cubeColor = cubeParts[1];
      if (numberOfCubes > MAXIMUM_CUBES[cubeColor]) {
        return 0;
      }
    }
  }

  return currentId;
}

function solve(input) {
  let sum = 0;

  for (const line of input.split("\n")) {
    const result = getGameId(line);
    sum += result;
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-2-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-2-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
