import { Component,ViewChild } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm  } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from "rxjs";

import { DetalleEstudianteModalComponent } from '../detalle-estudiante-modal/detalle-estudiante-modal.component';
import { ModificarEstudianteModalComponent } from '../modificar-estudiante-modal/modificar-estudiante-modal.component';

@Component({
  selector: 'app-consultar-datos',
  templateUrl: './consultar-datos.component.html',
  styleUrls: ['./consultar-datos.component.scss']
})
export class ConsultarDatosComponent {
  displayedColumns: string[] = ['estatus','carnet', 'ult_per_ins', 'cohorte', 'annio', 'cedula','nombre_persona','pnf','gestion'];
  dataSource = new MatTableDataSource();
  hayResultados: boolean = false;
  sinResultados: boolean = false;
  
  public visible = false;

  modalRef: BsModalRef; 

  carnet: string = '';
  cedula: number | null = null;
  nombre: string = '';
  isFormValid: boolean = false;
  resultados!: string[];

  @ViewChild('formSearchPersona') formSearchPersona!: NgForm;
  constructor(public controlestudiosService: ControlEstudiosService,
              private SpinnerService: NgxSpinnerService,
              private notifyService : NotificacionService,
              private modalService: BsModalService
) {}


searchPersona(formSearchPersona: NgForm) {
  if (this.isFormValid) {
    this.SpinnerService.show(); 
    this.controlestudiosService.findPersona(formSearchPersona.value).subscribe(
      (result: any) => {
          this.hayResultados = false;
          this.sinResultados = false;
          this.dataSource.data = result;
          if (this.dataSource.data.length == 0) {
            this.SpinnerService.hide();
            this.sinResultados = this.dataSource.data.length ==0
            this.hayResultados = false;
            this.formSearchPersona.reset();
            this.isFormValid = false;
          }
          else{
            this.notifyService.showSuccess('Consulta de datos de estudiante');
            this.SpinnerService.hide();
            this.hayResultados = this.dataSource.data.length >0
            this.formSearchPersona.reset();
            this.isFormValid = false;
          }   
    
    }
    );
  }
}

  checkFormValidity() {
    this.isFormValid = !!this.carnet || !!this.cedula || !!this.nombre;
  }

  abrirDetalleEstudiante(carnet: string) {
    if (carnet) {
        this.SpinnerService.show();
        this.controlestudiosService.findPersonaInscripcion({ carnet: carnet }).subscribe({
            next: (result: any) => {
                // Verificar si se encontraron datos del estudiante
                if (result && result.estudiante) {
                    // Luego, verificar las inscripciones activas para este estudiante
                    this.findInscripcion(carnet).subscribe(dataInscripcion => {
                        this.SpinnerService.hide();
                        // Preparar el estado inicial para el modal
                        const initialState = {
                            estudianteBase: result.estudiante,
                            inscripciones: dataInscripcion, // Pasar los datos de inscripción al modal
                            hayResultadosDocumentos: dataInscripcion.length > 0,
                        };
                        //console.log(initialState);
                        // Abrir el modal con el estado inicial
                        this.abrirModalDetalleEstudiante(initialState);
                    });
                } else {
                    this.notifyService.showError('No se encontraron datos del estudiante.');
                    this.SpinnerService.hide();
                }
            },
            error: (error) => {
                console.error('Error al buscar datos del estudiante: ', error);
                this.SpinnerService.hide();
                this.notifyService.showError('Error al comunicarse con el servidor.');
            }
        });
    } else {
        this.notifyService.showWarning('Carnet no proporcionado o inválido.');
    }
}

findInscripcion(carnet: string): Observable<any> {
  // Asumiendo que `getInscripcionUCEstudiante` ya retorna un Observable
  return this.controlestudiosService.getInscripcionUCEstudiante(carnet);
}

  
  abrirModalDetalleEstudiante(estudiante: any) {
    const initialState = {
      estudianteBase: estudiante.estudianteBase,
      inscripcion: estudiante.inscripciones,
      inscrito: estudiante.hayResultadosDocumentos
      // Otros datos que necesites pasar al modal
    };

        this.modalRef = this.modalService.show(DetalleEstudianteModalComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable',
        });
      };


      abrirModificacionEstudiante(carnet: string) {
        if (carnet) {
            this.SpinnerService.show();
            this.controlestudiosService.findPersonaModify({ cedula: carnet }).subscribe({
                next: (result: any) => {
                    // Verificar si se encontraron datos del estudiante
                    if (result) {
                        // Luego, verificar las inscripciones activas para este estudiante
                        this.findInscripcion(carnet).subscribe(dataInscripcion => {
                            this.SpinnerService.hide();
                            // Preparar el estado inicial para el modal
                            const initialState = {
                                estudianteBase: result.estudiante,
                                inscripciones: dataInscripcion, // Pasar los datos de inscripción al modal
                                hayResultadosDocumentos: dataInscripcion.length > 0,
                            };
                            //console.log(initialState);
                            // Abrir el modal con el estado inicial
                            this.abrirModalModificacionEstudiante(initialState);
                        });
                    } else {
                        this.notifyService.showError('No se encontraron datos del estudiante.');
                        this.SpinnerService.hide();
                    }
                },
                error: (error) => {
                    console.error('Error al buscar datos del estudiante: ', error);
                    this.SpinnerService.hide();
                    this.notifyService.showError('Error al comunicarse con el servidor.');
                }
            });
        } else {
            this.notifyService.showWarning('Carnet no proporcionado o inválido.');
        }
    }


  abrirModalModificacionEstudiante(estudiante: any) {
    const initialState = {
      estudianteBase: estudiante.estudianteBase,
    };


        this.modalRef = this.modalService.show(ModificarEstudianteModalComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable',
          ignoreBackdropClick: true,
          keyboard: false
        });
      };


}
