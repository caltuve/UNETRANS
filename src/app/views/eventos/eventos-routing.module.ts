import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EleccionPresidencial2024Component } from './eleccion-presidencial2024/eleccion-presidencial2024.component';
import { EstadisticaEleccionPresidencialComponent } from './estadistica-eleccion-presidencial/estadistica-eleccion-presidencial.component';
const routes: Routes = [
  {
    path: 'eleccion-presidencial2024',
    component: EleccionPresidencial2024Component,
    data: {
      title: 'Registro de Ejercicio del Derecho al Voto | 28/07/2024'
    }
  },
  {
    path: 'estadistica-eleccion-presidencial',
    component: EstadisticaEleccionPresidencialComponent,
    data: {
      title: 'Estadistica Elección Presidencial'
    }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
