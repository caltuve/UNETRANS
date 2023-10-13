import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-gestion-cupos',
  templateUrl: './gestion-cupos.component.html',
  styleUrls: ['./gestion-cupos.component.scss']
})
export class GestionCuposComponent implements OnInit {

  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['acta','seccion','tipo','cupos','cupos_dis', 'doc_asignado', 'acciones'];
  trayectos: any []= [];

  carreras: any[] = [];
  periodos: any[] = [];

  seccion: number;
  cuposmax: number;
  docente: string;
  tseccion: any[] = [];

  carreraSeleccionada: any;
  periodoSeleccionado: any;
  tiposeccion: string;

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

  public mostrarTrayectos: boolean = true;

  @ViewChild('gestionNewSeccion') public gestionNewSeccion: ModalDirective;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {

    }

    ngOnInit() { 
      //this.findAspirantesConvenio();
      this.findCarreras();
      this.findTipoSeccion();
      //this.findTrayectos();

  }

  findCarreras(){

    this.controlestudiosService.getCarreras().subscribe(
      (result: any) => {
          this.carreras = result;

    }
    );
  }

  findTipoSeccion(){

    this.controlestudiosService.getTipoSeccion().subscribe(
      (result: any) => {
          this.tseccion = result;

    }
    );
  }

  // findTrayectos(){
  //   this.controlestudiosService.getTrayectos().subscribe(
  //     (result: any) => {
  //         this.periodos = result;
  //   }
  //   );
  // }

  onPnfSeleccionado(carreraSeleccionada: any) {
    this.SpinnerService.show();
    this.controlestudiosService.getPeriodoOfPnfSeleccionado(carreraSeleccionada).subscribe(
      (data: any) => {
        this.periodos = data;
        this.periodoSeleccionado = null; // Reiniciar el valor del segundo mat-select
        this.mostrarTrayectos = false; // Ocultar la información mostrada
        this.SpinnerService.hide();
      }
    );
  }
  onPeriodoSeleccionado(carreraSeleccionada: any,periodoSeleccionado: any ){
    this.SpinnerService.show();
    this.controlestudiosService.getOfertaAcademica(carreraSeleccionada,periodoSeleccionado).subscribe(
      (result: any) => {
        this.mostrarTrayectos = true;
        this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
        this.arrayDatos = result;
        this.trayectos = result[0].trayectos;
        this.SpinnerService.hide();
    }
    );
  }

  selectedCodUcurr: any;

setSelectedCodUcurr(codUcurr: any) {
  this.selectedCodUcurr = codUcurr;
}
guardar(): void {
  this.SpinnerService.show(); 
      
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;


    const datosCompletos = {
      step1: datosStep1,
    };

    this.controlestudiosService.createSeccion(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'SECCIONDUPLICADA':
              this.SpinnerService.hide(); 
              this.notifyService.showWarning('La sección está duplicada para esa Unidad Curricular, verifique e intente de nuevo.');
              //this.gestionNewSeccion.hide(); 
              this.firstFormGroup.reset();
              this.mostrarTrayectos = false;
              break;
            case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
              //this.gestionNewSeccion.hide(); 
              this.firstFormGroup.reset();
              this.mostrarTrayectos = false;
              break;
        default:
          //this.gestionNewSeccion.hide();
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Sección creada para el periodo seleccionado');
           
          this.firstFormGroup.reset();
          this.mostrarTrayectos = false;
          break;
      }
    });
}


  firstFormGroup = this._formBuilder.group({
    seccion:['', Validators.required],
    tiposeccion:['', Validators.required],
    cuposmax:['', Validators.required],
    docente:[null, Validators.nullValidator],
    usrsice:['', Validators.required],
    carreraSeleccionada:['', Validators.required],
    periodoSeleccionado:['', Validators.required],
    selectedCodUcurr:['', Validators.required],
  
  });

}
