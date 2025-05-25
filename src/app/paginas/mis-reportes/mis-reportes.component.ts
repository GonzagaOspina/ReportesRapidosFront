import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-mis-reportes',
  templateUrl: './mis-reportes.component.html',
  styleUrls: ['./mis-reportes.component.css'],
  imports: [FormsModule,CommonModule],
  standalone:true
})
export class MisReportesComponent implements OnInit {

  reportes: ReporteDTO[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private reportesService: ReportesService, private router: Router) {}

  ngOnInit(): void {
this.reportesService.obtenerReportesUsuario().subscribe({
  next: (data) => {
    this.reportes = data;
    this.cargando = false;
  },
  error: (err) => {
    this.error = '❌ Error al cargar tus reportes';
    this.cargando = false;
  }
});

  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'pendiente';
      case 'RESUELTO': return 'resuelto';
      case 'RECHAZADO': return 'rechazado';
      case 'VERIFICADO': return 'verificado';
      default: return '';
    }
  }

  irAEditar(id: string): void {
  this.router.navigate(['/editar-reporte', id]);
}
}
