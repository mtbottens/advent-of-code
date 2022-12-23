import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

Deno.test('processInput - formats input into proper structure', () => {
  const input = `<<<>>>`;
  const {
    directionGenerator,
    rockGenerator,
  } = processInput(input);

  const directions = directionGenerator();
  assertEquals(directions.next().value.direction, '<');
  assertEquals(directions.next().value.direction, '<');
  assertEquals(directions.next().value.direction, '<');
  assertEquals(directions.next().value.direction, '>');
  assertEquals(directions.next().value.direction, '>');
  assertEquals(directions.next().value.direction, '>');
  assertEquals(directions.next().value.direction, '<');
});

const input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '3068');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '1514285714288');
});
