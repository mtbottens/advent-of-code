import {Blueprint, Resource, ResourceCount} from './types.ts';

export interface Attempt {
  minute: number;
  inventory: ResourceCount;
  robots: ResourceCount;
}

export function analyzeBlueprint(
  blueprint: Blueprint,
  maximumMinutes: number,
  startingState: Attempt = {
    minute: 0,
    inventory: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    robots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
  },
): number {
  const attempts: Attempt[] = [startingState];
  let geodeMaximum = 0;

  for (let attemptIdx = 0; attemptIdx < attempts.length; attemptIdx++) {
    const attempt = attempts[attemptIdx];

    // if move === maximumMinutes, stop
    if (attempt.minute >= maximumMinutes) {
      continue;
    }

    // Get next moves
    const nextMoves = getMoves(attempt, blueprint, maximumMinutes);

    // calculate maximum geodes so far
    geodeMaximum = Math.max(
      ...nextMoves.map(move => move.inventory.geode),
      geodeMaximum,
    );

    attempts.push(
      ...(
        nextMoves
          // optimization needed for part 2
          // if it is impossible to get more geodes than current maximum, do not push to queue
          .filter(
            move => {
              const remainingMinutes = maximumMinutes - move.minute;
              // Assuming we can buy 1 geode bot per minute, what is the theoretical maximum geodes we can get?
              const theoreticalMaximum = [
                move.inventory.geode,
                ...(move.robots.geode > 0 ? [remainingMinutes * move.robots.geode] : []),
                ...(
                  // remainingMinutes - 2, each "move" is at the end of a minute, and building a bot takes a minute as well
                  remainingMinutes - 2 > 0
                    ? Array(remainingMinutes - 2)
                      .fill(0)
                      .map((_, i) => i + 1)
                    : []
                ),
              ].reduce((acc, n) => acc + n, 0)
              
              return theoreticalMaximum >= geodeMaximum
            }
          )
      )
    );
  }

  const sorted = attempts
    // Increment time from current minute to max minutes
    .map((attempt) => ({
      ...attempt,
      minute: maximumMinutes,
      inventory: {
        ore: attempt.inventory.ore + (maximumMinutes - attempt.minute) * attempt.robots.ore,
        clay: attempt.inventory.clay + (maximumMinutes - attempt.minute) * attempt.robots.clay,
        obsidian: attempt.inventory.obsidian + (maximumMinutes - attempt.minute) * attempt.robots.obsidian,
        geode: attempt.inventory.geode + (maximumMinutes - attempt.minute) * attempt.robots.geode,
      },
    }))
    // Sort by most geodes
    .sort((a, b) => b.inventory.geode - a.inventory.geode);

  // get the first one
  return sorted[0].inventory.geode;
}

export function getMoves(
  attempt: Attempt,
  blueprint: Blueprint,
  maximumMinutes: number = 24,
): Attempt[] {
  const limitRobotCount: ResourceCount = {
    [Resource.Ore]: Math.max(
      blueprint.costs[Resource.Ore][Resource.Ore],
      blueprint.costs[Resource.Clay][Resource.Ore],
      blueprint.costs[Resource.Obsidian][Resource.Ore],
      blueprint.costs[Resource.Geode][Resource.Ore],
    ),
    [Resource.Clay]: blueprint.costs[Resource.Obsidian][Resource.Clay],
    [Resource.Obsidian]: blueprint.costs[Resource.Geode][Resource.Obsidian],
    [Resource.Geode]: Infinity,
  };

  // figure out which pieces we could buy with our current robots regardless of time
  // return an attempt for each possible piece
  // assume it can only ever be 1 per purchase
  return ([Resource.Ore, Resource.Clay, Resource.Obsidian, Resource.Geode] as Resource[])
    .map<Attempt | null>((resource) => {
      // is possible to purchase?
      let canPurchase = true;
      let movesRequiredList: number[] = [];
      let resourceUsage: ResourceCount = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
      };

      // do not attempt to buy more than what is necessary
      if (attempt.robots[resource] >= limitRobotCount[resource]) return null;

      for (const [type, cost] of Object.entries(blueprint.costs[resource])) {
        const resourceType = type as Resource;
        const robotCount = attempt.robots[resourceType];
        const required = (cost as number) - attempt.inventory[resourceType];
        
        if (robotCount === 0) {
          canPurchase = false;
          break;
        } else {
          resourceUsage[resourceType] = cost;
          movesRequiredList.push(Math.ceil(required / robotCount) + 1);
        }
      }

      if (!canPurchase) return null;

      const movesRequired = Math.max(...movesRequiredList, 1);

      return {
        ...attempt,
        minute: attempt.minute + movesRequired,
        inventory: {
          ore: attempt.inventory.ore - resourceUsage.ore + (movesRequired * attempt.robots.ore),
          clay: attempt.inventory.clay - resourceUsage.clay + (movesRequired * attempt.robots.clay),
          obsidian: attempt.inventory.obsidian - resourceUsage.obsidian + (movesRequired * attempt.robots.obsidian),
          geode: attempt.inventory.geode - resourceUsage.geode + (movesRequired * attempt.robots.geode),
        },
        robots: {
          ...attempt.robots,
          [resource]: attempt.robots[resource] + 1,
        },
      };
    })
    .filter((attempt): attempt is Attempt => !!attempt)
    .filter((attempt) => attempt.minute <= maximumMinutes);
}