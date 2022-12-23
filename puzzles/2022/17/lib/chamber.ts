import {
  Direction,
  DisplayCode,
  Rock,
} from './types.ts';

export class Chamber {
  private state: DisplayCode[][] = [];

  // update after rock finishes falling
  private tallest = 0;
  private flushedRows = 0;

  private width = 7;

  private currentRock: Rock | null = null;
  private currentRockPosition: [number, number] | null = null;
  private previousRockPosition: [number, number] | null = null;

  constructor(
  ) {}

  addRock(rock: Rock) {
    this.padChamberAndPlaceRock(rock);
  }

  getTallest() {
    return this.tallest;
  }

  *whileFalling() {
    while (this.currentRock) {
      yield {
        position: this.currentRockPosition,
        falling: true,
      };
      this.move(Direction.Down);
    }

    yield {
      position: this.previousRockPosition,
      falling: false,
    };
  }

  print() {
    const floor = Array(this.width + 2).fill(DisplayCode.Floor);
    floor[0] = DisplayCode.Axis;
    floor[this.width + 1] = DisplayCode.Axis;

    let result = floor.join('');

    for (let row of this.state) {
      result = `${DisplayCode.Wall}${row.join('')}${DisplayCode.Wall}\n${result}`
    }

    console.log(result);
  }

  private padChamberAndPlaceRock(rock: Rock) {
    // rock should be added 2 from left wall
    // and bottom should be 3 units higher than floor or other rock
    let padHeight = this.tallest + 3 + rock.length;
    // const rowsToFill = padHeight - this.state.length - this.tallest;
    const rowsToFill = padHeight - this.state.length;

    // add buffer to chamber
    if (rowsToFill > 0) {
      this.state = [
        ...this.state,
        ...Array(rowsToFill)
          .fill(null)
          .map(() => Array(this.width).fill(DisplayCode.Air)),
      ];
    } else if (rowsToFill < 0) {
      this.state.splice(rowsToFill);
    }

    // place falling rock
    this.currentRock = rock;
    this.currentRockPosition = [rock.length - 1, 2];

    this.drawFallingRock();
  }

  private drawFallingRock(erase = false, commit = false) {
    const rock = this.currentRock!;
    const position = this.currentRockPosition!;
    const [x, y] = position;

    for (let rowIdx = 0; rowIdx < rock.length; rowIdx++) {
      for (let colIdx = 0; colIdx < rock[rowIdx].length; colIdx++) {
        const cellContent = rock[rowIdx][colIdx];

        if (cellContent === DisplayCode.Rock) {
          const stateX = this.state.length - 1 + rowIdx - x;
          const stateY = colIdx + y;

          this.state[stateX][stateY] = erase
            ? DisplayCode.Air
            : commit ? DisplayCode.Rock : DisplayCode.FallingRock;
        }
      }
    }
  }

  move(direction: Direction) {
    const position = this.currentRockPosition!;
    let [newX, newY] = position;

    switch (direction) {
      case Direction.Left:
        newY = position[1] - 1;

        if (!this.checkCollision(newX, newY)) {
          this.drawFallingRock(true);
          this.currentRockPosition = [newX, newY];
          this.drawFallingRock();
        }
        break;
      case Direction.Right:
        newY = position[1] + 1;

        if (!this.checkCollision(newX, newY)) {
          this.drawFallingRock(true);
          this.currentRockPosition = [newX, newY];
          this.drawFallingRock();
        }
        break;
      case Direction.Down:
        newX = position[0] + 1;

        if (this.checkCollision(newX, newY)) {
          // make rock placement pernament, reset rock vars
          this.drawFallingRock(true);
          this.drawFallingRock(false, true);

          // update tallest var
          this.tallest = Math.max(
            this.state.length - newX + this.currentRock!.length + this.flushedRows,
            this.tallest,
          );

          this.previousRockPosition = [...this.currentRockPosition!];

          this.currentRock = null;
          this.currentRockPosition = null;
        } else {
          // move rock down
          this.drawFallingRock(true);
          this.currentRockPosition = [newX, newY];
          this.drawFallingRock();
        }
        break;
    }
  }

  private checkCollision(x: number, y: number): boolean {
    const rock = this.currentRock!;

    for (let rowIdx = 0; rowIdx < rock.length; rowIdx++) {
      for (let colIdx = 0; colIdx < rock[rowIdx].length; colIdx++) {
        const cellContent = rock[rowIdx][colIdx];

        if (cellContent === DisplayCode.Rock) {
          const stateX = this.state.length - 1 + rowIdx - x;
          const stateY = colIdx + y;
          const contents = this.state[stateX]?.[stateY] || DisplayCode.Rock;

          if (contents === DisplayCode.Rock) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
