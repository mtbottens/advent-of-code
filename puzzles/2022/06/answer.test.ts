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
  const inputs: [string, number][] = [
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
  ];

  for (const [input, expected] of inputs) {
    let result = await testHelper(input, one);
    assertEquals(result, expected.toString());
  }
});

Deno.test('two - solves the second challenge', async () => {
  const inputs: [string, number][] = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
  ];

  for (const [input, expected] of inputs) {
    let result = await testHelper(input, two);
    assertEquals(result, expected.toString());
  }
});
