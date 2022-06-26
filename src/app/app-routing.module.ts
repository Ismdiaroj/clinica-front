import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AyudaComponent } from './Components/ayuda/ayuda.component';
import { ConsultasFormComponent } from './Components/consultas/consultas-form/consultas-form.component';
import { ConsultasComponent } from './Components/consultas/consultas.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { AuthLoggedGuard } from './Components/login/guards/auth-logged.guard';
import { AuthGuard } from './Components/login/guards/auth.guard';
import { LoginComponent } from './Components/login/login.component';
import { PacientesFormComponent } from './Components/pacientes/pacientes-form/pacientes-form.component';
import { PacientesComponent } from './Components/pacientes/pacientes.component';
import { PerfilComponent } from './Components/perfil/perfil.component';

const routes: Routes = [
  // Ruta predeterminada
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'inicio'
  },

  // Inicio

  {
    path: 'inicio',
    component: InicioComponent
  },

  //Login

  {
    path: 'login',
    component: LoginComponent
  },

  //Pacientes
  {
    path: 'usuarios',
    component: PacientesComponent,
    canActivate:[AuthGuard]
  },

  //Form Pacientes
  {
    path: 'usuarios/form',
    component: PacientesFormComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'usuarios/form/:id',
    component: PacientesFormComponent,
    canActivate:[AuthGuard]
  },

  //Consultas Pacientes
  {
    path: 'usuarios/consultas/:id',
    component: ConsultasComponent,
    canActivate:[AuthGuard]
  },

  // Formulario Consulta de un Paciente
  {
    path: 'consultas/form/:idPaciente',
    component: ConsultasFormComponent,
    canActivate:[AuthLoggedGuard]
  },
  {
    path: 'consultas/form/:idPaciente/:idConsulta',
    component: ConsultasFormComponent,
    canActivate:[AuthGuard]
  },

  //Perfil
  {
    path: 'perfil/:idUsuario',
    component: PerfilComponent,
    canActivate:[AuthLoggedGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
