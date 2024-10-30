import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentosComponent } from './documentos/documentos.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Solicitudes'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'documentos'
      },
      {
        path: 'documentos',
        component: DocumentosComponent,
        data: {
          title: 'Documentos-Constancias'
        }
      },
      { path: 'documentos/nueva-solicitud', 
        component: NuevaSolicitudComponent,
        data: {
          title: 'Documentos-Constancias - Nueva solicitud'
        } 
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstSolicitudRoutingModule { }
