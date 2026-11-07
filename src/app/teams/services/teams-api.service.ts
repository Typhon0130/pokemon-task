import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LOCAL_GRAPHQL_URL } from '../../common/constants/app.constants';
import { GraphqlService } from '../../core/graphql/graphql.service';
import { CreateTeamInput, Team } from '../models/team.model';
import { mapTeam } from './team.mapper';
import { ALL_TEAMS, CREATE_TEAM, REMOVE_TEAM } from './teams.queries';

@Injectable({ providedIn: 'root' })
export class TeamsApiService {
  private readonly graphql = inject(GraphqlService);

  /**
   * Fetches all teams from the local mock GraphQL server.
   */
  getTeams$(): Observable<Team[]> {
    return this.graphql
      .query$<{ allTeams: Record<string, unknown>[] }>(LOCAL_GRAPHQL_URL, ALL_TEAMS)
      .pipe(map((data) => (data.allTeams ?? []).map(mapTeam)));
  }

  /**
   * Creates a team via the local mock GraphQL server.
   */
  createTeam$(input: CreateTeamInput): Observable<Team> {
    return this.graphql
      .query$<{ createTeam: Record<string, unknown> }>(LOCAL_GRAPHQL_URL, CREATE_TEAM, {
        name: input.name,
        trainer_id: String(input.trainer_id),
        pokemon_ids: input.pokemon_ids,
        created_at: new Date().toISOString(),
      })
      .pipe(map((data) => mapTeam(data.createTeam)));
  }

  /**
   * Deletes a team by id on the local mock GraphQL server.
   */
  deleteTeam$(id: number): Observable<number> {
    return this.graphql
      .query$<{ removeTeam: { id: string | number } }>(LOCAL_GRAPHQL_URL, REMOVE_TEAM, {
        id: String(id),
      })
      .pipe(map((data) => Number(data.removeTeam.id)));
  }
}
