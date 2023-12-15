const fs = require("fs");

function getNewSequence(oldSequence) {
  const newSequence = [];

  for (let i = 0; i < oldSequence.length - 1; i++) {
    newSequence.push(oldSequence[i + 1] - oldSequence[i]);
  }

  return newSequence;
}

function isFinalSequence(sequence) {
  return sequence.every((x) => x === 0);
}

function calculateNextNumber(sequences) {
  let result = 0;
  for (let i = sequences.length - 2; i >= 0; i--) {
    result = sequences[i][0] - result;
  }

  return result;
}

function solve(input) {
  let result = 0;
  for (const line of input.split("\n")) {
    const sequence = line.split(/ +/).map(x => Number(x));
    const resultSequences = [sequence]

    let previousSequence = sequence;
    let currentSequence;
    do {
      currentSequence = getNewSequence(previousSequence);
      previousSequence = currentSequence;
      resultSequences.push(currentSequence);
    } while(!isFinalSequence(currentSequence));

    const nextNumber = calculateNextNumber(resultSequences);
    result += nextNumber;
  }

  return result;
}

const resultTest = solve(fs.readFileSync("./day-9-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-9-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
