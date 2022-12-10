import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

Deno.test('processInput - formats input into proper structure', () => {
  const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`
  assertEquals(processInput(input), [
    {direction: 'right', distance: 4},
    {direction: 'up', distance: 4},
    {direction: 'left', distance: 3},
    {direction: 'down', distance: 1},
    {direction: 'right', distance: 4},
    {direction: 'down', distance: 1},
    {direction: 'left', distance: 5},
    {direction: 'right', distance: 2},
  ]);
});

Deno.test('one - solves the first challenge', async () => {
  const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`
  const result = await testHelper(input, one);

  assertEquals(result, '13');
});

Deno.test('two - solves the second challenge', async () => {
  const input = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
  const result = await testHelper(input, two);

  assertEquals(result, '36');
});
