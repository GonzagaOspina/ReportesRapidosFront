import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { CategoriaDTO } from '../dto/categoria/categoria-dto';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrlPublica = `${environment.apiUrl}/categorias`;
  private baseUrlModerador = `${environment.apiUrl}/moderador/categorias`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * ✅ Listar categorías públicas (clientes)
   */
  listarCategorias(): Observable<CategoriaDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: CategoriaDTO[] }>(`${this.baseUrlPublica}/listarCategorias`)
      .pipe(map(res => res.respuesta));
  }

  /**
   * ✅ Listar todas las categorías (moderador)
   */
  obtenerCategoriasModerador(): Observable<CategoriaDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: CategoriaDTO[] }>(`${this.baseUrlModerador}`, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res.respuesta));
  }

  /**
   * ✅ Obtener categoría por ID
   */
  obtenerCategoriaPorId(id: string): Observable<CategoriaDTO> {
    return this.http
      .get<{ error: boolean; respuesta: CategoriaDTO }>(`${this.baseUrlModerador}/${id}`, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res.respuesta));
  }

  /**
   * ✅ Crear nueva categoría
   */
  crearCategoria(dto: CategoriaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.baseUrlModerador}`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * ✅ Editar categoría
   */
  editarCategoria(id: string, dto: CategoriaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.baseUrlModerador}/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  /**
   * ✅ Eliminar categoría
   */
  eliminarCategoria(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrlModerador}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
