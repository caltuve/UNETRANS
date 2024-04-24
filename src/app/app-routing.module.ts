import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { LoginAspiranteComponent } from './views/aspirante/login-aspirante/login-aspirante.component';
import { AutomatriculacionComponent } from './views/aspirante/automatriculacion/automatriculacion.component';
import { AutopostulacionComponent } from './views/aspirante/autopostulacion/autopostulacion.component';
import { LoginAdministrativoComponent } from './views/administrativo/login-administrativo/login-administrativo.component';
import { AutoregistroComponent } from './views/administrativo/autoregistro/autoregistro.component';
import { LogoutComponent } from './views/pages/logout/logout.component';
import { LoginDocenteComponent } from './views/docentes/login-docente/login-docente.component';
import { AutoregistroDocenteComponent } from './views/docentes/autoregistro-docente/autoregistro-docente.component';
import { AutomigraEstudianteComponent } from './views/migraestudiantes/automigra-estudiante/automigra-estudiante.component';
import { LoginMigraestudianteComponent } from './views/migraestudiantes/login-migraestudiante/login-migraestudiante.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Inicio'
    },
    children: [
      {
        path: 'dashboard', canActivate: [AuthGuard],
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      /* Inicio de rutas UNETRANS*/
      { 
        path: 'control-estudios', canActivate: [AuthGuard],
        loadChildren: () => 
          import('./views/control-estudios/control-estudios.module').then(m => m.ControlEstudiosModule) 
      },
      { 
        path: 'seguridad', canActivate: [AuthGuard],
        loadChildren: () => 
          import('./views/seguridad/seguridad.module').then(m => m.SeguridadModule) 
      },
      { 
        path: 'aspirante', 
        loadChildren: () => 
          import('./views/aspirante/aspirante.module').then(m => m.AspiranteModule) 
      },
      { path: 'ce-academico', canActivate: [AuthGuard],
      loadChildren: () => 
          import('./views/ce-academico/ce-academico.module').then(m => m.CeAcademicoModule) 
      },
      { path: 'ce-nuevoingreso', canActivate: [AuthGuard],
        loadChildren: () => 
          import('./views/ce-nuevoingreso/ce-nuevoingreso.module').then(m => m.CeNuevoingresoModule) 
      },
      { path: 'administrativo', 
          loadChildren: () => 
            import('./views/administrativo/administrativo.module').then(m => m.AdministrativoModule) 
      },
      { path: 'dep-estudiante', canActivate: [AuthGuard],
          loadChildren: () => 
          import('./views/dep-estudiante/dep-estudiante.module').then(m => m.DepEstudianteModule) 
      },
      { path: 'dep-academico', canActivate: [AuthGuard],
          loadChildren: () => 
          import('./views/dep-academico/dep-academico.module').then(m => m.DepAcademicoModule) 
      },
      { path: 'docentes', 
          loadChildren: () => 
          import('./views/docentes/docentes.module').then(m => m.DocentesModule) 
      },
      { path: 'doc-academico', canActivate: [AuthGuard],
          loadChildren: () => 
          import('./views/doc-academico/doc-academico.module').then(m => m.DocAcademicoModule)
      },
      { path: 'est-solicitud', canActivate: [AuthGuard],
          loadChildren: () => 
          import('./views/est-solicitud/est-solicitud.module').then(m => m.EstSolicitudModule) 
      },
      { path: 'migraestudiantes', 
          loadChildren: () => 
          import('./views/migraestudiantes/migraestudiantes.module').then(m => m.MigraestudiantesModule) 
      },

      /* Fin de rutas UNETRANS */
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'login-aspirante',
    component: LoginAspiranteComponent,
    data: {
      title: 'Login Aspirantes'
    }
  },
  {
    path: 'automatriculacion',
    component: AutomatriculacionComponent,
    data: {
      title: 'Registro Aspirantes'
    }
  },
  {
    path: 'autopostulacion',
    component: AutopostulacionComponent,
    data: {
      title: 'Autopostulación'
    }
  },
  {
    path: 'autoregistro',
    component: AutoregistroComponent,
    data: {
      title: 'Autoregistro'
    }
  },
  
  {
    path: 'login-administrativo',
    component: LoginAdministrativoComponent,
    data: {
      title: 'Login Administrativo'
    }
  },

  {
    path: 'login-docente',
    component: LoginDocenteComponent,
    data: {
      title: 'Login Administrativo'
    }
  },
  {
    path: 'autoregistro-docente',
    component: AutoregistroDocenteComponent,
    data: {
      title: 'Autoregistro'
    }
  },

  {
    path: 'automigra-estudiante',
    component: AutomigraEstudianteComponent,
    data: {
      title: 'Automigración'
    }
  },
  {
    path: 'login-migraestudiante',
    component: LoginMigraestudianteComponent,
    data: {
      title: 'Login Estudiantil'
    }
  },

  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Salir'
    }
  }, 
  
  
  
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
