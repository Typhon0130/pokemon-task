import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SELECTED_TEAM_STORAGE_KEY } from '../common/constants/app.constants';
import { SkeletonBlockComponent } from '../common/components/skeleton-block/skeleton-block.component';
import { StatePanelComponent } from '../common/components/state-panel/state-panel.component';
import { TeamBuilderFormComponent } from './components/team-builder-form/team-builder-form.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TeamStore } from './state/team.store';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    TeamBuilderFormComponent,
    TeamListComponent,
    SkeletonBlockComponent,
    StatePanelComponent,
  ],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPage implements OnInit {
  private readonly store = inject(TeamStore);
  readonly state = toSignal(this.store.state$, {
    initialValue: this.store.snapshot(),
  });

  constructor() {
    const saved = localStorage.getItem(SELECTED_TEAM_STORAGE_KEY);
    if (saved) {
      const id = Number(saved);
      if (!Number.isNaN(id)) this.store.selectTeam(id);
    }

    effect(() => {
      const id = this.state().selectedTeamId;
      if (id == null) {
        localStorage.removeItem(SELECTED_TEAM_STORAGE_KEY);
      } else {
        localStorage.setItem(SELECTED_TEAM_STORAGE_KEY, String(id));
      }
    });
  }

  ngOnInit(): void {
    this.store.load();
  }

  retry(): void {
    this.store.load();
  }
}
