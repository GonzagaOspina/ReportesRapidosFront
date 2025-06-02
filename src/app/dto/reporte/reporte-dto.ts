export interface UbicacionDTO {
  latitud: number;
  longitud: number;
}

export interface ReporteDTO {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ciudad: string;
  fechaCreacion: string; // en TypeScript usamos string para fechas ISO
  imagenes: string[];
  ubicacion: UbicacionDTO;
  nombreUsuario: string;
  estadoActual: string;
}
