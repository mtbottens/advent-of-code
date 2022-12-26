import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import {Blueprint, Resource, ResourceCount} from './types.ts';
import {Attempt, getMoves} from './analyzeBlueprint.ts';

const sampleBlueprint: Blueprint = {
  id: 1,
  costs: {
    ore: {
      ore: 4,
    },
    clay: {
      ore: 2,
    },
    obsidian: {
      ore: 3,
      clay: 14,
    },
    geode: {
      ore: 2,
      obsidian: 7,
    },
  },
};

const initAttempt = ({
  minute = 0,
  inventory = {},
  robots = {},
}: Partial<{
  minute: number;
  inventory: Partial<ResourceCount>;
  robots: Partial<ResourceCount>;
}>): Attempt => {
  return {
    minute,
    inventory: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
      ...inventory,
    },
    robots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
      ...robots,
    },
  };
}

Deno.test(`getMoves - returns the correct moves`, () => {
  const minute1Attempt = initAttempt({});
  const minute1Result = getMoves(
    minute1Attempt,
    sampleBlueprint,
  );
  assertEquals(minute1Result, [
    initAttempt({
      minute: 5,
      robots: {
        ore: 2,
      },
      inventory: {
        ore: 1,
      }
    }),
    initAttempt({
      minute: 3,
      inventory: {
        ore: 1,
      },
      robots: {
        clay: 1,
        ore: 1,
      }
    }),
  ]);

  const minute3Attempt = initAttempt({
    minute: 3,
    inventory: {
      ore: 1,
    },
    robots: {
      clay: 1,
      ore: 1,
    }
  });
  const minute3Result = getMoves(minute3Attempt, sampleBlueprint);
  assertEquals(minute3Result, [
    initAttempt({
      minute: 7,
      inventory: {
        ore: 1,
        clay: 4,
      },
      robots: {
        clay: 1,
        ore: 2,
      },
    }),
    initAttempt({
      minute: 5,
      inventory: {
        clay: 2,
        ore: 1,
      },
      robots: {
        clay: 2,
        ore: 1,
      },
    }),
    initAttempt({
      minute: 18,
      inventory: {
        ore: 13,
        clay: 1,
      },
      robots: {
        clay: 1,
        obsidian: 1,
        ore: 1,
      },
    }),
  ]);

  const minute5Attempt = initAttempt({
    minute: 5,
    inventory: {
      clay: 2,
      ore: 1,
    },
    robots: {
      clay: 2,
      ore: 1,
    },
  });
  const minute5Result = getMoves(minute5Attempt, sampleBlueprint);
  assertEquals(minute5Result, [
    initAttempt({
      minute: 9,
      inventory: {
        clay: 10,
        ore: 1,
      },
      robots: {
        clay: 2,
        ore: 2,
      },
    }),
    initAttempt({
      minute: 7,
      inventory: {
        clay: 6,
        ore: 1,
      },
      robots: {
        clay: 3,
        ore: 1,
      },
    }),
    initAttempt({
      minute: 12,
      inventory: {
        clay: 2,
        ore: 5,
      },
      robots: {
        clay: 2,
        obsidian: 1,
        ore: 1,
      },
    }),
  ]);

  const minute7Attempt = initAttempt({
    minute: 7,
    inventory: {
      clay: 6,
      ore: 1,
    },
    robots: {
      clay: 3,
      ore: 1,
    },
  });
  const minute7Result = getMoves(minute7Attempt, sampleBlueprint);
  assertEquals(minute7Result, [
    initAttempt({
      minute: 11,
      inventory: {
        clay: 18,
        ore: 1,
      },
      robots: {
        clay: 3,
        ore: 2,
      },
    }),
    initAttempt({
      minute: 9,
      inventory: {
        clay: 12,
        ore: 1,
      },
      robots: {
        clay: 4,
        ore: 1,
      },
    }),
    initAttempt({
      minute: 11,
      inventory: {
        clay: 4,
        ore: 2,
      },
      robots: {
        clay: 3,
        obsidian: 1,
        ore: 1,
      },
    }),
  ]);
});

Deno.test(`getMoves - does not attempt to generate more robots than necessary`, () => {
  // We do not need more robots than it takes to generate any resource more than once per turn
  const attempt = initAttempt({
    robots: {
      ore: 4,
      clay: 14,
      obsidian: 7,
      geode: 1,
    },
  });
  const result = getMoves(attempt, sampleBlueprint);
  assertEquals(result, [
    initAttempt({
      minute: 2,
      inventory: {
        clay: 28,
        geode: 2,
        obsidian: 7,
        ore: 6,
      },
      robots: {
        ore: 4,
        clay: 14,
        obsidian: 7,
        geode: 2,
      },
    }),
  ]);
});

Deno.test(`getMoves - does not return additional moves when resulting minutes would be > limit`, () => {
  const attempt = initAttempt({
    minute: 23,
  });
  const result = getMoves(attempt, sampleBlueprint);
  assertEquals(result, []);
});