export enum Direction {
  Left = '<',
  Right = '>',
  Down = 'down',
}

export enum DisplayCode {
  Rock = '#',
  Air = '.',
  Floor = '-',
  Wall = '|',
  Axis = '+',
  FallingRock = '@',
}

export type RockCodes = DisplayCode.Rock | DisplayCode.Air;
export type Rock = RockCodes[][];

export enum RockType {
  Flat = 'flat',
  Plus = 'plus',
  Corner = 'corner',
  Tall = 'tall',
  Square = 'square',
}

export type DirectionGenerator = Generator<{direction: Direction, idx: number}>;
export type RockGenerator = Generator<{rock: Rock, type: RockType}>;
