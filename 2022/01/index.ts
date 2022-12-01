import main from './lib.ts';

const heap = await main();

console.log(`First Problem: ${heap.peek()}`);

let sumOfTopThree = 0;

for (let i = 0; i < 3; i++) {
  sumOfTopThree += heap.pop();
}

console.log(`Second Problem: ${sumOfTopThree}`);
