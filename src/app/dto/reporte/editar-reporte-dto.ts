import { UbicacionDTO } from "./reporte-dto";

export interface EditarReporteDTO {
  titulo: string;
  categoria: string;
  descripcion: string;
  ubicacion: UbicacionDTO;
  imagen: string[]; // corresponde a `List<String> imagen` en Java
}