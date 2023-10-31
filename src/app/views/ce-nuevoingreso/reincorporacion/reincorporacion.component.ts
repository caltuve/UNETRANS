import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reincorporacion',
  templateUrl: './reincorporacion.component.html',
  styleUrls: ['./reincorporacion.component.scss']
})
export class ReincorporacionComponent implements AfterViewInit {

  arrayDatos : any []= [];

  pnfs: any []= [];
  selectedOption: any;
  recibidas = new MatTableDataSource();
  pnfRecibidas = new MatTableDataSource();
  procesadas = new MatTableDataSource();
  displayedColumnsRecibidas: string[] = ['fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante', 'gestion'];
  displayedColumnsProcesadas: string[] = ['estatus', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante','usrproceso'];
  displayedColumnsPnf: string[] = ['radio','codigo','pnf'];
  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  hayResultadosProcesadas: boolean = false;
  sinResultadosProcesadas: boolean = false;

  fecha_solicitud: string;

  hayResultados: boolean = false;
  sinResultados: boolean = false;

  moding: any []= [];
  trayectos: any []= [];
  resolucion: any []= [];

  cedulaAuto!: string;

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

  nac!: string;
  cedula!: number;
  fecnac!: Date;
  primer_nombre!: string;
  segundo_nombre!: string;
  primer_apellido!: string;
  segundo_apellido!: string;
  pnf!: string;
  convenio!: string;
  valorCampo: any;

  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  carreras2: any []= [];
  aspirantes: any []= [];
  turnos: any []= [];
  convenios: any []= [];
  datosConsultados: any[] = [];

  @ViewChild('paginatorRecibidas') paginatorRecibidas: MatPaginator;
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild('gestionNewReincorporacion') public gestionNewReincorporacion: ModalDirective;

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
    this.findReincorporacion();
    this.findModIngreso();
    this.findTrayectosAll();
    this.findResolucion();  
}

findReincorporacion() {
  this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
  this.SpinnerService.show();
  this.controlestudiosService.getReincorporacion().subscribe(
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

findTrayectosAll(){
  this.controlestudiosService.getTrayectosAll().subscribe(
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
  const datosStep1 = this.secondFormGroup.value;

    const datosCompletos = {
      step1: datosStep1,
    };
    const cedula = datosCompletos.step1.cedula;

    this.controlestudiosService.procesarReincorporacionDace(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
              this.gestionNewReincorporacion.hide(); 
              this.firstFormGroup.reset();
              this.secondFormGroup.reset();
              break;
        default:
          this.SpinnerService.hide(); 
          this.notifyService.showSuccess('Solicitud de reincorporación procesada');
          this.gestionNewReincorporacion.hide(); 
          this.firstFormGroup.reset();
          this.findReincorporacion();
          //this.enviarNotificacion(cedula);
          break;
      }
    });
}

setSelectedCedulaAuto(cedula: any) {
  this.cedulaAuto = cedula;
}

enviarNotificacion(cedula: any){
  this.SpinnerService.show(); 
  const user = {cedula};

    this.controlestudiosService.pushNotify(user).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error enviando el correo de notificación.');
              break;
        default:
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Correo de notificación enviado');
          break;
      }
    });
  }

firstFormGroup = this._formBuilder.group({
  cedula: ['', Validators.required],
});


secondFormGroup = this._formBuilder.group({
  nac:['', Validators.required],
  cedula: ['', Validators.required],
  pnf:       [{value: '', }, Validators.required],
  trayecto:  [{value: '', }, Validators.required],
  reso:  [{value: '', }, Validators.required],
  usrsice : ['', Validators.required],
});

buscar_datos_student() {
  const cedula = this.cedula;
  this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
  this.controlestudiosService.findPersonaReincorporacion(cedula).subscribe(datos => {
    switch (datos['estatus']) {
      case 'Solicitud Aprobada':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Estudiante ya tiene una solicitud de reincorporación APROBADA');
            this.gestionNewReincorporacion.hide(); 
            this.firstFormGroup.reset();
            this.secondFormGroup.reset();
            break;
      case 'Solicitud Negada':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Estudiante ya tiene una solicitud de reincorporación NEGADA');
            this.gestionNewReincorporacion.hide(); 
            this.firstFormGroup.reset();
            this.secondFormGroup.reset();
            break;
    case 'Pendiente':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Estudiante ya tiene una solicitud de reincorporación PENDIENTE');
            this.gestionNewReincorporacion.hide(); 
            this.firstFormGroup.reset();
            this.secondFormGroup.reset();
            break;
      default:
        this.hayResultados = false;
        this.sinResultados = false;
        this.datosConsultados = datos;
        if (this.datosConsultados.length == 0) {
          this.SpinnerService.hide();
          this.sinResultados = this.datosConsultados.length ==0
          this.hayResultados = false;
          this.notifyService.showError('Estudiante no encontrado, verifique');
          this.gestionNewReincorporacion.hide(); 
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();
        }
        else{
          this.notifyService.showSuccess('Consulta de datos de estudiante');
          this.SpinnerService.hide();
          this.hayResultados = this.datosConsultados.length >0
         // this.formSearchPersona.reset();
        }   
        break;
    }
  });


}


}
