/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = {
  world: DisplayCode[][];
  instructions: (MoveCode | number)[];
};

enum MoveCode {
  Left = 'L',
  Right = 'R',
}

enum DisplayCode {
  Void = ' ',
  Wall = '#',
  Open = '.',
}

export enum Direction {
  Up = 'U',
  Right = 'R',
  Down = 'D',
  Left = 'L',
}

// used to determine next direction based on move code and current direction
const DIRECTION_MAP: Record<Direction, Record<MoveCode, Direction>> = {
  [Direction.Up]: {
    [MoveCode.Left]: Direction.Left,
    [MoveCode.Right]: Direction.Right,
  },
  [Direction.Right]: {
    [MoveCode.Left]: Direction.Up,
    [MoveCode.Right]: Direction.Down,
  },
  [Direction.Down]: {
    [MoveCode.Left]: Direction.Right,
    [MoveCode.Right]: Direction.Left,
  },
  [Direction.Left]: {
    [MoveCode.Left]: Direction.Down,
    [MoveCode.Right]: Direction.Up,
  },
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  return solver(
    input,
    navigator,
  ).toString();

  function navigator(
    world: DisplayCode[][],
    position: [number, number],
    direction: Direction,
  ): {
    position: [number, number];
    direction: Direction;
  } | false {
    let row = position[0];
    let col = position[1];

    while (true) {
      switch (direction) {
        case Direction.Up:
          if (row - 1 < 0) {
            row = world.length - 1;
          } else {
            row -= 1;
          }
          break;
        case Direction.Right:
          if (col + 1 >= world[row].length) {
            col = 0;
          } else {
            col += 1;
          }
          break;
        case Direction.Down:
          if (row + 1 >= world.length) {
            row = 0;
          } else {
            row += 1;
          }
          break;
        case Direction.Left:
          if (col - 1 < 0) {
            col = world[row].length - 1;
          } else {
            col -= 1;
          }
          break;
      }

      if (world[row][col] === DisplayCode.Void) {
        continue;
      }

      if (world[row][col] === DisplayCode.Wall) {
        return false;
      }

      if (world[row][col] === DisplayCode.Open) {
        break;
      }
    }

    return {
      position: [row, col],
      direction,
    };
  }
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  enum Plane {
    Top = 'T',
    Front = 'F',
    Right = 'R',
    Back = 'B',
    Left = 'L',
    Bottom = 'D',
  }

  interface Boundary {
    row: [number, number];
    col: [number, number];
  }

  const boundaries: Record<Plane, Boundary> = {
    [Plane.Top]: {
      row: [0, 3],
      col: [8, 11],
    },
    [Plane.Front]: {
      row: [4, 7],
      col: [8, 11],
    },
    [Plane.Left]: {
      row: [4, 7],
      col: [4, 7],
    },
    [Plane.Back]: {
      row: [0, 3],
      col: [0, 3],
    },
    [Plane.Bottom]: {
      row: [8, 11],
      col: [8, 11],
    },
    [Plane.Right]: {
      row: [8, 11],
      col: [12, 15],
    },
  };

  return solver(
    input,
    navigator,
  ).toString();

  function navigator(
    world: DisplayCode[][],
    position: [number, number],
    startingDirection: Direction,
  ): {
    position: [number, number];
    direction: Direction;
  } | false {
    let row = position[0];
    let col = position[1];
    let direction = startingDirection;

    while (true) {
      switch (direction) {
        case Direction.Up:
          if (row - 1 < 0) {
            row = world.length - 1;
          } else {
            row -= 1;
          }
          break;
        case Direction.Right:
          if (col + 1 >= world[row].length) {
            col = 0;
          } else {
            col += 1;
          }
          break;
        case Direction.Down:
          if (row + 1 >= world.length) {
            row = 0;
          } else {
            row += 1;
          }
          break;
        case Direction.Left:
          if (col - 1 < 0) {
            col = world[row].length - 1;
          } else {
            col -= 1;
          }
          break;
      }

      if (world[row][col] === DisplayCode.Void) {
        continue;
      }

      if (world[row][col] === DisplayCode.Wall) {
        return false;
      }

      if (world[row][col] === DisplayCode.Open) {
        break;
      }
    }

    return {
      position: [row, col],
      direction,
    };
  }
}

function solver(
  input: PuzzleInput,
  navigator: (
    world: DisplayCode[][],
    position: [number, number],
    direction: Direction,
  ) => {
    position: [number, number];
    direction: Direction;
  } | false,
): number {
  const { world, instructions } = input;
  let direction: Direction = Direction.Right;
  let position: [number, number] = [
    0,
    world[0].findIndex(v => v === DisplayCode.Open)
  ];

  for (let instructionIdx = 0; instructionIdx < instructions.length; instructionIdx++) {
    const instruction = instructions[instructionIdx];

    if (typeof instruction === 'number') {
      for (let moveIdx = 0; moveIdx < instruction; moveIdx++) {
        const navigationResult = navigator(
          world,
          position,
          direction,
        );

        if (navigationResult) {
          const {
            direction: nextDirection,
            position: nextPosition,
          } = navigationResult;

          position = nextPosition;
          direction = nextDirection;
        }
      }
    } else {
      direction = DIRECTION_MAP[direction][instruction];
    }
  }

  const FACING_SCORES: Record<Direction, number> = {
    [Direction.Right]: 0,
    [Direction.Down]: 1,
    [Direction.Left]: 2,
    [Direction.Up]: 3,
  };

  return [
    1000 * (position[0] + 1),
    4 * (position[1] + 1),
    FACING_SCORES[direction],
  ].reduce((a, b) => a + b, 0);
}

/**
 * Takes the raw input from adventofcode.com for the given day and year
 * and returns the processed input into whichever format is needed for the
 * one and two functions.
 * 
 * @param {string} input the raw input
 * @returns {PuzzleInput} the processed input
 */
export function processInput(input: string): PuzzleInput {
  const [worldString, instructionsString] = input.split('\n\n');
  const world: DisplayCode[][] = [];
  
  worldString
    .replace(/\n$/, '')
    .split('\n')
    .forEach(
      (row) => {
        const rowCodes = row.split('') as DisplayCode[];
        world.push(rowCodes);
      }
    );

  const instructions = instructionsString
    .replace(/\n$/, '')
    .replace(/(\d+)/g,'$1---')
    .replace(/([LR])/g, '$1---')
    .replace(/---$/, '')
    .split('---')
    .map((v) => {
      if ([MoveCode.Left, MoveCode.Right].includes(v as MoveCode)) {
        return v as MoveCode;
      }
      
      const result = parseInt(v, 10);
      if (isNaN(result)) {
        throw new Error(`Invalid input: ${v}`);
      }

      return result;
    });

  return {
    instructions,
    world,
  };
}

