import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective} from 'ngx-bootstrap/modal';

import { DatePipe } from '@angular/common';

import { EditCalendarComponent } from './../edit-calendar/edit-calendar.component'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-calendario-academico',
  templateUrl: './calendario-academico.component.html',
  styleUrls: ['./calendario-academico.component.scss']
})
export class CalendarioAcademicoComponent implements AfterViewInit {

  modalRef: BsModalRef; 
  Procesos = new MatTableDataSource();
  displayedColumnsProcesos: string[] = ['estatus','periodo', 'periodicidad', 'proceso',  'fec_ini', 'fec_fin', 'gestion'];
  hayResultadosProcesos: boolean = false;
  sinResultadosProcesos: boolean = false;
  minDate1!: Date;
  maxDate1!: Date;
  fec_ini_modal!: Date;

  @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;
  @ViewChild('gestionProcesoCalendar') public gestionProcesoCalendar: ModalDirective;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    ) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
      
    }

    rangeLabel = 'Mostrando ${start} – ${end} de ${length}';

    myFilter = (d: Date | null): boolean => {
      const day = (d || new Date()).getDay();
      // Prevent Saturday and Sunday from being selected.
      return day !== 0 && day !== 6;
    };

  ngAfterViewInit() {
    this.paginatorProcesos._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
    this.paginatorProcesos._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Mostrando 0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
    };
  
    this.Procesos.paginator = this.paginatorProcesos;
    this.findProcesosCalendar();
}

findProcesosCalendar() {
  this.SpinnerService.show();
  this.controlestudiosService.getProcesosCalendar().subscribe(
    (data: any) => {
      this.hayResultadosProcesos = false;
      this.sinResultadosProcesos= false; 
      this.Procesos.data = data;
      this.fec_ini_modal = new Date(data.fec_ini);
this.fec_ini_modal.setDate(this.fec_ini_modal.getDate() + 1);
      //console.log(this.Procesos.data);

    if (this.Procesos.data.length == 0) {
      this.sinResultadosProcesos = this.Procesos.data.length == 0;
      this.hayResultadosProcesos = false;
      this.SpinnerService.hide();
     } else{
      this.Procesos.paginator = this.paginatorProcesos;
      this.Procesos.data = data;
      this.hayResultadosProcesos = this.Procesos.data.length > 0;
      this.SpinnerService.hide();
     }
    }
  );
}

ajustarFecha(fecha: string): Date {
  const date = new Date(fecha);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

openEditModal(calendar: any) {
  calendar.fec_ini = this.ajustarFecha(calendar.fec_ini);
  calendar.fec_fin = this.ajustarFecha(calendar.fec_fin);
  const initialState = {
    calendar: calendar
  };

  const modalConfig = {
    initialState: initialState,
    class: 'modal-lg',
    ignoreBackdropClick: true,
    keyboard: false
  };

  // Abrir el modal pasando 'modalConfig'
  const modalRef = this.modalService.show(EditCalendarComponent, modalConfig);

  if (modalRef.content) {
    modalRef.content.actualizacionCompleta.subscribe(() => {
      this.findProcesosCalendar();
    });
  }
}



}
