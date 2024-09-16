import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvenioComponent } from './convenio/convenio.component'; 


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Entes del Transporte'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'convenio'
      },
      {
        path: 'convenio',
        component: ConvenioComponent,
        data: {
          title: 'Aspirantes por Convenio'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntesRoutingModule { }
