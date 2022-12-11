/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = number[];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return [20, 60, 100, 140, 180, 220].reduce((acc, value) => {
    return acc + (value * input[value - 1]);
  }, 0).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return input.map((register, cycle) => {
    const result = [
      [register - 1, register, register + 1].includes(cycle % 40)
        ? '#'
        : '.'
    ];

    if ([39, 79, 119, 159, 199].includes(cycle)) {
      result.push('\n');
    }

    return result.join('');
  }).join('');
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
  const cycles: number[] = [];
  const commands = input.split('\n');
  let command = commands.shift();
  let register = 1;

  while (command) {
    const [action, value] = command.split(' ');
    if (!action) break;

    const cost = action === 'addx' ? 2 : 1;
    for (let i = 0; i < cost; i++) {
      cycles.push(register);
    }

    if (value) {
      register += parseInt(value, 10);
    }
    command = commands.shift();
  }

  return cycles;
}