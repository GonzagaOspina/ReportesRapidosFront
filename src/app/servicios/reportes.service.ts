import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CrearReporteDTO } from '../dto/reporte/crear-reporte-dto';


@Injectable({ providedIn: 'root' })
export class ReportesService {

  private apiUrl = 'http://localhost:8080/api/reportes';
  imagenUrl: string | null = null;
  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<{ id: string, nombre: string }[]> {
    return this.http.get<{ id: string, nombre: string }[]>(`${this.apiUrl}/categorias`);
  }

crearReporte(data: CrearReporteDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/crear`, data);
}


subirImagen(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'reportes-rapidos'); // 👈 tu preset creado en Cloudinary

  return this.http.post<any>('https://api.cloudinary.com/v1_1/dgniqy2kw/image/upload', formData)
    .pipe(map(res => res.secure_url)); // ⬅️ devuelve la URL lista para guardar
}



}
