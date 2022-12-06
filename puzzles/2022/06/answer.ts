/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = string;

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return getIndexOfDistinctCharactersByCount(input, 4).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return getIndexOfDistinctCharactersByCount(input, 14).toString();
}

/**
 * Utility to get result from input based on variables from challenge
 * 
 * @param {string} input sequence of letters
 * @param {number} distinctCharacterCount how many unique characters to look for
 * @returns {number} position where unique characters are found
 */
function getIndexOfDistinctCharactersByCount(input: string, distinctCharacterCount: number): number {
  for (let cursor = distinctCharacterCount; cursor < input.length; cursor++) {
    const uniqueChars = new Set(input.slice(cursor - distinctCharacterCount, cursor));
    if (uniqueChars.size === distinctCharacterCount) {
      return cursor;
    }
  }

  return -1;
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
  return input;
}