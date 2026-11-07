import { Pokemon } from '../models/pokemon.model';

export function statOf(pokemon: Pokemon, name: string): number {
  return pokemon.stats.find((s) => s.name === name)?.baseStat ?? 0;
}
