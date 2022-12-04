import {submitAnswer, downloadInput} from '../utils/aoc-service.ts';

try {
  // Validate input params
  // Require AOC_SESSION env var
  if (!Deno.env.get('AOC_SESSION')) {
    throw new Error('AOC_SESSION env var is required');
  };
} catch (err) {
  console.error(err);
  Deno.exit(1);
}

enum Command {
  Run = 'run',
  Submit = 'submit',
}

// Resolve the year and day from the command line
const [command, year, day, part = '1'] = Deno.args;

if (!year || !day) {
  console.error(`deno task ${command} <year> <day>`);
  Deno.exit(1);
}

if (command === Command.Submit && !part) {
  console.error(`deno task ${command} <year> <day> <part>`);
  console.error(`part is required when submitting a puzzle`);
  Deno.exit(1);
}

// Import the puzzle module
try {
  const {one, two} = await import(`../puzzles/${year}/${day}/answer.ts`);

  const input = await downloadInput({
    year,
    day,
  })

  const result = await (part === '1' ? one(input) : two(input));

  switch (command) {
    case Command.Run:
      console.log(result);
      break;
    case Command.Submit:
      console.log(`Submitting answer ...`);
      const response = await submitAnswer({
        day,
        year,
        part,
        answer: result,
      });
      console.log(`Answer submitted ${response}`);
      break;
  }
} catch (err) {
  console.error(err);
  Deno.exit(1);
}

export {};

// console.log(Deno.args);