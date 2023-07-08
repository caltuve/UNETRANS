import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAspiranteComponent } from './login-aspirante/login-aspirante.component';
import { AutomatriculacionComponent } from './automatriculacion/automatriculacion.component';


const routes: Routes = [
  {
    path: 'login-aspirante',
    component: LoginAspiranteComponent,
    data: {
      title: 'Login Aspirante'
    }
  },
  {
    path: 'automatriculacion',
    component: AutomatriculacionComponent,
    data: {
      title: 'Registro Aspirante'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AspiranteRoutingModule { }
