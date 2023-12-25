import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoregistroDocenteComponent } from './autoregistro-docente/autoregistro-docente.component';
import { LoginDocenteComponent } from './login-docente/login-docente.component';

const routes: Routes = [
  {
    path: 'login-administrativo',
    component: LoginDocenteComponent,
    data: {
      title: 'Login Docente'
    }
  }, 
  {
    path: 'autoregistro',
    component: AutoregistroDocenteComponent,
    data: {
      title: 'Autoregistro'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentesRoutingModule { }
