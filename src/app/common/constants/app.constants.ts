export const POKEAPI_GRAPHQL_URL = 'https://beta.pokeapi.co/graphql/v1beta';
export const LOCAL_GRAPHQL_URL = 'http://127.0.0.1:4000';

export const POKEAPI_RETRY_COUNT = 2;
export const POKEAPI_RETRY_DELAY_MS = 800;

export const DEFAULT_POKEMON_LIMIT = 151;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_MS = 300;
export const TEAM_NAME_MIN = 3;
export const TEAM_NAME_MAX = 30;
export const TEAM_POKEMON_MIN = 1;
export const TEAM_POKEMON_MAX = 6;

export const SELECTED_TEAM_STORAGE_KEY = 'pokedex.selectedTeamId';

export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;
