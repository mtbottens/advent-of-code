import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`

Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), [
    {x: 2, y: 18, beacon: {x: -2, y: 15}},
    {x:9, y: 16, beacon: {x: 10, y: 16}},
    {x:13, y: 2, beacon: {x: 15, y: 3}},
    {x:12, y: 14, beacon: {x: 10, y: 16}},
    {x:10, y: 20, beacon: {x: 10, y: 16}},
    {x:14, y: 17, beacon: {x: 10, y: 16}},
    {x:8, y: 7, beacon: {x: 2, y: 10}},
    {x:2, y: 0, beacon: {x: 2, y: 10}},
    {x:0, y: 11, beacon: {x: 2, y: 10}},
    {x:20, y: 14, beacon: {x: 25, y: 17}},
    {x:17, y: 20, beacon: {x: 21, y: 22}},
    {x:16, y: 7, beacon: {x: 15, y: 3}},
    {x:14, y: 3, beacon: {x: 15, y: 3}},
    {x:20, y: 1, beacon: {x: 15, y: 3}},
  ]);
});

Deno.test('one - solves the first challenge', async () => {
  const result = one(
    processInput(input),
    10
  );

  assertEquals(result, '26');
});

Deno.test('two - solves the second challenge', async () => {
  const result = two(
    processInput(input),
    20
  );

  assertEquals(result, '56000011');
});
