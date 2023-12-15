const fs = require("fs");

const OPERATIONS = {
  ASSIGN: "=",
  REMOVE: "-",
};

const resultTest1 = solve(fs.readFileSync("./day-15-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-15-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const sequenceList = input.split(",");
  const hashmap = new Map();

  for (const sequence of sequenceList) {
    const parts = sequence.match(/(\w+)(-)?=?(\d+)?/);
    if (!parts) {
      continue;
    }
    const operation =
      parts[2] === OPERATIONS.REMOVE ? OPERATIONS.REMOVE : OPERATIONS.ASSIGN;
    const label = parts[1];
    const focalLength = Number(parts[3]);
    const key = calculateKey(label);

    if (!hashmap.get(key)) {
      hashmap.set(key, []);
    }

    const oldIndex = hashmap.get(key).findIndex((x) => x.label === label);
    if (operation === OPERATIONS.REMOVE) {
      if (oldIndex > -1) {
        hashmap.get(key).splice(oldIndex, 1);
      }
      continue;
    }

    if (oldIndex >= 0) {
      hashmap.get(key)[oldIndex].focalLength = focalLength;
    } else {
      hashmap.get(key).push({
        label,
        focalLength,
      });
    }
  }

  const result = calculateSolution(hashmap);

  return result;
}

function calculateKey(label) {
  let current = 0;
  for (let i = 0; i < label.length; i++) {
    const ascii = label[i].charCodeAt(0);
    current = ((current + ascii) * 17) % 256;
  }

  return current;
}

function calculateSolution(hashmap) {
  let sum = 0;
  const sortedKey = Array.from(hashmap.keys()).sort((a, b) => a - b);
  for (const key of sortedKey) {
    for (let i = 0; i < hashmap.get(key).length; i++) {
        const focalLength = hashmap.get(key)[i].focalLength;
        sum += (key + 1) * (i + 1) * focalLength
    }
  }

  return sum;
}
