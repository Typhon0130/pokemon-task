import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';
import { StatePanelComponent } from '../../../common/components/state-panel/state-panel.component';
import { TypeBadgeComponent } from '../../../common/components/type-badge/type-badge.component';
import { LoadStatus, Pokemon, PokemonAbility } from '../../models/pokemon.model';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonRadarComponent } from '../pokemon-radar/pokemon-radar.component';

@Component({
  selector: 'app-pokemon-detail-panel',
  standalone: true,
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    TypeBadgeComponent,
    PokemonRadarComponent,
    StatePanelComponent,
  ],
  templateUrl: './pokemon-detail-panel.component.html',
  styleUrl: './pokemon-detail-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailPanelComponent {
  private readonly api = inject(PokeapiService);
  private readonly loadAbilities$ = new Subject<number>();

  readonly pokemon = input<Pokemon | null>(null);
  readonly open = input(false);
  readonly closed = output<void>();

  readonly abilitiesStatus = signal<LoadStatus>('idle');
  readonly abilitiesError = signal<string | null>(null);
  readonly abilities = signal<PokemonAbility[]>([]);

  private readonly abilitiesAction = toSignal(
    this.loadAbilities$.pipe(
      tap(() => {
        this.abilitiesStatus.set('loading');
        this.abilitiesError.set(null);
      }),
      switchMap((id) =>
        this.api.getAbilities$(id).pipe(
          tap((list) => {
            this.abilities.set(list);
            this.abilitiesStatus.set(list.length ? 'success' : 'success');
          }),
          catchError((err: unknown) => {
            this.abilities.set([]);
            this.abilitiesStatus.set('error');
            this.abilitiesError.set(
              err instanceof Error ? err.message : 'Failed to load abilities.',
            );
            return of([]);
          }),
        ),
      ),
    ),
    { initialValue: [] },
  );

  constructor() {
    effect(() => {
      const p = this.pokemon();
      if (p && this.open()) {
        this.loadAbilities$.next(p.id);
      }
    });
  }

  retryAbilities(): void {
    const p = this.pokemon();
    if (p) this.loadAbilities$.next(p.id);
  }
}
