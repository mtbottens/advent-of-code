export class Knot {
  private next: Knot | null = null;
  private _onPositionChanged: ((x: number, y: number) => void) | null = null;

  constructor(
    public x: number,
    public y: number,
  ) {}

  onPositionChanged(callback: (x: number, y: number) => void) {
    this._onPositionChanged = callback;
  }

  parentMoved(x: number, y: number) {
    const distance = Math.max(
      Math.abs(Math.abs(this.y) - Math.abs(y)),
      Math.abs(Math.abs(this.x) - Math.abs(x)),
    );
    const prevX = this.x;
    const prevY = this.y;

    if (distance > 1) {
      if (this.x !== x && this.y !== y) {
        if (this.x > x && this.y > y) {
          this.x -= 1;
          this.y -= 1;
        } else if (this.x > x && this.y < y) {
          this.x -= 1;
          this.y += 1;
        } else if (this.x < x && this.y > y) {
          this.x += 1;
          this.y -= 1;
        } else if (this.x < x && this.y < y) {
          this.x += 1;
          this.y += 1;
        } else {
          throw new Error('Invalid state');
        }
      } else if (this.x !== x) {
        this.x = this.x < x ? this.x + 1 : this.x - 1;
      } else if (this.y !== y) {
        this.y = this.y < y ? this.y + 1 : this.y - 1;
      }
    }

    if (prevX !== this.x || prevY !== this.y) {
      this._onPositionChanged?.(this.x, this.y);
      this.next?.parentMoved(this.x, this.y);
    }
  }

  addNext(knot: Knot) {
    this.next = knot;
  }
}