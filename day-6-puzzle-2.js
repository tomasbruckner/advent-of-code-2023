const fs = require("fs");

function solve(input) {
  const allLines = input.split("\n");
  const [_, ...times] = allLines[0].split(/ +/);
  const [__, ...distances] = allLines[1].split(/ +/);
  const time = Number(times.join(""));
  const previousRecord = Number(distances.join(""));

  let result = 0;
  let found = false;
  for (let j = 1; j < time; j++) {
    if (j * (time - j) > previousRecord) {
      result += 1;
      found = true;
    } else if (found) {
      break;
    }
  }

  return result;
}

const resultTest = solve(fs.readFileSync("./day-6-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-6-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
