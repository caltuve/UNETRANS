import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionCuposComponent } from './gestion-cupos/gestion-cupos.component';
import { MallaAcademicaComponent } from './malla-academica/malla-academica.component';

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
export class DepAcademicoRoutingModule { }
