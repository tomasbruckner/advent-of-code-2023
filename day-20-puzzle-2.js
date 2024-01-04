const fs = require("fs");

const MODULE_TYPE = {
  BROADCASTER: "broadcaster",
  FLIP_FLOP: "%",
  CONJUNCTION: "&",
  RESET: "rx",
};

const PULSE_TYPE = {
  LOW: "LOW",
  HIGH: "HIGH",
};

const resultFull = solve(fs.readFileSync("./day-20-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const modules = {
    [MODULE_TYPE.RESET]: {
      type: MODULE_TYPE.RESET,
      destinations: [],
    },
  };

  for (const line of input.split("\n")) {
    const parts = line.match(/^([%&])?(.+) -> (.+)/);
    const type = parts[1];
    const key = parts[2];
    const destinations = parts[3].split(", ");

    modules[key] = {
      lastPulses: type === MODULE_TYPE.CONJUNCTION ? {} : undefined,
      isOn: type === MODULE_TYPE.FLIP_FLOP ? false : undefined,
      type:
        type === MODULE_TYPE.FLIP_FLOP
          ? MODULE_TYPE.FLIP_FLOP
          : type === MODULE_TYPE.CONJUNCTION
          ? MODULE_TYPE.CONJUNCTION
          : MODULE_TYPE.BROADCASTER,
      destinations,
    };
  }

  updateConjuctionLastPulses(modules);
  const finalModules = getFinalModules(modules);

  let iterationCount = 0;
  const cycles = {};

  while (true) {
    iterationCount += 1;
    const pressed = iterate(modules, finalModules);

    for (const module of pressed) {
      if (!cycles[module]) {
        cycles[module] = [];
      }

      cycles[module].push(iterationCount);
    }

    if (Object.keys(cycles).length === finalModules.length) {
      break;
    }
  }

  const result = calculateResult(cycles);

  return result;
}

function updateConjuctionLastPulses(modules) {
  for (const key of Object.keys(modules)) {
    const module = modules[key];
    if (module.type !== MODULE_TYPE.CONJUNCTION) {
      continue;
    }

    for (const k of Object.keys(modules)) {
      if (modules[k].destinations.includes(key)) {
        modules[key].lastPulses[k] = PULSE_TYPE.LOW;
      }
    }
  }
}

function iterate(modules, nodesToCheck) {
  const pulses = [
    { type: PULSE_TYPE.LOW, destination: MODULE_TYPE.BROADCASTER },
  ];

  const pressed = [];

  do {
    const currentPulse = pulses.shift();
    const newPulses = generateNewPulses(modules, currentPulse);
    pulses.push(...newPulses);

    if (!nodesToCheck.includes(currentPulse.destination)) {
      continue;
    }

    for (const { type } of newPulses) {
      if (type !== PULSE_TYPE.HIGH) {
        continue;
      }

      pressed.push(currentPulse.destination);
    }
  } while (pulses.length);

  return pressed;
}

function generateNewPulses(modules, currentPulse) {
  const { type: pulseType, destination, source } = currentPulse;
  const {
    type: moduleType,
    destinations: moduleDestinastions,
    lastPulses,
    isOn,
  } = modules[destination] || {};

  if (moduleType === MODULE_TYPE.BROADCASTER) {
    const generatedPulses = moduleDestinastions.map((x) => ({
      type: pulseType,
      destination: x,
      source: destination,
    }));
    return generatedPulses;
  }

  if (moduleType === MODULE_TYPE.FLIP_FLOP && pulseType === PULSE_TYPE.LOW) {
    modules[destination].isOn = !isOn;

    const generatedPulses = moduleDestinastions.map((x) => ({
      type: isOn ? PULSE_TYPE.LOW : PULSE_TYPE.HIGH,
      destination: x,
      source: destination,
    }));

    return generatedPulses;
  }

  if (moduleType === MODULE_TYPE.CONJUNCTION) {
    lastPulses[source] = pulseType;
    const allHigh = Object.keys(lastPulses).every(
      (key) => lastPulses[key] === PULSE_TYPE.HIGH
    );

    const generatedPulses = moduleDestinastions.map((x) => ({
      type: allHigh ? PULSE_TYPE.LOW : PULSE_TYPE.HIGH,
      destination: x,
      source: destination,
    }));

    return generatedPulses;
  }

  return [];
}

// from graphviz we know that these will be conjunctions
// so we simplify our solution to just level 2 and expecting conjunction modules
// more correct would be general solution that expects nothing
function getFinalModules(modules) {
  const nodesConnectedToResteLevel1 = [];

  for (const key of Object.keys(modules)) {
    const destinations = modules[key].destinations;

    if (destinations.includes(MODULE_TYPE.RESET)) {
      nodesConnectedToResteLevel1.push(key);
    }
  }

  const nodesConnectedToResteLevel2 = [];
  for (const key of Object.keys(modules)) {
    const destinations = modules[key].destinations;
    if (destinations.some((x) => nodesConnectedToResteLevel1.includes(x))) {
      nodesConnectedToResteLevel2.push(key);
    }
  }

  return nodesConnectedToResteLevel2;
}

function calculateResult(cycles) {
  const cycleIterations = [];

  for (const key of Object.keys(cycles)) {
    const iteration = cycles[key][0];
    cycleIterations.push(iteration);
  }

  let lcm = cycleIterations[0];

  for (let i = 1; i < cycleIterations.length; i++) {
    lcm = findLCM(lcm, cycleIterations[i]);
  }

  return lcm;
}

function findGCD(a, b) {
  return b === 0 ? a : findGCD(b, a % b);
}

function findLCM(a, b) {
  return (a * b) / findGCD(a, b);
}
