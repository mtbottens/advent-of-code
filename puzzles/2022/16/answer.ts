/**
 * By default, the input will be a string. Modify the type here, and the processInput function
 * to massage the input data into whichever format is needed by the answer functions.
 */
type PuzzleInput = {
  idToIndex: Map<string, number>;
  indexToId: Map<number, string>;
  transitCost: number[][];
  flowRates: number[]
};

/**
 * Solve for the first challenge
 * 
 * @param {PuzzleInput} input
 * @returns {string} the result for part one
 */
export function one(input: PuzzleInput): string {
  const routes = resolveRoutes(input, 30);
  routes.sort((a,b) => a.pressureReleased < b.pressureReleased ? 1 : -1);
  return routes[0].pressureReleased.toString();
}

interface Route {
  location: string;
  remainingValves: number[];
  pressureReleased: number;
  minutesRemaining: number;
  waypoints: string[];
}

function resolveRoutes(
  input: PuzzleInput,
  minutesRemaining: number,
): Route[] {
  const {
    indexToId,
    idToIndex,
    flowRates,
    transitCost,
  } = input;
  const initialValves = flowRates
    .map<[number, number]>((rate, idx) => [idx, rate])
    .filter(([, rate]) => rate > 0)
    .map<number>(([id]) => id);

  const routes: Route[] = [{
    location: 'AA',
    remainingValves: initialValves,
    pressureReleased: 0,
    minutesRemaining,
    waypoints: [],
  }];

  for (let routeIdx = 0; routeIdx < routes.length; routeIdx++) {
    const {
      location,
      remainingValves,
      pressureReleased,
      minutesRemaining,
      waypoints,
    } = routes[routeIdx];

    for (const destinationValveIdx of remainingValves) {
      const transitCostToValve = transitCost[idToIndex.get(location)!][destinationValveIdx];
      const newMinutesRemaining = minutesRemaining - transitCostToValve - 1;
      const newPressureReleased = pressureReleased + flowRates[destinationValveIdx] * newMinutesRemaining;
      const destinationId = indexToId.get(destinationValveIdx)!;

      if (newMinutesRemaining >= 0) {
        routes.push({
          location: destinationId,
          remainingValves: remainingValves.filter(v => v !== destinationValveIdx),
          pressureReleased: newPressureReleased,
          minutesRemaining: newMinutesRemaining,
          waypoints: [
            ...waypoints,
            destinationId,
          ],
        });
      }
    }
  }

  // reduce the size a bit, in an effort to get an answer for part 2 in a reasonable timeframe
  return routes
    .filter(route => route.minutesRemaining <= 20)
    .filter(route => route.waypoints.length > 0);
}

/**
 * Solve for the second challenge
 * 
 * @param {PuzzleInput} input 
 * @returns {string} the result for part two
 */
export function two(input: PuzzleInput): string {
  const routes = resolveRoutes(input, 26);
  routes.sort((a,b) => a.pressureReleased < b.pressureReleased ? 1 : -1);

  let result = 0;

  for (let myIdx = 0; myIdx < routes.length; myIdx++) {
    const myRoute = routes[myIdx];

    for (let elephantIdx = myIdx + 1; elephantIdx < routes.length; elephantIdx++) {
      const elephantRoute = routes[elephantIdx];

      if (myRoute.waypoints.every(waypoint => !elephantRoute.waypoints.includes(waypoint))) {
        const sum = myRoute.pressureReleased + elephantRoute.pressureReleased;

        result = Math.max(
          result,
          sum,
        );
        // logging this out, too lazy to clean up this code to be 
        // performant enough to complete in a reasonable amount of time
        // essentially, this currently takes 63k~**2 comparisons with my 
        // input
        // -- side note
        // -- this will log out the right result pretty quickly with my 
        // -- input, and completes the sample input fast
        console.log(`Current Result: ${result}`);
      }
    }
  }

  return result.toString();
}

/**
 * Takes the raw input from adventofcode.com for the given day and year
 * and returns the processed input into whichever format is needed for the
 * one and two functions.
 * 
 * @param {string} input the raw input
 * @returns {PuzzleInput} the processed input
 */
export function processInput(input: string): PuzzleInput {
  const idToIndex = new Map<string, number>();
  const indexToId = new Map<number, string>();
  const connectors = new Map<string, string[]>();

  const valveData: [number, string, number, string[]][] = input
    .replace(/\n$/, '')
    .split('\n')
    .map((line, idx) => {
      const match = line.match(/^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);

      if (!match) {
        throw new Error(`Invalid Input: ${line}`);
      }

      const [, valveId, flowRateAsString, valvesAsString] = match;
      const flowRate = parseInt(flowRateAsString, 10);
      const valves = valvesAsString.split(', ');

      return [
        idx,
        valveId,
        flowRate,
        valves,
      ];
    });

  const transitCost: number[][] = Array(
    valveData.length
  )
    .fill(null)
    .map(() => Array(valveData.length).fill(Infinity));

  // traveling to yourself is stupid, but shouldnt cost anything either
  for (let idx = 0; idx < transitCost.length; idx++) {
    for (let idx2 = 0; idx2 < transitCost[idx].length; idx2++) {
      if (idx === idx2) {
        transitCost[idx][idx2] = 0;
      }
    }
  }

  const flowRates: number[] = Array(valveData.length).fill(0);

  for (let [idx, valveId, flowRate, toValves] of valveData) {
    idToIndex.set(valveId, idx);
    indexToId.set(idx, valveId);
    connectors.set(valveId, toValves)
    flowRates[idx] = flowRate;
  }

  // init queue where [id, modifier], e.g.,
  const queue: [string, number, string][] = [
    ...(
      Array
        .from(idToIndex.keys())
        .map<[string, number, string]>((val) => [val, 1, val])
    )
  ];

  while (queue.length) {
    const [referenceIdentifier, modifier, fromIdentifier] = queue.shift()!;
    const connections = connectors.get(referenceIdentifier) || [];
    const referenceIdx = idToIndex.get(referenceIdentifier);
    const fromIdx = idToIndex.get(fromIdentifier)!;
    
    for (const connection of connections) {
      const toIdx = idToIndex.get(connection)!;
      const currentCost = transitCost[fromIdx][toIdx];
      const newCost = modifier;

      if (newCost < currentCost) {
        transitCost[fromIdx][toIdx] = newCost;
        queue.push(
          [
            connection,
            modifier + 1,
            fromIdentifier,
          ]
        );
      }
    }
  }

  return {
    idToIndex,
    indexToId,
    flowRates,
    transitCost,
  };
}