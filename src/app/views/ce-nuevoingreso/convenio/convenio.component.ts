import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.scss']
})
export class ConvenioComponent implements OnInit{

  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['id_estudiante','nombre_completo','convenio','confirma'];

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

  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  @ViewChild('gestionNewAspConvenio') public gestionNewAspConvenio: ModalDirective;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
    }



  ngOnInit() { 
    this.findAspirantesConvenio();
    this.findNac();
    this.findCarreras();
    this.findModIngreso();
    this.findTrayectos();
    this.findEmpConvenio();
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
      this.hayResultadosRecibidas = false;
      this.sinResultadosRecibidas= false;
      switch (result['estatus']) {
        case 'SIN CONVENIO':
          this.sinResultadosRecibidas = true;
          this.hayResultadosRecibidas = false;
          this.SpinnerService.hide();
          break;
        default:
          this.arrayDatos = result;
          this.carreras = result[0].carreras;
          this.hayResultadosRecibidas = this.carreras.length > 0;
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

});

}
