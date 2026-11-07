import { FormControl } from '@angular/forms';
import { firstValueFrom, of } from 'rxjs';
import { Team } from '../models/team.model';
import { uniqueTeamNameValidator } from './unique-team-name.validator';

describe('uniqueTeamNameValidator', () => {
  const teams: Team[] = [
    {
      id: 1,
      trainer_id: 1,
      name: 'Kanto Starters',
      pokemon_ids: [25],
      created_at: '2024-01-15T10:00:00Z',
    },
  ];

  it('flags duplicate names', async () => {
    const control = new FormControl('kanto starters');
    const result = await firstValueFrom(
      uniqueTeamNameValidator(of(teams))(control),
    );
    expect(result).toEqual({ uniqueName: true });
  });

  it('allows unused names', async () => {
    const control = new FormControl('Fresh Team');
    const result = await firstValueFrom(
      uniqueTeamNameValidator(of(teams))(control),
    );
    expect(result).toBeNull();
  });
});
