import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,ValidatorFn, AbstractControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { ShowActaComponent } from '../../ce-academico/show-acta/show-acta.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss']
})
export class MisCursosComponent implements AfterViewInit, OnInit {

  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['pnf','periodo', 'acta', 'seccion', 'nombre_uc','tipo_sec','inscritos','gestion'];

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
  cargandoDatos = true; // Añade esto a tu componente

  //@ViewChild('gestionNewAspConvenio') public gestionNewAspConvenio: ModalDirective;
  @ViewChild(MatPaginator, { static: false }) paginatorProcesos: MatPaginator;

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

  modalRef: BsModalRef; 
  
  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService) {

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
    this.findDocentesDep(this.usr.usrsice);
}

ngAfterViewInit() {
  setTimeout(() => {
    if (this.paginatorProcesos) {
      this.paginatorProcesos._intl.itemsPerPageLabel = 'Registros por página';

  this.paginatorProcesos._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return 'Mostrando 0 de ' + length + ' registros';
    }
    const startIndex = page * pageSize;
    // Ajuste para evitar que el índice de inicio sea mayor que el total de registros
    const endIndex = Math.min(startIndex + pageSize, length);
    
    return 'Mostrando ' + (startIndex + 1) + ' – ' + endIndex + ' de ' + length + ' registros';
  };
  this.dataSource.paginator = this.paginatorProcesos;
    }
  });

    
}

findDocentesDep(usrsice: any) {
  this.cargandoDatos = true;
  this.SpinnerService.show();
  
  this.controlestudiosService.getCursosDocente(usrsice).subscribe(data => {
    this.hayResultadosDocente = data.length > 0;
    this.sinResultadosDocente = data.length === 0;
    this.dataSource.data = data;

    if (this.hayResultadosDocente) {
      // Importante: actualizar el paginador después de asignar los datos
      setTimeout(() => this.dataSource.paginator = this.paginatorProcesos);
    } else {
      this.dataSource.data = [];
    }

    this.cargandoDatos = false;
    this.SpinnerService.hide();
  });
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

openActaDetail(actaId: any) {
  this.controlestudiosService.getDetailActa(actaId).subscribe(
    (result: any) => {
      //console.log('Detalle del acta:', result); 
      const initialState = {
        detalle_acta: result,
        inscritos: result[0].inscritos
      };
      this.modalRef = this.modalService.show(ShowActaComponent, { 
        initialState: initialState,
        class: 'modal-xl custom-modal-scrollable', // Tamaño extra grande y desplazable
        ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
        keyboard: false             // Evita cerrar el modal con la tecla ESC
      });
    }
  );
}


// guardar(): void {
//   this.SpinnerService.show(); 
      
//   // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
//   // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
//   const datosStep1 = this.firstFormGroup.value;


//     const datosCompletos = {
//       step1: datosStep1,
//     };
//     const cedula = datosCompletos.step1.cedula;

//     this.controlestudiosService.createPersonConvenio(datosCompletos).subscribe(datos => {
//       switch (datos['estatus']) {
//         case 'OPSU':
//           this.SpinnerService.hide(); 
//           this.notifyService.showInfo('El aspirante a incluir por Convenio está registrado como asignado OPSU, debe seguir el proceso regular.');
//           this.gestionNewAspConvenio.hide(); 
//           this.firstFormGroup.reset();
//           break;
//         case 'Solicitud Aprobada':
//             this.SpinnerService.hide(); 
//             this.notifyService.showInfo('El aspirante a incluir por Convenio le fue APROBADA la autopostulación, debe seguir el proceso regular.');
//             this.gestionNewAspConvenio.hide(); 
//             this.firstFormGroup.reset();
//             break;
//             case 'Solicitud Negada':
//               this.SpinnerService.hide(); 
//               this.notifyService.showError2('El aspirante a incluir por Convenio le fue NEGADA la solicitud por autopostulación.');
//               this.gestionNewAspConvenio.hide(); 
//               this.firstFormGroup.reset();
//               break;
//               case 'Solicitud Pendiente':
//             this.SpinnerService.hide(); 
//             this.notifyService.showInfo('El aspirante a incluir por Convenio tiene una solicutd de autopostulación pendiente, verifique el módulo de autopostulación.');
//             this.gestionNewAspConvenio.hide(); 
//             this.firstFormGroup.reset();
//             break;
//             case 'Inscrito en SICE':
//             this.SpinnerService.hide(); 
//             this.notifyService.showInfo('El aspirante a incluir por Convenio ya cumplio el proceso de automatriculación en SICE.');
//             this.gestionNewAspConvenio.hide(); 
//             this.firstFormGroup.reset();
//             break;
//             case 'ERROR':
//               this.SpinnerService.hide(); 
//               this.notifyService.showError2('Ha ocurrido un error, verifique el número de cédula y si persiste comuníquese con sistemas.');
//               this.gestionNewAspConvenio.hide(); 
//               this.firstFormGroup.reset();
//               break;
//         default:
//           this.SpinnerService.hide();
//           this.notifyService.showSuccess('Aspirante por convenio añadido');
//           this.gestionNewAspConvenio.hide(); 
//           this.firstFormGroup.reset();
//           this.findAspirantesConvenio();
//           break;
//       }
//     });
// }

}
