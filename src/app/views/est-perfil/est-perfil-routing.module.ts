import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallePerfilComponent } from './detalle-perfil/detalle-perfil.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Perfil'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'detalle-perfil'
      },
      {
        path: 'detalle-perfil',
        component: DetallePerfilComponent,
        data: {
          title: 'Datos del perfil estudiantil'
        }
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstPerfilRoutingModule { }
