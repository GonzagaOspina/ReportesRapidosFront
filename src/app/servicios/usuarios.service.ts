import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/usuario/crear-usuario-dto';
import { UsuarioDTO } from '../dto/usuario/usuario-dto';
import { EditarUsuarioDTO } from '../dto/usuario/editat-usuario0dto';
import { MensajeDTO   } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:8080/api/usuarios/registro';
  private apiUrl2 = 'http://localhost:8080/api/usuarios';
  private apiUrl3= 'http://localhost:8080/api/usuarios/eliminar';
  private apiUrl4= 'http://localhost:8080/api/usuarios/perfil';



  constructor(private http: HttpClient, private authService: AuthService) { }

  crearUsuario(dto: CrearUsuarioDTO): Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(this.apiUrl,dto);
  }
  
  obtenerUsuario(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl4}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

    editarUsuario(dto: EditarUsuarioDTO): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl4}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

    eliminarUsuario(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.delete<MensajeDTO>(`${this.apiUrl3}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
cambiarContrasena(actual: string, nueva: string): Observable<any> {
  const token = this.authService.getToken();
  return this.http.put('http://localhost:8080/api/usuarios/password', {
    actual,
    nueva
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
}
