import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reportes: ReporteDTO[] = [];
  cargando = true;
  error = '';

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.reportesService.obtenerReportes().subscribe({
      next: (res) => {
        this.reportes = res;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los reportes';
        console.error(err);
        this.cargando = false;
      }
    });
  }
  getEstadoClass(estado: string): string {
  switch (estado) {
    case 'PENDIENTE': return 'estado-pendiente';
    case 'EN_PROCESO': return 'estado-en-proceso';
    case 'RESUELTO': return 'estado-resuelto';
    case 'RECHAZADO': return 'estado-rechazado';
    default: return '';
  }
}

}
