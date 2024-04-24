import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Departamento académico'
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
        path: 'inscripcion',
        component: InscripcionComponent,
        data: {
          title: 'Inscribir estudiante'
        }
      },
      // {
      //   path: 'aspirante-opsu',
      //   component: AspiranteOpsuComponent,
      //   data: {
      //     title: 'Nuevo Ingreso - Aspirante OPSU'
      //   }
      // },
      // {
      //   path: 'convenio',
      //   component: ConvenioComponent,
      //   data: {
      //     title: 'Nuevo Ingreso - Convenio institucional'
      //   }
      // },
      // {
      //   path: 'autopostulados',
      //   component: AutopostuladosComponent,
      //   data: {
      //     title: 'Nuevo Ingreso - Autopostulados'
      //   }
      // },
      // {
      //   path: 'reincorporacion',
      //   component: ReincorporacionComponent,
      //   data: {
      //     title: 'Reincorporaciones'
      //   }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepEstudianteRoutingModule { }
