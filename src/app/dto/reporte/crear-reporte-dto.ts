export interface CrearReporteDTO {
  titulo: string;
  descripcion: string;
  categoria: string; // ID de categoría
  ciudad: string; // Enum 'Ciudad'
  ubicacion: { latitud: number, longitud: number };
  imagenes?: string[]; // O lista de URLs, depende si ya subiste las imágenes antes
}
