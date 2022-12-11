import { assertEquals, assertThrows } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Monkey } from './monkey.ts';

function createCalculatorMonkey(items: number[], calculation: string): Monkey {
  return new Monkey(
    items,
    calculation,
    0,
    0,
    0,
  );
}

function createReceiverMonkey(divisibility: number): Monkey {
  return new Monkey(
    [],
    '3 + 3',
    divisibility,
    1,
    0,
  );
}

Deno.test('monkey inspect calculates worry', () => {
  const adds = createCalculatorMonkey([10], 'old + 3');
  assertEquals(adds.inspectItem(), 13);
  assertEquals(adds.inspectItem(), undefined);

  const multiplies = createCalculatorMonkey([20], 'old * 2');
  assertEquals(multiplies.inspectItem(), 40);
  assertEquals(multiplies.inspectItem(), undefined);

  const throws = createCalculatorMonkey([40], 'old / old');
  assertThrows(throws.inspectItem);
})

Deno.test('monkey determines receiver', () => {
  const receiver = createReceiverMonkey(2);
  assertEquals(receiver.determineReceiver(4), 1);
  assertEquals(receiver.determineReceiver(3), 0);
});
