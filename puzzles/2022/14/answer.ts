/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = {
  grid: DisplayCodes[][];
  dropPoint: number;
  rowCount: number;
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  let result = 0;

  while (true) {
    if (!dropSand(input)) {
      result++;
    } else {
      break;
    }
  }

  // Final state after dropping sand
  logGrid(input.grid);

  return result.toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  let result = 0;

  // oops!
  input.grid.unshift(Array(input.grid[0].length).fill(DisplayCodes.Air));
  // Need to add two rows to bottom per differences with first part
  input.grid.push(Array(input.grid[0].length).fill(DisplayCodes.Air));
  input.grid.push(Array(input.grid[0].length).fill(DisplayCodes.Rock));

  while (true) {
    if (!dropSand(input)) {
      result++;
    } else {
      break;
    }
  }

  // Final state after dropping sand
  logGrid(input.grid);
  
  // I'm already trimming the edges off, but not counting them towards the result
  // So I need to add the triangles that fall off the left and right sides of the
  // trimmed grid
  let reachedLeft = false;
  let reachedRight = false;
  let leftOverflow = 0;
  let rightOverflow = 0;

  for (let row = 0; row < input.grid.length; row++) {
    const left = input.grid[row][0];
    const right = input.grid[row][input.grid[row].length - 1];

    if (reachedLeft) {
      leftOverflow += input.grid.length - row - 1;
    } else if (left === DisplayCodes.Sand) {
      reachedLeft = true;
    }

    if (reachedRight) {
      rightOverflow += input.grid.length - row - 1;
    } else if (right === DisplayCodes.Sand) {
      reachedRight = true;
    }
  }

  // Add the result with the overflow triangles
  return (result + leftOverflow + rightOverflow).toString();
}

function dropSand(input: PuzzleInput): boolean {
  const {grid, dropPoint} = input;
  let sandPosition = [0, dropPoint];

  if (grid[0][dropPoint] === DisplayCodes.Sand) {
    return true;
  }

  while (true) {
    let fell = false;
    const downPosition = [sandPosition[0] + 1, sandPosition[1]];
    const leftPosition = [sandPosition[0] + 1, sandPosition[1] - 1];
    const rightPosition = [sandPosition[0] + 1, sandPosition[1] + 1];

    for (const [x, y] of [downPosition, leftPosition, rightPosition]) {
      if (x === grid.length) {
        return true;
      }
      const element = grid[x][y];

      if (element === DisplayCodes.Air) {
        sandPosition = [x, y];
        fell = true;
        break;
      }
    }

    if (fell) continue;

    // cant move? update grid and return
    grid[sandPosition[0]][sandPosition[1]] = DisplayCodes.Sand;
    break;
  }

  return false;
}

enum DisplayCodes {
  Air = '.',
  FallingSand = '+',
  Rock = '#',
  Sand = 'o',
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
  // Wanting to log the grid for visual debugging, so I'm trimming the fat from the input
  const rowBounds = [Infinity, -Infinity];
  const colBounds = [Infinity, -Infinity];

  // Parse the input, and calculate the boundaries
  const paths = input
    .replace(/\n$/, '')
    .split('\n')
    .map(
      line => line
        .split(' -> ')
        .map(part => {
          const [col, row] = part.split(',').map(Number);

          // update bounds
          rowBounds[0] = row < rowBounds[0] ? row : rowBounds[0];
          rowBounds[1] = row > rowBounds[1] ? row : rowBounds[1];
          colBounds[0] = col < colBounds[0] ? col : colBounds[0];
          colBounds[1] = col > colBounds[1] ? col : colBounds[1];

          return [col, row];
        })
    );

  // Generate the grids initial state
  const grid = Array(
    rowBounds[1]
  )
    .fill(null)
    .map(
      () => Array(
        // Pad left and right to calculate the void
        (colBounds[1] - colBounds[0]) + 3
      ).fill(DisplayCodes.Air)
    );

  // draw lines
  for (let pathIdx = 0; pathIdx < paths.length; pathIdx++) {
    const path = paths[pathIdx];

    // BARF
    for (let partIdx = 1; partIdx < path.length; partIdx++) {
      const partA = path[partIdx - 1];
      const partB = path[partIdx];
      const [_colA, _rowA] = partA;
      const [_colB, _rowB] = partB;
      const colA = _colA - colBounds[0] + 1;
      const rowA = _rowA - 1;
      const colB = _colB - colBounds[0] + 1;
      const rowB = _rowB - 1;

      const fromRow = rowA < rowB ? rowA : rowB;
      const toRow = rowA < rowB ? rowB : rowA;
      const fromCol = colA < colB ? colA : colB;
      const toCol = colA < colB ? colB : colA;

      if (colA === colB) {
        for (let row = fromRow; row <= toRow; row++) {
          grid[row][colA] = DisplayCodes.Rock;
        }
      } else {
        for (let col = fromCol; col <= toCol; col++) {
          grid[rowA][col] = DisplayCodes.Rock;
        }
      }
    }
  }

  return {
    // Grid state including rocks
    grid,
    // fix the drop point to take the trimmed grid size into account
    dropPoint: 500 - colBounds[0] + 1,
    rowCount: rowBounds[1],
  };
}

/**
 * Console friendly output of grid state
 */
function logGrid(grid: DisplayCodes[][]) {
  let message = ``;

  for (const row of grid) {
    message += `${row.join('')}\n`;
  }
  console.log(message);
}