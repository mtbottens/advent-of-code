import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

// Deno.test('processInput - formats input into proper structure', () => {
//   assertEquals(processInput(input), {
//     elevations: [
//       [0, 0, 1, ]
//     ]
//   });
// });

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '31');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '29');
});
