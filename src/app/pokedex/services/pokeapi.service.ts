import { Injectable, inject } from '@angular/core';
import { Observable, map, retry, timer } from 'rxjs';
import {
  DEFAULT_POKEMON_LIMIT,
  POKEAPI_GRAPHQL_URL,
  POKEAPI_RETRY_COUNT,
  POKEAPI_RETRY_DELAY_MS,
} from '../../common/constants/app.constants';
import { GraphqlService } from '../../core/graphql/graphql.service';
import { Pokemon, PokemonAbility } from '../models/pokemon.model';
import { GET_ABILITIES, GET_POKEMON } from './pokeapi.queries';
import { mapAbilities, mapPokemon } from './pokemon.mapper';

@Injectable({ providedIn: 'root' })
export class PokeapiService {
  private readonly graphql = inject(GraphqlService);

  /**
   * Loads a paginated Pokémon list from PokéAPI GraphQL.
   */
  getPokemon$(
    limit = DEFAULT_POKEMON_LIMIT,
    offset = 0,
  ): Observable<Pokemon[]> {
    return this.graphql
      .query$<{ pokemon_v2_pokemon: Parameters<typeof mapPokemon>[0][] }>(
        POKEAPI_GRAPHQL_URL,
        GET_POKEMON,
        { limit, offset },
      )
      .pipe(
        map((data) => data.pokemon_v2_pokemon.map(mapPokemon)),
        retry({
          count: POKEAPI_RETRY_COUNT,
          delay: () => timer(POKEAPI_RETRY_DELAY_MS),
        }),
      );
  }

  /**
   * Loads English ability texts for one Pokémon.
   */
  getAbilities$(pokemonId: number): Observable<PokemonAbility[]> {
    return this.graphql
      .query$<{
        pokemon_v2_pokemonability: Parameters<typeof mapAbilities>[0];
      }>(POKEAPI_GRAPHQL_URL, GET_ABILITIES, { pokemonId })
      .pipe(
        map((data) => mapAbilities(data.pokemon_v2_pokemonability as never)),
        retry({
          count: POKEAPI_RETRY_COUNT,
          delay: () => timer(POKEAPI_RETRY_DELAY_MS),
        }),
      );
  }
}
