interface InputContext {
  day: string;
  year: string;
}

export default async function downloadInput({day, year}: InputContext): Promise<string> {
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      cookie: `session=${Deno.env.get('AOC_SESSION')}`,
    }
  });
  
  return response.text();
}