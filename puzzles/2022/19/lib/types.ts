export interface Blueprint {
  id: number;
  costs: {
    [Resource.Ore]: {
      [Resource.Ore]: number;
    };
    [Resource.Clay]: {
      [Resource.Ore]: number;
    };
    [Resource.Obsidian]: {
      [Resource.Ore]: number;
      [Resource.Clay]: number;
    };
    [Resource.Geode]: {
      [Resource.Ore]: number;
      [Resource.Obsidian]: number;
    };
  };
}

export enum Resource {
  Ore = 'ore',
  Clay = 'clay',
  Obsidian = 'obsidian',
  Geode = 'geode',
}

export type ResourceCount = Record<Resource, number>;