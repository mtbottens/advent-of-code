/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = {
  size: number;
  positions: [number, number, number][]; // x, y, z
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one({positions, size}: PuzzleInput): string {
  const area = createAreaBySize(size);

  addPositionsToArea(area, positions);
  
  return calculateSurfaceArea(area).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two({positions, size}: PuzzleInput): string {
  const area = createAreaBySize(size);

  addPositionsToArea(area, positions);
  const outerArea = removeInternalBubblesFromArea(area);
  
  return calculateSurfaceArea(outerArea).toString();
}

function createAreaBySize(size: number, fillValue = false): boolean[][][] {
  return Array(size)
    .fill(null)
    .map(
      () => Array(size)
        .fill(null)
        .map(
          () => Array(size)
            .fill(fillValue)
        )
    );
}

function addPositionsToArea(area: boolean[][][], positions: [number, number, number][]) {
  // Fill area with positions
  for (const position of positions) {
    area[position[0]][position[1]][position[2]] = true;
  }
}

function removeInternalBubblesFromArea(area: boolean[][][]): boolean[][][] {
  const result = createAreaBySize(area.length, true);

  // initialize queue
  const queue: [number, number, number][] = [];
  
  // add all outer edges to queue for processing
  for (let x = 0; x < area.length; x++) {
    for (let y = 0; y < area[x].length; y++) {
      for (let z = 0; z < area[x][y].length; z++) {
        if (canProcess(x, y, z) && !area[x][y][z]) {
          queue.push([x, y, z]);
        }
      }
    }
  }

  while (queue.length) {
    const [x, y, z] = queue.shift()!;

    result[x][y][z] = false;

    // check all adjacent positions
    const adjacentPositions: [number, number, number][] = [
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1],
    ]
      .filter(
        // filter out invalid positions
        (position) => !position.some(value => value < 0 || value >= area.length)
      )
      .filter(
        // filter out positions that are truthy
        (position) => !area[position[0]][position[1]][position[2]]
      )
      .filter(
        // filter out positions that are already processed
        (position) => result[position[0]][position[1]][position[2]]
      ) as [number, number, number][]; // why?

    // add adjacent positions to queue
    queue.push(...adjacentPositions);
  }

  return result;

  function canProcess(x: number, y: number, z: number) {
    return x === 0
      || x === area.length - 1
      || y === 0 || y === area[x].length - 1
      || z === 0 || z === area[x][y].length - 1;
  }
}

function calculateSurfaceArea(area: boolean[][][]) {
  let result = 0;

  for (let x = 0; x < area.length; x++) {
    for (let y = 0; y < area[x].length; y++) {
      for (let z = 0; z < area[x][y].length; z++) {
        if (area[x][y][z]) {
          if (x === 0 || !area[x - 1][y][z]) {
            result++;
          }
        
          if (x === area.length - 1 || !area[x + 1][y][z]) {
            result++;
          }
        
          if (y === 0 || !area[x][y - 1][z]) {
            result++;
          }
        
          if (y === area[x].length - 1 || !area[x][y + 1][z]) {
            result++;
          }
        
          if (z === 0 || !area[x][y][z - 1]) {
            result++;
          }
        
          if (z === area[x][y].length - 1 || !area[x][y][z + 1]) {
            result++;
          }
        }
      }
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
  const positions = input
    .replace(/\n$/, '')
    .split('\n')
    .map(v => v.split(',').map(Number));

  const size = positions
    .reduce((acc, n) => n.map((q, i) => Math.max(q, acc[i])), [-Infinity, -Infinity, -Infinity]);

  return {
    positions: positions as [number, number, number][],
    size: Math.max(...size) + 1,
  };
}