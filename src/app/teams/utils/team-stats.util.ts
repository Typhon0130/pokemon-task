import { Pokemon } from '../../pokedex/models/pokemon.model';
import { Team } from '../models/team.model';

export function teamPokemon(team: Team, all: Pokemon[]): Pokemon[] {
  return team.pokemon_ids
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Pokemon => !!p);
}

export function teamTypeDistribution(members: Pokemon[]): Record<string, number> {
  return members.reduce<Record<string, number>>((acc, p) => {
    for (const type of p.types) {
      acc[type] = (acc[type] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function teamTotalBaseStats(members: Pokemon[]): number {
  return members.reduce((sum, p) => sum + p.totalStats, 0);
}