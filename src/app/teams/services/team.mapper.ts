import { Team } from '../models/team.model';

export function mapTeam(raw: Record<string, unknown>): Team {
  return {
    id: Number(raw['id']),
    trainer_id: Number(raw['trainer_id']),
    name: String(raw['name'] ?? ''),
    pokemon_ids: Array.isArray(raw['pokemon_ids'])
      ? (raw['pokemon_ids'] as unknown[]).map((id) => Number(id))
      : [],
    created_at: String(raw['created_at'] ?? ''),
  };
}
