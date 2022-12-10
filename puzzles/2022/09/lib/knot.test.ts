import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Knot } from "./knot.ts";

Deno.test('knot affects the next knot', () => {
  const knot = new Knot(0, 0, () => {});
  const nextKnot = new Knot(0, 0, () => {});

  knot.addNext(nextKnot);

  knot.parentMoved(0, 1);
  assertPositions(
    {x: knot.x, y: knot.y},
    {x: 0, y: 0},
  );

  knot.parentMoved(0, 2);
  assertPositions(
    {x: knot.x, y: knot.y},
    {x: 0, y: 1},
  );

  knot.parentMoved(0, 3);
  assertPositions(
    {x: knot.x, y: knot.y},
    {x: 0, y: 2},
  );
  assertPositions(
    {x: nextKnot.x, y: nextKnot.y},
    {x: 0, y: 1},
  );

  knot.parentMoved(1, 3);
  assertPositions(
    {x: knot.x, y: knot.y},
    {x: 0, y: 2},
  );
  assertPositions(
    {x: nextKnot.x, y: nextKnot.y},
    {x: 0, y: 1},
  );

  knot.parentMoved(2, 3);
  assertPositions(
    {x: knot.x, y: knot.y},
    {x: 1, y: 3},
  );
  assertPositions(
    {x: nextKnot.x, y: nextKnot.y},
    {x: 1, y: 2},
  );
  

  function assertPositions(
    first: {x: number, y: number},
    expected: {x: number, y: number},
  ) {
    assertEquals(first.x, expected.x);
    assertEquals(first.y, expected.y);
  }
})
