import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { MenuComponent } from './menu/menu.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { GrupoComponent } from './grupo/grupo.component';
import { PerfilComponent } from './perfil/perfil.component';


@NgModule({
  declarations: [
    MenuComponent,
    InstitucionComponent,
    GrupoComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule
  ]
})
export class SeguridadModule { }
