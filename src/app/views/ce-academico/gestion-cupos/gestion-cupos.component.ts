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
import { ShowActaComponent } from './../show-acta/show-acta.component';
import { EditActaCeComponent } from './../edit-acta-ce/edit-acta-ce.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-cupos',
  templateUrl: './gestion-cupos.component.html',
  styleUrls: ['./gestion-cupos.component.scss']
})
export class GestionCuposComponent implements OnInit {

  form: FormGroup;
  carreras: any[] = []; // Lista de PNF
  periodos: any[] = []; // Lista de periodos
  trayectos: any[] = []; // Lista de trayectos

  arrayDatos : any []= [];
  detalle_acta : any []= [];
  inscritos : any []= [];
  dataSource = new MatTableDataSource([]);
  // displayedColumns: string[] = ['acta','seccion','tipo','cupos','cupos_dis', 'doc_asignado', 'acciones'];
  displayedColumnsDetail: string[] = ['orden','carnet','cedula','nombre_completo','telefono','correo'];
  displayedColumns: string[] = ['acta','codigo_uc', 'nombre_uc', 'seccion', 'tipo', 'cupos', 'cupos_dis', 'doc_asignado', 'acciones'];

  unidadesCurriculares: any[] = [];

  trayectoAct: string;

  seccion: number;
  cuposmax: number;
  docente: string;

  periodoEnviar: string;

  tseccion: any[] = [];

  carreraSeleccionada: any;
  periodoSeleccionado: any;
  tiposeccion: string;

  programaSeleccionado: any = null;

  sinResultados: boolean = false;

  estadisticas: any = {};
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

  expansionControl = {
    trayecto: null as number | null, // Permite number y null
    mencion: null as number | null  // Permite number y null
  };

  public mostrarTrayectos: boolean = true;

  @ViewChild('gestionNewSeccion') public gestionNewSeccion: ModalDirective;
  @ViewChild('openActa') public openActa: ModalDirective;


  modalRef: BsModalRef; 

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private fb: FormBuilder,
    ) {

    }

    ngOnInit() { 
      this.form = this.fb.group({
        carreraSeleccionada: ['', Validators.required],
        periodoSeleccionado: [{ value: '', disabled: true }, Validators.required],
        trayectoSeleccionado: [{ value: '', disabled: true }, Validators.required]
      });
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

  onPnfSeleccionado(pnf: any) {
    this.form.get('periodoSeleccionado')?.reset();
    this.form.get('trayectoSeleccionado')?.reset();
    this.form.get('periodoSeleccionado')?.enable();
    this.form.get('trayectoSeleccionado')?.disable();
    this.unidadesCurriculares = []; // Limpiar los datos de la tabla
    this.sinResultados = false;
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
        this.sinResultados = this.unidadesCurriculares.length === 0;
      },
      error => {
        console.error('Error al obtener unidades curriculares: ', error);
      },
      () => this.SpinnerService.hide()
    );
  }
  

  cargarUnidadesCurricularesMencion(trayectoNombre: string, mencion: string): void {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurricularesMencionGestionCupos(this.programaSeleccionado, trayectoNombre, mencion,  this.periodoEnviar)
      .subscribe(data => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }

  // Método para manejar la apertura de un trayecto
  onTrayectoOpened(index: number): void {
    // Actualiza el trayecto expandido y cierra cualquier mención abierta
    this.expansionControl.trayecto = index;
    this.expansionControl.mencion = null; // Resetear la mención para asegurarnos de que se cierra
  }

  // Opcional: Método para manejar la apertura de una mención
  onMencionOpened(index: number, trayecto: string, mencion: string): void {
    this.expansionControl.mencion = index;
    this.cargarUnidadesCurricularesMencion(trayecto, mencion);
  }

  irAGestionSeccion(idUc: string): void {
    console.log(idUc);
    this.router.navigate(['/ce-academico/gestion-cupos/gestion-secciones-uc', idUc, this.periodoEnviar]);
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
