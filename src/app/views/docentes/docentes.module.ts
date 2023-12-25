import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentesRoutingModule } from './docentes-routing.module';
import { AutoregistroDocenteComponent } from './autoregistro-docente/autoregistro-docente.component';
import { LoginDocenteComponent } from './login-docente/login-docente.component';

import { MatStepperModule } from '@angular/material/stepper'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSelectModule} from '@angular/material/select';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { GridModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { DocenteService } from './docente.service';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { CalloutModule, NavModule, TabsModule, UtilitiesModule } from '@coreui/angular';

import {TableModule } from '@coreui/angular';
import { MatTableModule } from '@angular/material/table';


import { DocsComponentsModule } from '@docs-components/docs-components.module';

import {MatPaginatorModule} from '@angular/material/paginator';

import {MatCheckboxModule} from '@angular/material/checkbox';

import {
  AlertModule,
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  HeaderModule ,
  ListGroupModule,
  //ModalModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SidebarModule,
  SharedModule,
  SpinnerModule,
  TooltipModule,
} from '@coreui/angular';


import { IconModule } from '@coreui/icons-angular';

import { NgxSpinnerModule } from "ngx-spinner";

import {MatDialogModule} from '@angular/material/dialog';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AutoregistroDocenteComponent,
    LoginDocenteComponent,
    AutoregistroDocenteComponent
  ],
  imports: [
    CommonModule,
    DocentesRoutingModule,
    CommonModule,
    DocentesRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    GridModule,
    FormModule,
    MatExpansionModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatTabsModule,
    TableModule,
    MatTableModule,
    DocsComponentsModule,
    CalloutModule, NavModule, TabsModule, UtilitiesModule,
    AlertModule,
    AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  HeaderModule,
  ListGroupModule,
  ModalModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SidebarModule,
  SharedModule,
  SpinnerModule,
  TooltipModule,
  IconModule,
  MatPaginatorModule,  
  MatCheckboxModule,
  NgxSpinnerModule,
  MatDialogModule
  ]
})
export class DocentesModule { }
