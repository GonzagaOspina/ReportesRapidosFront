import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../servicios/usuarios.service';
import { CrearUsuarioDTO } from '../../dto/usuario/crear-usuario-dto';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioDTO } from '../../dto/usuario/usuario-dto';
import { EditarUsuarioDTO } from '../../dto/usuario/editat-usuario0dto';
import { Ciudad } from '../../enum/ciudad.enum';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioDTO | null = null;
  registroForm!: FormGroup;
  titleForm: string = "";
  esPerfil: boolean = false;
  modoEdicion: boolean = false;
  ciudades =Object.entries(Ciudad);

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearFormulario();

    const rutaA = this.route.snapshot.url[0]?.path;
    this.esPerfil = rutaA === 'perfil';
    this.titleForm = this.esPerfil ? "Perfil cliente" : "Crear cuenta";

    if (this.esPerfil) {
      this.usuarioService.obtenerUsuario().subscribe({
        next: (res) => {
          this.usuario = res.mensaje;
          if (this.usuario) {
            this.registroForm.patchValue(this.usuario);
            Object.keys(this.registroForm.controls).forEach(control => {
              if (!['password', 'confirmarPassword'].includes(control)) {
                this.registroForm.get(control)?.disable();
              }
            });
          }
        },
        error: (err) => console.error("Error en la API:", err)
      });
    }
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],  // ✅ ahora sí existe
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  public registrar() {
    if (this.registroForm.invalid) return;

    const { confirmarPassword, ...dataSinConfirmar } = this.registroForm.value;

    const usuario: CrearUsuarioDTO = {
      ...dataSinConfirmar
    };

    this.usuarioService.crearUsuario(usuario).subscribe({
      next: () => {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        this.registroForm.reset();
        this.router.navigate(['/activar'], {
       queryParams: { email: usuario.email }
    })
      },
      error: (error) => {
        console.error("Error al registrar cliente", error);
        alert("Error al registrar. Por favor intenta de nuevo.");
      }
    });
  }

  public passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordsMismatch: true };
  }

  habilitarEdicion() {
    this.modoEdicion = true;
    Object.keys(this.registroForm.controls).forEach(control => {
      if (!['password', 'confirmarPassword'].includes(control)) {
        this.registroForm.get(control)?.enable();
      }
    });
  }

  guardarCambios() {
    if (this.registroForm.invalid) return;

    const formData = this.registroForm.getRawValue();

    const usuarioEditado: EditarUsuarioDTO = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion,
      ciudad: formData.email
    };

    this.usuarioService.editarUsuario(usuarioEditado).subscribe({
      next: () => {
        alert("Perfil actualizado correctamente.");
        this.modoEdicion = false;
        Object.keys(this.registroForm.controls).forEach(control => {
          this.registroForm.get(control)?.disable();
        });
      },
      error: (err) => {
        console.error("Error al guardar cambios", err);
        alert("Error al actualizar perfil.");
      }
    });
  }
}
