import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
 selector: 'app-registro',
 imports: [CommonModule,ReactiveFormsModule],
 templateUrl: './registro.component.html',
 styleUrl: './registro.component.css'
})
export class RegistroComponent{


 registroForm!: FormGroup;


 constructor(private formBuilder: FormBuilder) {
  this.crearFormulario();
  }

private crearFormulario() {
 this.registroForm = this.formBuilder.group({     
   nombre: ['', [Validators.required]],
   telefono: ['', [Validators.required, Validators.maxLength(10)]],
   ciudad: ['', [Validators.required]],
   direccion: ['', [Validators.required]],
   email: ['', [Validators.required, Validators.email]],     
   password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
   confirmarPassword: ['',[Validators.required,Validators.maxLength(10),Validators.minLength(7)]]
  },{ validators: this.passwordsMatchValidator } as AbstractControlOptions
);
 }
public registrar() {
   console.log(this.registroForm.value);
}
public passwordsMatchValidator(formGroup: FormGroup) {
 const password = formGroup.get('password')?.value;
 const confirmarPassword = formGroup.get('confirmarPassword')?.value;


 // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
 return password == confirmarPassword ? null : { passwordsMismatch: true };
}

}
