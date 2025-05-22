import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportesService } from '../../servicios/reportes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapaService } from '../../servicios/mapa.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearReporteDTO } from '../../dto/reporte/crear-reporte-dto';

@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class CrearReporteComponent implements OnInit {

  crearReporteForm!: FormGroup;
  categorias: { id: string, nombre: string }[] = [];
  imagenesUrl: string[] = [];
  cargandoImagen: boolean = false; // 🌀 Muestra spinner mientras se sube
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private reporteService: ReportesService,
    private router: Router,
    private mapaService: MapaService
  ) {}

  ngOnInit(): void {
    this.crearReporteForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      ciudad: ['', Validators.required],
      ubicacion: this.fb.group({
        latitud: [4.5321, Validators.required],   // Armenia por defecto
        longitud: [-75.6757, Validators.required]
      }),
    });

    this.obtenerCategorias();
    // Suscribirse al marcador del mapa
    this.mapaService.crearMapa();
    this.mapaService.agregarMarcador().subscribe((marcador: { lat: number, lng: number }) => {
      this.crearReporteForm.get('ubicacion')?.setValue({
        latitud: marcador.lat,
        longitud: marcador.lng,
      });
    });
  }

  obtenerCategorias() {
    this.reporteService.obtenerCategorias().subscribe({
      next: (cats) => this.categorias = cats,
      error: () => this.mensajeError = 'No se pudieron cargar las categorías'
    });
  }

  ubicarEnMapa() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.crearReporteForm.patchValue({
          ubicacion: {
            latitud: pos.coords.latitude,
            longitud: pos.coords.longitude
          }
        });
      });
    } else {
      alert('Geolocalización no soportada por el navegador');
    }
  }

  onArchivoSeleccionado(event: any): void {
    const archivos: FileList = event.target.files;
    if (archivos.length === 0) return;

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      this.subirImagenACloudinary(archivo);
    }
  }

  subirImagenACloudinary(archivo: File): void {
    this.cargandoImagen = true;

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', 'reportes-rapidos'); // ⚠️ Tu upload_preset
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

  crearReporte() {
    if (this.crearReporteForm.invalid) {
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

    const formValue = this.crearReporteForm.value;

    const dto: CrearReporteDTO = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      categoria: formValue.categoria,
      ciudad: formValue.ciudad,
      ubicacion: {
        latitud: formValue.ubicacion.latitud,
        longitud: formValue.ubicacion.longitud
      },
      imagenes: this.imagenesUrl
    };

    this.reporteService.crearReporte(dto).subscribe({
      next: () => {
        alert('✅ Reporte creado con éxito');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al crear reporte: ' + err.message);
      }
    });
  }
}
