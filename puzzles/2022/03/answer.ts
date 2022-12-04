export function one(input: string): number {
  return input.split('\n').reduce((acc, line) => {
    const groups = [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2),
    ];

    return acc + findScoreOfCommonItemInGroups(...groups);
  }, 0);
}

export function two(input: string): number {
  let cursor = 0;
  let result = 0;
  let lines = input.split('\n');

  while (cursor + 3 < lines.length) {

    result += findScoreOfCommonItemInGroups(
      ...lines.slice(cursor, cursor + 3),
    );

    cursor += 3;
  }

  return result;
}

function findScoreOfCommonItemInGroups(...groups: string[]): number {
  const found = Array(52).fill(0);

  for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
    const group = groups[groupIdx];

    for (let cursor = 0; cursor <= group.length; cursor++) {
      const character = group.charCodeAt(cursor);
      let charIdx: number;

      if (character >= 97 && character <= 122) {
        charIdx = character - 97;
      } else {
        charIdx = character - 39;
      }

      if (found[charIdx] === groupIdx) {
        found[charIdx]++;
        
        if (groupIdx === groups.length - 1) {
          return charIdx + 1;
        }
      }
    }
  }

  return 0;
}
