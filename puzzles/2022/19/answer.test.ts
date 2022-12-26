import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`

Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), [
    {
      id: 1,
      costs: {
        ore: {
          ore: 4,
        },
        clay: {
          ore: 2,
        },
        obsidian: {
          ore: 3,
          clay: 14,
        },
        geode: {
          ore: 2,
          obsidian: 7,
        },
      },
    },
    {
      id: 2,
      costs: {
        ore: {
          ore: 2,
        },
        clay: {
          ore: 3,
        },
        obsidian: {
          ore: 3,
          clay: 8,
        },
        geode: {
          ore: 3,
          obsidian: 12,
        },
      },
    },
  ]);
});

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '33');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '3472');
});
