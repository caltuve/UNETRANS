import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { EventserviceService } from '../eventservice.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { DetMigraestudianteModalComponent } from '../det-migraestudiante-modal/det-migraestudiante-modal.component';
import { ModalDetalleVotanteComponent } from '../modal-detalle-votante/modal-detalle-votante.component';

@Component({
  selector: 'app-eleccion-presidencial2024',
  templateUrl: './eleccion-presidencial2024.component.html',
  styleUrls: ['./eleccion-presidencial2024.component.scss']
})
export class EleccionPresidencial2024Component {

  cedula!: number;
  estudiante: any;
  resultados: any;
  aspirante: any []= [];

  modalRef: BsModalRef; 

  constructor(private _formBuilder: FormBuilder,
    public eventserviceService: EventserviceService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    private modalService: BsModalService,
    ) 
    { }

    consultarCedula(){
      this.SpinnerService.show(); 
      const user = {cedula: this.cedula};
      this.eventserviceService.verifyVotante(user).subscribe(
        data=>{
          this.aspirante = data;
          //console.log(this.aspirante)
          switch (data['estatus']) {
            case 'mantenimiento':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfo('El proceso de registro de ejercicio del derecho al voto no está habilitada, sino hasta el 28/07/2024.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/eleccion-presidencial2024');
                break;
            case 'no_es_estudiante':
              this.SpinnerService.hide();
              this.notifyService.showError2('Usted no está registrado en la Base de Datos como estudiante activo, verifique su cédula e intente nuevamente.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/eleccion-presidencial2024');
              break;
            case 'no_inscrito_cne':
              this.SpinnerService.hide();
              this.notifyService.showWarning('Usted no está inscrito y/o habilitado en el CNE para ejercer su derecho al voto');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/eleccion-presidencial2024');
              break;
            case 'voto_registrado':
              this.SpinnerService.hide();
              this.notifyService.showInfo('Usted ya notificó su participación en el proceso electoral.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/eleccion-presidencial2024');
              break;
            default:
              this.SpinnerService.hide(); 
                const initialState = {
                    estudianteBase: data.estudiante
                };
                //console.log(initialState);
                // Abrir el modal con el estado inicial
                sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
                this.abrirModalDetalleEstudiante(initialState);
              //this.aspirante = data
              //this.migrastudentService.datosAspirante = data
              //this.migrastudentService.materiasAspirante = data.materias
             
              //this.notifyService.showSuccess('Bienvenido al proceso de autoregistro.');
              //this.router.navigateByUrl('/automigra-estudiante');
              break;
          }
          
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });


  abrirModalDetalleEstudiante(estudiante: any) {
    //console.log(estudiante);
    const initialState = {
      estudianteBase: estudiante.estudianteBase,
      // Otros datos que necesites pasar al modal
    };

        this.modalRef = this.modalService.show(ModalDetalleVotanteComponent, { 
          initialState: initialState,
          class: 'modal-lg custom-modal-scrollable',
        });

        this.modalRef.onHide?.subscribe(() => {
          // Esto se ejecutará cuando el modal se cierre
          this.firstFormGroup.reset();
        });

      };
}
