const fs = require("fs");

const resultTest1 = solve(fs.readFileSync("./day-22-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-22-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const nodePairs = [];

  for (const line of input.split("\n")) {
    const points = line.split("~");
    const newNodePair = [
      points[0].split(",").map((x) => Number(x)),
      points[1].split(",").map((x) => Number(x)),
    ];

    nodePairs.push(newNodePair);
  }

  nodePairs.sort((a, b) => a[0][2] - b[0][2]);

  const droppedPairs = dropPairs(nodePairs);
  const result = calculateSolution(droppedPairs);

  return result;
}

function dropPairs(nodePairs) {
  const newNodePairs = [];
  for (const [from, to] of nodePairs) {
    const [x1, y1, z1] = from;
    const [x2, y2, z2] = to;

    const { offsetZ, support } = getInfo(from, to, newNodePairs);
    newNodePairs.push([
      [x1, y1, z1 - offsetZ],
      [x2, y2, z2 - offsetZ],
      support,
    ]);
  }

  return newNodePairs;
}

function getInfo(from, to, nodePairs) {
  const [x1, y1, z1] = from;
  const [x2, y2, z2] = to;
  let offsetZ = Math.min(z1, z2);
  const support = [];
  let supportZ = 0;

  for (let i = 0; i < nodePairs.length; i++) {
    const [fromCurrent, toCurrent] = nodePairs[i];
    const [xFrom, yFrom, zFrom] = fromCurrent;
    const [xTo, yTo, zTo] = toCurrent;

    if (hasCollision(x1, x2, xFrom, xTo) && hasCollision(y1, y2, yFrom, yTo)) {
      const newCandidateOffsetZ = Math.min(z1, z2) - Math.max(zFrom, zTo) - 1;
      offsetZ = Math.min(offsetZ, newCandidateOffsetZ);
      support.push(i);
      supportZ = Math.max(supportZ, zTo);
    }
  }

  return {
    offsetZ,
    support: support.filter((x) => nodePairs[x][1][2] === supportZ),
  };
}

function hasCollision(from1, to1, from2, to2) {
  const collisionLeft = to1 >= from2 && from1 <= from2;
  const collisionRight = from1 <= to2 && from1 >= from2;
  const collisionInside = from1 >= from2 && to1 <= to2;
  const collisionOutside = from1 <= from2 && to1 >= to2;
  return collisionLeft || collisionRight || collisionInside || collisionOutside;
}

function calculateSolution(nodePairs) {
  const cannotRemove = {};

  for (let i = 0; i < nodePairs.length; i++) {
    const isSupporterBy = nodePairs[i][2];

    if (isSupporterBy.length === 1) {
      cannotRemove[isSupporterBy[0]] = true;
    }
  }

  let result = 0;
  for (const key of Object.keys(cannotRemove)) {
    result += calculate(nodePairs, Number(key));
  }

  return result;
}

function calculate(nodePairs, index) {
  let found = 0;
  const indexes = [index];

  for (let i = 0; i < nodePairs.length; i++) {
    const supportedBy = nodePairs[i][2];

    if (supportedBy.length === 0) {
      continue;
    }

    if (supportedBy.every((val) => indexes.includes(val))) {
      indexes.push(i);
      found += 1;
    }
  }

  return found;
}
