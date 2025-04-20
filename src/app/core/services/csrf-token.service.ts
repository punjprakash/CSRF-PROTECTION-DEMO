import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsrfTokenService {
  private csrfToken: string | null = null;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getToken(): Observable<string> {
    if (this.csrfToken) {
      return of(this.csrfToken);
    }

    return this.http.get<{ token: string }>(`${this.apiUrl}/csrf-token`, {
      withCredentials: true
    }).pipe(
      map(response => response.token),
      tap(token => {
        this.csrfToken = token;
      }),
      catchError(error => {
        console.error('Failed to fetch CSRF token', error);
        return of('');
      })
    );
  }

  clearToken(): void {
    this.csrfToken = null;
  }
}
