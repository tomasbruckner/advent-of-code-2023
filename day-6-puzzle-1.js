const fs = require("fs");

function solve(input) {
  const allLines = input.split("\n");
  const [_, ...times] = allLines[0].split(/ +/);
  const [__, ...distances] = allLines[1].split(/ +/);

  let result = 0;
  for (let i = 0; i < times.length; i++) {
    const time = Number(times[i]);
    const previousRecord = Number(distances[i]);
    let localSolution = 0;
    let found = false;
    for (let j = 1; j < time; j++) {
      if (j * (time - j) > previousRecord) {
        localSolution += 1;
        found = true;
      } else if (found) {
        break;
      }
    }

    if (localSolution) {
      result = result === 0 ? localSolution : result * localSolution;
    }
  }

  return result;
}

const resultTest = solve(fs.readFileSync("./day-6-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-6-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
