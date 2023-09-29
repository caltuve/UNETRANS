import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-autopostulados',
  templateUrl: './autopostulados.component.html',
  styleUrls: ['./autopostulados.component.scss']
})
export class AutopostuladosComponent implements AfterViewInit {
  arrayDatos : any []= [];

  pnfs: any []= [];
  selectedOption: any;
  recibidas = new MatTableDataSource();
  pnfRecibidas = new MatTableDataSource();
  procesadas = new MatTableDataSource();
  displayedColumnsRecibidas: string[] = ['fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante', 'gestion'];
  displayedColumnsProcesadas: string[] = ['estatus','fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante'];
  displayedColumnsPnf: string[] = ['radio','codigo','pnf'];
  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  hayResultadosProcesadas: boolean = false;
  sinResultadosProcesadas: boolean = false;

  fecha_solicitud: string;

  @ViewChild('paginatorRecibidas') paginatorRecibidas: MatPaginator;
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild('gestionAutopostulado') public gestionAutopostulado: ModalDirective;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,) {
    }

    rangeLabel = 'Mostrando ${start} – ${end} de ${length}';

    ngAfterViewInit() {
    this.paginatorRecibidas._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
    this.paginatorRecibidas._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Mostrando 0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
    };
    
    this.recibidas.paginator = this.paginatorRecibidas;
    this.procesadas.paginator = this.paginatorProcesadas;
    this.findAutopostulados();  
}

findAutopostulados() {
  this.SpinnerService.show();
  this.controlestudiosService.getAutopostulado().subscribe(
    (data: any) => {
      this.hayResultadosRecibidas = false;
      this.sinResultadosRecibidas= false;
      this.hayResultadosProcesadas = false;
      this.sinResultadosProcesadas = false; 
      this.recibidas.data = data.recibidas;
      this.pnfs = data.recibidas[0].pnf;
      console.log(this.pnfs);
      this.procesadas.data = data.procesadas;
    if (this.recibidas.data.length == 0) {
      this.sinResultadosRecibidas = this.recibidas.data.length == 0;
      this.hayResultadosRecibidas = false;
      this.SpinnerService.hide();
     } else{
      this.recibidas.paginator = this.paginatorRecibidas;
      this.recibidas.data = data.recibidas;
      this.hayResultadosRecibidas = this.recibidas.data.length > 0;
      this.SpinnerService.hide();
     }

     if (this.procesadas.data.length == 0) {
      this.sinResultadosProcesadas = this.procesadas.data.length == 0;
      this.hayResultadosProcesadas = false;
      this.SpinnerService.hide();
     } else{
      this.procesadas.paginator = this.paginatorProcesadas;
      this.procesadas.data = data.procesadas;
      this.hayResultadosProcesadas = this.procesadas.data.length > 0;
      this.SpinnerService.hide();
     }
    }
  );
}

applyFilterRecibidas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.recibidas.filter = filterValue.trim().toLowerCase();

  if (this.recibidas.paginator) {
    this.recibidas.paginator.firstPage();
  }
}


applyFilterProcesadas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.procesadas.filter = filterValue.trim().toLowerCase();

  if (this.procesadas.paginator) {
    this.procesadas.paginator.firstPage();
  }
}

}
