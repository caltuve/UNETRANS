import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultarDatosComponent } from './consultar-datos/consultar-datos.component';
import { CeNuevoingresoRoutingModule } from './ce-nuevoingreso-routing.module';
import { AspiranteOpsuComponent } from './aspirante-opsu/aspirante-opsu.component' ;
import { AutopostuladosComponent } from './autopostulados/autopostulados.component';
import { ConvenioComponent } from './convenio/convenio.component';
import { ReincorporacionComponent } from './reincorporacion/reincorporacion.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';

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
import { ControlEstudiosService } from './../control-estudios/control-estudios.service';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { CalloutModule, NavModule, TabsModule, UtilitiesModule } from '@coreui/angular';

import {TableModule } from '@coreui/angular';
import { MatTableModule } from '@angular/material/table';

import { NgxSpinnerModule } from "ngx-spinner";

import { DocsComponentsModule } from '@docs-components/docs-components.module';

import {MatPaginatorModule} from '@angular/material/paginator';


import {
  AccordionModule,
  AlertModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  ListGroupModule,
  //ModalModule,
  //PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TooltipModule,
} from '@coreui/angular';



import { IconModule } from '@coreui/icons-angular';
import {MatSortModule} from '@angular/material/sort';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { EstatusExpedientePipe } from './expediente/expediente.component';
import { ModalInscripcionComponent } from './modal-inscripcion/modal-inscripcion.component';
import { DetalleEstudianteModalComponent } from './detalle-estudiante-modal/detalle-estudiante-modal.component';
import { ModificarEstudianteModalComponent } from './modificar-estudiante-modal/modificar-estudiante-modal.component';
import { MigracionComponent } from './migracion/migracion.component';
import { ModalRevMigracionComponent } from './modal-rev-migracion/modal-rev-migracion.component';


@NgModule({
  declarations: [
    ConsultarDatosComponent,
    AspiranteOpsuComponent,
    AutopostuladosComponent,
    ConvenioComponent,
    ReincorporacionComponent,
    ExpedienteComponent,
    EstatusExpedientePipe,
    DocumentosComponent,
    InscripcionComponent,
    ModalInscripcionComponent,
    DetalleEstudianteModalComponent,
    ModificarEstudianteModalComponent,
    MigracionComponent,
    ModalRevMigracionComponent
  ],
  imports: [
    CommonModule,
    CeNuevoingresoRoutingModule,
    MatStepperModule,
    FormsModule,
    AlertModule,
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
    AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  ListGroupModule,
  ModalModule,
  //PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TooltipModule,
  IconModule,
  MatPaginatorModule, 
  NgxSpinnerModule,
  MatSortModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,
  ],
  exports: [EstatusExpedientePipe], 
})
export class CeNuevoingresoModule { }
