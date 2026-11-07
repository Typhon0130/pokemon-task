import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../common/services/toast.service';
import { CreateTeamInput, Team } from '../models/team.model';
import { TeamsApiService } from '../services/teams-api.service';
import { TeamStore } from './team.store';

describe('TeamStore', () => {
  let store: TeamStore;
  let api: {
    createTeam$: jest.Mock;
    getTeams$: jest.Mock;
    deleteTeam$: jest.Mock;
  };
  let toast: { show: jest.Mock };

  const existing: Team = {
    id: 1,
    trainer_id: 1,
    name: 'Kanto Starters',
    pokemon_ids: [25],
    created_at: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    api = {
      createTeam$: jest.fn(),
      getTeams$: jest.fn(),
      deleteTeam$: jest.fn(),
    };
    toast = { show: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        TeamStore,
        { provide: TeamsApiService, useValue: api },
        { provide: ToastService, useValue: toast },
      ],
    });

    store = TestBed.inject(TeamStore);
    store['patch']({ teams: [existing], status: 'success', error: null });
  });

  it('rolls back optimistic create when mutation fails', (done) => {
    const input: CreateTeamInput = {
      name: 'Temp Squad',
      trainer_id: 1,
      pokemon_ids: [6, 9],
    };
    api.createTeam$.mockImplementation(() => {
      expect(store.snapshot().teams[0].name).toBe('Temp Squad');
      expect(store.snapshot().teams[0].id).toBeLessThan(0);
      return throwError(() => new Error('network down'));
    });

    store.createTeam$(input).subscribe({
      error: () => {
        expect(store.snapshot().teams).toEqual([existing]);
        expect(toast.show).toHaveBeenCalledWith('network down', 'error');
        done();
      },
    });
  });

  it('keeps created team when mutation succeeds', (done) => {
    const input: CreateTeamInput = {
      name: 'New Squad',
      trainer_id: 1,
      pokemon_ids: [1],
    };
    const created: Team = {
      id: 99,
      trainer_id: 1,
      name: 'New Squad',
      pokemon_ids: [1],
      created_at: '2024-05-01T00:00:00Z',
    };
    api.createTeam$.mockReturnValue(of(created));

    store.createTeam$(input).subscribe({
      next: () => {
        expect(store.snapshot().teams.some((t) => t.id === 99)).toBe(true);
        expect(toast.show).toHaveBeenCalled();
        done();
      },
    });
  });
});
