const fs = require("fs");

const resultTest1 = solve(fs.readFileSync("./day-15-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-15-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const sequenceList = input.split(",");
  let result = 0;

  for (const sequence of sequenceList) {
    let current = 0;
    for (let i = 0; i < sequence.length; i++) {
      const ascii = sequence[i].charCodeAt(0);
      current = ((current + ascii) * 17) % 256;
    }

    result += current;
  }

  return result;
}
