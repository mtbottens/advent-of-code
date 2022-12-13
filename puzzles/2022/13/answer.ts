/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type InfinitelyDeepArray = Array<InfinitelyDeepArray | number>
type PuzzleInput = [InfinitelyDeepArray, InfinitelyDeepArray][];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return input.map((pair, idx) => {
    return (compare(...pair) > -1) ? idx + 1 : 0;
  }).reduce((acc, n) => acc + n, 0).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const flattened = [];
  for (const [a, b] of input) {
    flattened.push(a, b);
  }
  const inputs: InfinitelyDeepArray[] = [
    [2],
    [6],
    ...flattened,
  ];

  // Always mix up in my head if it should be 1 or -1, too lazy to fix
  inputs.sort((a, b) => compare(a,b) * -1);

  const indexOfTwo = inputs.findIndex((n) => typeof n !== 'number' && n.length === 1 && n[0] === 2);
  const indexOfSix = inputs.findIndex((n) => typeof n !== 'number' && n.length === 1 && n[0] === 6);

  return ((indexOfTwo + 1) * (indexOfSix + 1)).toString();
}

export function compare(a: InfinitelyDeepArray | number, b: InfinitelyDeepArray | number): number {
  const typeA = typeof a;
  const typeB = typeof b;

  if (typeA === 'number' && typeB === 'number') {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }

  const listA = (typeA === 'number' ? [a] : a) as InfinitelyDeepArray[];
  const listB = (typeB === 'number' ? [b] : b) as InfinitelyDeepArray[];
  const size = Math.min(listA.length, listB.length);

  for (let idx = 0; idx < size; idx++) {
    const valA = listA[idx];
    const valB = listB[idx];
    const result = compare(valA, valB);

    if (result !== 0) {
      return result;
    }
  }

  if (listB.length < listA.length) return -1;
  if (listA.length < listB.length) return 1;

  return 0;
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
    .split('\n\n')
    .reduce(
      (acc, groupsAsString) => {
        const [a, b] = groupsAsString.split('\n');

        return [
          ...acc,
          [JSON.parse(a), JSON.parse(b)],
        ];
      },
      [] as PuzzleInput,
    );
}