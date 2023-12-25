import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GestionPlanEstudiosModalComponent } from './../gestion-plan-estudios-modal/gestion-plan-estudios-modal.component';
import { AddUnidadCurricularModalComponent } from './../add-unidad-curricular-modal/add-unidad-curricular-modal.component';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { Console } from 'console';

@Component({
  selector: 'app-gestion-plan-estudios',
  templateUrl: './gestion-plan-estudios.component.html',
  styleUrls: ['./gestion-plan-estudios.component.scss']
})
export class GestionPlanEstudiosComponent implements OnInit {

  
  idPrograma: number;
  datosPrograma: any = {}; // Aquí almacenarás los datos del programa
  planesEstudio = []; 
  trayectos: any[] = [];
  displayedColumns: string[] = ['codigoPlan','nombrePlan','estatus','vig_desde','vig_hasta'];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  hayResultadosPlanes: boolean = false;
  sinResultadosPlanes: boolean = false;

  trayectoActual: string;
semestreActual: number | null;

    mencionActual: string;

  @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;
  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    public bsModalRef: BsModalRef,) { }

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
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
          // Ahora los datos del programa están disponibles para ser utilizados en tu plantilla
        },
        error => {
          // Manejo de errores, por ejemplo, mostrar un mensaje de error
        }
      );
    }

// Método para abrir el modal
abrirModalGestionPlanEstudios(): void {
  const initialState = {
    datosPrograma: this.datosPrograma
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
      console.log('El plan de estudios se ha actualizado');
      this.cargarPlanesEstudios(this.idPrograma);
    }
  });
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


      this.cargarUnidadesCurriculares(this.trayectoActual, this.semestreActual);
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

  cargarUnidadesCurriculares(trayectoNombre: string, semestreNumero?: number | null): void {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurriculares(this.planSeleccionado, trayectoNombre, semestreNumero)
      .subscribe(data => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }


  cargarUnidadesCurricularesMencion(trayectoNombre: string, mencion: string): void {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerUnidadesCurricularesMencion(this.planSeleccionado, trayectoNombre, mencion)
      .subscribe(data => {
        this.unidadesCurriculares = data;
        this.SpinnerService.hide();
      });
  }


}
