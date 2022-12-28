import {Monkey, Tree, Value, Operation} from './types.ts';

export function buildTree(monkeys: Monkey[]): Tree {
  const treeMap = new Map<string, Tree>();
  const queue = [...monkeys];

  while (queue.length) {
    const monkey = queue.shift()!;
    const {id, job, parameters} = monkey;
    let value: Value;

    if (typeof parameters === 'number') {
      value = parameters;
    } else {
      if (job === '!') {
        throw new Error(`Invalid operation type`);
      }
      const param0 = treeMap.get(parameters[0]);
      const param1 = treeMap.get(parameters[1]);

      if (!param0 || !param1) {
        queue.push(monkey);
        continue;
      }

      value = {
        operation: job,
        left: param0,
        right: param1,
      };
    }

    treeMap.set(id, {
      variable: id,
      value,
    });
  }

  return treeMap.get('root')!;
}

export function evaluateTree(tree: Tree): number {
  const {value} = tree;

  if (typeof value === 'number') {
    return value;
  }

  const {operation, left, right} = value;

  switch (operation) {
    case '+':
      return evaluateTree(left) + evaluateTree(right);
    case '-':
      return evaluateTree(left) - evaluateTree(right);
    case '*':
      return evaluateTree(left) * evaluateTree(right);
    case '/':
      return evaluateTree(left) / evaluateTree(right);
  }

  throw new Error('Unable to evaluate tree');
}

export function solveForHumn(tree: Tree): number {
  // ROOT, should create 2 trees, one for left and one for right;
  const {value} = tree;

  if (typeof value === 'number') {
    throw new Error('tree root should have left and right sides');
  }

  const {left: _left, right: _right} = value;
  const rightEquation = findHumn(_left) ? _right : _left;
  
  let head = findHumn(_left) ? _left : _right;
  let result = evaluateTree(rightEquation);

  while (head.variable !== 'humn') {
    const {value} = head;
    
    if (typeof value === 'number') {
      throw new Error('tree root should have left and right sides');
    }

    const {left, right, operation} = value;
    const humnIsLeft = findHumn(left);
    const humnTree = humnIsLeft ? left : right;
    const expression = humnIsLeft ? right : left;

    if (!humnIsLeft && [Operation.ADD, Operation.SUBTRACT].includes(operation)) {
      // special case, handle separately
      const leftResult = evaluateTree(left);

      if (leftResult >= 0) {
        result -= leftResult;
      } else {
        result += leftResult;
      }

      // flip the sign
      if (operation === Operation.SUBTRACT) {
        result *= -1;
      }
    } else if (!humnIsLeft && operation === Operation.DIVIDE) {
      // special case, multiply both sides by humn to get rid of division
      const leftResult = evaluateTree(left);
      const currentResult = result.valueOf();

      result = leftResult;
      head = {
        variable: '',
        value: {
          operation: Operation.MULTIPLY,
          left: {
            variable: '',
            value: currentResult,
          },
          right: {
            ...humnTree
          },
        },
      };
      continue;
    } else {
      switch (operation) {
        case Operation.ADD:
          result -= evaluateTree(expression);
          break;
        case Operation.SUBTRACT:
          result += evaluateTree(expression);
          break;
        case Operation.MULTIPLY:
          result /= evaluateTree(expression);
          break;
        case Operation.DIVIDE:
          result *= evaluateTree(expression);
          break;
      }
    }
    

    head = humnTree;
  }
  

  return result;
}

function findHumn(tree: Tree): boolean {
  const {variable, value} = tree;

  if (variable === 'humn') return true;

  if (typeof value === 'number') {
    return false;
  }

  const {left, right} = value;

  return findHumn(left) || findHumn(right);
}
