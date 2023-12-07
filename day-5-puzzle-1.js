const fs = require("fs");

const MAPPINGS = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];

function findLowestLocation(seeds, map) {
  let minLocation = Number.MAX_SAFE_INTEGER;

  for (const seed of seeds) {
    let currentValue = seed;
    for (const key of MAPPINGS) {
      for (const { source, destination, range } of map[key]) {
        if (currentValue >= source && currentValue <= source + range - 1) {
          currentValue = destination + (currentValue - source);
          break;
        }
      }
    }

    if (minLocation > currentValue) {
      minLocation = currentValue;
    }
  }

  return minLocation;
}

function solve(input) {
  const seeds = [];
  const map = {};
  const allLines = input.split("\n");
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];

    if (line.startsWith("seeds:")) {
      const [_, ...allSeeds] = line.split(/ /);
      seeds.push(...allSeeds);
      continue;
    }

    const parts = line.match(/(\w+-to-\w+) map:/);
    if (!parts) {
      continue;
    }

    const mapKey = parts[1];
    map[mapKey] = [];

    do {
      let nextLine = allLines[i + 1];
      const numbers = nextLine.split(/ +/);

      map[mapKey].push({
        source: Number(numbers[1]),
        destination: Number(numbers[0]),
        range: Number(numbers[2]),
      });

      i += 1;
    } while (allLines[i + 1]);
  }

  const result = findLowestLocation(seeds, map);

  return result;
}

const resultTest = solve(fs.readFileSync("./day-5-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-5-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
