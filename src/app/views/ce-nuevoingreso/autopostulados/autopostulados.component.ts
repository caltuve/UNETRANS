import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
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
  displayedColumnsProcesadas: string[] = ['estatus','fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante','usrproceso'];
  displayedColumnsPnf: string[] = ['radio','codigo','pnf'];
  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  hayResultadosProcesadas: boolean = false;
  sinResultadosProcesadas: boolean = false;

  fecha_solicitud: string;

  moding: any []= [];
  trayectos: any []= [];
  resolucion: any []= [];

  trayecto!: string;
  mod_ingreso!: string;
  reso!: string;

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

  @ViewChild('paginatorRecibidas') paginatorRecibidas: MatPaginator;
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild('gestionAutopostulado') public gestionAutopostulado: ModalDirective;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
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
    this.findModIngreso();
    this.findTrayectos();
    this.findResolucion(); 
    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
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
      this.procesadas.data = data.procesadas;
    if (this.recibidas.data.length == 0) {
      this.sinResultadosRecibidas = this.recibidas.data.length == 0;
      this.hayResultadosRecibidas = false;
      this.SpinnerService.hide();
     } else{
      this.recibidas.paginator = this.paginatorRecibidas;
      this.recibidas.data = data.recibidas;
      this.pnfs = data.recibidas[0].pnf;
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

findModIngreso(){
  this.controlestudiosService.getModIngreso().subscribe(
    (result: any) => {
      const opcionesFiltradas = [ '011']; // Aquí colocas los valores codelemento que deseas mostrar
      this.moding = result.filter((moding: { codelemento: string; }) => opcionesFiltradas.includes(moding.codelemento));
  }
  );
}

findTrayectos(){
  this.controlestudiosService.getTrayectos().subscribe(
    (result: any) => {
        this.trayectos = result;
  }
  );
}

findResolucion(){
  this.controlestudiosService.getResolucion().subscribe(
    (result: any) => {
        this.resolucion = result;
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


guardar(): void {
  this.SpinnerService.show(); 
      
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;

    const datosCompletos = {
      step1: datosStep1,
    };
    const cedula = datosCompletos.step1.cedula;

    this.controlestudiosService.procesarAutopostulado(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
              this.gestionAutopostulado.hide(); 
              this.firstFormGroup.reset();
              break;
        default:
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Solicitud de autopostulación procesada');
          this.gestionAutopostulado.hide(); 
          this.firstFormGroup.reset();
          this.findAutopostulados();
          break;
      }
    });
}



firstFormGroup = this._formBuilder.group({
  cedula: ['', Validators.required],
  mingreso:  [{value: ''}, Validators.required],
  trayecto:       [{value: '', }, Validators.required],
  reso:  [{value: '', }, Validators.required],
  optionPnf: ['', Validators.required],
  usrsice : ['', Validators.required],
});



}
