import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export type UserRole = 'ADMIN' | 'MEMBER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  role: UserRole;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';
  private readonly STORAGE_KEY = 'chit_fund_user';
  private readonly ROLE_KEY = 'chit_fund_role';

  /**
   * Mock login - validates credentials and returns role
   * In real app, this would call actual API
   */
  login(email: string, password: string): Observable<LoginResponse> {
    // Mock validation - in production, this would be an HTTP POST
    // For demo: admin@chitfund.com / admin123 or member@chitfund.com / member123
    const mockUsers: Record<string, { password: string; role: UserRole }> = {
      'admin@chitfund.com': { password: 'admin123', role: 'ADMIN' },
      'member@chitfund.com': { password: 'member123', role: 'MEMBER' },
      'test@example.com': { password: 'test123', role: 'MEMBER' }
    };

    const user = mockUsers[email.toLowerCase()];

    if (!user || user.password !== password) {
      return throwError(() => ({
        error: { message: 'Invalid email or password' }
      })).pipe(delay(500)); // Simulate network delay
    }

    const response: LoginResponse = {
      success: true,
      role: user.role,
      token: `mock_token_${Date.now()}`
    };

    return of(response).pipe(
      delay(500), // Simulate network delay
      tap((res) => {
        if (res.success) {
          this.setUser(email, res.role);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUserRole(): UserRole | null {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role as UserRole | null;
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private setUser(email: string, role: UserRole): void {
    localStorage.setItem(this.STORAGE_KEY, email);
    localStorage.setItem(this.ROLE_KEY, role);
  }
}
