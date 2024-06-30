import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GestionPlanEstudiosModalComponent } from './../gestion-plan-estudios-modal/gestion-plan-estudios-modal.component';
import { AddUnidadCurricularModalComponent } from './../add-unidad-curricular-modal/add-unidad-curricular-modal.component';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
//import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { Console } from 'console';
import { NotificacionService } from './../../../notificacion.service'
import { ModificarUcModalComponent } from '../modificar-uc-modal/modificar-uc-modal.component';
import { AddEditPlanComponent } from '../add-edit-plan/add-edit-plan.component';
import { SharedDataService } from '../shared-data-service.service'

@Component({
  selector: 'app-gestion-plan-estudios',
  templateUrl: './gestion-plan-estudios.component.html',
  styleUrls: ['./gestion-plan-estudios.component.scss']
})
export class GestionPlanEstudiosComponent implements OnInit {

  selectedIndex: number = -1;

  idPrograma: number;
  datosPrograma: any = {}; // Aquí almacenarás los datos del programa
  menciones = [];
  planesEstudio = []; 
  trayectos: any[] = [];
  displayedColumns: string[] = ['codigoPlan', 'regimen', 'tipo', 'afilia','nombrePlan','estatus','mencion','gestion'];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  hayResultadosPlanes: boolean = false;
  sinResultadosPlanes: boolean = false;

  trayectoActual: string;

  trayectoAct: string
semestreActual: number | null;

modalRef: BsModalRef; 

    mencionActual: string;

    usrsice: string;

    rol: any []= [];


    codPrograma: number;
    codOpsu: number;
    tipoProg: string;
    departamento: string;
    idDpto: number;
    nomPro: string;
    siglas: string;
    jefe: string;

  @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;
  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private sharedDataService: SharedDataService
    ) { 
      this.obtenerUsuarioActual();
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
        const idParam = params.get('id');
        if (idParam) {
          this.idPrograma = +idParam;
          this.cargarDatosPrograma(this.idPrograma);
          this.cargarPlanesEstudios(this.idPrograma);
        } else {
          // Manejo de la situación donde el id no está presente
          // Redireccionar o mostrar un mensaje de error, según sea necesario
        }
      });
    }
  
    cargarDatosPrograma(id: number): void {
      this.controlestudiosService.obtenerPrograma(id).subscribe(
        data => {
          this.datosPrograma = data;
          if (this.datosPrograma && this.datosPrograma.length > 0) {
            const programa = this.datosPrograma[0];
            this.codPrograma = programa.cod_programa;
            this.codOpsu = programa.cod_opsu;
            this.tipoProg = programa.tipo_prog;
            this.departamento = programa.departamento;
            this.idDpto = programa.id_dpto;
            this.nomPro = programa.nom_pro;
            this.siglas = programa.siglas;
            this.jefe = programa.jefe;
          }
          this.controlestudiosService.obtenerMenciones(id).subscribe(
            (            menciones: never[]) => {
              this.menciones = menciones;
              if (this.menciones.length === 0) {
                //this.gestionPlanForm.removeControl('mencion');
              }
            }
          );
        },
        error => {
          // Manejo de errores, por ejemplo, mostrar un mensaje de error
        }
      );
    }

    irAGestionPlanEstudios(): void {
      const id = this.route.snapshot.paramMap.get('id');
      this.sharedDataService.setDatosPrograma(this.datosPrograma);
      this.sharedDataService.setMenciones(this.menciones);
      this.router.navigate([`/ce-academico/programa-academico/gestion-plan-estudios/${id}/add-edit-plan`]);
    }

// Método para abrir el modal
abrirModalGestionPlanEstudios(): void {
  const initialState = {
    datosPrograma: this.datosPrograma,
    menciones: this.menciones
  };

  const modalOptions = {
    initialState: initialState,
    class: 'modal-xl'
  };

  const bsModalRef: BsModalRef = this.modalService.show(GestionPlanEstudiosModalComponent, modalOptions);

  // Suscribirse al evento emitido por el modal
  const modalComponent = bsModalRef.content as GestionPlanEstudiosModalComponent;
  modalComponent.actualizacionCompleta.subscribe((completo) => {
    if (completo) {
      // Realizar alguna acción, como recargar los datos
      //console.log('El plan de estudios se ha actualizado');
      this.cargarPlanesEstudios(this.idPrograma);
    }
  });
}

