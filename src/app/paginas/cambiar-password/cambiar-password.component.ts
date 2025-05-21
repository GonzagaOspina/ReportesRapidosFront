import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css'],
  imports: [FormsModule,CommonModule]
})
export class CambiarPasswordComponent {
  formCambioClave = {
    actual: '',
    nueva: '',
    repetida: ''
  };

  errorCambioClave = '';
  exitoCambioClave = '';

  constructor(private usuarioService: UsuariosService, private router: Router) {}

  cambiarContrasena() {
    this.errorCambioClave = '';
    this.exitoCambioClave = '';

    const { actual, nueva, repetida } = this.formCambioClave;

    if (!actual || !nueva || !repetida) {
      this.errorCambioClave = 'Todos los campos son obligatorios';
      return;
    }

    if (nueva !== repetida) {
      this.errorCambioClave = 'Las nuevas contraseñas no coinciden';
      return;
    }

    this.usuarioService.cambiarContrasena(actual, nueva).subscribe({
      next: res => {
        this.exitoCambioClave = 'Contraseña actualizada correctamente ✅';
        this.formCambioClave = { actual: '', nueva: '', repetida: '' };
        setTimeout(() => this.router.navigate(['/perfil']), 2000);
      },
      error: err => {
        console.error(err);
        this.errorCambioClave = err?.error?.mensaje || 'Error al cambiar contraseña';
      }
    });
  }
}
