import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { ActivarComponent } from './paginas/activar/activar.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CambiarPasswordComponent } from './paginas/cambiar-password/cambiar-password.component';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'activar', component: ActivarComponent },
   { path: 'perfil', component: PerfilComponent },
   { path: 'cambiar-password', component: CambiarPasswordComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }

];
