const fs = require("fs");

function getGamePower(line) {
  const parts = line.match(/Game \d+: (.+)/);
  if (!parts) {
    return 0;
  }

  const currentGames = parts[1];
  const gameCubes = {
    red: 0,
    blue: 0,
    green: 0,
  };

  for (const game of currentGames.split(";")) {
    for (const cube of game.split(/,/)) {
      const cubeParts = cube.trim().split(/ /);
      const numberOfCubes = cubeParts[0];
      const cubeColor = cubeParts[1];

      gameCubes[cubeColor] = Math.max(gameCubes[cubeColor], numberOfCubes);
    }
  }

  return gameCubes.red * gameCubes.green * gameCubes.blue;
}

function solve(input) {
  let sum = 0;

  for (const line of input.split("\n")) {
    const result = getGamePower(line);
    sum += result;
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-2-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-2-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
