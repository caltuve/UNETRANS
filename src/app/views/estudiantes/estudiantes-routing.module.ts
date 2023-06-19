import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CrearNuevoComponent } from './crear-nuevo/crear-nuevo.component';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Estudiantes'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'consultar-datos'
      },
      {
        path: 'crear-nuevo',
        component: CrearNuevoComponent,
        data: {
          title: 'Crear nuevo estudiante555'
        }
      },
      {
        path: 'consultar-datos',
        component: ConsultarDatosComponent,
        data: {
          title: 'Consultar datos'
        }
      },
      {
        path: 'expediente-digital',
        component: ExpedienteDigitalComponent,
        data: {
          title: 'Expediente Digital'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudiantesRoutingModule { }
