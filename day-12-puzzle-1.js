const fs = require("fs");

const DAMAGED = "#";
const UNKNOWN = "?";
const WORKING = ".";

function isValidMap(map, groups) {
  let currentGroupIndex = 0;

  let currentOasis = 0;
  for (let i = 0; i <= map.length; i++) {
    const currentTile = map[i];
    if (currentTile === DAMAGED) {
      currentOasis += 1;
      continue;
    }

    if (currentOasis > 0) {
      if (groups[currentGroupIndex] !== currentOasis) {
        return false;
      }

      currentGroupIndex += 1;
      currentOasis = 0;
    }
  }

  return currentGroupIndex === groups.length;
}

function generateMaps(map) {
  const newMap1 = map.split("");
  const newMap2 = [...newMap1];
  const index = newMap1.findIndex((x) => x === UNKNOWN);

  if (index < 0) {
    return [];
  }

  newMap1[index] = WORKING;
  newMap2[index] = DAMAGED;

  return [newMap1.join(''), newMap2.join('')];
}

function getCombinations({ map, groups }) {
  const mapToGenerate = [map];
  const fullMaps = [];

  do {
    const currentMap = mapToGenerate.pop();
    const newMaps = generateMaps(currentMap);

    if (newMaps.length === 0) {
      fullMaps.push(currentMap);
      continue;
    }

    mapToGenerate.push(...newMaps);
  } while (mapToGenerate.length);

  let result = 0;
  for (const mapToCheck of fullMaps) {
    if (isValidMap(mapToCheck, groups)) {
      result += 1;
    }
  }

  return result;
}

function solve(input) {
  const maps = [];
  for (const line of input.split("\n")) {
    const parts = line.split(" ");
    if (parts.length !== 2) {
      continue;
    }

    maps.push({
      map: parts[0],
      groups: parts[1].split(",").map((x) => Number(x)),
    });
  }

  let result = 0;

  for (const map of maps) {
    result += getCombinations(map);
  }

  return result;
}

const resultTest1 = solve(
  fs.readFileSync("./day-12-input-test-1.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-12-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
