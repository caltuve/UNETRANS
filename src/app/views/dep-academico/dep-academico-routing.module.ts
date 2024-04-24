import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionCuposComponent } from './gestion-cupos/gestion-cupos.component';
import { MallaAcademicaComponent } from './malla-academica/malla-academica.component';
import { GestionDocenteComponent } from './gestion-docente/gestion-docente.component';
import { ProgramaAcademicoComponent } from './programa-academico/programa-academico.component';
import { GestionPlanEstudiosComponent } from './gestion-plan-estudios/gestion-plan-estudios.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Departamento académico - Gestión administrativa'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'gestion-cupos'
      },
      {
        path: 'gestion-cupos',
        component: GestionCuposComponent,
        data: {
          title: 'Oferta académica'
        }
      },
      {
        path: 'programa-academico',
        component: ProgramaAcademicoComponent,
        data: {
          title: 'Programas Académicos'
        }
      },
      { path: 'programa-academico/gestion-plan-estudios/:id', 
        component: GestionPlanEstudiosComponent,
        data: {
          title: 'Programas Académicos - Gestión de planes de estudio'
        } 
      },
      {
        path: 'gestion-docente',
        component: GestionDocenteComponent,
        data: {
          title: 'Gestión Docente'
        }
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepAcademicoRoutingModule { }
