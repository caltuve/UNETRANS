import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AspiranteOpsuComponent } from './aspirante-opsu/aspirante-opsu.component' ;
import { AutopostuladosComponent } from './autopostulados/autopostulados.component';
import { ConvenioComponent } from './convenio/convenio.component';
import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { ReincorporacionComponent } from './reincorporacion/reincorporacion.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { MigracionComponent } from './migracion/migracion.component';

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
          title: 'Nuevo Ingreso - Aspirante OPSU'
        }
      },
      {
        path: 'convenio',
        component: ConvenioComponent,
        data: {
          title: 'Nuevo Ingreso - Convenio institucional'
        }
      },
      {
        path: 'autopostulados',
        component: AutopostuladosComponent,
        data: {
          title: 'Nuevo Ingreso - Autopostulados'
        }
      },
      {
        path: 'reincorporacion',
        component: ReincorporacionComponent,
        data: {
          title: 'Reincorporaciones'
        }
      },
      {
        path: 'expediente',
        component: ExpedienteComponent,
        data: {
          title: 'Expediente UNETRANS'
        }
      },
      {
        path: 'documentos',
        component: DocumentosComponent,
        data: {
          title: 'Documentos Académicos'
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
          title: 'Migración Estudiantil'
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
