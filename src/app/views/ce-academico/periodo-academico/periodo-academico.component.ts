import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrls: ['./periodo-academico.component.scss']
})
export class PeriodoAcademicoComponent {

  arrayDatos : any []= [];
  periodicidad: any []= [];
  minfechaDesde: Date;
fechaDesde: Date;

  selectedOption: any;
  actuales = new MatTableDataSource();
  finalizadas = new MatTableDataSource();
  displayedColumnsPeriodosActuales: string[] = ['estatus','periodo', 'periodicidad', 'fec_ini', 'fec_fin',];
  displayedColumnsProcesadas: string[] = ['estatus','fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante'];
  displayedColumnsPnf: string[] = ['radio','codigo','pnf'];
  
  hayResultadosPeriodosActuales: boolean = false;
  sinResultadosPeriodosActuales: boolean = false;

  hayResultadosPeriodosFinalizados: boolean = false;
  sinResultadosPeriodosFinalizados: boolean = false;

  @ViewChild('paginatorActuales') paginatorActuales: MatPaginator;
  @ViewChild('paginatorFinalizados') paginatorFinalizados: MatPaginator;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild('gestionNewPeriodo') public gestionNewPeriodo: ModalDirective;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minfechaDesde = new Date(currentYear, currentMonth, currentDay);
    }

    rangeLabel = 'Mostrando ${start} – ${end} de ${length}';

    ngAfterViewInit() {
    this.paginatorActuales._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
    this.paginatorActuales._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Mostrando 0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
    };
    
    this.actuales.paginator = this.paginatorActuales;
    this.finalizadas.paginator = this.paginatorFinalizados;
    this.findPeriodos();
    this.findPeriodicidad();
}

myFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  return day !== 0 && day !== 6;
}; 

findPeriodos() {
  this.SpinnerService.show();
  this.controlestudiosService.getPeriodos().subscribe(
    (data: any) => {
      this.hayResultadosPeriodosActuales = false;
      this.sinResultadosPeriodosActuales= false;
      this.hayResultadosPeriodosFinalizados = false;
      this.sinResultadosPeriodosFinalizados = false; 
      this.actuales.data = data.actuales;
      this.finalizadas.data = data.finalizados;
    if (this.actuales.data.length == 0) {
      this.sinResultadosPeriodosActuales = this.actuales.data.length == 0;
      this.hayResultadosPeriodosActuales = false;
      this.SpinnerService.hide();
     } else{
      this.actuales.paginator = this.paginatorActuales;
      this.actuales.data = data.actuales;
      this.hayResultadosPeriodosActuales = this.actuales.data.length > 0;
      this.SpinnerService.hide();
     }

     if (this.finalizadas.data.length == 0) {
      this.sinResultadosPeriodosFinalizados = this.finalizadas.data.length == 0;
      this.hayResultadosPeriodosFinalizados = false;
      this.SpinnerService.hide();
     } else{
      this.finalizadas.paginator = this.paginatorFinalizados;
      this.finalizadas.data = data.finalizados;
      this.hayResultadosPeriodosFinalizados = this.finalizadas.data.length > 0;
      this.SpinnerService.hide();
     }
    }
  );
}

findPeriodicidad(){
  this.controlestudiosService.getPeriodicidad().subscribe(
    (result: any) => {
        this.periodicidad = result;
  }
  );
}

applyFilterRecibidas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.actuales.filter = filterValue.trim().toLowerCase();

  if (this.actuales.paginator) {
    this.actuales.paginator.firstPage();
  }
}


applyFilterProcesadas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.finalizadas.filter = filterValue.trim().toLowerCase();

  if (this.finalizadas.paginator) {
    this.finalizadas.paginator.firstPage();
  }
}


}
