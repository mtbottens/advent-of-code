import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { File, Directory } from "./filesystem.ts";

Deno.test('File - returns the size of the file', () => {
  const file = new File('test', 10);
  assertEquals(file.getSize(), 10);
});

Deno.test('Directory - returns the size of the directory', () => {
  const directory = new Directory('test');
  assertEquals(directory.getSize(), 0);

  const files = ([['a', 1], ['b', 2], ['c', 3]] as [string, number][]).map(([name, size]) => new File(name, size));
  directory.setChildren(files);

  assertEquals(directory.getSize(), 6);
});
