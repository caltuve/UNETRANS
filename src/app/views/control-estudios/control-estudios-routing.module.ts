import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AspiranteOpsuComponent } from './aspirante-opsu/aspirante-opsu.component';
import { CrearNuevoComponent } from './crear-nuevo/crear-nuevo.component';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';
import { AutopostuladosComponent } from './autopostulados/autopostulados.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Control de Estudios'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'consultar-datos'
      },
      {
        path: 'consultar-datos',
        component: ConsultarDatosComponent,
        data: {
          title: 'Consultar datos'
        }
      },
      {
        path: 'aspirante-opsu',
        component: AspiranteOpsuComponent,
        data: {
          title: 'Aspirante OPSU'
        }
      },
      {
        path: 'autopostulados',
        component: AutopostuladosComponent,
        data: {
          title: 'Autopostulados'
        }
      },
      {
        path: 'crear-nuevo',
        component: CrearNuevoComponent,
        data: {
          title: 'Crear nuevo estudiante'
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
export class ControlEstudiosRoutingModule { }
