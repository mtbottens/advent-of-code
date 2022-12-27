import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import {mutateList} from './mutateList.ts';

Deno.test('mutateList - moves element by modifier, wrapping around ends', () => {
  const list = [4,5,6];
  // 4,5,6
  // 5,4,6
  // 4,6,5

  ([
    [[...list], 5, 1, [5,4,6]],
    [[...list], 5, 2, [4,5,6]],
    [[...list], 5, 8, [4,5,6]],
    [[...list], 5, -2, [4,5,6]],
    [[...list], 5, -8, [4,5,6]],
    [[...list], 5, -4, [4,5,6]],
    // work through issues with sample input
    [[1,-3,2,3,-2,0,4], -3, -3, [1,2,3,-2,-3,0,4]],
    [[1,2,3,-2,-3,0,4], 3, 3, [1,2,-2,-3,0,3,4]],
    [[1,2,-2,-3,0,3,4], -2, -2, [-2,1,2,-3,0,3,4]],
    [[-2,1,2,-3,0,3,4], 0, 0, [-2,1,2,-3,0,3,4]],
    [[-2,1,2,-3,0,3,4], 4, 4, [-2,1,2,-3,4,0,3]],
  ] as [number[], number, number, number[]][]).forEach(([originalList, elementToMove, modifier, expectedList]) => {
    mutateList(elementToMove, originalList, modifier);
    assertEquals(originalList, expectedList);
  });
});