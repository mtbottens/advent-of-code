import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { one, processInput, two, stitch, Direction } from "./answer.ts";

async function testHelper(input: string, solver: (...args: any[]) => string) {
  return await solver(processInput(input));
};

const input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`

Deno.test('processInput - formats input into proper structure', () => {
  assertEquals(processInput(input), {
    instructions: [
      10, "R", 5, "L", 5, "R",
      10, "L", 4, "R", 5, "L",
      5
    ],
    world: [
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", ".", ".", "#"
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", "#", ".", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        "#", ".", ".", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", ".", ".", "."
      ],
      [
        ".", ".", ".", "#",
        ".", ".", ".", ".",
        ".", ".", ".", "#"
      ],
      [
        ".", ".", ".", ".",
        ".", ".", ".", ".",
        "#", ".", ".", "."
      ],
      [
        ".", ".", "#", ".",
        ".", ".", ".", "#",
        ".", ".", ".", "."
      ],
      [
        ".", ".", ".", ".",
        ".", ".", ".", ".",
        ".", ".", "#", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", ".", ".", "#",
        ".", ".", ".", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", ".", ".", ".",
        ".", "#", ".", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", "#", ".", ".",
        ".", ".", ".", "."
      ],
      [
        " ", " ", " ", " ",
        " ", " ", " ", " ",
        ".", ".", ".", ".",
        ".", ".", "#", "."
      ]
    ]
  });
});

Deno.test('one - solves the first challenge', async () => {
  const result = await testHelper(input, one);

  assertEquals(result, '6032');
});

Deno.test('two - solves the second challenge', async () => {
  const result = await testHelper(input, two);

  assertEquals(result, '5031');
});

Deno.test('stitch - stitches together the cube', () => {
  const {world} = processInput(input);
  const getNext = stitch(world);
  
  assertEquals(
    getNext([5, 11], Direction.Right),
    {
      destination: [8, 14],
      direction: Direction.Down
    }
  )

  const tests: [
    [number, number],
    Direction,
    [number, number],
    Direction,
  ][] = [
    [[5, 11], Direction.Right, [8, 14], Direction.Down],
    [[11, 15], Direction.Down, [7, 2], Direction.Up],
  ];
  
  tests.forEach(([start, startDirection, end, endDirection]) => {
    assertEquals(
      getNext(start, startDirection),
      {
        destination: end,
        direction: endDirection,
      }
    );
  });
});
