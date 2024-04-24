import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomigraEstudianteComponent } from './automigra-estudiante/automigra-estudiante.component';
import { LoginMigraestudianteComponent } from './login-migraestudiante/login-migraestudiante.component';


const routes: Routes = [
  {
    path: 'login-migraestudiante',
    component: LoginMigraestudianteComponent,
    data: {
      title: 'Login Estudiante - Migración'
    }
  },
  {
    path: 'automigra-estudiante',
    component: AutomigraEstudianteComponent,
    data: {
      title: 'Automigración'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigraestudiantesRoutingModule { }
