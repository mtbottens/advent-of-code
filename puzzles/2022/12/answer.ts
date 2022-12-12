/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = {
  elevations: number[][];
  start: [number, number];
  end: [number, number];
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  const costs = calculateStepsNeededToReachEnd(input);
  const {end: [x, y]} = input;
  return costs[x][y].toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const costs = calculateStepsNeededToReachEnd(input);
  const costsFromLowestElevations: number[] = [];
  const {elevations, end: [x, y]} = input;

  for (let rowIdx = 0; rowIdx < elevations.length; rowIdx++) {
    for (let colIdx = 0; colIdx < elevations[rowIdx].length; colIdx++) {
      if (elevations[rowIdx][colIdx] === 0) {
        costsFromLowestElevations.push(
          calculateStepsNeededToReachEnd({
            ...input,
            start: [rowIdx, colIdx],
          })[x][y]
        );
      }
    }
  }

  return Math.min(...costsFromLowestElevations).toString();
}

/**
 * Calculate steps required to reach end for each cell
 */
function calculateStepsNeededToReachEnd(input: PuzzleInput): number[][] {
  const {elevations, start, end} = input;
  const costs: number[][] = Array(input.elevations.length)
    .fill(null)
    .map(
      () => Array(input.elevations[0].length).fill(Infinity)
    )
  costs[start[0]][start[1]] = 0;

  walk(start);

  return costs;

  function walk(originalPos: [number, number]) {
    const nextPositions: number[][] = [
      // up
      [originalPos[0] - 1, originalPos[1]],
      // right
      [originalPos[0], originalPos[1] + 1],
      // down
      [originalPos[0] + 1, originalPos[1]],
      // left
      [originalPos[0], originalPos[1] - 1],
    ].filter(([x, y]) => {
      // only existing positions
      return typeof elevations?.[x]?.[y] === 'number';
    });

    for (const pos of nextPositions) {
      // only walk if height difference is <= 1
      const currentHeight = elevations[originalPos[0]][originalPos[1]];
      const posHeight = elevations[pos[0]][pos[1]];

      if (posHeight - currentHeight > 1) {
        continue;
      }

      // only walk if new cost is less than current cost
      const newCost = costs[originalPos[0]][originalPos[1]] + 1;
      const posCost = typeof costs?.[pos[0]]?.[pos[1]] === 'number' ? costs?.[pos[0]]?.[pos[1]] : Infinity;
      
      if (newCost < posCost) {
        costs[pos[0]][pos[1]] = newCost;
        walk(pos as [number, number]);
      }
    }
  }
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
  const start: [number, number] = [0, 0];
  const end: [number, number] = [0, 0];
  const elevations = input.replace(/\n$/, '').split('\n')
    .map((row, rowIdx) => row.split('').map((col, colIdx) => {
      switch (col) {
        case 'S':
          start[0] = rowIdx;
          start[1] = colIdx;
          return 0;
        case 'E':
          end[0] = rowIdx;
          end[1] = colIdx;
          return 25;
        default:
          return col.charCodeAt(0) - 97;
      }
    }));

  return {
    elevations,
    start,
    end,
  };
}