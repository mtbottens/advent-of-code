export function mutateList(
  elementToMove: number,
  list: number[],
  modifier: number,
) {
  const originalIndex = list.findIndex((el) => el === elementToMove);
  list.splice(originalIndex, 1);

  // TIL way too much about the % operator
  // see: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
  const newIndex = (((originalIndex + modifier) % list.length) + list.length) % list.length;
  list.splice(newIndex, 0, elementToMove);
}