import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false; // <-- agrega esta línea

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true; // <-- activa el loading
    const { email, password } = this.loginForm.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.isLoading = false; // <-- desactiva al terminar
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.isLoading = false; // <-- desactiva al fallar
        console.error('ERROR completo:', err); // 🔥 AÑADE ESTO
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }
}