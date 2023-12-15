const fs = require("fs");

const OASIS = "#";
const UNKNOWN = "?";
const SAND = ".";
const MULTIPLICATION_COEFFICIENT = 5;

function isValidMap(map, groups, partialValid = false) {
  let currentGroupIndex = 0;

  let currentOasis = 0;
  for (let i = 0; i <= map.length; i++) {
    const currentTile = map[i];

    if (currentTile === UNKNOWN) {
      return partialValid;
    }

    if (currentTile === OASIS) {
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

function generateMaps(map, groups) {
  const newMapArr1 = map.split("");
  const newMapArr2 = [...newMapArr1];
  const index = newMapArr1.findIndex((x) => x === UNKNOWN);

  if (index < 0) {
    return [];
  }

  newMapArr1[index] = SAND;
  newMapArr2[index] = OASIS;

  const result = [];
  const newMap1 = newMapArr1.join("");
  const newMap2 = newMapArr2.join("");

  if (isValidMap(newMap1, groups, true)) {
    result.push(newMap1);
  }

  if (isValidMap(newMap2, groups, true)) {
    result.push(newMap2);
  }

  return result;
}

function getCombinations({ map, groups }) {
  const mapToGenerate = [map];
  const fullMaps = [];

  do {
    const currentMap = mapToGenerate.pop();
    const newMaps = generateMaps(currentMap, groups);

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

function expandMap({ map, groups }) {
  const newMap = Array(MULTIPLICATION_COEFFICIENT).fill(map).join(UNKNOWN);
  const newGroups = Array(MULTIPLICATION_COEFFICIENT).fill(groups).flat();

  return {
    map: newMap,
    groups: newGroups,
  };
}

function solve(input) {
  const maps = [];
  for (const line of input.split("\n")) {
    const parts = line.split(" ");
    if (parts.length !== 2) {
      continue;
    }

    const expandedMap = expandMap({
      map: parts[0],
      groups: parts[1].split(",").map((x) => Number(x)),
    });
    maps.push(expandedMap);
  }

  let result = 0;
  for (const map of maps) {
    result += getCombinations(map);
  }

  return result;
}

// const resultTest1 = solve(
//   fs.readFileSync("./day-12-input-test-1.txt", "utf-8")
// );
// console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-12-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
