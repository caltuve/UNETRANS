import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AspiranteOpsuComponent } from './aspirante-opsu/aspirante-opsu.component' ;
import { AutopostuladosComponent } from './autopostulados/autopostulados.component';
import { ConvenioComponent } from './convenio/convenio.component';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Control de Estudios - Nuevo Ingreso'
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
        path: 'convenio',
        component: ConvenioComponent,
        data: {
          title: 'Convenio institucional'
        }
      },
      {
        path: 'autopostulados',
        component: AutopostuladosComponent,
        data: {
          title: 'Autopostulados'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CeNuevoingresoRoutingModule { }
