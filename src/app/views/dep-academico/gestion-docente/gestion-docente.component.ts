import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,ValidatorFn, AbstractControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

export function documentoValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const nac = control.get('nac')?.value;
    const cedula = control.get('cedula')?.value;

    if (!nac || !cedula) {
      // Si alguno de los valores es nulo o indefinido, no aplicar la validación
      return null;
    }

    if (nac === 'V' && (cedula < 2000000 || cedula > 40000000)) {
      return { documentoInvalido: true };
    }

    if (nac === 'E' && (cedula < 1 || (cedula > 1999999 && cedula < 80000000) || cedula > 100000000)) {
      return { documentoInvalido: true };
    }

    return null; // Si todo está correcto, retorna null
  };
}

@Component({
  selector: 'app-gestion-docente',
  templateUrl: './gestion-docente.component.html',
  styleUrls: ['./gestion-docente.component.scss']
})
export class GestionDocenteComponent implements AfterViewInit, OnInit {

  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['estatus','cedula', 'nombre_persona', 'gestion'];

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



  ngOnInit() { 
    this.findAspirantesConvenio();
    this.findNac();
    this.findCarreras();
    this.findModIngreso();
    this.findTrayectos();
    this.findEmpConvenio();
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
this.controlestudiosService.getDocentesDep(usrsice).subscribe(
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

findNac(){
  this.controlestudiosService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.controlestudiosService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}

findCarreras(){
  this.controlestudiosService.getCarreras().subscribe(
    (result: any) => {
        this.carreras2 = result;
  }
  );
}

findAspirantesConvenio(){
  this.SpinnerService.show();
  this.controlestudiosService.getAspirantesConvenio().subscribe(
    (result: any) => {
      this.hayResultadosDocente = false;
      this.sinResultadosDocente= false;
      switch (result['estatus']) {
        case 'SIN CONVENIO':
          this.sinResultadosDocente = true;
          this.hayResultadosDocente = false;
          this.SpinnerService.hide();
          break;
        default:
          this.arrayDatos = result;
          this.carreras = result[0].carreras;
          this.hayResultadosDocente = this.carreras.length > 0;
          this.SpinnerService.hide();
          break;
      }
  }
  );
 
}

findModIngreso(){
  this.controlestudiosService.getModIngreso().subscribe(
    (result: any) => {
      const opcionesFiltradas = ['006', '007', '008', '013', '015','016', '018']; // Aquí colocas los valores codelemento que deseas mostrar
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

findEmpConvenio(){
  this.controlestudiosService.getEmpConvenio().subscribe(
    (result: any) => {
        this.convenios = result;
  }
  );
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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

    this.controlestudiosService.createPersonConvenio(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'OPSU':
          this.SpinnerService.hide(); 
          this.notifyService.showInfo('El aspirante a incluir por Convenio está registrado como asignado OPSU, debe seguir el proceso regular.');
          this.gestionNewAspConvenio.hide(); 
          this.firstFormGroup.reset();
          break;
        case 'Solicitud Aprobada':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio le fue APROBADA la autopostulación, debe seguir el proceso regular.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'Solicitud Negada':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('El aspirante a incluir por Convenio le fue NEGADA la solicitud por autopostulación.');
              this.gestionNewAspConvenio.hide(); 
              this.firstFormGroup.reset();
              break;
              case 'Solicitud Pendiente':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio tiene una solicutd de autopostulación pendiente, verifique el módulo de autopostulación.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'Inscrito en SICE':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio ya cumplio el proceso de automatriculación en SICE.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique el número de cédula y si persiste comuníquese con sistemas.');
              this.gestionNewAspConvenio.hide(); 
              this.firstFormGroup.reset();
              break;
        default:
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Aspirante por convenio añadido');
          this.gestionNewAspConvenio.hide(); 
          this.firstFormGroup.reset();
          this.findAspirantesConvenio();
          break;
      }
    });
}



firstFormGroup = this._formBuilder.group({
  nac:['', Validators.required],
  cedula: ['', Validators.required],
  primer_nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  segundo_nombre: [null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  primer_apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  segundo_apellido:[null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])] ,
  mingreso:  [{value: ''}, Validators.required],
  pnf:       [{value: '', }, Validators.required],
  trayecto:  [{value: '', }, Validators.required],
  convenio:  [{value: '', }, Validators.required],

}, { validators: documentoValidator() });
}
