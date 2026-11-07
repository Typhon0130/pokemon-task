import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

interface GraphqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  private readonly http = inject(HttpClient);

  /**
   * Posts a GraphQL operation and returns the data payload.
   */
  query$<T>(
    url: string,
    query: string,
    variables?: Record<string, unknown>,
  ): Observable<T> {
    return this.http
      .post<GraphqlResponse<T>>(url, { query, variables })
      .pipe(
        map((res) => {
          if (res.errors?.length) {
            throw new Error(res.errors.map((e) => e.message).join(', '));
          }
          if (!res.data) {
            throw new Error('Empty GraphQL response');
          }
          return res.data;
        }),
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            return throwError(
              () => new Error(`Request failed (${err.status || 'network'})`),
            );
          }
          return throwError(() => err);
        }),
      );
  }
}