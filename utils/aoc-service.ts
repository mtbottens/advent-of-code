import {dirname, join, posix} from 'https://deno.land/std@0.57.0/path/mod.ts';

interface RequestContext {
  day: string;
  year: string;
  part?: '1' | '2';
  answer?: string;
}

export async function submitAnswer(context: RequestContext) {
  console.log(context);

  const {
    part,
    answer,
    ...requestOptions
  } = context;

  return request({
    action: 'answer',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: `level=${part}&answer=${answer}`,
    ...requestOptions,
  });
}

export async function downloadInput(context: RequestContext): Promise<string> {
  const {day, year} = context;
  const sessionCookie = Deno.env.get('AOC_SESSION');
  const cacheKey = `${year}-${day}-${sessionCookie}`;
  const cacheFile = posix.fromFileUrl(join(dirname(import.meta.url), `../.input-cache/${cacheKey}.txt`));

  try {
    const cachedInput = await Deno.readTextFile(cacheFile);
    return cachedInput;
  } catch (_err) {
    const response = await request({
      action: 'input',
      day,
      year,
    });

    const input = await response.text();

    // write cache
    await Deno.writeTextFile(cacheFile, input);

    return input;
  }
}

interface RequestOptions {
  day: string;
  year: string;
  action: 'input' | 'answer';
  method?: 'GET' | 'POST';
  headers?: HeadersInit;
  body?: BodyInit;
}

async function request({
  day,
  year,
  action,
  method = 'GET',
  headers = {},
  body,
}: RequestOptions): Promise<Response> { 
  const url = `https://adventofcode.com/${year}/day/${day.replace(/^0+/, '')}/${action}`;
  return fetch(url, {
    method,
    headers: {
      cookie: `session=${Deno.env.get('AOC_SESSION')}`,
      'User-Agent': `github.com/mtbottens/advent-of-code by mtbottens@gmail.com`,
      ...headers,
    },
    ...(body ? { body } : {}),
  });
}
