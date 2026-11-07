import { Pokemon, PokemonAbility, PokemonStat } from '../models/pokemon.model';

interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemontypes: { type: { name: string } }[];
  pokemonstats: {
    base_stat: number;
    stat: { name: string };
  }[];
  pokemonsprites: { sprites: unknown }[];
}

interface RawAbility {
  is_hidden: boolean;
  ability: {
    name: string;
    abilityeffecttexts: { short_effect: string }[];
  };
}

export function mapPokemon(raw: RawPokemon): Pokemon {
  const stats: PokemonStat[] = raw.pokemonstats.map((s) => ({
    name: s.stat.name,
    baseStat: s.base_stat,
  }));

  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    types: raw.pokemontypes.map((t) => t.type.name),
    stats,
    spriteUrl: resolveSprite(raw),
    totalStats: stats.reduce((sum, s) => sum + s.baseStat, 0),
  };
}

export function mapAbilities(rows: RawAbility[]): PokemonAbility[] {
  return rows.map((row) => ({
    name: row.ability.name,
    shortEffect: row.ability.abilityeffecttexts[0]?.short_effect ?? 'No description.',
    isHidden: row.is_hidden,
  }));
}

function resolveSprite(raw: RawPokemon): string {
  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`;
  const sprites = raw.pokemonsprites[0]?.sprites;
  if (!sprites) return fallback;

  const parsed =
    typeof sprites === 'string'
      ? (JSON.parse(sprites) as Record<string, unknown>)
      : (sprites as Record<string, unknown>);

  const direct = parsed['front_default'];
  if (typeof direct === 'string' && direct) return direct;

  const other = parsed['other'] as
    | { 'official-artwork'?: { front_default?: string | null } }
    | undefined;
  const art = other?.['official-artwork']?.front_default;
  return art || fallback;
}
