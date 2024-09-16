import { Component, QueryList, ViewChild, ViewChildren,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ChangeDetectorRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { ModalPostMigracionPlanesEstudiosComponent } from '../modal-post-migracion-planes-estudios/modal-post-migracion-planes-estudios.component';

export interface Estudiante {
  carnet: string;
  desc_estatus: string,
  nac: string,
  nombre_completo: string;
  ced_pas: number,
  pnf: string,
  ult_per_inscrito: string,
  cohorte: string
  trayecto: string,
  foto: string,
  cedula_formateada: string,
  carnet_formateado: string,
  estatus_exp: string,
  email: string,
  tlf_cel: string,
  // ... otros campos relevantes
}

interface UnidadCurricular {
  codigo_uc: string;
  nombre_uc: string;
  creditos: number;
  nota_minima: number;
  calificacion: number | null;
  periodoSeleccionado: string | null;
  noCursado: boolean;
  periodosFiltrados?: string[];
}

interface Periodo {
  nombre: string;
  materias: string[];
}

interface Materia {
  id: string;
  nombre: string;
}

interface Calificacion {
  materiaId: string;
  periodoAcademico: string;
  calificacion: string; // o 'number' si es numérico
  // Agrega otros campos como fecha, observaciones, etc., según sean necesarios
}

@Component({
  selector: 'app-post-migracion',
  templateUrl: './post-migracion.component.html',
  styleUrls: ['./post-migracion.component.scss']
})
export class PostMigracionComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  estudianteForm: FormGroup;
  academicForm: FormGroup;
  planes = ['Plan 1', 'Plan 2', 'Plan 3']; // Reemplazar con planes reales
  estatuses = ['Activo', 'Inactivo', 'Egresado'];

  copiado = false;
  cedulacaptada: number;
  carnetActual: string;
  modalidadIngresoActual: string;
  dataSourceEstudiante = new MatTableDataSource<Estudiante>();
  dataSource = new MatTableDataSource();

  programas: any[] = [];
  displayedColumns: string[] = ['nombre_programa', 'afiliacion','titulacion', 'desc_estatus_est', 'nombre_plan', 'gestion'];
  displayedColumnsCalificaciones: string[] = ['carnet','cohorte', 'pnf', 'grado', 'plan', 'estatus'];

  modalidadesIngreso: any []= [];

  sinResultadosUC: boolean = false;

  hayResultados: boolean = false;
  sinResultados: boolean = false;

  periodos: any[] = [];

  idPlanValido: boolean = false;

  modalRef: BsModalRef;

  unidadesPorTrayectoYSemestre: { [key: string]: any[] } = {};

  public visible = false;

  planSeleccionado: any = null; // El plan de estudios seleccionado

  datosRegimen: any = null; // El plan de estudios seleccionado

  trayectos: any[] = [];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  carnet!: string;
  cedula!: string;
  nombre!: string;
  resultados!: string[];

  plan!: string;
  mensajeSinResultados!: string;

  usr = {
    nac: null,
    cedula: null,
    nombre_completo: null,
    nombre_corto: null,
    fecnac: null,
    carnet: null,
    pnf: null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private location: Location,
  ) {
      this.estudianteForm = this.fb.group({
        modalidadIngreso: ['', Validators.required]
      });

    this.academicForm = this.fb.group({
      programa: ['', Validators.required],
      plan: ['', Validators.required],
      estatus: ['', Validators.required]
    });

    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
      const cedula = params.get('cedula');
      console.log(cedula)
      if (cedula) {
        this.cedulacaptada = +cedula;
        this.searchPersonaPM();
      } else {
        // Manejo de la situación donde el id no está presente
        // Redireccionar o mostrar un mensaje de error, según sea necesario
      }
    });
    this.findModIngreso();
  }

  onAddAcademicInfo() {
    // Lógica para añadir información académica a la base de datos
    console.log(this.academicForm.value);
    // Reset form after adding
    this.academicForm.reset();
  }

  irAGestionPostMigracion(cedula: number): void {
    this.router.navigate(['/ce-nuevoingreso/migracion/post-migracion', cedula]);
  }

  searchPersonaPM() {
    this.SpinnerService.show();
    this.controlestudiosService.findPersonaPostMigracion(this.cedulacaptada).subscribe(
      (result: any) => {
        // Asumiendo que la respuesta tiene dos propiedades: 'estudiante' y 'documentos'
        if (result && result.estudiante) {
          this.dataSourceEstudiante.data = [result.estudiante]; // Almacena los datos del estudiante
          this.carnetActual = result.estudiante.carnet;
          this.modalidadIngresoActual = result.estudiante.mod_ingreso;
          this.estudianteForm.patchValue({
            modalidadIngreso: result.estudiante.mod_ingreso || ''
          });
          
          this.notifyService.showSuccess('Consulta de datos de estudiante');
          // Actualizar el FormArray
        } else {

        }

        this.SpinnerService.hide();
      },
      error => {
        // Manejo de error
        console.error('Error al buscar datos: ', error);
        this.SpinnerService.hide();
      }
    );
  }

  searchPersona() {
    this.SpinnerService.show();
    this.trayectos = []; // Limpia los trayectos existentes
    this.sinResultadosUC = false; // Resetea el estado de resultados UC
    this.planSeleccionado = null; // Resetea el plan seleccionado
    this.controlestudiosService.findPersonaCalificaciones({cedula: this.cedulacaptada}).subscribe(
      (result: any) => {
        this.hayResultados = false;
        this.sinResultados = false;
        this.dataSource.data = result;
        if (this.dataSource.data.length == 0) {
          this.SpinnerService.hide();
          this.sinResultados = this.dataSource.data.length == 0
          this.hayResultados = false;
        }
        else {
          this.notifyService.showSuccess('Consulta de datos de estudiante');
          this.SpinnerService.hide();
          this.hayResultados = this.dataSource.data.length > 0
        }

      }
    );
  }



  findModIngreso(){
    this.aspiranteService.getModIngreso().subscribe(
      (result: any) => {
          this.modalidadesIngreso = result;
    }
    );
  }

  cargarProgramasDelEstudiante() {
    
    if (this.estudianteForm.value.modalidadIngreso !== this.modalidadIngresoActual) {
      this.actualizarModalidadIngreso();
    } else {
      this.SpinnerService.show();
      // Invocar el servicio para cargar programas del estudiante
      this.controlestudiosService.findProgramsForStudent(this.cedulacaptada).subscribe(
        (programas: any[]) => {
          this.programas = programas;
          this.SpinnerService.hide();
          this.verificarIdPlan();
          
        },
        error => {
          console.error('Error al cargar programas: ', error);
          this.notifyService.showError('Error al cargar programas del estudiante.');
          this.SpinnerService.hide();
        }
      );
    }
  }

  actualizarModalidadIngreso() {
    const datosActualizados = {
      carnet: this.carnetActual,
      modalidadIngreso: this.estudianteForm.value.modalidadIngreso
    };

    this.controlestudiosService.actualizarModalidadIngresoPM(datosActualizados).subscribe(
      response => {
        this.notifyService.showSuccess('Modalidad de ingreso actualizada correctamente.');
        // Cargar programas asociados al estudiante
        this.controlestudiosService.findProgramsForStudent(this.cedulacaptada).subscribe(
          (programas: any[]) => {
            this.programas = programas;
            this.verificarIdPlan();
          },
          error => {
            console.error('Error al cargar programas: ', error);
            this.notifyService.showError('Error al cargar programas del estudiante.');
          }
        );
      },
      error => {
        console.error('Error al actualizar modalidad de ingreso:', error);
        this.notifyService.showError('Error al actualizar modalidad de ingreso.');
      }
    );
  }

  verificarIdPlan(): void {
    this.idPlanValido = this.programas.some(programa => {
      const idPlan = programa.id_plan ? String(programa.id_plan).trim() : '';
      return idPlan !== '';
    });
  }



  abrirModalGestion(programa: any): void {
    const initialState = {
      programa: programa,
      mode: 'edit' as 'edit'
    };
  
    this.modalRef = this.modalService.show(ModalPostMigracionPlanesEstudiosComponent, { 
      initialState: initialState,
      class: 'modal-xl custom-modal-scrollable',
      ignoreBackdropClick: true,
      keyboard: false
    });
  
    // Suscribirse al evento onClose del modal
    this.modalRef.content.onClose.subscribe(() => {
      this.cargarProgramasDelEstudiante();
    });
  }

  abrirModalCrear(): void {
    const initialState = {
      programa: {},  // Pasar un objeto vacío para creación
      mode: 'create' as 'create'
    };
  
    this.modalRef = this.modalService.show(ModalPostMigracionPlanesEstudiosComponent, { 
      initialState: initialState,
      class: 'modal-xl custom-modal-scrollable',
      ignoreBackdropClick: true,
      keyboard: false
    });
  
    // Suscribirse al evento onClose del modal
    this.modalRef.content.onClose.subscribe(() => {
      this.cargarProgramasDelEstudiante();
    });
  }

  agregarPrograma() {
    // Lógica para agregar el programa a la base de datos
  }


    // Método para manejar el clic en una fila del mat-table
    onFilaClic(tipo_titulacion: number, carnet: string) {
      this.sinResultadosUC = true;
      this.cargarTrayectos(tipo_titulacion,carnet);
      // Reiniciar el acordeón
      this.reiniciarAcordeon();
    }

    cargarTrayectos(tipo_titulacion: number, carnet: string ) {
      this.SpinnerService.show();
      // Lógica para cargar los trayectos del plan seleccionado
      this.controlestudiosService.obtenerTrayectosPorCodigoPlanYTrayecto(tipo_titulacion,carnet).subscribe(
        data => {
          this.trayectos = data; // Asegúrate de que el servicio retorne el formato adecuado
          console.log(this.trayectos)
          this.SpinnerService.hide();
          
        },
        error => {
          // Manejo de errores
          console.error('Error al cargar los trayectos:', error);
          this.SpinnerService.hide();
        }
      );
    }
  
    reiniciarAcordeon() {
      setTimeout(() => {
        this.accordion.closeAll();
      }, 0);
    }
  
  
    cargarUnidadesCurriculares(idTrayecto: number): void {
      this.SpinnerService.show();
      const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
  
      // Reiniciar unidades curriculares y sinResultadosUC
      this.unidadesCurriculares = [];
      this.sinResultadosUC = false;
  
      this.controlestudiosService.obtenerUnidadesCurricularesGrado(idTrayecto, carnetEstudiante)
    .subscribe((data: any) => {
      if (data.mensaje) {
        this.sinResultadosUC = true;
        this.mensajeSinResultados = data.mensaje;  // Guarda el mensaje específico
        this.SpinnerService.hide();
      } else {
        this.sinResultadosUC = data.length === 0;
        if (!this.sinResultadosUC) {
          this.unidadesCurriculares = data.map((uc: UnidadCurricular) => ({
            ...uc,
            periodoSeleccionado: null,
            noCursado: uc.noCursado || false
          }));
        }
        this.SpinnerService.hide();
        this.findPeriodos();
      }
    });
    }
  
    copiarUC(ucOriginal: any): void {
      // Encuentra el índice de la unidad curricular actual en el array
      const indiceUCActual = this.unidadesCurriculares.indexOf(ucOriginal);
  
      // Copia la unidad curricular
      const nuevaUC = { ...ucOriginal, calificacion: null, periodoSeleccionado: null };
  
      // Actualizar la nueva UC con los períodos filtrados
      nuevaUC.periodosFiltrados = this.obtenerPeriodosFiltrados(ucOriginal);
  
      // Inserta la nueva UC justo después de la actual
      this.unidadesCurriculares.splice(indiceUCActual + 1, 0, nuevaUC);
  
      // Crear un nuevo array para asegurarse de que los cambios se detecten
      this.unidadesCurriculares = [...this.unidadesCurriculares];
  
      // Refresca el dataSource si estás utilizando MatTableDataSource
      // this.dataSource.data = [...this.unidadesCurriculares];
  
      // Forzar la detección de cambios si es necesario
      this.changeDetectorRef.detectChanges();
    }
  
    guardarCalificacionesTrayecto(trayecto: any) {
      // Añadir un nuevo registro de calificación para la misma UC pero con el próximo período
      // Puedes añadirlo al array de unidadesCurriculares u otro array dedicado a registros adicionales
    }
  
    findPeriodos() {
      this.SpinnerService.show();
      this.controlestudiosService.getPeriodosCalificaciones().subscribe(
        (data: any) => {
  
          // Filtrar los períodos por régimen
          this.periodos = data.filter((periodo: { periodicidad: string; }) => periodo.periodicidad === 'ANUAL');
          this.SpinnerService.hide();
        }
      );
    }
  
    onPeriodoChange(ucActual: any): void {
      this.SpinnerService.show();
      if (ucActual.periodoSeleccionado) {
        this.controlestudiosService.obtenerNotaMinima(ucActual.codigo_uc, ucActual.periodoSeleccionado).subscribe({
          next: escalas => {
            ucActual.nota_minima = escalas.nota_minima;
            ucActual.nota_maxima = escalas.nota_maxima;
            ucActual.nota_aprobatoria = escalas.nota_aprobatoria;
            ucActual.nota_apro_proyecto = escalas.nota_apro_proyecto;
            ucActual.nota_aprobatoria_final = escalas.nota_aprobatoria_final;
    
            this.validarCalificacion(ucActual);
            this.validarCalificacionesCompletas();
            this.SpinnerService.hide();
          },
          error: err => {
            const errorMessage = err.error?.error || 'Error desconocido';
            this.notifyService.showError(`${errorMessage}`);
            this.SpinnerService.hide();
          }
        });
      }
    }
  
  isApproved(uc: any): boolean {
    return uc.calificacion >= uc.nota_aprobatoria && uc.calificacion <= uc.nota_maxima;
  }
  
  isOutOfRange(uc: any): boolean {
    return uc.calificacion > uc.nota_maxima;
  }
  
  isFailed(uc: any): boolean {
    return uc.calificacion < uc.nota_aprobatoria && uc.calificacion >= uc.nota_minima;
  }
  
  validarCalificacion(uc: any): void {
    if (uc.calificacion && uc.calificacion < uc.nota_aprobatoria_final) {
      this.copiarUC(uc);
      this.validarCalificacionesCompletas();
    }
  }
  
    obtenerPeriodosFiltrados(ucActual: any): any[] {
      // Si la UC actual no tiene período seleccionado o no está reprobada, mostrar todos los períodos
      if (!ucActual.periodoSeleccionado || ucActual.calificacion >= ucActual.nota_aprobatoria_final) {
        return this.periodos;
      }
  
      // Encontrar el índice del período actual en el array de períodos
      const indicePeriodoActual = this.periodos.findIndex(p => p.periodo === ucActual.periodoSeleccionado);
  
      // Si no se encuentra el período, devolver todos los períodos
      if (indicePeriodoActual === -1) return this.periodos;
  
      // Devolver los períodos anteriores al actual
      // Asumiendo que la lista de períodos está ordenada de más reciente a más antiguo
      return this.periodos.slice(0, indicePeriodoActual);
    }
  
  
    guardarCalificaciones(): void {
      this.SpinnerService.show();
      if (!this.validarCalificacionesCompletas()) {
        console.error('No se han completado todas las calificaciones.');
        return;
      }
  
      // Suponiendo que 'carnet' es parte de la primera fila de dataSource
      const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
      console.log(carnetEstudiante);
      if (!carnetEstudiante) {
        console.error('No se encontró el carnet del estudiante.');
        return;
      }
  
      const usrid = this.usr ? this.usr.usrsice : null; // Asegúrate de que 'id' es la propiedad correcta
  
      if (!usrid) {
        console.error('No se encontró el ID del usuario.');
        return;
      }
  
      const calificacionesParaEnviar = this.unidadesCurriculares
        .filter(uc => !uc.noCursado) // Excluir unidades curriculares marcadas como 'No Cursado'
        .map(uc => {
          // Determinar la condición de la UC
          const condicion = uc.calificacion == null || uc.calificacion === '' ? 'SIN_CALIFICAR' :
            uc.calificacion >= uc.nota_aprobatoria_final ? 'APROBADO' : 'REPROBADO';
  
          return {
            codigoUC: uc.codigo_uc,
            nombreUC: uc.nombre_uc,
            creditos: uc.creditos,
            calificacion: uc.calificacion,
            periodo: uc.periodoSeleccionado,
            condicion: condicion,
            usrid: usrid, // Añade el usrid a cada objeto de calificación
            carnet: carnetEstudiante
          };
        });
  
  
  
  
      this.controlestudiosService.enviarCalificaciones(calificacionesParaEnviar).subscribe({
        next: (response) => {
          if (response.success) {
  
            this.SpinnerService.hide();
            this.notifyService.showSuccess('Calificaciones procesadas');
  
          } else if (response.error) {
  
            this.SpinnerService.hide();
            this.notifyService.showError(`Error al procesar las calificaciones: ${response.error}`);
  
          }
        },
        error: (error) => {
          this.notifyService.showError('Error al enviar los datos al servidor.');
          this.SpinnerService.hide();
  
        }
      });
    }
  
    // Función para determinar la condición
    determinarCondicion(uc: any): string {
      if (uc.calificacion == null || uc.calificacion === '') {
        return 'SIN_CALIFICAR';
      } else if (uc.calificacion >= uc.nota_minima) {
        return 'APROBADO';
      } else {
        return 'REPROBADO';
      }
    }
  
    validarCalificacionesCompletas(): boolean {
      // Verifica si hay al menos una unidad curricular no marcada como 'No Cursado'
      const hayUCNoCursada = this.unidadesCurriculares.some(uc => !uc.noCursado);
  
      // Si todas las UC están marcadas como 'No Cursado', deshabilita el botón
      if (!hayUCNoCursada) {
        return false;
      }
  
      // Si al menos una UC no está marcada como 'No Cursado', verifica que todas las UC no marcadas como 'No Cursado' tengan calificación y período
      return this.unidadesCurriculares.every(uc =>
        uc.noCursado ||
        (uc.calificacion != null &&
          uc.periodoSeleccionado != null &&
          uc.calificacion >= 1 &&
          uc.calificacion <= 20)
      );
    }
  
    onNoCursadoChange(uc: any): void {
      if (uc.noCursado) {
        // Inhabilita el select de período y limpia los valores de calificación y período
        uc.periodoSeleccionado = null;
        uc.calificacion = null;
      }
    }
  
    trackByCodigoUC(index: number, uc: UnidadCurricular): string {
      return uc.codigo_uc;
    }
  
    trackByPeriodo(index: number, periodo: any): string {
      return periodo.periodo;
    }

    copiarCedula() {
      const cedula = String(this.cedulacaptada); 
      navigator.clipboard.writeText(cedula).then(() => {
        this.copiado = true;
        setTimeout(() => {
          this.copiado = false;
        }, 4000); // Oculta el mensaje después de 2 segundos
      }, (err) => {
        console.error('Error al copiar cédula: ', err);
      });
    }

    goBack() {
      const data = { 
        cedula: String(this.cedulacaptada), 
        en_gestion: false, 
        gestor: null,
        revision: 'RPM' 
      };
      this.controlestudiosService.marcarEnGestion(data).subscribe(
        () => {
        },
        error => {
          console.error('Error al desmarcar solicitud como en gestión:', error);
        }
      );
      this.location.back();
    }

}
