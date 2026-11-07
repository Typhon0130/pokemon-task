import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pokedex/pokedex-page.component').then((m) => m.PokedexPage),
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./teams/teams-page.component').then((m) => m.TeamsPage),
  },
  { path: '**', redirectTo: '' },
];
