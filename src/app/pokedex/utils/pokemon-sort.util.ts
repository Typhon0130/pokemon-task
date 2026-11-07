import { Pokemon, PokemonSortKey } from '../models/pokemon.model';

export function getStatValue(pokemon: Pokemon, key: PokemonSortKey): number | string {
  if (key === 'id') return pokemon.id;
  if (key === 'name') return pokemon.name;
  if (key === 'total') return pokemon.totalStats;
  return pokemon.stats.find((s) => s.name === key)?.baseStat ?? 0;
}

export function comparePokemon(
  a: Pokemon,
  b: Pokemon,
  key: PokemonSortKey,
  dir: 'asc' | 'desc',
): number {
  const left = getStatValue(a, key);
  const right = getStatValue(b, key);
  let result = 0;
  if (typeof left === 'string' && typeof right === 'string') {
    result = left.localeCompare(right);
  } else {
    result = Number(left) - Number(right);
  }
  return dir === 'asc' ? result : -result;
}
