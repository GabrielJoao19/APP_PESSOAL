import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/app.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = '/api';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  public currentUser = signal<Usuario | null>(this.getStoredUser());
  
  public isLoggedIn = computed(() => !!this.tokenSignal());

  private getStoredToken(): string | null {
    return localStorage.getItem('lifeos_token');
  }

  private getStoredUser(): Usuario | null {
    const raw = localStorage.getItem('lifeos_user');
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  login(email: string, senha: string): Observable<{ access_token?: string; acces_token?: string; usuario?: Usuario }> {
    return this.http.post<{ access_token?: string; acces_token?: string; usuario?: Usuario }>(`${this.apiUrl}/auth/login`, {
      email,
      senha
    }).pipe(
      tap(res => {
        const token = res.access_token || res.acces_token;
        if (token) {
          localStorage.setItem('lifeos_token', token);
          this.tokenSignal.set(token);
          
          const user = res.usuario || {
            id: 1,
            nome: email.split('@')[0],
            email: email,
            limite_diario: 50
          };
          localStorage.setItem('lifeos_user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, {
      nome,
      email,
      senha
    });
  }

  logout(): void {
    localStorage.removeItem('lifeos_token');
    localStorage.removeItem('lifeos_user');
    this.tokenSignal.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