export function stitch(cube: DisplayCode[][]): (position: [number, number], direction: Direction) => {
  destination: [number, number];
  direction: Direction;
} {
  const outerCells = new Map<string, EdgeCell | CornerCell>();
  const cornerCells = new Set<CornerCell>();
  const threads = new Map<string, {
    destination: [number, number];
    direction: Direction;
  }>();

  const DIRECTION_MAP: Record<Direction, (position: [number, number]) => [number, number]> = {
    [Direction.Up]: (position: [number, number]) => [position[0] - 1, position[1]],
    [Direction.Right]: (position: [number, number]) => [position[0], position[1] + 1],
    [Direction.Down]: (position: [number, number]) => [position[0] + 1, position[1]],
    [Direction.Left]: (position: [number, number]) => [position[0], position[1] - 1],
  };

  const INVERT_DIRECTION_MAP: Record<Direction, Direction> = {
    [Direction.Up]: Direction.Down,
    [Direction.Right]: Direction.Left,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
  };

  function addThread(
    positionA: [number, number],
    directionA: Direction,
    positionB: [number, number],
    directionB: Direction,
  ) {
    const keyA = [...positionA, INVERT_DIRECTION_MAP[directionA]].join(',');
    const keyB = [...positionB, INVERT_DIRECTION_MAP[directionB]].join(',');

    if (threads.has(keyA)) {
      throw new Error(`Thread already exists for ${keyA}`);
    }

    if (threads.has(keyB)) {
      throw new Error(`Thread already exists for ${keyB}`);
    }

    threads.set(keyA, {
      destination: positionB,
      direction: directionB,
    });

    threads.set(keyB, {
      destination: positionA,
      direction: directionA,
    });

    console.log(`Added thread ${keyA} -> ${keyB}`);
    console.log({
      from: positionA,
      fromDir: INVERT_DIRECTION_MAP[directionA],
      to: positionB,
      toDir: directionB,
    });
    console.log({
      from: positionB,
      fromDir: INVERT_DIRECTION_MAP[directionB],
      to: positionA,
      toDir: directionA,
    });
  }

  // identify inner corners
  for (let row = 0; row < cube.length; row++) {
    for (let col = 0; col < cube[row].length; col++) {
      const analyzedCell = analyzeCell([row, col], cube);

      if (['edge', 'corner'].includes(analyzedCell.type)) {
        outerCells.set(`${row},${col}`, analyzedCell as EdgeCell | CornerCell);

        if (analyzedCell.type === 'corner' && analyzedCell.subType === 'inner') {
          cornerCells.add(analyzedCell);
        }
      }
    }
  }

  for (const cornerCell of cornerCells) {
    let previousForwardPointer: EdgeCell | CornerCell = cornerCell;
    let previousBackwardPointer: EdgeCell | CornerCell = cornerCell;
    let forwardPointer: EdgeCell | CornerCell = cornerCell;
    let backwardPointer: EdgeCell | CornerCell = cornerCell;
    let skipForward = false;
    let skipBackward = false;

    while (true) {
      previousForwardPointer = forwardPointer;
      previousBackwardPointer = backwardPointer;
      const forwardPosition = DIRECTION_MAP[previousForwardPointer.forward](previousForwardPointer.position);
      const backwardPosition = DIRECTION_MAP[previousBackwardPointer.backward](previousBackwardPointer.position);
      if (!skipForward) {
        forwardPointer = outerCells.get(`${forwardPosition[0]},${forwardPosition[1]}`)!;
      }
      if (!skipBackward) {
        backwardPointer = outerCells.get(`${backwardPosition[0]},${backwardPosition[1]}`)!;
      }
      skipForward = false;
      skipBackward = false;

      // break out of loop if either pointer is the same as the initial pointer
      if (forwardPointer === cornerCell || backwardPointer === cornerCell) break;

      if (forwardPointer.type === 'corner' && backwardPointer.type === 'corner') {
        addThread(
          forwardPointer.position,
          forwardPointer.innerDirectionBackward,
          backwardPointer.position,
          backwardPointer.innerDirectionForward,
        );
        
        // if both corners are corners, we treat them as edges, but break out of loop
        break;
      } else if (forwardPointer.type === 'corner' && backwardPointer.type === 'edge') {
        addThread(
          forwardPointer.position,
          forwardPointer.innerDirectionBackward,
          backwardPointer.position,
          backwardPointer.innerDirection,
        );
        
        forwardPointer = {
          type: 'edge',
          forward: forwardPointer.forward,
          backward: forwardPointer.innerDirectionBackward,
          innerDirection: forwardPointer.innerDirectionForward,
          position: [...forwardPointer.position],
        };
        skipForward = true;
      } else if (backwardPointer.type === 'corner' && forwardPointer.type === 'edge') {
        addThread(
          forwardPointer.position,
          forwardPointer.innerDirection,
          backwardPointer.position,
          backwardPointer.innerDirectionForward,
        );
        
        backwardPointer = {
          type: 'edge',
          forward: backwardPointer.forward,
          backward: backwardPointer.innerDirectionForward,
          innerDirection: backwardPointer.innerDirectionBackward,
          position: [...backwardPointer.position],
        };
        skipBackward = true;
      } else if (forwardPointer.type === 'edge' && backwardPointer.type === 'edge') {
        addThread(
          forwardPointer.position,
          forwardPointer.innerDirection,
          backwardPointer.position,
          backwardPointer.innerDirection,
        );
      }
    }
  }

  return (position: [number, number], direction: Direction) => {
    const key = [...position, direction].join(',');
    const thread = threads.get(key);

    if (!thread) {
      throw new Error(`Could not find thread at ${key}`);
    }

    return thread;
  };
}

type AnalyzedCell = BoringCell | EdgeCell | CornerCell;

interface Cell {
  position: [number, number];
}

interface BoringCell extends Cell {
  type: 'inside' | 'void';
}

interface EdgeCell extends Cell {
  type: 'edge';
  forward: Direction;
  backward: Direction;
  innerDirection: Direction;
}

interface CornerCell extends Cell {
  type: 'corner';
  subType: 'inner' | 'outer';
  forward: Direction;
  backward: Direction;
  innerDirectionForward: Direction;
  innerDirectionBackward: Direction;
}

