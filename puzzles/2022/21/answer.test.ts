import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";
import { Operation } from "./lib/types.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`

// pppw = cczh / lfqf
// pppw = (sllz + lgvd) / 4
// pppw = (4 + (ljgn * ptdq)) / 4
// pppw = (4 + (2 * (humn - dvpt))) / 4
// pppw = (4 + (2 * (humn - 3))) / 4
// RESOLVED

// sjmn = drzm * dbpl
// sjmn = (hmdt - zczc) * 5
// sjmn = (32 - 2) * 5
// sjmn = 150
// RESOLVED

// pppw = sjmn
// -- solve for humn
// (4 + (2 * (humn - 3))) / 4 = (32 - 2) * 5 
// -- multiply both sides by 4
// (4 + (2 * (humn - 3))) = (32 - 2) * 5 * 4
// (4 + (2 * (humn - 3))) = (32 - 2) * 20
// -- subtract 4 from both sides
// (2 * (humn - 3)) = (32 - 2) * 20 - 4
// -- divide both sides by 2
// (humn - 3) = (32 - 2) * 20 / 2 - 4 / 2
// (humn - 3) = (32 - 2) * 10 - 2
// -- add 3 to both sides
// humn = (32 - 2) * 10 - 2 + 3
// humn = (32 - 2) * 10 + 1
// humn = 320 - 20 + 1
// humn = 301 
// INTERESTING


Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), [
    { id: "root", job: Operation.ADD, parameters: [ "pppw", "sjmn" ] },
    { id: "dbpl", job: '!', parameters: 5 },
    { id: "cczh", job: Operation.ADD, parameters: [ "sllz", "lgvd" ] },
    { id: "zczc", job: '!', parameters: 2 },
    { id: "ptdq", job: Operation.SUBTRACT, parameters: [ "humn", "dvpt" ] },
    { id: "dvpt", job: '!', parameters: 3 },
    { id: "lfqf", job: '!', parameters: 4 },
    { id: "humn", job: '!', parameters: 5 },
    { id: "ljgn", job: '!', parameters: 2 },
    { id: "sjmn", job: Operation.MULTIPLY, parameters: [ "drzm", "dbpl" ] },
    { id: "sllz", job: '!', parameters: 4 },
    { id: "pppw", job: Operation.DIVIDE, parameters: [ "cczh", "lfqf" ] },
    { id: "lgvd", job: Operation.MULTIPLY, parameters: [ "ljgn", "ptdq" ] },
    { id: "drzm", job: Operation.SUBTRACT, parameters: [ "hmdt", "zczc" ] },
    { id: "hmdt", job: '!', parameters: 32 }
  ]);
});

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '152');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '301');
});
