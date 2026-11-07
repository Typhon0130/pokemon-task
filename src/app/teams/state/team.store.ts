import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { ToastService } from '../../common/services/toast.service';
import { LoadStatus } from '../../pokedex/models/pokemon.model';
import { CreateTeamInput, Team } from '../models/team.model';
import { TeamsApiService } from '../services/teams-api.service';

export interface TeamState {
  teams: Team[];
  status: LoadStatus;
  error: string | null;
  selectedTeamId: number | null;
}

const initialState: TeamState = {
  teams: [],
  status: 'idle',
  error: null,
  selectedTeamId: null,
};

@Injectable({ providedIn: 'root' })
export class TeamStore {
  private readonly api = inject(TeamsApiService);
  private readonly toast = inject(ToastService);
  private readonly stateSubject = new BehaviorSubject<TeamState>(initialState);
  readonly state$ = this.stateSubject.asObservable();

  /**
   * Returns the current team store snapshot.
   */
  snapshot(): TeamState {
    return this.stateSubject.value;
  }

  /**
   * Loads teams from the local mock server.
   */
  load(): void {
    this.patch({ status: 'loading', error: null });
    this.api
      .getTeams$()
      .pipe(
        tap((teams) => this.patch({ teams, status: 'success', error: null })),
        catchError((err: unknown) => {
          const message =
            err instanceof Error ? err.message : 'Could not load teams.';
          this.patch({ status: 'error', error: message });
          return of([]);
        }),
      )
      .subscribe();
  }

  selectTeam(id: number | null): void {
    this.patch({ selectedTeamId: id });
  }

  /**
   * Creates a team optimistically and rolls back if the mutation fails.
   */
  createTeam$(input: CreateTeamInput): Observable<Team> {
    const tempId = -Date.now();
    const optimistic: Team = {
      id: tempId,
      trainer_id: input.trainer_id,
      name: input.name,
      pokemon_ids: [...input.pokemon_ids],
      created_at: new Date().toISOString(),
    };
    const previous = this.snapshot().teams;
    this.patch({ teams: [optimistic, ...previous] });

    return this.api.createTeam$(input).pipe(
      tap((created) => {
        const teams = this.snapshot().teams.map((t) =>
          t.id === tempId ? created : t,
        );
        this.patch({ teams, selectedTeamId: created.id });
        this.toast.show(`Team "${created.name}" created`);
      }),
      catchError((err: unknown) => {
        this.patch({ teams: previous });
        const message =
          err instanceof Error ? err.message : 'Could not create team.';
        this.toast.show(message, 'error');
        return throwError(() => err);
      }),
    );
  }

  /**
   * Deletes a team and restores it if the request fails.
   */
  deleteTeam$(id: number): Observable<number> {
    const previous = this.snapshot().teams;
    this.patch({
      teams: previous.filter((t) => t.id !== id),
      selectedTeamId:
        this.snapshot().selectedTeamId === id
          ? null
          : this.snapshot().selectedTeamId,
    });

    return this.api.deleteTeam$(id).pipe(
      tap(() => this.toast.show('Team deleted')),
      catchError((err: unknown) => {
        this.patch({ teams: previous });
        const message =
          err instanceof Error ? err.message : 'Could not delete team.';
        this.toast.show(message, 'error');
        return throwError(() => err);
      }),
    );
  }

  private patch(partial: Partial<TeamState>): void {
    this.stateSubject.next({ ...this.snapshot(), ...partial });
  }
}