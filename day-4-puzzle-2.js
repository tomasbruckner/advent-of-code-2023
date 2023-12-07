const fs = require("fs");

function solve(input) {
  let sum = 0;
  const numberOfCardsMap = {};

  for (const line of input.split("\n")) {
    const winningMap = {};
    let correctNumbers = 0;
    const parts = line.match(/Card +(\d+): +([\d ]+) \| ([\d ]+)/);
    if (!parts) {
      continue;
    }

    const currentCardId = Number(parts[1]);
    if (numberOfCardsMap[currentCardId]) {
      numberOfCardsMap[currentCardId] += 1;
    } else {
      numberOfCardsMap[currentCardId] = 1;
    }

    const numberOfCards = numberOfCardsMap[currentCardId];

    for (const winning of parts[2].split(/ +/)) {
      winningMap[winning] = true;
    }

    for (const clientNumber of parts[3].trim().split(/ +/)) {
      if (winningMap[clientNumber]) {
        correctNumbers += 1;
      }
    }

    for (let i = 1; i <= correctNumbers; i++) {
      const nextCardId = currentCardId + i;
      if (numberOfCardsMap[nextCardId]) {
        numberOfCardsMap[nextCardId] += numberOfCards;
      } else {
        numberOfCardsMap[nextCardId] = numberOfCards;
      }
    }

    sum += numberOfCardsMap[currentCardId];
  }

  return sum;
}

const resultTest = solve(fs.readFileSync("./day-4-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-4-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
