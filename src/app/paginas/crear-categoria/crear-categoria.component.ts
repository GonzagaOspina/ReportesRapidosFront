import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService } from '../../servicios/categoria.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CrearCategoriaComponent implements OnInit {

  categoriaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {

    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    if (!this.authService.isModerador()) {
      alert('❌ No tienes permiso para acceder a esta página');
      this.router.navigate(['/']);
    }
  }

  crearCategoria() {
    if (this.categoriaForm.invalid) {
      alert('❗Completa todos los campos');
      return;
    }

    this.categoriaService.crearCategoria(this.categoriaForm.value).subscribe({
      next: () => {
        alert('✅ Categoría creada correctamente');
        this.router.navigate(['/moderador']); // o donde redirecciones después
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al crear categoría: ' + err.error?.mensaje);
      }
    });
  }
}