export function analyzeCell(
  position: [number, number],
  cube: DisplayCode[][],
): AnalyzedCell {
  const result: AnalyzedCell = {
    position,
    type: 'void',
  };

  if (cube[position[0]][position[1]] === DisplayCode.Void) return result; 

  const [row, col] = position;
  const [
    up,
    right,
    down,
    left,
    upperLeft,
    upperRight,
    lowerLeft,
    lowerRight,
  ] = [
    [row - 1, col],
    [row, col + 1],
    [row + 1, col],
    [row, col - 1],
    [row - 1, col - 1],
    [row - 1, col + 1],
    [row + 1, col - 1],
    [row + 1, col + 1],
  ] as [number, number][];

  const sides = [up, right, down, left]
    .map(getDisplayCodeAtPosition)
    .filter((code) => [DisplayCode.Open, DisplayCode.Wall].includes(code));
  const sideCount = sides.length;

  const voidCorners = [upperLeft, upperRight, lowerLeft, lowerRight]
    .map(getDisplayCodeAtPosition)
    .filter((code) => DisplayCode.Void === code);
  const voidCornerCount = voidCorners.length;

  // check for corners
  if (sideCount === 4) {
    // corner
    if (voidCornerCount === 1) {
      // upperLeft
      const codeAtUpperLeft = getDisplayCodeAtPosition(upperLeft);
      if (codeAtUpperLeft === DisplayCode.Void) {
        return {
          ...result,
          type: 'corner',
          subType: 'inner',
          innerDirectionForward: Direction.Right,
          innerDirectionBackward: Direction.Down,
          forward: Direction.Up,
          backward: Direction.Left,
        };
      }

      // upperRight
      const codeAtUpperRight = getDisplayCodeAtPosition(upperRight);
      if (codeAtUpperRight === DisplayCode.Void) {
        return {
          ...result,
          type: 'corner',
          subType: 'inner',
          innerDirectionForward: Direction.Down,
          innerDirectionBackward: Direction.Left,
          forward: Direction.Right,
          backward: Direction.Up,
        };
      }

      // lowerLeft
      const codeAtLowerLeft = getDisplayCodeAtPosition(lowerLeft);
      if (codeAtLowerLeft === DisplayCode.Void) {
        return {
          ...result,
          type: 'corner',
          subType: 'inner',
          innerDirectionForward: Direction.Up,
          innerDirectionBackward: Direction.Right,
          forward: Direction.Left,
          backward: Direction.Down,
        };
      }

      // lowerRight
      const codeAtLowerRight = getDisplayCodeAtPosition(lowerRight);
      if (codeAtLowerRight === DisplayCode.Void) {
        return {
          ...result,
          type: 'corner',
          subType: 'inner',
          innerDirectionForward: Direction.Left,
          innerDirectionBackward: Direction.Up,
          forward: Direction.Down,
          backward: Direction.Right,
        };
      }
    }

    return {
      ...result,
      type: 'inside',
    };
  }

  // 3 sides will always be an edge
  if (sideCount === 3) {
    // up edge
    if (getDisplayCodeAtPosition(up) === DisplayCode.Void) {
      return {
        ...result,
        type: 'edge',
        forward: Direction.Right,
        backward: Direction.Left,
        innerDirection: Direction.Down,
      };
    }

    // right edge
    if (getDisplayCodeAtPosition(right) === DisplayCode.Void) {
      return {
        ...result,
        type: 'edge',
        forward: Direction.Down,
        backward: Direction.Up,
        innerDirection: Direction.Left,
      };
    }

    // down edge
    if (getDisplayCodeAtPosition(down) === DisplayCode.Void) {
      return {
        ...result,
        type: 'edge',
        forward: Direction.Left,
        backward: Direction.Right,
        innerDirection: Direction.Up,
      };
    }

    // left edge
    if (getDisplayCodeAtPosition(left) === DisplayCode.Void) {
      return {
        ...result,
        type: 'edge',
        forward: Direction.Up,
        backward: Direction.Down,
        innerDirection: Direction.Right,
      };
    }
  }

  // 2 sides will always be an outer corner 
  if (sideCount === 2) {
    const codeUp = getDisplayCodeAtPosition(up);
    const codeRight = getDisplayCodeAtPosition(right);
    const codeDown = getDisplayCodeAtPosition(down);
    const codeLeft = getDisplayCodeAtPosition(left);

    // upper left outer corner
    if (codeUp === DisplayCode.Void && codeLeft === DisplayCode.Void) {
      return {
        ...result,
        type: 'corner',
        subType: 'outer',
        innerDirectionForward: Direction.Down,
        innerDirectionBackward: Direction.Right,
        forward: Direction.Right,
        backward: Direction.Down,
      };
    }

    // upper right outer corner
    if (codeUp === DisplayCode.Void && codeRight === DisplayCode.Void) {
      return {
        ...result,
        type: 'corner',
        subType: 'outer',
        innerDirectionForward: Direction.Left,
        innerDirectionBackward: Direction.Down,
        forward: Direction.Down,
        backward: Direction.Left,
      };
    }

    // lower left outer corner
    if (codeDown === DisplayCode.Void && codeLeft === DisplayCode.Void) {
      return {
        ...result,
        type: 'corner',
        subType: 'outer',
        innerDirectionForward: Direction.Right,
        innerDirectionBackward: Direction.Up,
        forward: Direction.Up,
        backward: Direction.Right,
      };
    }

    // lower right outer corner
    if (codeDown === DisplayCode.Void && codeRight === DisplayCode.Void) {
      return {
        ...result,
        type: 'corner',
        subType: 'outer',
        innerDirectionForward: Direction.Up,
        innerDirectionBackward: Direction.Left,
        forward: Direction.Left,
        backward: Direction.Up,
      };
    }
  }

  return result;

  function getDisplayCodeAtPosition(position: [number, number]) {
    return cube[position[0]]?.[position[1]] || DisplayCode.Void;
  }
}

/**
Stitching algo: https://www.youtube.com/watch?v=qWgLdNFYDDo
1. identify corners
2. stitch corners going from oposite directions
3. terminate when both corners turn
 */