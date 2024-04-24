import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { CargaCalificacionesComponent } from './carga-calificaciones/carga-calificaciones.component';
import { DetalleActaCalificacionesDocenteComponent } from './detalle-acta-calificaciones-docente/detalle-acta-calificaciones-docente.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestión académica'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mis-cursos'
      },
      {
        path: 'mis-cursos',
        component: MisCursosComponent,
        data: {
          title: 'Mis cursos'
        }
      },
      {
        path: 'carga-calificaciones',
        component: CargaCalificacionesComponent,
        data: {
          title: 'Cargar Calificaciones'
        }
      },
      {
        path: 'carga-calificaciones/detalle-acta-calificaciones-docente/:idActa',
        component: DetalleActaCalificacionesDocenteComponent,
        data: {
          title: 'Cargar Calificaciones - Detalle del acta'
        }
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocAcademicoRoutingModule { }
