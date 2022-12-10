/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = number[][];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return calculateVisibility(input).reduce(
    (acc, row, rowIdx) => acc + row.reduce(
      (acc, col, colIdx) => {
        const {top, left, bottom, right} = col;
        const all = [top, left, bottom, right];
        const value = input[rowIdx][colIdx];

        // Meh, this is a bit of a hack, but it works
        // 0 indicates an edge,
        // the rest calculate if the row/column index matches the distance required to see the edge
        // then finally compares the value to the value at the edge, to determine if the tree is visible from 
        // the outside.
        if (
          all.includes(0) || 
          top === rowIdx && value > input[0][colIdx] ||
          left === colIdx && value > input[rowIdx][0] ||
          bottom === (input.length - 1 - rowIdx) && value > input[input.length - 1][colIdx] ||
          right === input[rowIdx].length - 1 - colIdx && value > input[rowIdx][input[rowIdx].length - 1]
        ) {
          return acc + 1;
        }

        return acc;
      },
      0
    ),
    0
  ).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const requirements = calculateVisibility(input);
  let scores: number[] = [];

  for (let row = 0; row < requirements.length; row++) {
    for (let col = 0; col < requirements[row].length; col++) {
      const current = requirements[row][col];

      scores.push(
        Object.values(current).reduce((a, b) => a * b, 1)
      );
    }
  }

  return Math.max(...scores).toString();
}

enum Direction {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

type SightRequirement = {
  [Direction.Top]: number;
  [Direction.Right]: number;
  [Direction.Bottom]: number;
  [Direction.Left]: number;
};

/**
 * Calculate the amount of trees which can be seen from each cell, in each direction in the grid
 */
function calculateVisibility(grid: number[][]): SightRequirement[][] {
  let result: SightRequirement[][] = grid.map(
    (row) => row.map(
      () => ({
        [Direction.Top]: 0,
        [Direction.Right]: 0,
        [Direction.Bottom]: 0,
        [Direction.Left]: 0,
      })
    )
  );

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const cellValue = grid[row][column];
      let cellResult: SightRequirement = {
        [Direction.Top]: 0,
        [Direction.Right]: 0,
        [Direction.Bottom]: 0,
        [Direction.Left]: 0,
      };

      // go up
      for (let i = row - 1; i >= 0; i--) {
        const current = grid[i][column];
        cellResult[Direction.Top]++;

        if (current >= cellValue) {
          break;
        }
      }

      // go right
      for (let i = column + 1; i < grid[row].length; i++) {
        const current = grid[row][i];
        cellResult[Direction.Right]++;

        if (current >= cellValue) {
          break;
        }
      }

      // go down
      for (let i = row + 1; i < grid.length; i++) {
        const current = grid[i][column];
        cellResult[Direction.Bottom]++;

        if (current >= cellValue) {
          break;
        }
      }

      // go left
      for (let i = column - 1; i >= 0; i--) {
        const current = grid[row][i];
        cellResult[Direction.Left]++;

        if (current >= cellValue) {
          break;
        }
      }

      result[row][column] = cellResult;
    }
  }

  return result;
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
  return input.replace(/\n$/, '').split('\n')
    .map(
      (row) => row.split('').map((char) => parseInt(char, 10))
    );
}