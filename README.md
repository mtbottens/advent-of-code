# What?

To run input files, you'll need to provide an AOC_SESSION environment variable, which can be retrieved from your session cookie on adventofcode.com.

## Run answer.ts for year and day, log the results

```bash
deno task run <YEAR> <DAY> <PART>
```

## Submit your answer

```bash
deno task submit <YEAR> <DAY> <PART>
```

### Command options

- <YEAR>: The 4 digit year, e.g., 2022
- <DAY>: The day number, padded by 0, e.g., 01, 09, 22
- <PART>: Only required for submitting answers, either 1 or 2, defaults to 1.
