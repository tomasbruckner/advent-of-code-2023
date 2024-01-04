const fs = require("fs");

const MODULE_TYPE = {
  BROADCASTER: "BROADCASTER",
  FLIP_FLOP: "FLIP_FLOP",
  CONJUNCTION: "CONJUNCTION",
};

const PULSE_TYPE = {
  LOW: "LOW",
  HIGH: "HIGH",
};

const FLIP_FLOP = "%";
const CONJUNCTION = "&";
const BROADCASTER = "broadcaster";
const NUMBER_OF_ITERATIONS = 1_000;

const resultTest1 = solve(fs.readFileSync("./day-20-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultTest2 = solve(
  fs.readFileSync("./day-20-input-test-2.txt", "utf-8")
);
console.log(`Solution to test 2: ${resultTest2}`);

const resultFull = solve(fs.readFileSync("./day-20-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const modules = {};

  for (const line of input.split("\n")) {
    const parts = line.match(/^([%&])?(.+) -> (.+)/);
    const type = parts[1];
    const key = parts[2];
    const destinations = parts[3].split(", ");

    modules[key] = {
      type:
        type === FLIP_FLOP
          ? MODULE_TYPE.FLIP_FLOP
          : type === CONJUNCTION
          ? MODULE_TYPE.CONJUNCTION
          : MODULE_TYPE.BROADCASTER,
      lastPulses: type === CONJUNCTION ? {} : undefined,
      isOn: type === FLIP_FLOP ? false : undefined,
      destinations,
    };
  }

  setConjuctionLastPulses(modules);

  let lowCount = 0;
  let highCount = 0;
  for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    const { lowCount: currentLowCount, highCount: currentHighCount } =
      getPulsesCount(modules);
    lowCount += currentLowCount;
    highCount += currentHighCount;
  }

  return lowCount * highCount;
}

function setConjuctionLastPulses(modules) {
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

function getPulsesCount(modules) {
  const pulses = [{ type: PULSE_TYPE.LOW, destination: BROADCASTER }];
  let lowCount = 1;
  let highCount = 0;

  do {
    const currentPulse = pulses.shift();
    const newPulses = generateNewPulses(modules, currentPulse);
    for (const { type } of newPulses) {
      if (type === PULSE_TYPE.LOW) {
        lowCount += 1;
      } else {
        highCount += 1;
      }
    }
    pulses.push(...newPulses);
  } while (pulses.length);

  return { lowCount, highCount };
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
