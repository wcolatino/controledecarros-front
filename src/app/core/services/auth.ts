import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthRequest {
  login: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'westside_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decodifica o payload do token JWT
  getPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getRole(): string | null {
    const payload = this.getPayload();
    return payload?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isPortaria(): boolean {
    return this.getRole() === 'ROLE_PORTARIA';
  }

  getLogin(): string | null {
    const payload = this.getPayload();
    return payload?.sub ?? null;
  }
}