import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SEARCH_DEBOUNCE_MS,
} from '../common/constants/app.constants';
import { SkeletonBlockComponent } from '../common/components/skeleton-block/skeleton-block.component';
import { StatePanelComponent } from '../common/components/state-panel/state-panel.component';
import { PokemonDetailPanelComponent } from './components/pokemon-detail-panel/pokemon-detail-panel.component';
import { PokedexTableComponent } from './components/pokedex-table/pokedex-table.component';
import { Pokemon, PokemonSortKey } from './models/pokemon.model';
import { PokemonSelectors } from './state/pokemon.selectors';
import { PokemonStore } from './state/pokemon.store';

@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    PokedexTableComponent,
    PokemonDetailPanelComponent,
    SkeletonBlockComponent,
    StatePanelComponent,
  ],
  templateUrl: './pokedex-page.component.html',
  styleUrl: './pokedex-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexPage implements OnInit {
  private readonly store = inject(PokemonStore);
  private readonly selectors = inject(PokemonSelectors);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSizes = PAGE_SIZE_OPTIONS;
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly typeControl = new FormControl('', { nonNullable: true });
  readonly pageSizeControl = new FormControl(DEFAULT_PAGE_SIZE, {
    nonNullable: true,
  });

  readonly panelOpen = signal(false);
  readonly selected = signal<Pokemon | null>(null);
  readonly vm = toSignal(this.selectors.vm$, { initialValue: null });

  ngOnInit(): void {
    this.store.load();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((value) => of(value).pipe(tap((v) => this.store.setSearch(v)))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.typeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.store.setTypeFilter(value || null));

    this.pageSizeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((size) => this.store.setPageSize(size));
  }

  retry(): void {
    this.store.load(true);
  }

  onSort(key: PokemonSortKey): void {
    this.store.setSort(key);
  }

  openDetail(pokemon: Pokemon): void {
    this.selected.set(pokemon);
    this.panelOpen.set(true);
  }

  closeDetail(): void {
    this.panelOpen.set(false);
  }

  setPage(page: number): void {
    this.store.setPage(page);
  }
}