obtenerUsuarioActual() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  this.usrsice = currentUser.usrsice;
  this.rol = currentUser.rol;
}

  planSeleccionado: any = null; // El plan de estudios seleccionado

  // Método para cargar los planes de estudios (ajustar según tu servicio)
  cargarPlanesEstudios(id: number) {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerPlanesEstudios(id).subscribe(
      data => {
        this.hayResultadosPlanes = false;
        this.sinResultadosPlanes = false;
        this.planesEstudio = data;
        if (this.planesEstudio.length == 0) {
          this.sinResultadosPlanes = this.planesEstudio.length == 0;
          this.hayResultadosPlanes = false;
          this.SpinnerService.hide();
         } else{
          this.planesEstudio = data;
          this.hayResultadosPlanes = this.planesEstudio.length > 0;
          this.SpinnerService.hide();
         }
        this.SpinnerService.hide();
        // Ahora los datos del programa están disponibles para ser utilizados en tu plantilla
      },
      error => {
        this.SpinnerService.hide();
        // Manejo de errores, por ejemplo, mostrar un mensaje de error
      }
    );
  }

  // Método para manejar el clic en una fila del mat-table
  onFilaClic(codigoPlan: string) {

    this.planSeleccionado = codigoPlan;
    //console.log(this.planSeleccionado);
    // Aquí puedes cargar más detalles del plan si es necesario
    this.cargarTrayectos(codigoPlan);
  }

  cargarTrayectos(codigoPlan: string) {
    this.SpinnerService.show();
    // Lógica para cargar los trayectos del plan seleccionado
    this.controlestudiosService.obtenerTrayectosPorCodigoPlan(codigoPlan).subscribe(
      data => {
        this.trayectos = data; // Asegúrate de que el servicio retorne el formato adecuado
        this.SpinnerService.hide();
      },
      error => {
        // Manejo de errores
        console.error('Error al cargar los trayectos:', error);
        this.SpinnerService.hide();
      }
    );
  }

  addUnidadesCurriculares(trayectoId: string, semestreNumero?: number): void {

    this.trayectoActual = trayectoId;
    this.semestreActual = semestreNumero || null;

    const initialState = {
      trayectoId: trayectoId,
      semestreNumero: semestreNumero || null,
      codigoPlan: this.planSeleccionado ,// Asumiendo que 'planSeleccionado' contiene el código del plan
      trayectoActual: trayectoId,
      semestreActual: semestreNumero
    };
    const modalOptions = {
      initialState: initialState,
      class: 'modal-xl'
    };

    const bsModalRef: BsModalRef = this.modalService.show(AddUnidadCurricularModalComponent, modalOptions); 
    // Suscribirse al evento emitido por el modal
  const modalComponent = bsModalRef.content as AddUnidadCurricularModalComponent;
  modalComponent.actualizacionCompleta.subscribe((completo) => {
    if (completo) {
      // Realizar alguna acción, como recargar los datos


      this.cargarUnidadesCurriculares(this.trayectoActual);
      this.cargarUnidadesCurricularesSemestral (this.trayectoActual, this.semestreActual!);
    } 
  });

  }

  addUnidadesCurricularesMencion(trayectoId: string, mencion: string): void {

    this.trayectoActual = trayectoId;
    this.mencionActual = mencion;

    const initialState = {
      trayectoId: trayectoId,
      codigoPlan: this.planSeleccionado ,// Asumiendo que 'planSeleccionado' contiene el código del plan
      semestreNumero: null,
      trayectoActual: trayectoId,
      mencionActual: mencion
    };
    const modalOptions = {
      initialState: initialState,
      class: 'modal-xl'
    };
    const bsModalRef: BsModalRef = this.modalService.show(AddUnidadCurricularModalComponent, modalOptions); 
    // Suscribirse al evento emitido por el modal
  const modalComponent = bsModalRef.content as AddUnidadCurricularModalComponent;
  modalComponent.actualizacionCompleta.subscribe((completo) => {
    if (completo) {
      // Realizar alguna acción, como recargar los datos


      this.cargarUnidadesCurricularesMencion(this.trayectoActual, this.mencionActual);
    } 
  });

  }

  cargarUnidadesCurriculares(trayectoNombre: string): void {
    this.trayectoAct = trayectoNombre;
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurriculares(this.planSeleccionado, trayectoNombre)
      .subscribe((data: any[]) => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }

  cargarUnidadesCurricularesSemestral(trayectoNombre: string, semestreNumero: number): void {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurricularesSemestre(this.planSeleccionado, trayectoNombre, semestreNumero)
      .subscribe((data: any[]) => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }


  cargarUnidadesCurricularesMencion(trayectoNombre: string, mencion: string): void {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurricularesMencion(this.planSeleccionado, trayectoNombre, mencion)
      .subscribe((data: any[]) => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }

  cambiarIndice(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = -1; // Cerrar el panel si ya está abierto
    } else {
      this.selectedIndex = index; // Abrir el panel seleccionado
    }
  }

  selectedTrayecto: any = null; // Variable para rastrear el trayecto seleccionado

cambiarTrayecto(trayecto: any) {
  //console.log(trayecto);
  if (this.selectedTrayecto === trayecto) {
    this.selectedTrayecto = null; // Si se hace clic en el mismo trayecto, cierra todos los paneles internos
  } else {
    this.selectedTrayecto = trayecto; // Establece el trayecto seleccionado
  }
}

abrirModificacionUc(id_uc: string) {
  if (id_uc) {
      this.SpinnerService.show();
      this.controlestudiosService.findUcModify({ id_uc: id_uc }).subscribe({
          next: (result: any) => {
              // Verificar si se encontraron datos del estudiante
              if (result) {
                this.SpinnerService.hide();
                  // Luego, verificar las inscripciones activas para este estudiante
                      const initialState = {
                        ucBase: result.uc,
                      };

                      this.abrirModalModificacionUc(initialState);
              } else {
                  this.notifyService.showError('No se encontraron datos de la UC.');
                  this.SpinnerService.hide();
              }
          },
          error: (error: any) => {
              console.error('Error al buscar datos de la UC: ', error);
              this.SpinnerService.hide();
              this.notifyService.showError('Error al comunicarse con el servidor.');
          }
      });
  } else {
      this.notifyService.showWarning('Error: 005, notificar a: soportesice@unetrans.edu.ve.');
  }
}

abrirModalModificacionUc(uc: any) {
  const initialState = {
    ucBase: uc.ucBase,
  };

      this.modalRef = this.modalService.show(ModificarUcModalComponent, { 
        initialState: initialState,
        class: 'modal-xl custom-modal-scrollable',
        ignoreBackdropClick: true,
        keyboard: false
      });

      this.modalRef.content.actualizacionCompleta.subscribe(() => {
        this.cargarUnidadesCurriculares(this.trayectoAct);
      });
    };


    irAGestionUnidadesCurriculares(idPlan: number): void {
      const id = this.route.snapshot.paramMap.get('id');
      console.log(idPlan);
      this.router.navigate([`/ce-academico/programa-academico/gestion-plan-estudios/${id}/unidad-curricular`, idPlan]);
    }

}
