import {
  RockType,
} from './types.ts';

export interface CycleInput {
  rockType: RockType;
  directionIdx: number;
  restingPlace: [number, number];
}

export interface CycleValue {
  height: number;
  droppedCount: number;
}

export interface CycleOutput {
  start: CycleValue;
  end: CycleValue;
}

export class CycleDetector {
  static CACHE_KEY_JOINER = '__';
  // Honestly YOLO: The criteria for CycleInput is so specific that I'm not
  // worried about potential edge cases with this number
  // Theres probably a much smaller number that would work.
  static DETECT_COUNT = 1000;

  private detectQueue: string[] = [];
  private cache = new Map<string, CycleValue>();

  public add(input: CycleInput, value: CycleValue): CycleOutput | void {
    const serialized = this.serialize(input);

    // If detect queue is < detectCount, add to queue
    this.detectQueue.push(serialized);

    // If detect queue is >= detectCount, remove first item
    if (this.detectQueue.length > CycleDetector.DETECT_COUNT) {
      this.detectQueue.shift();
    }

    // if detect queue is >= detectCount, calculate cache key for entirity of queue
    if (this.detectQueue.length === CycleDetector.DETECT_COUNT) {
      // and add cache key along with height to cache
      const cacheKey = this.detectQueue.join(CycleDetector.CACHE_KEY_JOINER);

      if (this.cache.has(cacheKey)) {
        // if cache key already exists, return the difference between the current height and the cached height
        const start = this.cache.get(cacheKey);
        if (start) {
          return {
            start,
            end: value,
          };
        } else {
          throw new Error('WTF error');
        }
      } else {
        this.cache.set(cacheKey, value);
      }
    }
  }

  private serialize(input: CycleInput): string {
    return JSON.stringify(input);
  }

  private deserialize(serialized: string): CycleInput {
    return JSON.parse(serialized);
  }
}