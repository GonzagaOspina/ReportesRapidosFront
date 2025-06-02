import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/usuario/crear-usuario-dto';
import { UsuarioDTO } from '../dto/usuario/usuario-dto';
import { EditarUsuarioDTO } from '../dto/usuario/editar-usuario-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = `${environment.apiUrl}/api/usuarios`;

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
    return this.http.post<MensajeDTO<string>>(`${this.apiUrl}/registro`, dto);
  }

  /**
   * Obtener los datos del perfil del usuario autenticado
   */
  obtenerUsuario(): Observable<MensajeDTO<UsuarioDTO>> {
    return this.http.get<MensajeDTO<UsuarioDTO>>(`${this.apiUrl}/perfil`, {
      headers: this.authHeaders
    });
  }

  /**
   * Editar los datos del perfil del usuario autenticado
   */
  editarUsuario(dto: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.apiUrl}/perfil`, dto, {
      headers: this.authHeaders
    });
  }

  /**
   * Eliminar la cuenta del usuario autenticado
   */
  eliminarUsuario(): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.apiUrl}/eliminar`, {
      headers: this.authHeaders
    });
  }
activarUsuario(email: string, codigo: string): Observable<MensajeDTO<string>> {
    console.log('API URL en activarUsuario:', this.apiUrl);
  return this.http.post<MensajeDTO<string>>(`${this.apiUrl}/activar`, { email, codigo });
}

  /**
   * Cambiar la contraseña del usuario
   */
  cambiarContrasena(actual: string, nueva: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.apiUrl}/password`, {
      actual,
      nueva
    }, {
      headers: this.authHeaders
    });
  }
}
