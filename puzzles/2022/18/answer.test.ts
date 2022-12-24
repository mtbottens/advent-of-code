import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), {
    positions: [
      [2, 2, 2],
      [1, 2, 2],
      [3, 2, 2],
      [2, 1, 2],
      [2, 3, 2],
      [2, 2, 1],
      [2, 2, 3],
      [2, 2, 4],
      [2, 2, 6],
      [1, 2, 5],
      [3, 2, 5],
      [2, 1, 5],
      [2, 3, 5],
    ],
    size: 7,
  });
});

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '64');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '58');
});
