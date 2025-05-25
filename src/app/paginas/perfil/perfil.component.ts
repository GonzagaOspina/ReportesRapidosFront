import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { UsuarioDTO } from '../../dto/usuario/usuario-dto';
import { EditarUsuarioDTO } from '../../dto/usuario/editat-usuario-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ciudad } from '../../enum/ciudad.enum';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  mostrarCambioClave = false;

  formCambioClave = {
  actual: '',
  nueva: '',
  repetida: ''
};

errorCambioClave = '';
exitoCambioClave = '';

  ciudades = Object.entries(Ciudad); // [['MEDELLIN', 'Medellín'], ...]

  usuario!: UsuarioDTO;
  usuarioEditado: EditarUsuarioDTO = {} as EditarUsuarioDTO;
  editando: boolean = false;
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuariosService,
    public router: Router
  ) {}

ngOnInit(): void {
  this.usuarioService.obtenerUsuario().subscribe({
    next: (res) => {
      this.usuario = res.respuesta; // ✅ CAMBIO AQUÍ
      if (this.usuario) {
        this.usuarioEditado = this.mapUsuarioToDTO(this.usuario);
      } else {
        console.warn('⚠️ El perfil recibido está vacío');
      }
      this.cargando = false;
    },
    error: (err) => {
      console.error('❌ Error al cargar el perfil:', err);
      this.error = err?.error?.respuesta || 'No tienes permisos para acceder a este recurso.';
      this.cargando = false;
    }
  });
}


  activarEdicion(): void {
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.usuarioEditado = this.mapUsuarioToDTO(this.usuario);
  }

  actualizarUsuario(): void {
    this.usuarioService.editarUsuario(this.usuarioEditado).subscribe({
      next: () => {
        this.usuario = { ...this.usuario, ...this.usuarioEditado };
        this.editando = false;
        alert('Perfil actualizado con éxito ✅');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('❌ Error al actualizar el perfil');
      }
    });
  }

  eliminarCuenta(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.usuarioService.eliminarUsuario().subscribe({
        next: () => {
          this.authService.logout();
          alert('Cuenta eliminada con éxito');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al eliminar cuenta:', err);
          alert('❌ No se pudo eliminar la cuenta');
        }
      });
    }
  }

  private mapUsuarioToDTO(usuario: UsuarioDTO): EditarUsuarioDTO {
    return {
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      ciudad: usuario.ciudad
    };
  }
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
      this.exitoCambioClave = 'Contraseña actualizada correctamente';
      this.formCambioClave = { actual: '', nueva: '', repetida: '' };
      this.mostrarCambioClave = false;
    },
    error: err => {
      console.error(err);
      this.errorCambioClave = 'Error al cambiar contraseña';
    }
  });
}
irACambiarPassword(): void {
  this.router.navigate(['/cambiar-password']);
}
}
