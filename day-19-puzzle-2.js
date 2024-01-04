const fs = require("fs");

const RULE_TYPE = {
  ACCEPT: "ACCEPT",
  REJECT: "REJECT",
  LOWER_THAN: "LOWER_THAN",
  GRATER_THAN: "GRATER_THAN",
  NO_CONDITION: "NO_CONDITION",
  RULE: "RULE",
};

const ACCEPT = "A";
const REJECT = "R";
const START_RULE = "in";

const MIN_VALUE = 1;
const MAX_VALUE = 4000;

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

  const accepted = getAccepted(rules);
  const result = calculateResult(accepted);

  return result;
}

function getAccepted(rules) {
  const toSearch = [
    {
      x: [MIN_VALUE, MAX_VALUE],
      m: [MIN_VALUE, MAX_VALUE],
      a: [MIN_VALUE, MAX_VALUE],
      s: [MIN_VALUE, MAX_VALUE],
      rules: [...rules[START_RULE]],
    },
  ];
  const accepted = [];

  do {
    const currentNode = toSearch.pop();
    const { rules: currentRules } = currentNode;
    if (currentRules.length === 0) {
      continue;
    }

    const rule = currentRules.shift();

    if (rule.type === RULE_TYPE.ACCEPT) {
      accepted.push(currentNode);
      continue;
    }

    if (rule.type === RULE_TYPE.REJECT) {
      continue;
    }

    if (rule.type === RULE_TYPE.NO_CONDITION) {
      toSearch.push({
        ...currentNode,
        rules: [...rules[rule.endSymbol]],
      });
      continue;
    }

    if (rule.type === RULE_TYPE.GRATER_THAN) {
      const [from, to] = currentNode[rule.startSymbol];
      let lower;
      let greater;
      if (from > rule.value) {
        greater = [from, to];
      } else if (to <= rule.value) {
        lower = [from, to];
      } else {
        lower = [from, rule.value];
        greater = [rule.value + 1, to];
      }

      if (rule.endType === RULE_TYPE.ACCEPT) {
        accepted.push({
          ...currentNode,
          [rule.startSymbol]: greater,
        });
      }

      if (rule.endType === RULE_TYPE.RULE) {
        toSearch.push({
          ...currentNode,
          [rule.startSymbol]: greater,
          rules: [...rules[rule.endSymbol]],
        });
      }

      if (lower) {
        toSearch.push({
          ...currentNode,
          [rule.startSymbol]: lower,
          rules: [...currentRules],
        });
      }
    }

    if (rule.type === RULE_TYPE.LOWER_THAN) {
      const [from, to] = currentNode[rule.startSymbol];
      let lower;
      let greater;
      if (to < rule.value) {
        lower = [from, to];
      } else if (from >= rule.value) {
        greater = [from, to];
      } else {
        lower = [from, rule.value - 1];
        greater = [rule.value, to];
      }

      if (rule.endType === RULE_TYPE.ACCEPT) {
        accepted.push({
          ...currentNode,
          [rule.startSymbol]: lower,
        });
      }

      if (rule.endType === RULE_TYPE.RULE) {
        toSearch.push({
          ...currentNode,
          [rule.startSymbol]: lower,
          rules: [...rules[rule.endSymbol]],
        });
      }

      if (greater) {
        toSearch.push({
          ...currentNode,
          [rule.startSymbol]: greater,
          rules: [...currentRules],
        });
      }
    }
  } while (toSearch.length);

  return accepted;
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

function calculateResult(accepted) {
  let result = 0;

  for (const { x, m, a, s } of accepted) {
    let sum = x[1] - x[0] + 1;
    result += sum * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);
  }

  return result;
}
