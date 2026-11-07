import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import {
  SEARCH_DEBOUNCE_MS,
  TEAM_NAME_MAX,
  TEAM_NAME_MIN,
  TEAM_POKEMON_MAX,
  TEAM_POKEMON_MIN,
} from '../../../common/constants/app.constants';
import { Pokemon } from '../../../pokedex/models/pokemon.model';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';
import { TeamStore } from '../../state/team.store';
import { uniqueTeamNameValidator } from '../../validators/unique-team-name.validator';

@Component({
  selector: 'app-team-builder-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './team-builder-form.component.html',
  styleUrl: './team-builder-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamBuilderFormComponent implements OnInit {
  private readonly teamStore = inject(TeamStore);
  private readonly pokemonStore = inject(PokemonStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly pickerControl = new FormControl('', { nonNullable: true });
  readonly selected = signal<Pokemon[]>([]);
  readonly submitting = signal(false);
  readonly suggestions = signal<Pokemon[]>([]);
  readonly suggestStatus = signal<'idle' | 'loading' | 'empty' | 'ready'>('idle');

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(TEAM_NAME_MIN),
        Validators.maxLength(TEAM_NAME_MAX),
      ],
      asyncValidators: [
        uniqueTeamNameValidator(this.teamStore.state$.pipe(map((s) => s.teams))),
      ],
    }),
  });

  readonly canAddMore = computed(() => this.selected().length < TEAM_POKEMON_MAX);

  readonly pokemonList = toSignal(
    this.pokemonStore.state$.pipe(map((s) => s.items)),
    { initialValue: [] as Pokemon[] },
  );

  ngOnInit(): void {
    this.pickerControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((query) => {
          const q = query.trim().toLowerCase();
          if (!q) {
            this.suggestStatus.set('idle');
            return of([] as Pokemon[]);
          }
          this.suggestStatus.set('loading');
          const selectedIds = new Set(this.selected().map((p) => p.id));
          const hits = this.pokemonList()
            .filter((p) => p.name.includes(q) && !selectedIds.has(p.id))
            .slice(0, 8);
          this.suggestStatus.set(hits.length ? 'ready' : 'empty');
          return of(hits);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((hits) => this.suggestions.set(hits));
  }

  addPokemon(pokemon: Pokemon): void {
    if (!this.canAddMore()) return;
    this.selected.update((list) => [...list, pokemon]);
    this.pickerControl.setValue('');
    this.suggestions.set([]);
    this.suggestStatus.set('idle');
  }

  removePokemon(id: number): void {
    this.selected.update((list) => list.filter((p) => p.id !== id));
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;
    if (this.selected().length < TEAM_POKEMON_MIN) return;

    this.submitting.set(true);
    this.teamStore
      .createTeam$({
        name: this.form.controls.name.value.trim(),
        trainer_id: 1,
        pokemon_ids: this.selected().map((p) => p.id),
      })
      .subscribe({
        next: () => {
          this.form.reset({ name: '' });
          this.selected.set([]);
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false),
      });
  }
}
