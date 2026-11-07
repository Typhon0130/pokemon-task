import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-state-panel',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './state-panel.component.html',
  styleUrl: './state-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatePanelComponent {
  readonly title = input('Something went wrong');
  readonly message = input('Please try again.');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}
