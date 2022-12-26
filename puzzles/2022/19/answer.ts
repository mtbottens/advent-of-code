/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */

import {Blueprint, Resource} from './lib/types.ts';
import {analyzeBlueprint} from './lib/analyzeBlueprint.ts';

type PuzzleInput = Blueprint[];

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return input
    .map<[Blueprint, number]>(
      blueprint => [blueprint, analyzeBlueprint(blueprint, 24)],
    )
    .reduce((acc, [{id}, result]) => acc + id * result, 0)
    .toString();
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  return input
    .slice(0, 3)
    .map(blueprint => analyzeBlueprint(blueprint, 32))
    .reduce((acc, n) => acc * n, 1)
    .toString();
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
      const match = line
        .match(/^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/)

      if (!match) {
        throw new Error(`Invalid input: ${line}`);
      }

      const [, id, oreCost, clayCost, obsidianCost, obsidianClayCost, geodeCost, geodeObsidianCost] = match.map(Number);

      return {
        id,
        costs: {
          [Resource.Ore]: {
            [Resource.Ore]: oreCost,
          },
          [Resource.Clay]: {
            [Resource.Ore]: clayCost,
          },
          [Resource.Obsidian]: {
            [Resource.Ore]: obsidianCost,
            [Resource.Clay]: obsidianClayCost,
          },
          [Resource.Geode]: {
            [Resource.Ore]: geodeCost,
            [Resource.Obsidian]: geodeObsidianCost,
          },
        },
      };
    });
}