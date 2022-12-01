import { BinaryHeap } from "https://deno.land/std@0.148.0/collections/binary_heap.ts";

import downloadInput from "../../utils/download-input.ts";

export default async function main(): BinaryHeap<number> {
  const input = await downloadInput({day: '1', year: '2022'});
  return createBinaryHeap(input);
}

function createBinaryHeap(input: string): BinaryHeap<number> {
  const lines = input.split('\n');
  const heap = new BinaryHeap<number>();
  let aggregator = 0;

  for (const line of lines) {
    if (line === '') {
      heap.push(aggregator);
      aggregator = 0;
    } else {
      aggregator += parseInt(line);
    }
  }

  return heap;
}
