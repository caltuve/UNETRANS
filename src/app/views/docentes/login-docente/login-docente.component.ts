import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { DocenteService } from '../docente.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login-docente',
  templateUrl: './login-docente.component.html',
  styleUrls: ['./login-docente.component.scss']
})
export class LoginDocenteComponent {
  @ViewChild('myModalCompletado') public myModalCompletado: ModalDirective;
  cedula!: number;
  estudiante: any;
  resultados: any;
  aspirante: any []= [];

  constructor(private _formBuilder: FormBuilder,
    public docenteService: DocenteService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService
    ) 
    { }

    consultarCedula(){
      this.SpinnerService.show(); 
      const user = {cedula: this.cedula};
      this.docenteService.getDocente(user).subscribe(
        data=>{
          this.aspirante = data;
          //console.log(this.aspirante)
          switch (data['estatus']) {
            case 'completado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfo('Usted ya cumplió con el proceso de autoregistro, debe iniciar sesión en SICE.');
              this.router.navigateByUrl('/login-docente');
                break;
            case 'no registrado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showError2('Usted no está registrado como personal DOCENTE, verifique su cédula e intente nuevamente.');
              this.router.navigateByUrl('/login-docente');
                break;
            case 'sin jefe':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfoRegDoc('Es necesario que el Jefe de Departamento complete su registro para usted poder registrarse.');
              this.router.navigateByUrl('/login-docente');
                break;
            default:
              this.SpinnerService.hide(); 
              this.aspirante = data
              this.docenteService.datosAspirante = data
              this.docenteService.materiasAspirante = data.materias
              sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
              this.notifyService.showSuccess('Bienvenido al proceso de autoregistro DOCENTE.');
              this.router.navigateByUrl('/autoregistro-docente');
              break;
          }
          
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });
}
