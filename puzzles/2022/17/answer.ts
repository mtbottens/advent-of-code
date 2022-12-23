/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */

import {Chamber} from './lib/chamber.ts';
import {CycleDetector} from './lib/cycleDetector.ts';
import {rockFactory} from './lib/rockFactory.ts';
import {
  Direction,
  DirectionGenerator,
  RockGenerator,
  RockType,
} from './lib/types.ts';

type PuzzleInput = {
  directionGenerator: () => DirectionGenerator;
  rockGenerator: () => RockGenerator;
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  const {
    directionGenerator,
    rockGenerator,
  } = input;

  const generator = rockGenerator();
  const directions = directionGenerator();
  const chamber = new Chamber();

  let createRockCount = 2022;

  for (let count = 0; count < createRockCount; count++) {
    const rock = generator.next().value.rock;
    chamber.addRock(rock);

    for (const {falling} of chamber.whileFalling()) {
      if (falling) {
        chamber.move(directions.next().value.direction)
      }
    }
  }

  // chamber.print();

  return chamber.getTallest().toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const {
    directionGenerator,
    rockGenerator,
  } = input;

  const generator = rockGenerator();
  const directions = directionGenerator();
  const chamber = new Chamber();
  const cycleDetector = new CycleDetector();
  let cycleDetected = false;

  let createRockCount = 1000000000000;
  let cycleAdditionalHeight = 0;

  for (let count = 0; count < createRockCount; count++) {
    const {rock, type} = generator.next().value;
    let previousDirectionIdx = -1;
    chamber.addRock(rock);

    for (const {falling, position} of chamber.whileFalling()) {
      if (falling) {
        const {direction, idx} = directions.next().value;
        previousDirectionIdx = idx;
        chamber.move(direction)
      } else if (!cycleDetected) {
        // rock has finished falling, check for cycles
        const cycle = cycleDetector.add({
          rockType: type,
          directionIdx: previousDirectionIdx,
          restingPlace: position!,
        }, {
          height: chamber.getTallest(),
          droppedCount: count,
        });

        if (cycle) {
          cycleDetected = true;
          // SPEED THIS SHIT UP
          const {start, end} = cycle;
          const cycleLength = end.droppedCount - start.droppedCount;
          const cycleHeight = end.height - start.height;
          const cyclesToRun = Math.floor((createRockCount - count) / cycleLength);
          const cyclesRemaining = (createRockCount - count) % cycleLength;
          // update count to skip as many cycles as possible
          count = createRockCount - cyclesRemaining;
          // add the height of the cycles to the final height
          cycleAdditionalHeight = cyclesToRun * cycleHeight;
        }
      }
    }
  }

  return (chamber.getTallest() + cycleAdditionalHeight).toString();
}

/**
 * Takes the raw input from adventofcode.com for the given day and year
 * and returns the processed input into whichever format is needed for the
 * one and two functions.
 * 
 * @param {string} input the raw input
 * @returns {PuzzleInput} the processed input
 */
export function processInput(input: string): PuzzleInput {
  // TRUST NO ONE
  const sanitized = input.match(/[<>]/g)!.join('');

  return {
    directionGenerator,
    rockGenerator,
  };

  function *directionGenerator() {
    while (true) {
      for (let idx = 0; idx < sanitized.length; idx++) {
        yield {
          direction: sanitized[idx] as Direction,
          idx,
        };
      }
    }
  };

  function *rockGenerator() {
    const rocks: RockType[] = [
      RockType.Flat,
      RockType.Plus,
      RockType.Corner,
      RockType.Tall,
      RockType.Square,
    ];

    while (true) {
      for (const type of rocks) {
        yield {
          rock: rockFactory(type),
          type,
        };
      }
    }
  }
}