import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { TypeBadgeComponent } from '../../../common/components/type-badge/type-badge.component';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';
import { Team } from '../../models/team.model';
import {
  teamPokemon,
  teamTotalBaseStats,
  teamTypeDistribution,
} from '../../utils/team-stats.util';
import { TeamStore } from '../../state/team.store';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [TypeBadgeComponent, MatCardModule, MatButtonModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent {
  private readonly teamStore = inject(TeamStore);
  private readonly pokemonStore = inject(PokemonStore);

  readonly teams = input.required<Team[]>();
  readonly selectedTeamId = input<number | null>(null);

  private readonly allPokemon = toSignal(
    this.pokemonStore.state$.pipe(map((s) => s.items)),
    { initialValue: [] },
  );

  readonly cards = computed(() =>
    this.teams().map((team) => {
      const members = teamPokemon(team, this.allPokemon());
      return {
        team,
        members,
        total: teamTotalBaseStats(members),
        types: Object.entries(teamTypeDistribution(members)),
      };
    }),
  );

  select(id: number): void {
    this.teamStore.selectTeam(id);
  }

  remove(id: number, event: Event): void {
    event.stopPropagation();
    this.teamStore.deleteTeam$(id).subscribe({ error: () => undefined });
  }
}
