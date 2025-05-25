import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css'],
  imports: [CommonModule],
})
export class DetalleReporteComponent implements OnInit {
  reporte!: ReporteDTO;
  imagenActual: number = 0;
  ubicacionTexto: string = '';

  constructor(
    private route: ActivatedRoute,
    private reporteService: ReportesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reporteService.obtenerReportePorId(id).subscribe({
        next: (r) => {
          this.reporte = r;
          if (!this.reporte.ubicacion) {
            this.ubicacionTexto = 'Sin ubicación registrada';
          } else {
            this.ubicacionTexto = `Lat: ${this.reporte.ubicacion.latitud}, Lng: ${this.reporte.ubicacion.longitud}`;
          }
        },
        error: (err) => {
          console.error('❌ Error cargando reporte', err);
        }
      });
    }
  }

  anterior() {
    if (this.reporte.imagenes?.length) {
      this.imagenActual = (this.imagenActual - 1 + this.reporte.imagenes.length) % this.reporte.imagenes.length;
    }
  }

  siguiente() {
    if (this.reporte.imagenes?.length) {
      this.imagenActual = (this.imagenActual + 1) % this.reporte.imagenes.length;
    }
  }

  verEnMapa() {
    const lat = this.reporte.ubicacion?.latitud;
    const lng = this.reporte.ubicacion?.longitud;
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  }

  marcarImportante(positivo: boolean): void {
  if (!this.reporte?.id) {
    console.error('❌ ID de reporte no disponible');
    return;
  }

  if (positivo) {
    this.reporteService.marcarImportante(this.reporte.id).subscribe({
      next: () => alert('✅ ¡Gracias por tu voto!'),
      error: (err) => alert('❌ Error al marcar como importante: ' + err.error?.respuesta || err.message)
    });
  } else {
    alert('❌ ¡Voto negativo registrado (solo visual)!');
    // Si quisieras registrar también el voto negativo, puedes hacer otro endpoint
  }
}

}
