import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { ActivarComponent } from './paginas/activar/activar.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CambiarPasswordComponent } from './paginas/cambiar-password/cambiar-password.component';
import { CrearReporteComponent } from './paginas/crear-reporte/crear-reporte.component';
import { ClienteGuard } from './servicios/cliente.guard';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'activar', component: ActivarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'cambiar-password', component: CambiarPasswordComponent },
  { path: 'crear-reporte', component: CrearReporteComponent, canActivate: [ClienteGuard] }, // ✅ aquí está protegido
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

