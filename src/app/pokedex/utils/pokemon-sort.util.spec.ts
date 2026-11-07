import { Pokemon } from '../models/pokemon.model';
import { comparePokemon } from './pokemon-sort.util';

function poke(partial: Partial<Pokemon> & Pick<Pokemon, 'id' | 'name'>): Pokemon {
  return {
    height: 1,
    weight: 1,
    types: ['normal'],
    stats: [
      { name: 'hp', baseStat: 50 },
      { name: 'attack', baseStat: 40 },
    ],
    spriteUrl: '',
    totalStats: 90,
    ...partial,
  };
}

describe('comparePokemon', () => {
  it('sorts by total descending', () => {
    const a = poke({ id: 1, name: 'a', totalStats: 100 });
    const b = poke({ id: 2, name: 'b', totalStats: 200 });
    expect(comparePokemon(a, b, 'total', 'desc')).toBeGreaterThan(0);
    expect(comparePokemon(a, b, 'total', 'asc')).toBeLessThan(0);
  });
});
