import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";
import { Directory } from "./lib/filesystem.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const puzzleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

Deno.test('processInput - formats input into proper structure', () => {
  const input = puzzleInput;
  assertEquals(processInput(input).constructor, Directory);
});

Deno.test('one - solves the first challenge', async () => {
  const input = puzzleInput;
  const result = await testHelper(input, one);

  assertEquals(result, '95437');
});

Deno.test('two - solves the second challenge', async () => {
  const input = puzzleInput;
  const result = await testHelper(input, two);

  assertEquals(result, `24933642`);
});
