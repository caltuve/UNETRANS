import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';
import * as XLSX from 'xlsx';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ShowActaComponent } from '../../ce-academico/show-acta/show-acta.component';
import { EditActaCeComponent } from '../../ce-academico/edit-acta-ce/edit-acta-ce.component';

@Component({
  selector: 'app-gestion-cupos',
  templateUrl: './gestion-cupos.component.html',
  styleUrls: ['./gestion-cupos.component.scss']
})
export class GestionCuposComponent {

  arrayDatos : any []= [];
  detalle_acta : any []= [];
  inscritos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['acta','codigo_uc', 'nombre_uc', 'seccion', 'tipo', 'cupos', 'cupos_dis', 'doc_asignado', 'acciones'];
  displayedColumnsDetail: string[] = ['orden','carnet','cedula','nombre_completo','telefono','correo'];
  trayectos: any []= [];

  carreras: any[] = [];
  periodos: any[] = [];

  seccion: number;
  cuposmax: number;
  docente: string;
  tseccion: any[] = [];

  unidadesCurriculares: any[] = [];

  estadisticas: any = {};
  carreraSeleccionada: any;
  periodoSeleccionado: any;
  tiposeccion: string;

  selectedTrayecto: any;

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

  hayResultados: boolean = false;
  sinResultados: boolean = false;

  sinResultadosUC: boolean = false;
  form: FormGroup;

  public mostrarTrayectos: boolean = true;

  @ViewChild('gestionNewSeccion') public gestionNewSeccion: ModalDirective;
  @ViewChild('openActa') public openActa: ModalDirective;

  modalRef: BsModalRef; 
  
  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    ) {
      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }

    ngOnInit() { 
      this.form = this.fb.group({
        carreraSeleccionada: ['', Validators.required],
        periodoSeleccionado: [{ value: '', disabled: true }, Validators.required],
        trayectoSeleccionado: [{ value: '', disabled: true }, Validators.required]
      });
      //this.findAspirantesConvenio();
      this.findCarrerasForDep(this.usr.usrsice);
      //this.findTipoSeccion();
      //this.findTrayectos();

  }

  findCarrerasForDep(usrsice: any){
    this.SpinnerService.show();
    this.controlestudiosService.getCarrerasForDep(usrsice).subscribe(
      (result: any) => {
        this.hayResultados = false;
        this.sinResultados = false;
        this.carreras = result;
        if (this.carreras.length == 0) {
          this.SpinnerService.hide();
          this.sinResultados = this.carreras.length ==0
          this.hayResultados = false;
        }
        else{
          this.notifyService.showSuccess('Consulta de actas');
          this.SpinnerService.hide();
          this.hayResultados = this.carreras.length >0
        }  

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



  onPnfSeleccionado(pnf: any) {
    this.form.get('periodoSeleccionado')?.reset();
    this.form.get('trayectoSeleccionado')?.reset();
    this.form.get('periodoSeleccionado')?.enable();
    this.form.get('trayectoSeleccionado')?.disable();
    this.unidadesCurriculares = []; // Limpiar los datos de la tabla
    this.sinResultadosUC = false;
    // Cargar los periodos desde el servicio
    this.controlestudiosService.getPeriodoOfPnfSeleccionado(pnf).subscribe(
      (result: any) => {
        this.periodos = result;
      },
      error => {
        console.error('Error al cargar periodos: ', error);
      }
    );
  }


  onPeriodoSeleccionado(pnf: any, periodo: any) {
    this.form.get('trayectoSeleccionado')?.reset();
    this.form.get('trayectoSeleccionado')?.enable();
    this.SpinnerService.show();
    this.controlestudiosService.getOfertaAcademicaDCE(pnf, periodo).subscribe(
      (result: any) => {
        this.trayectos = result;
      },
      error => {
        console.error('Error al obtener oferta académica: ', error);
      },
      () => this.SpinnerService.hide()
    );
  }

  onTrayectoSeleccionado(trayecto: any) {
    this.selectedTrayecto = trayecto; // Guardar el trayecto seleccionado
    const pnf = this.form.get('carreraSeleccionada')?.value;
    const periodo = this.form.get('periodoSeleccionado')?.value;
    const trayectoId = trayecto.id;
    const trayectoPeriodo = periodo;
  
    this.SpinnerService.show();
    
    // Realizar la solicitud al backend con los parámetros seleccionados
    this.controlestudiosService.obtenerUnidadesCurricularesGestionCupos(pnf, trayectoId, trayectoPeriodo).subscribe(
      (result: any) => {
        this.unidadesCurriculares = result.detalle;
        this.estadisticas = result.estadisticas;
        this.sinResultadosUC = this.unidadesCurriculares.length === 0;
      },
      error => {
        console.error('Error al obtener unidades curriculares: ', error);
      },
      () => this.SpinnerService.hide()
    );
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

  editActaDetail(actaId: any) {
    this.controlestudiosService.getDetailActaEdit(actaId).subscribe(
      (result: any) => {
        const initialState = {
          detalle_acta: result,
          inscritos: result[0].inscritos
        };
        this.modalRef = this.modalService.show(EditActaCeComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable', // Tamaño extra grande y desplazable
          ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
          keyboard: false             // Evita cerrar el modal con la tecla ESC
        });
        this.modalRef.content.actualizacionCompleta.subscribe(() => {
          this.onTrayectoSeleccionado(this.selectedTrayecto); // Invocar la actualización con los datos seleccionados
        });
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

  exportarAExcel(): void {
    if (this.detalle_acta && this.detalle_acta.length > 0) {
      const primerDetalle = this.detalle_acta[0];
      const numeroActa = primerDetalle[0].acta || 'Acta';
  
      const encabezado = [
        { A: 'Acta', B: primerDetalle[0].acta || '' },
        { A: 'Periodo Académico', B: primerDetalle[0].periodo || '' },
        { A: 'PNF', B: primerDetalle[0].nombre_programa || '' },
        { A: 'Unidad Curricular', B: (primerDetalle[0].cod_ucurr || '') + ' - ' + (primerDetalle[0].uni_curr || '') },
        { A: 'Sección', B: (primerDetalle[0].seccion || '') + ' - ' + (primerDetalle[0].tipo_sec || '') },
        { A: 'Docente', B: primerDetalle[0].prof_asignado || '' },
        // Una fila vacía como separador
        {},
      ];
  
      // Crear hoja de cálculo para el encabezado
      const wsEncabezado: XLSX.WorkSheet = XLSX.utils.json_to_sheet(encabezado, { skipHeader: true });
  
      // Agregar los datos de los inscritos a la hoja de cálculo
      XLSX.utils.sheet_add_json(wsEncabezado, this.inscritos, { skipHeader: true, origin: -1 });
  
      // Crear el libro y añadir la hoja
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsEncabezado, 'Estudiantes');
  
      const nombreArchivo = `Detalle_${numeroActa}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    }
  }

}
