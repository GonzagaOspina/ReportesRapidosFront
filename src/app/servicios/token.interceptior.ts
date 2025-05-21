// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // ✅ Método que devuelva el JWT

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // 👉 JWT token en el header
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
