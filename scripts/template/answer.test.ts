import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

Deno.test('processInput - formats input into proper structure', () => {
  const input = `hello-world`;
  assertEquals(processInput(input), input);
});

Deno.test('one - solves the first challenge', async () => {
  const input = `hello-world`;
  const result = await testHelper(input, one);

  assertEquals(result, input);
});

Deno.test('two - solves the second challenge', async () => {
  const input = `hello-world`;
  const result = await testHelper(input, two);

  assertEquals(result, input);
});
