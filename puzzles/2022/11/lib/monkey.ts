export class Monkey {
  constructor(
    public items: number[],
    private rawCalculation: string,
    public divisor: number,
    private receiverMonkeyIfTrue: number,
    private receiverMonkeyIfFalse: number,
  ) {}

  inspectItem(): number | undefined {
    const item = this.items.shift();
    if (!item) return undefined;
    return this.calculateNewWorry(item);
  }

  determineReceiver(worry: number): number {
    return worry % this.divisor === 0
      ? this.receiverMonkeyIfTrue
      : this.receiverMonkeyIfFalse;
  }

  private calculateNewWorry(old: number) {
    const [rawVarA, modifier, rawVarB] = this.rawCalculation.split(' ');
      const varA = rawVarA === 'old' ? old : parseInt(rawVarA, 10);
      const varB = rawVarB === 'old' ? old : parseInt(rawVarB, 10);

      switch (modifier) {
        case '*':
          return varA * varB;
        case '+':
          return varA + varB;
        default:
          throw new Error(`calculation not supported: ${modifier}`);
      }
  }
}