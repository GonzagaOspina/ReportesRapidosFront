import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../servicios/reportes.service';
import { CategoriaDTO } from '../../dto/categoria/categoria-dto';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../servicios/categoria.service';
@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: CategoriaDTO[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private reportesService: ReportesService,private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.cargando = true;
    this.reportesService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = '❌ Error al cargar categorías';
        this.cargando = false;
      }
    });
  }



eliminarCategoria(id: string) {
  if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
    this.cargando = true;
    this.categoriaService.eliminarCategoria(id).subscribe({
      next: () => {
        alert('✅ Categoría eliminada correctamente');
        this.obtenerCategorias(); // Recarga la lista
      },
      error: (err) => {
        console.error(err);
        alert('❌ No se pudo eliminar la categoría');
        this.cargando = false;
      }
    });
  }
}

}
