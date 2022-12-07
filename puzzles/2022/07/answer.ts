import { BinaryHeap } from "https://deno.land/std@0.148.0/collections/binary_heap.ts";
import { Scanner } from './lib/scanner.ts';
import {Directory} from './lib/filesystem.ts'

/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = Directory;

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  let size = 0;

  function traverse(directory: Directory) {
    const directorySize = directory.getSize();

    if (directorySize <= 100000) {
      size += directorySize;
    }

    for (const child of directory.children) {
      if (child instanceof Directory) {
        traverse(child);
      }
    }
  }

  traverse(input);

  return size.toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const heap: BinaryHeap<number> = new BinaryHeap<number>((a, b) => a < b ? -1 : 1);

  // build binary heap of all directory sizes
  function traverse(directory: Directory) {
    const size = directory.getSize();
    heap.push(size);

    for (const child of directory.children) {
      if (child instanceof Directory) {
        traverse(child);
      }
    }
  }

  traverse(input);

  const TOTAL_SPACE = 70000000;
  const REQUIRED_SPACE = 30000000;
  const usedSpace = input.getSize() || 0;


  while (heap.peek()) {
    const size = heap.pop() || 0;

    if (TOTAL_SPACE - usedSpace + size >= REQUIRED_SPACE) {
      return size.toString();
    }
  }

  return '0';
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
  return (new Scanner(input)).scan();
}