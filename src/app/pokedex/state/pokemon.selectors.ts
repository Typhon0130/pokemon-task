import { Injectable, inject } from '@angular/core';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { comparePokemon } from '../utils/pokemon-sort.util';
import { PokemonState, PokemonStore } from './pokemon.store';

export interface PagedPokemon {
  rows: Pokemon[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class PokemonSelectors {
  private readonly store = inject(PokemonStore);

  readonly state$ = this.store.state$.pipe(shareReplay(1));

  readonly filteredSorted$: Observable<Pokemon[]> = this.state$.pipe(
    map((state) => this.filterAndSort(state)),
    shareReplay(1),
  );

  readonly paged$: Observable<PagedPokemon> = this.filteredSorted$.pipe(
    map((rows) => {
      const { page, pageSize } = this.store.snapshot();
      const total = rows.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const safePage = Math.min(page, totalPages);
      const start = (safePage - 1) * pageSize;
      return {
        rows: rows.slice(start, start + pageSize),
        total,
        page: safePage,
        pageSize,
        totalPages,
      };
    }),
    shareReplay(1),
  );

  readonly availableTypes$: Observable<string[]> = this.state$.pipe(
    map((state) =>
      [...new Set(state.items.flatMap((p) => p.types))].sort((a, b) =>
        a.localeCompare(b),
      ),
    ),
    distinctUntilChanged((a, b) => a.join() === b.join()),
    shareReplay(1),
  );

  readonly vm$ = combineLatest([this.state$, this.paged$, this.availableTypes$]).pipe(
    map(([state, paged, types]) => ({ state, paged, types })),
    shareReplay(1),
  );

  private filterAndSort(state: PokemonState): Pokemon[] {
    const q = state.search.trim().toLowerCase();
    let rows = state.items;
    if (q) rows = rows.filter((p) => p.name.includes(q));
    if (state.typeFilter) {
      rows = rows.filter((p) => p.types.includes(state.typeFilter!));
    }
    return [...rows].sort((a, b) =>
      comparePokemon(a, b, state.sortKey, state.sortDir),
    );
  }
}
