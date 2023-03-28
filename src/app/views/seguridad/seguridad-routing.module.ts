import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { GrupoComponent } from './grupo/grupo.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Seguridad'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'institucion'
      },
      {
        path: 'institucion',
        component: InstitucionComponent,
        data: {
          title: 'Instituciones SIAGEU'
        }
      },
      {
        path: 'menu',
        component: MenuComponent,
        data: {
          title: 'Menú SIAGEU'
        }
      },
      {
        path: 'grupo',
        component: GrupoComponent,
        data: {
          title: 'Grupo'
        }
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {
          title: 'Perfil'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
