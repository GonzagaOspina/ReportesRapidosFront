import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';

@Component({
  selector: 'app-gestionar-reporte',
  templateUrl: './gestionar-reporte.component.html',
  styleUrls: ['./gestionar-reporte.component.css'],
    imports: [CommonModule, FormsModule], 
    standalone:true

})
export class GestionarReportesComponent implements OnInit {
  reportes: any[] = [];

  constructor(private reportesService: ReportesService) {}

ngOnInit(): void {
  this.reportesService.obtenerReportes().subscribe({
  next: (data: ReporteDTO[]) => {
    this.reportes = data.map((r: ReporteDTO) => ({
      ...r,
      nuevoEstado: r.estadoActual,
      motivo: ''
    }));
  },
  error: (err: any) => console.error('Error al cargar reportes:', err)
});

}


  cambiarEstado(reporte: any): void {
    if (!reporte.nuevoEstado || !reporte.motivo) {
      alert('❗ Debes seleccionar un estado y motivo');
      return;
    }

    this.reportesService.cambiarEstadoReporte(reporte.id, {
      nuevoEstado: reporte.nuevoEstado,
      motivo: reporte.motivo
    }).subscribe({
      next: () => {
        alert('✅ Estado actualizado');
        this.reportes = this.reportes.filter(r => r.id !== reporte.id);
      },
      error: err => {
        console.error(err);
        alert('❌ Error al cambiar estado');
      }
    });
  }
  getEstadoClass(estado: string): string {
  switch (estado) {
    case 'PENDIENTE': return 'estado-pendiente';
    case 'RESUELTO': return 'estado-resuelto';
    case 'VERIFICADO': return 'estado-verificado';
    case 'RECHAZADO': return 'estado-rechazado';
    case 'ELIMINADO': return 'estado-eliminado';
    default: return '';
  }
}

}
