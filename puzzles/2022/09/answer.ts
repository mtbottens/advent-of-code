import { Knot } from "./lib/knot.ts";

/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = Instruction[];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return getResult(input, 1).toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return getResult(input, 9).toString();
}

function getResult(input: PuzzleInput, knotCount: number): number {
  const startX = 1000;
  const startY = 1000;
  const visited = new Set<string>([`${startX},${startY}`]);

  const head = new Knot(startX, startY);
  let current = head;

  for (let i = 1; i < knotCount; i++) {
    const next = new Knot(startX, startY);
    current.addNext(next);
    current = next;
  }
  current.onPositionChanged((x, y) => {
    visited.add(`${x},${y}`);
  })

  let x = startX;
  let y = startY;

  for (let instruction of input) {
    switch (instruction.direction) {
      case Direction.L:
        for (let i = 0; i < instruction.distance; i++) {
          x--;
          head.parentMoved(x, y);
        }
        break;
      case Direction.R:
        for (let i = 0; i < instruction.distance; i++) {
          x++;
          head.parentMoved(x, y);
        }
        break;
      case Direction.U:
        for (let i = 0; i < instruction.distance; i++) {
          y++;
          head.parentMoved(x, y);
        }
        break;
      case Direction.D:
        for (let i = 0; i < instruction.distance; i++) {
          y--;
          head.parentMoved(x, y);
        }
        break;
    }
  }

  return visited.size;
}

enum Direction {
  L = 'left',
  R = 'right',
  U = 'up',
  D = 'down',
}

interface Instruction {
  direction: Direction;
  distance: number;
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
  const lines = input.split('\n');
  const result: PuzzleInput = [];

  for (const line of lines) {
    if (!line) continue;

    const [direction, distance] = line.split(' ');
    result.push({
      direction: Direction[direction as keyof typeof Direction],
      distance: parseInt(distance, 10)
    });
  }

  return result;
}