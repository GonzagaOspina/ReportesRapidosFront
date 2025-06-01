import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';
import { CommonModule } from '@angular/common';
import { Comentario } from '../../dto/comentario/comentario-dto';
import { AuthService } from '../../servicios/auth.service';
import { ComentarioService } from '../../servicios/comentario.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css'],
  imports: [CommonModule,FormsModule],
})
export class DetalleReporteComponent implements OnInit {
  reporte!: ReporteDTO;
  imagenActual: number = 0;
  ubicacionTexto: string = '';
  comentarios: Comentario[] = [];
  nuevoComentario: string = '';
  userId: string | null = null;
  comentarioEditando: Comentario | null = null;



constructor(
  private route: ActivatedRoute,
  private reporteService: ReportesService,
  private authService: AuthService,
  private comentarioService: ComentarioService
) {}


  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.userId = this.authService.getUserIdFromToken(); // ✅ CLAVE

  console.log('📦 ID recibido:', id);
  console.log('👤 Usuario actual:', this.userId);

  if (id) {
    this.reporteService.obtenerReportePorId(id).subscribe({
      next: (r) => {
        this.reporte = r;
        this.ubicacionTexto = r.ubicacion
          ? `Lat: ${r.ubicacion.latitud}, Lng: ${r.ubicacion.longitud}`
          : 'Sin ubicación registrada';

        this.cargarComentarios(r.id); // ✅ Aquí cargamos comentarios
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
  publicarComentario() {
  const userId = this.authService.getUserIdFromToken();
  if (!userId || !this.nuevoComentario.trim()) return;

  const dto = {
    idUsuario: userId,
    comentario: this.nuevoComentario.trim(),
    idReporte: this.reporte.id
  };

  this.comentarioService.crearComentario(dto).subscribe({
    next: () => {
      this.nuevoComentario = '';
      this.cargarComentarios(this.reporte.id); // Recarga comentarios
    },
    error: err => {
      console.error('❌ Error al comentar', err);
      alert('No se pudo enviar el comentario');
    }
  });
}
  verEnMapa() {
    const lat = this.reporte.ubicacion?.latitud;
    const lng = this.reporte.ubicacion?.longitud;
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  }
cargarComentarios(idReporte: string) {
this.comentarioService.obtenerComentariosPorReporte(this.reporte.id).subscribe({
  next: (data) => {
    console.log("Respuesta completa del backend:", data);
    if (!data.error && Array.isArray(data.respuesta)) {
      this.comentarios = data.respuesta;
      console.log("✅ Comentarios recibidos:", this.comentarios);
    } else {
      console.warn("⚠️ La respuesta no contiene un arreglo de comentarios.");
      this.comentarios = [];
    }
  },
  error: (err) => {
    console.error("❌ Error al obtener comentarios:", err);
    this.comentarios = [];
  }
});

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
editarComentario(comentario: Comentario): void {
  this.comentarioEditando = { ...comentario }; // Clona para edición
}

cancelarEdicion(): void {
  this.comentarioEditando = null;
}

guardarEdicion(): void {
  if (!this.comentarioEditando) return;

  const { id, mensaje } = this.comentarioEditando;
  if (!mensaje.trim()) {
    alert('⚠️ El comentario no puede estar vacío');
    return;
  }

  this.comentarioService.editarComentario(id, mensaje).subscribe({
    next: () => {
      this.cargarComentarios(this.reporte.id);
      this.comentarioEditando = null;
    },
    error: err => {
      console.error("❌ Error al guardar comentario", err);
      alert("No se pudo editar el comentario");
    }
  });
}

eliminarComentario(idComentario: string): void {
  if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;

  this.comentarioService.eliminarComentario(idComentario).subscribe({
    next: () => {
      this.comentarios = this.comentarios.filter(c => c.id !== idComentario);
    },
    error: err => {
      console.error("❌ Error al eliminar comentario", err);
      alert("No se pudo eliminar el comentario");
    }
  });
}

}
