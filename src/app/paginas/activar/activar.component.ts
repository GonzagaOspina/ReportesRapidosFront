import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  standalone: true,
  selector: 'app-activar',
  templateUrl: './activar.component.html',
  styleUrls: ['./activar.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class ActivarComponent implements OnInit {

  activarForm: FormGroup;
  errorActivar = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.activarForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.activarForm.patchValue({ email });
      }
    });
  }

  activarCuenta(): void {
    if (this.activarForm.invalid) return;

    const formValue = {
      email: this.activarForm.getRawValue().email,
      codigo: this.activarForm.value.codigo
    };

    this.usuariosService.activarUsuario(formValue.email, formValue.codigo)
      .subscribe({
        next: () => {
          alert('Cuenta activada correctamente ✅');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorActivar.set(true);
        }
      });
  }
}
