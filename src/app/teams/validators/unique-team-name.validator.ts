import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SEARCH_DEBOUNCE_MS } from '../../common/constants/app.constants';
import { Team } from '../models/team.model';

/**
 * Async validator that rejects team names already present in the list.
 */
export function uniqueTeamNameValidator(
  teams$: Observable<Team[]>,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = String(control.value ?? '')
      .trim()
      .toLowerCase();
    if (!value) return of(null);

    return timer(SEARCH_DEBOUNCE_MS).pipe(
      switchMap(() => teams$),
      map((teams) =>
        teams.some((t) => t.name.trim().toLowerCase() === value)
          ? { uniqueName: true }
          : null,
      ),
    );
  };
}
