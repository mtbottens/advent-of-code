import {Monkey, Operation} from './lib/types.ts';
import {buildTree, evaluateTree, solveForHumn} from './lib/math.ts';

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
  return evaluateTree(
    buildTree(
      input,
    ),
  ).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return solveForHumn(
    buildTree(
      input,
    ),
  ).toString();
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
  return input
    .replace(/\n$/, '')
    .split('\n')
    .map(line => {
      const [id, rawJob] = line.split(': ');

      // Yelling monkey
      if (rawJob.match(/^\d+$/)) {
        return {
          id,
          job: '!',
          parameters: Number(rawJob),
        }
      }

      // Math monkey
      const [param0, job, param1] = rawJob.split(' ');
      
      return {
        id,
        job: job as Operation,
        parameters: [param0, param1],
      };
    });
}