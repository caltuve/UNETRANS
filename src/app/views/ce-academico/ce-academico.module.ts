import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { ControlEstudiosService } from '../control-estudios/control-estudios.service';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { CalloutModule, NavModule, TabsModule, UtilitiesModule } from '@coreui/angular';

import {TableModule } from '@coreui/angular';
import { MatTableModule } from '@angular/material/table';

import { NgxSpinnerModule } from "ngx-spinner";

import { DocsComponentsModule } from '@docs-components/docs-components.module';

import {MatPaginatorModule} from '@angular/material/paginator';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


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

import { CeAcademicoRoutingModule } from './ce-academico-routing.module';
import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component';
import { ProgramaAcademicoComponent } from './programa-academico/programa-academico.component';
import { GestionCuposComponent } from './gestion-cupos/gestion-cupos.component';
import { ConstantesGlobalesComponent } from './constantes-globales/constantes-globales.component';
import { MallaAcademicaComponent } from './malla-academica/malla-academica.component';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';

@NgModule({
  declarations: [
    
  
    CalendarioAcademicoComponent,
            ProgramaAcademicoComponent,
            GestionCuposComponent,
            ConstantesGlobalesComponent,
            MallaAcademicaComponent,
            PeriodoAcademicoComponent,
  ],
  imports: [
    CommonModule,
    CeAcademicoRoutingModule,
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
  ],
  providers: [DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'es-VE'}, {provide: ControlEstudiosService},
  ],
  
})
export class CeAcademicoModule { }
