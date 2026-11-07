import { Pokemon, PokemonAbility, PokemonStat } from '../models/pokemon.model';

interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: { pokemon_v2_type: { name: string } }[];
  pokemon_v2_pokemonstats: {
    base_stat: number;
    pokemon_v2_stat: { name: string };
  }[];
  pokemon_v2_pokemonsprites: { sprites: unknown }[];
}

interface RawAbility {
  is_hidden: boolean;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: { short_effect: string }[];
  };
}

export function mapPokemon(raw: RawPokemon): Pokemon {
  const stats: PokemonStat[] = raw.pokemon_v2_pokemonstats.map((s) => ({
    name: s.pokemon_v2_stat.name,
    baseStat: s.base_stat,
  }));

  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    types: raw.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
    stats,
    spriteUrl: resolveSprite(raw),
    totalStats: stats.reduce((sum, s) => sum + s.baseStat, 0),
  };
}

export function mapAbilities(rows: RawAbility[]): PokemonAbility[] {
  return rows.map((row) => ({
    name: row.pokemon_v2_ability.name,
    shortEffect:
      row.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0]?.short_effect ??
      'No description.',
    isHidden: row.is_hidden,
  }));
}

function resolveSprite(raw: RawPokemon): string {
  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`;
  const sprites = raw.pokemon_v2_pokemonsprites[0]?.sprites;
  if (!sprites) return fallback;

  const parsed =
    typeof sprites === 'string' ? (JSON.parse(sprites) as Record<string, unknown>) : sprites;
  const url = (parsed as { front_default?: string | null }).front_default;
  return url || fallback;
}
