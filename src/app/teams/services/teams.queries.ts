export const ALL_TEAMS = `
  query AllTeams {
    allTeams {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;

export const CREATE_TEAM = `
  mutation CreateTeam(
    $name: String!
    $trainer_id: ID!
    $pokemon_ids: [Int]!
    $created_at: String!
  ) {
    createTeam(
      name: $name
      trainer_id: $trainer_id
      pokemon_ids: $pokemon_ids
      created_at: $created_at
    ) {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;

export const REMOVE_TEAM = `
  mutation RemoveTeam($id: ID!) {
    removeTeam(id: $id) {
      id
    }
  }
`;
