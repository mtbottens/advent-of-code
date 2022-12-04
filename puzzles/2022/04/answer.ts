export function one(input: string) {
  return input.split('\n').reduce((acc, line) => {
    if (!line) return acc;

    const [a, b] = line.split(',');
    const [startA, endA] = a.split('-').map(Number);
    const [startB, endB] = b.split('-').map(Number);

    if (
      (startA >= startB && endA <= endB) ||
      (startB >= startA && endB <= endA)
    ) {
      return acc + 1;
    }
    
    return acc;
  }, 0);
}

export function two(input: string) {
  return input.split('\n').reduce((acc, line) => {
    if (!line) return acc;

    const [a, b] = line.split(',');
    const [startA, endA] = a.split('-').map(Number);
    const [startB, endB] = b.split('-').map(Number);

    if (
      ((startA >= startB && startA <= endB) || (endA >= startB && endA <= endB)) ||
      ((startB >= startA && startB <= endA) || (endB >= startA && endB <= endA))
    ) {
      return acc + 1;
    }
    
    return acc;
  }, 0);
}
