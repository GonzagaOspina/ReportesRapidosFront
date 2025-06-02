import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CrearComentarioDTO } from '../dto/comentario/crear-comentario-dto';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Comentario } from '../dto/comentario/comentario-dto';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private readonly baseUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Enviar nuevo comentario con token
   */
  crearComentario(dto: CrearComentarioDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/${dto.idReporte}/comentarios`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener todos los comentarios de un reporte con token
   */
  obtenerComentariosPorReporte(idReporte: string): Observable<MensajeDTO<Comentario[]>> {
    return this.http.get<MensajeDTO<Comentario[]>>(`${this.baseUrl}/${idReporte}/comentarios`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Editar comentario por ID
   */
  editarComentario(id: string, mensaje: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/comentarios/${id}`, { mensaje }, {
      headers: this.getHeaders()
    });
  }

  /**
   * Eliminar comentario por ID
   */
  eliminarComentario(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comentarios/${id}`, {
      headers: this.getHeaders()
    });
  }
}
