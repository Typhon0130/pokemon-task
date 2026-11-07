export interface Team {
  id: number;
  trainer_id: number;
  name: string;
  pokemon_ids: number[];
  created_at: string;
}

export interface CreateTeamInput {
  name: string;
  trainer_id: number;
  pokemon_ids: number[];
}
