import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TYPE_COLORS } from '../../constants/type-colors.constants';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  template: `
    <span class="type-badge" [style.background]="color()">{{ type() }}</span>
  `,
  styles: `
    .type-badge {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: capitalize;
      color: #111;
      margin-right: 0.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeBadgeComponent {
  readonly type = input.required<string>();
  readonly color = computed(() => TYPE_COLORS[this.type()] ?? '#888');
}
