import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../servicios/reportes.service';
import { MapaService } from '../../servicios/mapa.service';
import { CategoriaDTO } from '../../servicios/reportes.service';
import { EditarReporteDTO } from '../../dto/reporte/editar-reporte-dto';
import { ReporteDTO } from '../../dto/reporte/reporte-dto';

@Component({
  selector: 'app-editar-reporte',
  templateUrl: './editar-reporte.component.html',
  styleUrls: ['./editar-reporte.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditarReporteComponent implements OnInit {

  editarReporteForm!: FormGroup;
  categorias: CategoriaDTO[] = [];
  categoriaSeleccionadaDescripcion = '';
  imagenesUrl: string[] = [];
  cargandoImagen = false;
  reporteId: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reporteService: ReportesService,
    private mapaService: MapaService
  ) {}

  ngOnInit(): void {
    this.reporteId = this.route.snapshot.paramMap.get('id') || '';
    this.crearFormulario();
    this.cargarCategorias();
    this.inicializarMapa();

    if (this.reporteId) {
      this.cargarDatosDelReporte();
    }
  }

  private crearFormulario() {
    this.editarReporteForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      ciudad: ['', Validators.required],
      ubicacion: this.fb.group({
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      })
    });
  }

  private cargarCategorias() {
    this.reporteService.obtenerCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.error = 'No se pudieron cargar las categorías';
      }
    });
  }

  private cargarDatosDelReporte() {
    this.reporteService.obtenerReportePorId(this.reporteId).subscribe({
      next: (reporte: ReporteDTO) => {
        if (!reporte.ubicacion) {
          console.warn('⚠️ Reporte sin ubicación, se usará valor por defecto');
          reporte.ubicacion = { latitud: 4.5321, longitud: -75.6757 };
        }

        this.editarReporteForm.patchValue({
          titulo: reporte.titulo,
          descripcion: reporte.descripcion,
          categoria: reporte.categoria,
          ciudad: reporte.ciudad,
          ubicacion: {
            latitud: reporte.ubicacion.latitud,
            longitud: reporte.ubicacion.longitud
          }
        });

        this.imagenesUrl = reporte.imagenes || [];

        const cat = this.categorias.find(c => c.id === reporte.categoria);
        this.categoriaSeleccionadaDescripcion = cat ? cat.descripcion : '';
      },
      error: (err) => {
        console.error('Error al obtener reporte por ID:', err);
        this.error = 'No se pudo cargar la información del reporte';
      }
    });
  }

  private inicializarMapa() {
    this.mapaService.crearMapa();
    this.mapaService.agregarMarcador().subscribe((marcador: { lat: number; lng: number }) => {
      this.editarReporteForm.get('ubicacion')?.setValue({
        latitud: marcador.lat,
        longitud: marcador.lng,
      });
    });
  }

  onArchivoSeleccionado(event: any): void {
    const archivos: FileList = event.target.files;
    if (archivos.length === 0) return;

    for (let i = 0; i < archivos.length; i++) {
      this.subirImagenACloudinary(archivos[i]);
    }
  }

  subirImagenACloudinary(archivo: File): void {
    this.cargandoImagen = true;

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', 'reportes-rapidos');

    fetch('https://api.cloudinary.com/v1_1/dgniqy2kw/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          this.imagenesUrl.push(data.secure_url);
          console.log('✅ Imagen subida:', data.secure_url);
        } else {
          alert('❌ No se pudo obtener la URL de la imagen');
        }
      })
      .catch(error => {
        console.error('❌ Error al subir imagen:', error);
        alert('Error al subir una imagen. Inténtalo de nuevo.');
      })
      .finally(() => {
        this.cargandoImagen = false;
      });
  }

  actualizarReporte() {
    if (this.editarReporteForm.invalid) {
      alert('❌ Completa todos los campos');
      return;
    }

    if (this.imagenesUrl.length === 0) {
      alert('❌ Sube al menos una imagen');
      return;
    }

    if (this.cargandoImagen) {
      alert('⏳ Espera a que terminen de subir todas las imágenes');
      return;
    }

    const formValue = this.editarReporteForm.value;

    const dto: EditarReporteDTO = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      categoria: formValue.categoria,
      ubicacion: {
        latitud: formValue.ubicacion.latitud,
        longitud: formValue.ubicacion.longitud
      },
      imagen: this.imagenesUrl
    };

    this.reporteService.editarReporte(this.reporteId, dto).subscribe({
      next: () => {
        alert('✅ Reporte actualizado con éxito');
        this.router.navigate(['/mis-reportes']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al actualizar reporte: ' + err.message);
      }
    });
  }
}
