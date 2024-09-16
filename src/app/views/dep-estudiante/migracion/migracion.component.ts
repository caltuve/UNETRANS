import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,ValidatorFn, AbstractControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-migracion',
  templateUrl: './migracion.component.html',
  styleUrls: ['./migracion.component.scss']
})
export class MigracionComponent implements AfterViewInit {
  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['cedula', 'nombre_persona', 'detalle_solicitudes', 'gestion'];

  minDate1!: Date;
  maxDate1!: Date;

  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  carreras2: any []= [];
  aspirantes: any []= [];

  moding: any []= [];
  turnos: any []= [];
  trayectos: any []= [];
  convenios: any []= [];

  hayResultadosDocente: boolean = false;
  sinResultadosDocente: boolean = false;

  @ViewChild('gestionNewAspConvenio') public gestionNewAspConvenio: ModalDirective;
  @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;

  nac!: string;
  cedula!: number;
  fecnac!: Date;
  primer_nombre!: string;
  segundo_nombre!: string;
  primer_apellido!: string;
  segundo_apellido!: string;
  pnf!: string;
  trayecto!: string;
  mod_ingreso!: string;
  convenio!: string;

  usr={
    nac:null,
    cedula:null,
    nombre_completo:null,
    nombre_corto:null,
    fecnac:null,
    carnet:null,
    pnf:null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);

      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }


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

  this.dataSource.paginator = this.paginatorProcesos;
  this.findDocentesDep(this.usr.usrsice);
}

findDocentesDep(usrsice: any) {
this.SpinnerService.show();
this.controlestudiosService.getStudentsMigraDep(usrsice).subscribe(
  (data: any) => {
    this.hayResultadosDocente = false;
    this.sinResultadosDocente= false; 
    this.dataSource.data = data;
    //console.log(this.Procesos.data);

  if (this.dataSource.data.length == 0) {
    this.sinResultadosDocente = this.dataSource.data.length == 0;
    this.hayResultadosDocente = false;
    this.SpinnerService.hide();
   } else{
    this.dataSource.paginator = this.paginatorProcesos;
    this.dataSource.data = data;
    this.hayResultadosDocente = this.dataSource.data.length > 0;
    this.SpinnerService.hide();
   }
  }
);
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


}
