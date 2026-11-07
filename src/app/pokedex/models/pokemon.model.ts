export interface PokemonStat {
  name: string;
  baseStat: number;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  stats: PokemonStat[];
  spriteUrl: string;
  totalStats: number;
}

export interface PokemonAbility {
  name: string;
  shortEffect: string;
  isHidden: boolean;
}

export type PokemonSortKey =
  | 'id'
  | 'name'
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed'
  | 'total';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
