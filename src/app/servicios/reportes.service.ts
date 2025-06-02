import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CrearReporteDTO } from '../dto/reporte/crear-reporte-dto';
import { ReporteDTO } from '../dto/reporte/reporte-dto';
import { EditarReporteDTO } from '../dto/reporte/editar-reporte-dto';
import { CategoriaDTO } from '../dto/categoria/categoria-dto';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = `${environment.apiUrl}/reportes`;
  private categoriasUrl = `${environment.apiUrl}/categorias`;

  imagenUrl: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // ✅ Obtener categorías públicas
  obtenerCategorias(): Observable<CategoriaDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: CategoriaDTO[] }>(`${this.categoriasUrl}/listarCategorias`, this.getAuthHeaders())
      .pipe(map(res => res.respuesta));
  }

  // ✅ Crear un nuevo reporte
  crearReporte(data: CrearReporteDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearReporte`, data, this.getAuthHeaders());
  }

  // ✅ Obtener reporte por ID
  obtenerReportePorId(id: string): Observable<ReporteDTO> {
    return this.http
      .get<{ error: boolean; respuesta: ReporteDTO }>(`${this.apiUrl}/${id}`, this.getAuthHeaders())
      .pipe(map(res => res.respuesta));
  }

  // ✅ Marcar un reporte como importante
  marcarImportante(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/importante`, {}, this.getAuthHeaders());
  }

  // ✅ Subir imagen a Cloudinary
  subirImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'reportes-rapidos');

    return this.http
      .post<any>('https://api.cloudinary.com/v1_1/dgniqy2kw/image/upload', formData)
      .pipe(map(res => res.secure_url));
  }

  // ✅ Editar un reporte
  editarReporte(id: string, datos: EditarReporteDTO): Observable<ReporteDTO> {
    return this.http.put<ReporteDTO>(`${this.apiUrl}/${id}`, datos, this.getAuthHeaders());
  }

  // ✅ Eliminar un reporte
  eliminarReporte(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ Obtener reportes del usuario autenticado
  obtenerReportesUsuario(): Observable<ReporteDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: ReporteDTO[] }>(`${this.apiUrl}/mis-reportes`, this.getAuthHeaders())
      .pipe(map(res => res.respuesta));
  }

  // ✅ Obtener todos los reportes (para moderadores/admins)
  obtenerReportes(): Observable<ReporteDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: ReporteDTO[] }>(`${this.apiUrl}`, this.getAuthHeaders())
      .pipe(map(res => res.respuesta));
  }

  // ✅ Cambiar estado de un reporte
  cambiarEstadoReporte(id: string, data: { nuevoEstado: string; motivo: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, data, this.getAuthHeaders());
  }
}
