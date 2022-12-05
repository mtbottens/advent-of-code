export function one(input: DayFiveInput): string {
  return getResult(input, true);
};

export function two(input: DayFiveInput): string {
  return getResult(input, false);
};

function getResult(input: DayFiveInput, reverse = false): string {
  // modifying in place cuz laziness
  const stacks = input.stacks;

  for (const move of input.moves) {
    const {count, from, to} = move;
    const elementsFrom = stacks[from].splice(-1 * count);

    if (reverse) {
      stacks[to].push(...elementsFrom.reverse());
    } else {
      stacks[to].push(...elementsFrom);
    }
  }

  return stacks.map((stack) => stack.pop()).join('');
}

interface DayFiveInput {
  stacks: string[][];
  moves: Move[];
}

interface Move {
  count: number;
  from: number;
  to: number;
}

export function processInput(input: string): DayFiveInput {
  const result: DayFiveInput = {
    stacks: [],
    moves: [],
  };
  const inputArr = input.split('\n');

  for (let rowIdx = 0; rowIdx < inputArr.length; rowIdx++) {
    const row = inputArr[rowIdx];

    if (row.startsWith('move')) {
      const match = row.match(/move (\d+) from (\d+) to (\d+)/);
      // add to moves
      if (match) {
        const [, count, from, to] = match;
        const inputs = [count, from, to].map((i) => parseInt(i, 10));

        result.moves.push({
          count: inputs[0],
          from: inputs[1] - 1,
          to: inputs[2] - 1,
        })
      } else {
        throw new Error('invalid input');
      }
    } else if (row.includes('[')) {
      if (result.stacks.length === 0) {
        result.stacks = Array(Math.ceil((row.length - 1) / 4)).fill(0).map(() => ([]));
      }

      // build stacks
      // parse values in stack
      for (let colIdx = 1; colIdx < row.length; colIdx += 4) {
        const char = row[colIdx];
        const stackIdx = Math.floor(colIdx / 4);

        if (char.match(/[A-Z]/)) {
          // add to stack
          result.stacks[stackIdx].unshift(char);
        }
      }
    }
  }

  return result;
}