import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarCertificadoComponent } from './validar-certificado/validar-certificado.component';
const routes: Routes = [
  {
    path: 'validar-certificado/:hash',
    component: ValidarCertificadoComponent,
    data: {
      title: 'Validación de Certificados'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule { }
