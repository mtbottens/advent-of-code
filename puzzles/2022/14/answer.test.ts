import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

// NOPE!
// Deno.test('processInput - formats input into proper structure', () => {
//   assertEquals(processInput(input), '');
// });

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '24');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '93');
});
