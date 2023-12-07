const fs = require("fs");

const OVERLAP_ENUM = {
  NO_OVERLAP: 0,
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 3,
  ALL: 4,
};

function getOverlap({
  startIndexSource,
  rangeSource,
  startIndexDestination,
  rangeDestination,
}) {
  if (
    startIndexDestination <= startIndexSource &&
    startIndexDestination + rangeDestination > startIndexSource &&
    startIndexDestination + rangeDestination < startIndexSource + rangeSource
  ) {
    return OVERLAP_ENUM.LEFT;
  }

  if (
    startIndexDestination >= startIndexSource &&
    startIndexDestination < startIndexSource + rangeSource &&
    startIndexDestination + rangeDestination > startIndexSource + rangeSource
  ) {
    return OVERLAP_ENUM.RIGHT;
  }

  if (
    startIndexDestination > startIndexSource &&
    startIndexDestination + rangeDestination < startIndexSource + rangeSource
  ) {
    return OVERLAP_ENUM.MIDDLE;
  }

  if (
    startIndexDestination <= startIndexSource &&
    startIndexDestination + rangeDestination >= startIndexSource + rangeSource
  ) {
    return OVERLAP_ENUM.ALL;
  }

  return OVERLAP_ENUM.NO_OVERLAP;
}

function getRanges(mappings, ranges) {
  const allNewRanges = [];
  for (const { startIndex: currentRangeStartIndex, range: currentRange } of ranges) {
    const currentNewRanges = [];
    for (const {
      startIndexSource: mappingStartIndex,
      startIndexDestination: mappingNewStartIndex,
      range: mappingRange,
    } of mappings) {
      const overlap = getOverlap({
        startIndexSource: currentRangeStartIndex,
        rangeSource: currentRange,
        startIndexDestination: mappingStartIndex,
        rangeDestination: mappingRange,
      });

      if (overlap === OVERLAP_ENUM.LEFT) {
        const newRange = mappingRange - currentRangeStartIndex + mappingStartIndex;
        currentNewRanges.push({
          originalStartIndex: currentRangeStartIndex,
          startIndex: mappingNewStartIndex + (mappingRange - newRange),
          range: newRange,
        });
      } else if (overlap === OVERLAP_ENUM.RIGHT) {
        const newRange = currentRangeStartIndex + currentRange - mappingStartIndex;
        currentNewRanges.push({
          originalStartIndex: currentRangeStartIndex + currentRange - newRange,
          startIndex: mappingNewStartIndex,
          range: currentRangeStartIndex + currentRange - mappingStartIndex,
        });
      } else if (overlap === OVERLAP_ENUM.MIDDLE) {
        currentNewRanges.push({
          originalStartIndex: mappingStartIndex,
          startIndex: mappingNewStartIndex,
          range: mappingRange,
        });
      } else if (overlap === OVERLAP_ENUM.ALL) {
        currentNewRanges.push({
          originalStartIndex: currentRangeStartIndex,
          startIndex: mappingNewStartIndex + (currentRangeStartIndex - mappingStartIndex),
          range: currentRange,
        });
      }
    }

    currentNewRanges.sort((a, b) => a.originalStartIndex - b.originalStartIndex);
    const defaultRanges = getDefaultRanges(currentNewRanges, currentRangeStartIndex, currentRange);
    allNewRanges.push(...currentNewRanges);
    allNewRanges.push(...defaultRanges);
  }

  return allNewRanges.filter((x) => x.range);
}

function getDefaultRanges(currentNewRanges, startIndex, range) {
  if (currentNewRanges.length === 0) {
    // there was no overlap
    return [
      {
        startIndex,
        range,
      },
    ];
  }

  const defaultRanges = [];
  let localEndIndex = startIndex;
  for (const { originalStartIndex, range: currentRange } of currentNewRanges) {
    if (originalStartIndex > localEndIndex) {
      defaultRanges.push({
        startIndex: localEndIndex,
        range: originalStartIndex - localEndIndex,
      });
    }

    localEndIndex = originalStartIndex + currentRange;
  }

  if (localEndIndex < startIndex + range) {
    defaultRanges.push({
      startIndex: localEndIndex + 1,
      range: startIndex + range - localEndIndex,
    });
  }

  return defaultRanges;
}

function findLowestLocation(ranges) {
  ranges.sort((a, b) => a.startIndex - b.startIndex);

  return ranges[0].startIndex;
}

function solve(input) {
  const allLines = input.split("\n");
  const [_, ...allSeeds] = allLines[0].split(/ /);
  let ranges = [];

  for (let i = 0; i < allSeeds.length; i += 2) {
    ranges.push({
      startIndex: Number(allSeeds[i]),
      range: Number(allSeeds[i + 1]),
    });
  }

  for (let i = 1; i < allLines.length; i++) {
    if (!/^\d/.test(allLines[i])) {
      continue;
    }

    const mappings = [];
    do {
      const numbers = allLines[i].split(/ +/);
      mappings.push({
        startIndexSource: Number(numbers[1]),
        startIndexDestination: Number(numbers[0]),
        range: Number(numbers[2]),
      });
      i += 1;
    } while (allLines[i]);

    ranges = getRanges(mappings, ranges);
  }

  const result = findLowestLocation(ranges);

  return result;
}

const resultTest = solve(fs.readFileSync("./day-5-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-5-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
