/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = Sensor[];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput, row = 2000000): string {
  return calculateCoverageForSensorByRow(row, input).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput, range = 4000000): string {
  for (let row = 0; row <= range; row++) {
    const requiredCoverage = [[0, range]];
    const ranges = getCoverageRangesByRow(row, input);

    while (ranges.length) {
      const range = ranges.shift()!;
      const [ax, ay] = range;

      for (let idx = requiredCoverage.length - 1; idx >= 0; idx--) {
        const [bx, by] = requiredCoverage[idx];

        // if entirely in range, remove from required coverage
        if (
          (bx >= ax && bx <= ay) &&
          (by >= ax && by <= ay)
        ) {
          requiredCoverage.splice(idx, 1);
          continue;
        }

        // IF range is in middle of required coverage, create two coverages
        // Start: 0-4000 bx-by
        // comp: 300-500 ax-ay
        // End: 0-299 501-4000
        if (
          ax > bx &&
          ax < by &&
          ay > ax &&
          ay < by
        ) {
          requiredCoverage.splice(
            idx,
            1,
            [bx, ax - 1],
            [ay + 1, by],
          );
          continue;
        }

        // IF range is at beginning of required coverage, slice beginning off
        // Start 0-4000 bx-by
        // comp -400-1000 ax-ay
        // End   1001-4000
        if (
          ax < bx &&
          ay >= bx &&
          ay < by
        ) {
          requiredCoverage.splice(
            idx,
            1,
            [ay + 1, by]
          );
          continue;
        }

        // IF range is at end of required coverage, slice ending off
        // Start 0-4000 bx-by
        // comp 2999-5000 ax-ay
        // end   0-2998
        if (
          ax <= by &&
          ax > bx &&
          ay > by
        ) {
          requiredCoverage.splice(
            idx,
            1,
            [bx, ax - 1],
          );
          continue;
        }
      }
    }

    // IF after all that, we still have coverage required
    // Then we can terminate
    if (requiredCoverage.length > 0) {
      // Final check, there should only be one cell
      const [from, to] = requiredCoverage[0];

      // Throw an error, ideally this would never happen, 
      // but one should never trust this code
      if (from !== to) {
        throw new Error(`Definitely not the right answer lol`)
      }

      // Advent of code likes really big numbers for some reason
      return (from * 4000000 + row).toString();
    }
  }

  // Should never happen, but you know what, if we made it this far /shrug
  return '🤷‍♂️';
}

/**
 * Helper to calculate the manhattan distance between two points
 */
function calculateDistance(a: Locatable, b: Locatable): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Given a row number, and the formatted input,
 * Calculates the total coverage for a given row
 */
function calculateCoverageForSensorByRow(row: number, input: PuzzleInput): number {
  return getCoverageRangesByRow(row, input).reduce(
    (acc, [from, to]) => acc + (to - from),
    0
  );
}

/**
 * Given a row number, and the formatted input
 * returns pairs of numbers representing the coverage as a range where
 * range[0] = from
 * range[1] = to
 */
function getCoverageRangesByRow(row: number, input: PuzzleInput): [number, number][] {
  let ranges: [number, number][] = [];

  for (const sensor of input) {
    const distance = calculateDistance(sensor, sensor.beacon);
    const topBound = sensor.y + distance;
    const bottomBound = sensor.y - distance;
    
    if (row <= topBound && row >= bottomBound) {
      const width = distance - Math.abs(sensor.y - row);
      ranges.push([
        sensor.x - width,
        sensor.x + width,
      ]);
    }
  }
  
  // ranges can, and do overlap
  // we don't want to count any individual cell more than once
  // iterate through ranges, merging as we go, until no merges can be completed
  let mergedRanges: [number, number][] = [];
  
  // iterate over all the ranges
  while (ranges.length) {
    const range = ranges.shift()!;

    if (mergedRanges.length === 0) {
      mergedRanges.push(range);
      continue;
    }

    const [ax, ay] = range;
    let merged = false;

    // iterate over the merged ranges
    // if theres some intersection..
    // - remove the mergedRange
    // - process the intersection
    // - add the new range(s) back to the queue
    // - this range is complete, keep processing the queue
    // if no intersection, keep processing the queue
    for (let idx = 0; idx < mergedRanges.length; idx++) {
      const [bx, by] = mergedRanges[idx];

      if (
        (ax >= bx && ax <= by) ||
        (ay >= bx && ay <= by) ||
        (bx >= ax && bx <= ay) ||
        (by >= ax && by <= ay)
      ) {
        merged = true;
        mergedRanges.splice(idx, 1);
        ranges.push(
          [
            Math.min(ax, bx, ay, by),
            Math.max(ax, bx, ay, by),
          ]
        );
        break;
      }
    }

    if (!merged) {
      mergedRanges.push(range);
    }
  }

  return mergedRanges;
}

interface Locatable {
  x: number;
  y: number;
}

interface Sensor extends Locatable {
  beacon: Locatable;
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
    .map((line) => {
      // Don't forget the minus sign, or you'll be confused why part 2 fails so hard
      const match = line.match(/-?\d+/g);
      if (!match) {
        console.log(line);
        throw new Error('Invalid input');
      }
      const [x, y, beaconX, beaconY] = match.map(Number);

      return {
        x,
        y,
        beacon: {
          x: beaconX,
          y: beaconY,
        },
      };
    });
}