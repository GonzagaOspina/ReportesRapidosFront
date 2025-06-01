import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService, CategoriaDTO } from '../../servicios/categoria.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  templateUrl: './editar-categorias.component.html',
  styleUrls: ['./editar-categorias.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // 👈 ¡Esto es lo que faltaba!
})
export class EditarCategoriaComponent implements OnInit {
  categoriaForm!: FormGroup;
  categoriaId!: string;
  cargando = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.paramMap.get('id')!;
    this.crearFormulario();
    this.cargarCategoria();
  }

  crearFormulario() {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  cargarCategoria() {
    this.cargando = true;
    this.categoriaService.obtenerCategoriaPorId(this.categoriaId).subscribe({
      next: (cat: CategoriaDTO) => {
        this.categoriaForm.patchValue(cat);
        this.cargando = false;
      },
      error: (err) => {
        this.error = '❌ Error al cargar la categoría';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  actualizarCategoria() {
    if (this.categoriaForm.invalid) {
      alert('❌ Por favor completa todos los campos');
      return;
    }

    const categoriaActualizada: CategoriaDTO = {
      ...this.categoriaForm.value
    };

    this.categoriaService.editarCategoria(this.categoriaId, categoriaActualizada).subscribe({
      next: () => {
        alert('✅ Categoría actualizada exitosamente');
        this.router.navigate(['/categorias']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ No se pudo actualizar la categoría');
      }
    });
  }
}
