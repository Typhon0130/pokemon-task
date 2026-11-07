import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from '../../common/constants/app.constants';
import { LoadStatus, Pokemon, PokemonSortKey } from '../models/pokemon.model';
import { PokeapiService } from '../services/pokeapi.service';

export interface PokemonState {
  items: Pokemon[];
  status: LoadStatus;
  error: string | null;
  search: string;
  typeFilter: string | null;
  sortKey: PokemonSortKey;
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

const initialState: PokemonState = {
  items: [],
  status: 'idle',
  error: null,
  search: '',
  typeFilter: null,
  sortKey: 'id',
  sortDir: 'asc',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

@Injectable({ providedIn: 'root' })
export class PokemonStore {
  private readonly api = inject(PokeapiService);
  private readonly stateSubject = new BehaviorSubject<PokemonState>(initialState);
  readonly state$ = this.stateSubject.asObservable();

  /**
   * Returns the current store snapshot.
   */
  snapshot(): PokemonState {
    return this.stateSubject.value;
  }

  /**
   * Loads Pokémon into the cache. Reuses cache unless forced.
   */
  load(force = false): void {
    const current = this.snapshot();
    if (!force && current.items.length && current.status === 'success') return;

    this.patch({ status: 'loading', error: null });
    this.api
      .getPokemon$()
      .pipe(
        tap((items) => this.patch({ items, status: 'success', error: null })),
        catchError((err: unknown) => {
          const message =
            err instanceof Error ? err.message : 'Could not load Pokémon.';
          this.patch({ status: 'error', error: message });
          return of([]);
        }),
      )
      .subscribe();
  }

  setSearch(search: string): void {
    this.patch({ search, page: 1 });
  }

  setTypeFilter(typeFilter: string | null): void {
    this.patch({ typeFilter, page: 1 });
  }

  setSort(sortKey: PokemonSortKey): void {
    const current = this.snapshot();
    if (current.sortKey === sortKey) {
      this.patch({ sortDir: current.sortDir === 'asc' ? 'desc' : 'asc' });
      return;
    }
    this.patch({ sortKey, sortDir: 'desc' });
  }

  setPage(page: number): void {
    this.patch({ page });
  }

  setPageSize(pageSize: number): void {
    this.patch({ pageSize, page: 1 });
  }

  private patch(partial: Partial<PokemonState>): void {
    this.stateSubject.next({ ...this.snapshot(), ...partial });
  }
}
