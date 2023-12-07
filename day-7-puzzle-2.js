const fs = require("fs");

const RANKS = {
  FIVE_OF_KIND: 1,
  FOUR_OF_KIND: 2,
  FULL_HOUSE: 3,
  THREE_OF_KIND: 4,
  TWO_PAIR: 5,
  ONE_PAIR: 6,
  HIGH_CARD: 7,
};

const CARD_VALUE = {
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 12,
  K: 13,
  A: 14,
};

function getRank(hand) {
  const map = {};

  for (let i = 0; i < hand.length; i++) {
    const currentChar = hand[i];
    map[currentChar] = map[currentChar] ? map[currentChar] + 1 : 1;
  }

  const numberOfJokers = map["J"] ?? 0;
  const countList = Object.keys(map).filter(x => x !== 'J').map((x) => map[x]);

  if (numberOfJokers === 5) {
    return RANKS.FIVE_OF_KIND;
  }

  if (numberOfJokers > 0) {
    const maxNumber = Math.max(...countList);
    const indexOfMax = countList.indexOf(maxNumber);
    countList[indexOfMax] += numberOfJokers;
  }

  if (countList.length === 1) {
    return RANKS.FIVE_OF_KIND;
  }

  if (countList.length === 2) {
    if (countList.includes(4)) {
      return RANKS.FOUR_OF_KIND;
    }

    return RANKS.FULL_HOUSE;
  }

  if (countList.includes(3)) {
    return RANKS.THREE_OF_KIND;
  }

  if (countList.length === 3) {
    return RANKS.TWO_PAIR;
  }

  if (countList.length === 4) {
    return RANKS.ONE_PAIR;
  }

  return RANKS.HIGH_CARD;
}

function calculateSolution(pairs) {
  let sum = 0;
  pairs.sort((a, b) => {
    if (a.rank !== b.rank) {
      return b.rank - a.rank;
    }

    for (let i = 0; i < a.hand.length; i++) {
      const leftCard = a.hand[i];
      const rightCard = b.hand[i];
      if (leftCard !== rightCard) {
        return CARD_VALUE[leftCard] - CARD_VALUE[rightCard];
      }
    }

    return 0;
  });

  for (let i = 0; i < pairs.length; i++) {
    sum += (i + 1) * pairs[i].bid;
  }

  return sum;
}

function solve(input) {
  const pairs = [];

  for (const line of input.split("\n")) {
    const [hand, bid] = line.split(/ +/);
    pairs.push({
      hand,
      bid: Number(bid),
      rank: getRank(hand),
    });
  }

  const result = calculateSolution(pairs);

  return result;
}

const resultTest = solve(fs.readFileSync("./day-7-input-test.txt", "utf-8"));
console.log(`Solution to test: ${resultTest}`);

const resultFull = solve(fs.readFileSync("./day-7-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);
