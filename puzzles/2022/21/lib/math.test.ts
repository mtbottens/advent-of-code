import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { buildTree, evaluateTree, solveForHumn } from "./math.ts";
import { Operation, Monkey, Tree } from "./types.ts";

const sampleMonkeys: Monkey[] = [
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
];

Deno.test('buildTree - can build tree from list of monkeys', () => {
  assertEquals(buildTree(sampleMonkeys), {
    variable: 'root',
    value: {
      operation: Operation.ADD,
      left: {
        variable: 'pppw',
        value: {
          operation: Operation.DIVIDE,
          left: {
            variable: 'cczh',
            value: {
              operation: Operation.ADD,
              left: {
                variable: 'sllz',
                value: 4,
              },
              right: {
                variable: 'lgvd',
                value: {
                  operation: Operation.MULTIPLY,
                  left: {
                    variable: 'ljgn',
                    value: 2,
                  },
                  right: {
                    variable: 'ptdq',
                    value: {
                      operation: Operation.SUBTRACT,
                      left: {
                        variable: 'humn',
                        value: 5,
                      },
                      right: {
                        variable: 'dvpt',
                        value: 3,
                      },
                    },
                  },
                },  
              },
            },
          },
          right: {
            variable: 'lfqf',
            value: 4,
          },
        },
      },
      right: {
        variable: 'sjmn',
        value: {
          operation: Operation.MULTIPLY,
          left: {
            variable: 'drzm',
            value: {
              operation: Operation.SUBTRACT,
              left: {
                variable: 'hmdt',
                value: 32,
              },
              right: {
                variable: 'zczc',
                value: 2,
              },
            },
          },
          right: {
            variable: 'dbpl',
            value: 5,
          },
        },
      },
    },
  })
});

Deno.test('evaluateTree - can reduce tree to a single number', () => {
  const tree = buildTree(sampleMonkeys);
  assertEquals(evaluateTree(tree), 152);
})

Deno.test('solveForHumn - can solve for humn', () => {
  const tree = buildTree(sampleMonkeys);

  assertEquals(solveForHumn(tree), 301);

  [
    ['humn+1=2+9', 10],
    ['humn-1=2+9', 12],
    ['1+humn=2+9', 10],
    ['1-humn=2+9', -10],
    ['humn*2=2+9', 5.5],
    ['2*humn=2+9', 5.5],
    ['humn/2=2+9', 22],
    ['2/humn=2+9', 0.18181818181818182],
  ].forEach(([equation, expectedResult]) => {
    assertEquals(
      solveForHumn(
        generateEquationTree(equation as string)
      ),
      expectedResult
    );
  });
});

/**
 * The equation should always contain:
 * 1. a single variable named humn
 * 2. a single equals sign
 * 3. two values and an operation on either side of the equal sign, e.g., 3+humn=5+4
 * 
 * Any violations to the rule above will result in an error.
 * 
 * @param equation A string representing an equation
 */
function generateEquationTree(equation: string): Tree {
  const [expressionA, expressionB] = equation.split('=');
  
  const [variable1A, operationA, variable2A] = expressionA.split(/([+*-/])/);
  const [variable1B, operationB, variable2B] = expressionB.split(/([+*-/])/);

  const treeA: Tree = {
    variable: 'a',
    value: {
      operation: operationA as Operation,
      left: {
        variable: variable1A === 'humn' ? 'humn' : 'a1',
        value: variable1A === 'humn' ? 0 : Number(variable1A),
      },
      right: {
        variable: variable2A === 'humn' ? 'humn' : 'a2',
        value: variable2A === 'humn' ? 0 : Number(variable2A),
      },
    }
  };
  const treeB: Tree = {
    variable: 'b',
    value: {
      operation: operationB as Operation,
      left: {
        variable: variable1B === 'humn' ? 'humn' : 'b1',
        value: variable1B === 'humn' ? 0 : Number(variable1B),
      },
      right: {
        variable: variable2B === 'humn' ? 'humn' : 'b2',
        value: variable2B === 'humn' ? 0 : Number(variable2B),
      },
    }
  };

  return {
    variable: 'root',
    value: {
      // doesn't matter
      operation: Operation.ADD,
      left: treeA,
      right: treeB,
    },
  };
}