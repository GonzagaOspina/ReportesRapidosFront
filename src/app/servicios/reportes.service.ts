import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CrearReporteDTO } from '../dto/reporte/crear-reporte-dto';
import { ReporteDTO } from '../dto/reporte/reporte-dto';
import { EditarReporteDTO } from '../dto/reporte/editar-reporte-dto';
import { CategoriaDTO } from '../dto/categoria/categoria-dto';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = 'http://localhost:8080/api/reportes';
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

  obtenerCategorias(): Observable<CategoriaDTO[]> {
    return this.http
      .get<{ error: boolean; respuesta: CategoriaDTO[] }>(
        `http://localhost:8080/api/categorias/listarCategorias`,
        this.getAuthHeaders()
      )
      .pipe(map(res => res.respuesta));
  }

  crearReporte(data: CrearReporteDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearReporte`, data, this.getAuthHeaders());
  }

obtenerReportePorId(id: string): Observable<ReporteDTO> {
  return this.http
    .get<{ error: boolean; respuesta: ReporteDTO }>(`${this.apiUrl}/${id}`, this.getAuthHeaders())
    .pipe(map(res => res.respuesta));
}


  marcarImportante(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/importante`, {}, this.getAuthHeaders());
  }

  subirImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'reportes-rapidos');

    return this.http
      .post<any>('https://api.cloudinary.com/v1_1/dgniqy2kw/image/upload', formData)
      .pipe(map(res => res.secure_url));
  }

  editarReporte(id: string, datos: EditarReporteDTO): Observable<ReporteDTO> {
    return this.http.put<ReporteDTO>(`${this.apiUrl}/${id}`, datos, this.getAuthHeaders());
  }

  eliminarReporte(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

obtenerReportesUsuario(): Observable<ReporteDTO[]> {
  return this.http
    .get<{ error: boolean; respuesta: ReporteDTO[] }>(`${this.apiUrl}/mis-reportes`, this.getAuthHeaders())
    .pipe(map(res => res.respuesta)); // ✅ ya devuelve el array directamente
}


obtenerReportes(): Observable<ReporteDTO[]> {
  return this.http
    .get<{ error: boolean; respuesta: ReporteDTO[] }>(`${this.apiUrl}`, this.getAuthHeaders())
    .pipe(map(res => res.respuesta)); // 👈 ya devuelve solo el array
}
  cambiarEstadoReporte(id: string, data: { nuevoEstado: string; motivo: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, data, this.getAuthHeaders());
  }
}
