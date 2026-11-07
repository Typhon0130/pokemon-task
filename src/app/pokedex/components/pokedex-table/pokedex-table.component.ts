import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TypeBadgeComponent } from '../../../common/components/type-badge/type-badge.component';
import { Pokemon, PokemonSortKey } from '../../models/pokemon.model';
import { statOf } from '../../utils/stat.util';

@Component({
  selector: 'app-pokedex-table',
  standalone: true,
  imports: [TypeBadgeComponent, MatButtonModule],
  templateUrl: './pokedex-table.component.html',
  styleUrl: './pokedex-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexTableComponent {
  readonly rows = input.required<Pokemon[]>();
  readonly sortKey = input.required<PokemonSortKey>();
  readonly sortDir = input.required<'asc' | 'desc'>();
  readonly sortChange = output<PokemonSortKey>();
  readonly rowClick = output<Pokemon>();

  readonly columns: { key: PokemonSortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'special-attack', label: 'Sp.Atk' },
    { key: 'special-defense', label: 'Sp.Def' },
    { key: 'speed', label: 'Speed' },
    { key: 'total', label: 'Total' },
  ];

  stat = statOf;

  marker(key: PokemonSortKey): string {
    if (this.sortKey() !== key) return '';
    return this.sortDir() === 'asc' ? ' ↑' : ' ↓';
  }
}
