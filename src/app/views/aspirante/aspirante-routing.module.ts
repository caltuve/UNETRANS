import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAspiranteComponent } from './login-aspirante/login-aspirante.component';
import { AutomatriculacionComponent } from './automatriculacion/automatriculacion.component';
import { AutopostulacionComponent } from './autopostulacion/autopostulacion.component'; 


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
      title: 'Automatriculación'
    }
  },
  {
    path: 'autopostulacion',
    component: AutopostulacionComponent,
    data: {
      title: 'Autopostulación'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AspiranteRoutingModule { }
