import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // ← Aquí importamos RouterModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'ReportesRapidos'; // ← Título personalizado para tu app
  isLoggedIn$!: Observable<boolean>;
  rolActual: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn(); // Reactivo al cambio de estado
    this.auth.rol$.subscribe(rol => {
      this.rolActual = rol; // Actualiza el rol actual
      console.log('Rol detectado:', this.rolActual); // Imprime el rol en la consola
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  fechaActual: string = new Date().toLocaleDateString('es-ES', {
  year: 'numeric', month: 'long', day: 'numeric'
});
}