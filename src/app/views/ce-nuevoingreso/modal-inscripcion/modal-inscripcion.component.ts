import { Component, ViewChild,Input } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

interface DatosReporte {
  periodos: { [key: string]: Periodo };
  materias: { [key: string]: Materia };
  calificaciones: Calificacion[];
}

interface RespuestaInscripcion {
  resultado: string;
  // Añade más propiedades según sea necesario
}

@Component({
  selector: 'app-modal-inscripcion',
  templateUrl: './modal-inscripcion.component.html',
  styleUrls: ['./modal-inscripcion.component.scss']
})
export class ModalInscripcionComponent {

  @Input() trayectos: any[] = [];

  dataSource = new MatTableDataSource();
  hayResultados: boolean = false;
  sinResultados: boolean = false;

  sinResultadosUC: boolean = false;
  todasUCInscritas: boolean = false;
  sinSeccion: boolean = false;

  periodos: any[] = [];

  unidadesPorTrayectoYSemestre: { [key: string]: any[] } = {};

  public visible = false;

  planSeleccionado: any = null; // El plan de estudios seleccionado

  datosRegimen: any = null; // El plan de estudios seleccionado

  //trayectos: any[] = [];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  carnet!: string;
  cedula!: string;
  nombre!: string;
  resultados!: string[];

  plan!: string;

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

  usrsice: string;

  constructor(public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    private changeDetectorRef: ChangeDetectorRef,
    public modalRef: BsModalRef
  ) {
    this.obtenerUsuarioActual();
  }

  cargarUnidadesCurriculares(trayectoNombre: string, semestreNumero?: number | null): void {
    this.SpinnerService.show();
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;

    // Reiniciar unidades curriculares y sinResultadosUC
    this.unidadesCurriculares = [];
    this.sinResultadosUC = false;

    this.controlestudiosService.obtenerUnidadesCurricularesInscripcion(this.planSeleccionado, this.carnet, trayectoNombre)
      .subscribe({
        next: (data) => {
          if (data && data.resultado) {
            // Reinicia las UCs y maneja los mensajes específicos
            this.unidadesCurriculares = [];
            this.sinResultadosUC = false;
            this.todasUCInscritas = data.resultado === 'todasUCInscrita';
            this.sinSeccion = data.resultado === 'sinSeccion';
          } else {
            this.sinResultadosUC = data.length === 0;
            this.todasUCInscritas = false;
            this.sinSeccion = false;
            if (!this.sinResultadosUC) {
              this.unidadesCurriculares = data.map((uc: { noCursado: any; }) => ({
                ...uc,
                periodoSeleccionado: null,
                noCursado: uc.noCursado || false
              }));
            }
          }
          this.SpinnerService.hide();
        },
        error: (error) => {
          console.error('Error al obtener las unidades curriculares:', error);
          this.SpinnerService.hide();
        }
      });
  }


  trackByCodigoUC(index: number, uc: UnidadCurricular): string {
    return uc.codigo_uc;
  }

  trackByPeriodo(index: number, periodo: any): string {
    return periodo.periodo;
  }

  closeModal() {
    this.modalRef.hide();
  }

  
  inscribir() {
    this.SpinnerService.hide();
    const unidadesSeleccionadas = this.unidadesCurriculares.filter(uc => uc.seleccionado);
  
    if (unidadesSeleccionadas.length > 0) {
      // Mapea las unidades curriculares seleccionadas a la estructura deseada
      const inscripciones = unidadesSeleccionadas.map(uc => {
        return {
          carnet: this.carnet, // Asume que 'carnetActual' contiene el carnet del estudiante.
          acta: uc.acta, // Asume que 'acta' es el identificador de la UC o el número de acta.
          usrsice: this.usrsice
        };
      });
  
     // Llama a tu servicio para enviar los datos al backend.
    this.controlestudiosService.inscribirEstudiante({ inscripciones: inscripciones }).subscribe({
      next: (respuesta: any) => {
        // Verifica la respuesta del servidor
        if (respuesta['resultado'] === "OKOK") {
          // Notificación de éxito
          this.notifyService.showSuccess("Inscripción realizada con éxito.");
          this.controlestudiosService.notificarInscripcionCompletada(this.carnet); // Notificar que la inscripción se completó
          this.SpinnerService.hide();
          this.closeModal();
        } else {
          // Notificación de fallo esperado controlado por el backend
          this.notifyService.showError("Ocurrió un error al inscribir, notifiquelo a soportesice@unetrans.edu.ve.");
          this.SpinnerService.hide();
          this.closeModal();
        }
      },
      error: (error) => {
        // Manejo de errores de red o del servidor
        console.error('Error en la inscripción', error);
        this.notifyService.showError("Error al comunicarse con el servidor.");
        this.SpinnerService.hide();
        this.closeModal();
      }
    });
  } else {
    // Manejar el caso de que no se seleccionó ninguna unidad curricular.
    this.notifyService.showError("Debe seleccionar al menos una unidad curricular para la inscripción.");
  }
  }

  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
  }

}
