const fs = require("fs");

function getVerticalIndex(group) {
  const rotated = [];

  for (let i = 0; i < group[0].length; i++) {
    let newLine = ''
    for (let j = 0; j < group.length; j++) {
      newLine += group[j][i]
    }

    rotated.push(newLine);
  }

  const result = getHorizontalIndex(rotated);

  return result;
}

function isReflection(group, index) {
  for (let i = index - 1, offset = index; i >= 0; i--, offset++) {
    if (group[i] === group[offset]) {
      continue;
    }

    if (typeof group[i] === 'undefined' || typeof group[offset] === 'undefined') {
      continue;
    }

    return false;
  }

  return true;
}

function getHorizontalIndex(group) {
  for (let i = 1; i < group.length; i++) {
    if (isReflection(group, i)) {
      return i;
    }
  }

  return 0;
}

function solve(input) {
  const groups = [];
  let currentGroup = []
  for (const line of input.split("\n")) {
    if (line === '') {
      groups.push(currentGroup)
      currentGroup = [];
      continue;
    }

    currentGroup.push(line);
  }

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  let result = 0;
  for (const group of groups) {
    const vertical = getVerticalIndex(group);
    const horizontal = getHorizontalIndex(group)

    result += vertical + 100 * horizontal;
  }

  return result;
}

const resultTest1 = solve(
  fs.readFileSync("./day-13-input-test.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-13-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
