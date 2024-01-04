const fs = require("fs");

const RULE_TYPE = {
  ACCEPT: 1,
  REJECT: 2,
  LOWER_THAN: 3,
  GRATER_THAN: 4,
  NO_CONDITION: 5,
  RULE: 6,
};

const ACCEPT = "A";
const REJECT = "R";
const START_RULE = "in";

const resultTest1 = solve(fs.readFileSync("./day-19-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-19-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const rules = {};

  const allLines = input.split("\n");
  let i = 0;
  for (; i < allLines.length; i++) {
    const parts = allLines[i].match(/^(\w+){(.+)}/);
    if (!parts) {
      break;
    }

    const ruleName = parts[1];
    rules[ruleName] = [];
    for (const rule of parts[2].split(",")) {
      const parsedRule = parseRule(rule);
      rules[ruleName].push(parsedRule);
    }
  }

  const ratings = [];
  for (; i < allLines.length; i++) {
    const parts = allLines[i].match(/{(.+)}/);
    if (!parts) {
      continue;
    }

    const parsedRating = parseRating(parts[1]);
    ratings.push(parsedRating);
  }

  const accepted = [];
  for (const rating of ratings) {
    if (isAccepted(rating, rules)) {
      accepted.push(rating);
    }
  }

  const result = calculateResult(accepted);

  return result;
}

function isAccepted(rating, rules) {
  let currentRuleName = START_RULE;

  do {
    for (const rule of rules[currentRuleName]) {
      if (rule.type === RULE_TYPE.ACCEPT) {
        return true;
      }

      if (rule.type === RULE_TYPE.REJECT) {
        return false;
      }

      if (rule.type === RULE_TYPE.NO_CONDITION) {
        currentRuleName = rule.endSymbol;
        break;
      }

      if (rule.type === RULE_TYPE.GRATER_THAN) {
        if (rating[rule.startSymbol] > rule.value) {
          if (rule.endType === RULE_TYPE.ACCEPT) {
            return true;
          }

          if (rule.endType === RULE_TYPE.REJECT) {
            return false;
          }

          currentRuleName = rule.endSymbol;
          break;
        }
      }

      if (rule.type === RULE_TYPE.LOWER_THAN) {
        if (rating[rule.startSymbol] < rule.value) {
          if (rule.endType === RULE_TYPE.ACCEPT) {
            return true;
          }

          if (rule.endType === RULE_TYPE.REJECT) {
            return false;
          }

          currentRuleName = rule.endSymbol;
          break;
        }
      }
    }
  } while (true);
}

function parseRule(rule) {
  if (rule.includes(">")) {
    const parts = rule.match(/(.+)>(\d+):(\w+)/);
    return {
      startSymbol: parts[1],
      value: Number(parts[2]),
      type: RULE_TYPE.GRATER_THAN,
      endSymbol: parts[3],
      endType:
        parts[3] === ACCEPT
          ? RULE_TYPE.ACCEPT
          : parts[3] === REJECT
          ? RULE_TYPE.REJECT
          : RULE_TYPE.RULE,
    };
  }

  if (rule.includes("<")) {
    const parts = rule.match(/(.+)<(\d+):(\w+)/);
    return {
      startSymbol: parts[1],
      value: Number(parts[2]),
      type: RULE_TYPE.LOWER_THAN,
      endSymbol: parts[3],
      endType:
        parts[3] === ACCEPT
          ? RULE_TYPE.ACCEPT
          : parts[3] === REJECT
          ? RULE_TYPE.REJECT
          : RULE_TYPE.RULE,
    };
  }

  if (rule === ACCEPT) {
    return {
      type: RULE_TYPE.ACCEPT,
    };
  }

  if (rule === REJECT) {
    return {
      type: RULE_TYPE.REJECT,
    };
  }

  return {
    type: RULE_TYPE.NO_CONDITION,
    endSymbol: rule,
    endType: RULE_TYPE.RULE,
  };
}

function parseRating(rating) {
  const result = {};

  for (const part of rating.split(",")) {
    const parts = part.split("=");
    result[parts[0]] = Number(parts[1]);
  }

  return result;
}

function calculateResult(ratings) {
  let sum = 0;
  for (const rating of ratings) {
    for (const key of Object.keys(rating)) {
      sum += rating[key];
    }
  }

  return sum;
}
