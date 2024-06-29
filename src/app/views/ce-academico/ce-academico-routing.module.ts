import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component';
import { ProgramaAcademicoComponent } from './programa-academico/programa-academico.component';
import { GestionCuposComponent } from './gestion-cupos/gestion-cupos.component';
import { ConstantesGlobalesComponent } from './constantes-globales/constantes-globales.component';
import { MallaAcademicaComponent } from './malla-academica/malla-academica.component';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { GestionPlanEstudiosComponent } from './gestion-plan-estudios/gestion-plan-estudios.component';
import { CalificacionesContingenciaGradoComponent } from './calificaciones-contingencia-grado/calificaciones-contingencia-grado.component';
import { CalificacionesContingenciaMigracionComponent } from './calificaciones-contingencia-migracion/calificaciones-contingencia-migracion.component';
import { CalificacionesCargaComponent } from './calificaciones-carga/calificaciones-carga.component';
import { GestionSeccionesUcComponent } from './gestion-secciones-uc/gestion-secciones-uc.component';
import { AddEditProgramaComponent } from './add-edit-programa/add-edit-programa.component';
import { AddEditPlanComponent } from './add-edit-plan/add-edit-plan.component';
import { UnidadCurricularComponent } from './unidad-curricular/unidad-curricular.component';

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
          title: 'Gestión de cupos'
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
      { path: 'programa-academico/gestion-plan-estudios/:id', 
        component: GestionPlanEstudiosComponent,
        data: {
          title: 'Programas Académicos - Gestión de planes'
        } 
      },
      { path: 'programa-academico/gestion-plan-estudios/:id/add-edit-plan', 
        component: AddEditPlanComponent,
        data: {
          title: 'Programas Académicos - Gestión de planes - Añadir/Editar Plan'
        } 
      },

      { path: 'programa-academico/gestion-plan-estudios/:id/unidad-curricular/:idPlan', 
        component: UnidadCurricularComponent,
        data: {
          title: 'Programas Académicos - Gestión de Unidades Curriculares'
        } 
      },
      {
        path: 'programa-academico/add-edit-programa',
        component: AddEditProgramaComponent,
        data: {
          title: 'Añadir/Editar Programas'
        },
      },
      {
        path: 'calificaciones-carga',
        component: CalificacionesCargaComponent,
        data: {
          title: 'Carga de calificación (Periodo actual)'
        }
      },
      {
        path: 'calificaciones-contingencia-grado',
        component: CalificacionesContingenciaGradoComponent,
        data: {
          title: 'Carga de calificaciones (CONTINGENCIA-GRADO)'
        }
      },
      {
        path: 'calificaciones-contingencia-migracion',
        component: CalificacionesContingenciaMigracionComponent,
        data: {
          title: 'Carga de calificaciones (MIGRACIÓN)'
        }
      },
      { path: 'gestion-cupos/gestion-secciones-uc/:codigoUC/:periodo', 
        component: GestionSeccionesUcComponent,
        data: {
          title: 'Gestión de cupos - Secciones por UC'
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
