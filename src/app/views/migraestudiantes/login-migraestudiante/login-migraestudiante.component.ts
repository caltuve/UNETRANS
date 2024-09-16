import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { MigrastudentService } from '../migrastudent.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DetMigraestudianteModalComponent } from '../det-migraestudiante-modal/det-migraestudiante-modal.component';

@Component({
  selector: 'app-login-migraestudiante',
  templateUrl: './login-migraestudiante.component.html',
  styleUrls: ['./login-migraestudiante.component.scss']
})
export class LoginMigraestudianteComponent {

  cedula!: number;
  estudiante: any;
  resultados: any;
  aspirante: any []= [];

  modalRef: BsModalRef; 

  constructor(private _formBuilder: FormBuilder,
    public migrastudentService: MigrastudentService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    private modalService: BsModalService,
    ) 
    { }

    consultarCedula(){
      this.SpinnerService.show(); 
      const user = {cedula: this.cedula};
      this.migrastudentService.getMigraEstudiante(user).subscribe(
        data=>{
          this.aspirante = data;
          //console.log(this.aspirante)
          switch (data['estatus']) {
            case 'mantenimiento':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfoMtto('En este momento estamos haciendo una actualización de la aplicación, por favor intenta nuevamente más tarde.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/login-migraestudiante');
                break;
            case 'completado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfo('Usted ya cumplió con el proceso de autoregistro, debe iniciar sesión en SICE.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/login');
                break;
            case 'existente_sice':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfo('Usted ya es estudiante registrado no necesita hacer el proceso de migración, debe iniciar sesión en SICE con su usuario y clave.');
              this.firstFormGroup.reset();
              this.router.navigateByUrl('/login');
                break;
            case 'no registrado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showError2('Usted no está registrado en la Base de Datos, verifique su cédula e intente nuevamente si el inconveniente persiste diríjase a Control de Estudios');
              this.router.navigateByUrl('/login-migraestudiante');
              this.firstFormGroup.reset();
                break;
            case 'iniciado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.aspirante = data.estudiante;
              this.migrastudentService.datosAspirante = data.estudiante;
              console.log(this.aspirante);
              this.notifyService.showSuccess('Bienvenido al proceso de automigración del SICE-UNETRANS.');
              this.router.navigateByUrl('/automigra-estudiante');
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
    console.log(estudiante);
    const initialState = {
      estudianteBase: estudiante.estudianteBase,
      // Otros datos que necesites pasar al modal
    };

        this.modalRef = this.modalService.show(DetMigraestudianteModalComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable',
        });

        this.modalRef.onHide?.subscribe(() => {
          // Esto se ejecutará cuando el modal se cierre
          this.firstFormGroup.reset();
        });

      };
}
