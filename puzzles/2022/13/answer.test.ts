import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { compare, one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), [
    [[1,1,3,1,1], [1,1,5,1,1]],
    [[[1],[2,3,4]], [[1],4]],
    [[9], [[8,7,6]]],
    [[[4,4],4,4], [[4,4],4,4,4]],
    [[7,7,7,7], [7,7,7,]],
    [[], [3]],
    [[[[]]], [[]]],
    [[1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9]],
  ]);
});

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '13');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '140');
});

Deno.test('compare works as expected', () => {
  // handles integers
  assertEquals(compare(0, 1), 1);
  assertEquals(compare(2, 1), -1);
  assertEquals(compare(2, 2), 0);

  // handles arrays
  assertEquals(compare([], []), 0);
  assertEquals(compare([[]], [[], []]), 1);
  assertEquals(compare([[],[]], [[]]), -1);
  assertEquals(compare([[1,2,3]], [[1,2,3]]), 0);
  assertEquals(compare([[1,2,3]], [[1,2,4]]), 1);
  assertEquals(compare([[1,2,4]], [[1,2,3]]), -1);
  assertEquals(compare(1, [1]), 0);
  assertEquals(compare(2, [1]), -1);
  assertEquals(compare(2, [3]), 1);
});
