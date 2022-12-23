import {
  DisplayCode,
  Rock,
  RockType,
} from './types.ts';

export const rockFactory = (type: RockType): Rock => {
  switch (type) {
    case RockType.Flat:
      return [
        [DisplayCode.Rock, DisplayCode.Rock, DisplayCode.Rock, DisplayCode.Rock]
      ];
    case RockType.Plus:
      return [
        [DisplayCode.Air, DisplayCode.Rock, DisplayCode.Air],
        [DisplayCode.Rock, DisplayCode.Rock, DisplayCode.Rock],
        [DisplayCode.Air, DisplayCode.Rock, DisplayCode.Air],
      ];
    case RockType.Corner:
      // return [
      //   [DisplayCode.Air, DisplayCode.Air, DisplayCode.Rock],
      //   [DisplayCode.Air, DisplayCode.Air, DisplayCode.Rock],
      //   [DisplayCode.Rock, DisplayCode.Rock, DisplayCode.Rock],
      // ];

      return [
        [DisplayCode.Rock, DisplayCode.Rock, DisplayCode.Rock],
        [DisplayCode.Air, DisplayCode.Air, DisplayCode.Rock],
        [DisplayCode.Air, DisplayCode.Air, DisplayCode.Rock],
      ];
    case RockType.Tall:
      return [
        [DisplayCode.Rock],
        [DisplayCode.Rock],
        [DisplayCode.Rock],
        [DisplayCode.Rock],
      ];
    case RockType.Square:
      return [
        [DisplayCode.Rock, DisplayCode.Rock],
        [DisplayCode.Rock, DisplayCode.Rock],
      ];
  }
}
