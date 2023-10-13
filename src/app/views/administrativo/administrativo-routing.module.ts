import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdministrativoComponent } from './login-administrativo/login-administrativo.component';
import { AutoregistroComponent } from './autoregistro/autoregistro.component';

const routes: Routes = [
  {
    path: 'login-administrativo',
    component: LoginAdministrativoComponent,
    data: {
      title: 'Login Administrativo'
    }
  },
  {
    path: 'autoregistro',
    component: AutoregistroComponent,
    data: {
      title: 'Autoregistro'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
