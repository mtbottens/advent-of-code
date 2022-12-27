import { mutateList } from "./lib/mutateList.ts";

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
  return calculateResult(
    mixInput(
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
  return calculateResult(
    mixInput(
      input,
      10,
      811589153,
    ),
  ).toString();
}

/**
 * Perform the meat of the work required, and return the resulting array
 * 
 * @param {number[]} input 
 * @param {number} mixTimes 
 * @param {number} decryptionKey 
 * @returns {number[]}
 */
function mixInput(input: PuzzleInput, mixTimes = 1, decryptionKey = 1) {
  const decryptedList = input.map(v => v * decryptionKey);
  const indexList = input.map((_, idx) => idx);

  for (let idx = 0; idx < mixTimes; idx++) {
    for (let idx = 0; idx < input.length; idx++) {
      mutateList(idx, indexList, decryptedList[idx]);
    }
  }

  return Array(input.length).fill(0).map((_, idx) => decryptedList[indexList[idx]])
}

/**
 * Helper method to share code between part one and two
 * 
 * @param {number[]} list 
 * @returns {number}
 */
function calculateResult(
  list: number[],
): number {
  const indexOfZero = list.findIndex((el) => el === 0);

  return [1000, 2000, 3000].reduce(
    (acc, idx) => acc + list[(indexOfZero + idx) % list.length],
    0
  );
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
    .map(Number);
}