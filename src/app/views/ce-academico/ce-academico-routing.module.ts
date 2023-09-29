import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component';
import { ProgramaAcademicoComponent } from './programa-academico/programa-academico.component';
import { GestionCuposComponent } from './gestion-cupos/gestion-cupos.component';
import { ConstantesGlobalesComponent } from './constantes-globales/constantes-globales.component';
import { MallaAcademicaComponent } from './malla-academica/malla-academica.component';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Control de Estudios - Académico'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'consultar-datos'
      },
      {
        path: 'calendario-academico',
        component: CalendarioAcademicoComponent,
        data: {
          title: 'Calendario académico'
        }
      },
      {
        path: 'periodo-academico',
        component: PeriodoAcademicoComponent,
        data: {
          title: 'Gestión de periodo académico'
        }
      },
      {
        path: 'programa-academico',
        component: ProgramaAcademicoComponent,
        data: {
          title: 'Programas Académicos'
        }
      },
      {
        path: 'gestion-cupos',
        component: GestionCuposComponent,
        data: {
          title: 'Gestion de cupos'
        }
      },
      {
        path: 'constantes-globales',
        component: ConstantesGlobalesComponent,
        data: {
          title: 'Constantes globales'
        }
      },
      {
        path: 'mallas-academica',
        component: MallaAcademicaComponent,
        data: {
          title: 'Mantenimiento de Mallas Curriculares'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CeAcademicoRoutingModule { }
