import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RecuperarPasswordComponent {
  paso = 1;
  cargando = false;
  error: string | null = null;

  recuperarForm: FormGroup;
  nuevaPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.nuevaPasswordForm = this.fb.group({
      codigo: ['', Validators.required],
      nuevoPassword: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  enviarCodigo() {
    this.cargando = true;
    const email = this.recuperarForm.value.email;
    this.authService.solicitarCodigoRecuperacion(email).subscribe({
      next: () => {
        this.paso = 2;
        this.cargando = false;
      },
      error: (err) => {
        this.error = '❌ No se pudo enviar el código.';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  cambiarPassword() {
    if (this.nuevaPasswordForm.invalid) return;

    this.cargando = true;
    const email = this.recuperarForm.value.email;
    const { codigo, nuevoPassword } = this.nuevaPasswordForm.value;

    this.authService.cambiarPassword(email, codigo, nuevoPassword).subscribe({
      next: () => {
        alert('✅ Contraseña actualizada. Inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = '❌ No se pudo cambiar la contraseña.';
        console.error(err);
        this.cargando = false;
      }
    });
  }
}
