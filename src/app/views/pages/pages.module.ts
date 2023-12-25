import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

import { NgxSpinnerModule } from "ngx-spinner";

import {MatDialogModule} from '@angular/material/dialog';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LogoutComponent } from './logout/logout.component';
import { SessionExpiryModalComponent } from './session-expiry-modal/session-expiry-modal.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    Page404Component,
    Page500Component,
    LogoutComponent,
    SessionExpiryModalComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    MatDialogModule,
    ModalModule
  ]
})
export class PagesModule {
}
