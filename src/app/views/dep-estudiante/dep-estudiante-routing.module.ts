import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { MigracionComponent } from './migracion/migracion.component';
import { ConveniosComponent } from './convenios/convenios.component';
import { ConsultaDetalleAcademicoComponent } from './consulta-detalle-academico/consulta-detalle-academico.component';

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
      { path: 'consultar-datos/consulta-detalle-academico/:id', 
        component: ConsultaDetalleAcademicoComponent,
        data: {
          title: 'Consultar datos - Detalles Académicos'
        } 
      },
      {
        path: 'inscripcion',
        component: InscripcionComponent,
        data: {
          title: 'Inscribir estudiante'
        }
      },
      {
        path: 'migracion',
        component: MigracionComponent,
        data: {
          title: 'Migración estudiantil'
        }
      },
      {
        path: 'convenios',
        component: ConveniosComponent,
        data: {
          title: 'Aspirantes  por convenio'
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
