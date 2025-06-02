import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/usuario/crear-usuario-dto';
import { UsuarioDTO } from '../dto/usuario/usuario-dto';
import { EditarUsuarioDTO } from '../dto/usuario/editar-usuario-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly apiBase = 'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private get authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * Crear un nuevo usuario (registro)
   */
  crearUsuario(dto: CrearUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.apiBase}/registro`, dto);
  }

  /**
   * Obtener los datos del perfil del usuario autenticado
   */
  obtenerUsuario(): Observable<MensajeDTO<UsuarioDTO>> {
    return this.http.get<MensajeDTO<UsuarioDTO>>(`${this.apiBase}/perfil`, {
      headers: this.authHeaders
    });
  }

  /**
   * Editar los datos del perfil del usuario autenticado
   */
  editarUsuario(dto: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.apiBase}/perfil`, dto, {
      headers: this.authHeaders
    });
  }

  /**
   * Eliminar la cuenta del usuario autenticado
   */
  eliminarUsuario(): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.apiBase}/eliminar`, {
      headers: this.authHeaders
    });
  }

  /**
   * Cambiar la contraseña del usuario
   */
  cambiarContrasena(actual: string, nueva: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.apiBase}/password`, {
      actual,
      nueva
    }, {
      headers: this.authHeaders
    });
  }
}
