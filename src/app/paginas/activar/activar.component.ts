import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-activar',
  templateUrl: './activar.component.html',
  styleUrls: ['./activar.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ]
})
export class ActivarComponent implements OnInit {

  activarForm: FormGroup;
  errorActivar = signal(false); // Signal para usar con @if

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
      email: this.activarForm.getRawValue().email, // getRawValue() permite acceder a campos deshabilitados
      codigo: this.activarForm.value.codigo
    };

    this.http.post('http://localhost:8080/api/usuarios/activar', formValue)
      .subscribe({
        next: () => {
          alert('Cuenta activada correctamente ✅');
          this.router.navigate(['/login']); // O donde quieras redirigir
        },
        error: () => {
          this.errorActivar.set(true); // actualiza el signal
        }
      });
  }
}
