export interface Monkey {
  id: string;
  job: Operation | '!';
  parameters: number | string[];
}

export enum Operation {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

export interface Tree {
  variable: string;
  value: Value;
}

export type Value = number | Expression;

export interface Expression {
  operation: Operation;
  left: Tree;
  right: Tree;
}