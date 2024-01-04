const fs = require("fs");

const DAMAGED = "#";
const UNKNOWN = "?";
const WORKING = ".";
const MULTIPLICATION_COEFFICIENT = 5;

function solve(input) {
  const maps = [];
  for (const line of input.split("\n")) {
    const parts = line.split(" ");
    if (parts.length !== 2) {
      continue;
    }

    const map = parts[0].replaceAll(/\.+/g, ".");

    const expandedMap = expandMap({
      map,
      groups: parts[1].split(",").map((x) => Number(x)),
    });
    maps.push(expandedMap);
  }

  let result = 0;
  for (let map of maps) {
    result += getCombinations(map);
  }

  return result;
}

function expandMap({ map, groups }) {
  const newMap = Array(MULTIPLICATION_COEFFICIENT).fill(map).join(UNKNOWN);
  const newGroups = Array(MULTIPLICATION_COEFFICIENT).fill(groups).flat();

  return {
    map: newMap + WORKING,
    groups: newGroups,
  };
}

function getCombinations({ map, groups }) {
  let solutionList = [
    {
      currentGroup: 0,
      currentDamaged: 0,
      count: 1,
    },
  ];

  for (let i = 0; i < map.length; i++) {
    let currentTileList = [map[i]];

    if (map[i] === UNKNOWN) {
      currentTileList = [WORKING, DAMAGED];
    }

    const newSolutions = [];
    for (const solution of solutionList) {
      const currentGroupLength = groups[solution.currentGroup];

      for (const currentTile of currentTileList) {
        const s = { ...solution };
        if (updateSolution(s, currentTile, currentGroupLength)) {
          newSolutions.push(s);
        }
      }
    }

    const cache = new Map();
    for (const solution of newSolutions) {
      const key = `${solution.currentGroup}-${solution.currentDamaged}`;
      const count = cache.get(key)
        ? cache.get(key) + solution.count
        : solution.count;
      cache.set(key, count);
    }

    const normalizedSolutions = [];
    for (const [key, count] of cache.entries()) {
      const [group, damaged] = key.split("-");
      normalizedSolutions.push({
        currentGroup: Number(group),
        currentDamaged: Number(damaged),
        count,
      });
    }

    solutionList = normalizedSolutions;
  }

  let result = 0;
  for (const { count } of solutionList.filter(
    (x) => x.currentGroup === groups.length
  )) {
    result += count;
  }

  return result;
}

function updateSolution(solution, currentTile, currentGroupLength) {
  if (currentTile === DAMAGED) {
    solution.currentDamaged += 1;
    if (solution.currentDamaged > currentGroupLength) {
      return false;
    }

    return true;
  }

  if (solution.currentDamaged > 0) {
    if (solution.currentDamaged !== currentGroupLength) {
      return false;
    }

    solution.currentDamaged = 0;
    solution.currentGroup += 1;
  }

  return true;
}

const resultTest1 = solve(
  fs.readFileSync("./day-12-input-test-1.txt", "utf-8")
);
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-12-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
