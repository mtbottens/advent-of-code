import { BinaryHeap } from "https://deno.land/std@0.148.0/collections/binary_heap.ts";

export function one(input: string): number {
  const heap = createBinaryHeap(input);
  return heap.peek();
}

export function two(input: string): number {
  const heap = createBinaryHeap(input);
  let result = 0;

  for (let i = 0; i < 3; i++) {
    result += heap.pop();
  }

  return result;
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
