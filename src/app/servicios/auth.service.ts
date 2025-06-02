import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginResponse { token: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.tokenKey));
  private rolSubject = new BehaviorSubject<string | null>(this.getRroleFromToken());
  rol$ = this.rolSubject.asObservable();

  constructor(@Inject('API_URL') private apiUrl: string, private http: HttpClient) {}

  private get baseUrl() {
    return `${this.apiUrl}/api/login`;
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(this.baseUrl, { email, password })
      .pipe(
        tap(res => {
          const token = (res as any).token || (res as any).accessToken;
          if (!token) {
            console.warn('⚠️ No se recibió token en la respuesta');
            return;
          }
          localStorage.setItem(this.tokenKey, token);
          this.loggedIn$.next(true);
          this.rolSubject.next(this.getRroleFromToken());
        })
      );
  }

  getRroleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
    this.rolSubject.next(null);
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  isCliente(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_CLIENTE';
  }

  isModerador(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_MODERADOR';
  }

  getUserInfoFromToken(): { name?: string, email?: string } | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        name: payload.name,
        email: payload.email,
      };
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  solicitarCodigoRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recuerarPassword`, { email });
  }

  cambiarPassword(email: string, codigo: string, nuevoPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password/nuevo`, {
      email,
      codigo,
      nuevoPassword
    });
  }
}
