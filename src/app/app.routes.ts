import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { ActivarComponent } from './paginas/activar/activar.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CambiarPasswordComponent } from './paginas/cambiar-password/cambiar-password.component';
import { CrearReporteComponent } from './paginas/crear-reporte/crear-reporte.component';
import { ClienteGuard } from './servicios/cliente.guard';
import { GestionarReportesComponent } from './paginas/gestionar-reporte/gestionar-reporte.component';
import { CategoriasComponent } from './paginas/categorias/categorias.component';
import { CrearCategoriaComponent } from './paginas/crear-categoria/crear-categoria.component';
import { DetalleReporteComponent } from './paginas/detalle-reporte/detalle-reporte.component';
import { EditarReporteComponent } from './paginas/editar-reporte/editar-reporte.component';
import { MisReportesComponent } from './paginas/mis-reportes/mis-reportes.component';
import { RecuperarPasswordComponent } from './paginas/recuperar-password/recuperar-password.component';
import { ReportesComponent } from './paginas/reportes/reportes.component';
import { EditarCategoriaComponent } from './paginas/editar-categorias/editar-categorias.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'activar', component: ActivarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'cambiar-password', component: CambiarPasswordComponent },
  { path: 'crear-reporte', component: CrearReporteComponent, canActivate: [ClienteGuard] },
  { path: 'editar-reporte/:id', component: EditarReporteComponent }, 
  { path: 'detalle-reporte/:id', component: DetalleReporteComponent }, 
  { path: 'editar-categorias/:id', component: EditarCategoriaComponent},
  { path: 'gestionar-reporte', component: GestionarReportesComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'crear-categoria', component: CrearCategoriaComponent },
  { path: 'mis-reportes', component: MisReportesComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];
