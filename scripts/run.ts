import {submitAnswer, downloadInput} from '../utils/aoc-service.ts';
import {dirname, join, posix} from 'https://deno.land/std@0.57.0/path/mod.ts';

function getPath(path: string) {
  return posix.fromFileUrl(join(dirname(import.meta.url), path));
}

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
  Init = 'init',
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

function defaultProcessInput(input: string): string {
  return input;
}

// Import the puzzle module
try {
  if (command === Command.Init) {
    await Deno.mkdir(getPath(`../puzzles/${year}/${day}`), {recursive: true});
    await Deno.copyFile(getPath(`./template/answer.ts`), getPath(`../puzzles/${year}/${day}/answer.ts`));
    await Deno.copyFile(getPath(`./template/answer.test.ts`), getPath(`../puzzles/${year}/${day}/answer.test.ts`));
    console.log(`Created puzzle template for ${year}/${day}`);
  } else {
    const {one, two, processInput} = await import(`../puzzles/${year}/${day}/answer.ts`);
  
    const rawInput = await downloadInput({
      year,
      day,
    })
    const input = processInput ? processInput(rawInput) : defaultProcessInput(rawInput);
  
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
  }

} catch (err) {
  console.error(err);
  Deno.exit(1);
}

export {};

// console.log(Deno.args);