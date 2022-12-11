import {Monkey} from './lib/monkey.ts';

/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = Monkey[];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return monkeyBusiness(input, 20, true).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return monkeyBusiness(input, 10000, false).toString();
}

function monkeyBusiness(monkeys: PuzzleInput, rounds: number, copingCapability: boolean): number {
  const count = monkeys.length;
  const mod = monkeys.reduce((acc, monkey) => acc * monkey.divisor, 1);
  let results = Array(count).fill(0);

  // iterate through each round
  for (let round = 0; round < rounds; round++) {
    // iterate through each monkey
    for (let monkeyIdx = 0; monkeyIdx < count; monkeyIdx++) {
      const monkey = monkeys[monkeyIdx];
      results[monkeyIdx] += monkey.items.length;

      let item = monkey.inspectItem();
      while (item) {
        const newWorry = copingCapability
          ? Math.floor(item / 3)
          : item % mod;
        const receiver = monkey.determineReceiver(newWorry);
        monkeys[receiver].items.push(newWorry);

        item = monkey.inspectItem();
      }
    }
  }

  const inspectedValues = results.sort((a, b) => a < b ? 1 : -1);
  
  return (inspectedValues[0] * inspectedValues[1]);
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
  const monkeys: Monkey[] = [];

  const rawMonkeys = input.split('\n\n');
  for (const monkey of rawMonkeys) {
    const data = monkey.split('\n');
    if (!monkey) continue;
    const rawItems: number[] = data[1].slice(18).split(', ').map(Number);
    const rawCalculation = data[2].slice(19);
    const rawDivisibility = parseInt(data[3].slice(21), 10);
    const rawIfTrue = parseInt(data[4].slice(29), 10);
    const rawIfFalse = parseInt(data[5].slice(30), 10);

    monkeys.push(
      new Monkey(
        rawItems,
        rawCalculation,
        rawDivisibility,
        rawIfTrue,
        rawIfFalse,
      )
    );
  }

  return monkeys;
}