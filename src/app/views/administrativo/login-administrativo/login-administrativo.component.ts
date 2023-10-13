import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AdministrativoService } from '../administrativo.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login-administrativo',
  templateUrl: './login-administrativo.component.html',
  styleUrls: ['./login-administrativo.component.scss']
})
export class LoginAdministrativoComponent {
  @ViewChild('myModalCompletado') public myModalCompletado: ModalDirective;
  cedula!: number;
  estudiante: any;
  resultados: any;
  aspirante: any []= [];

  constructor(private _formBuilder: FormBuilder,
    public administrativoService: AdministrativoService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService
    ) 
    { }

    consultarCedula(){
      this.SpinnerService.show(); 
      const user = {cedula: this.cedula};
      this.administrativoService.getAdministrativo(user).subscribe(
        data=>{
          this.aspirante = data;
          //console.log(this.aspirante)
          switch (data['estatus']) {
            case 'completado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showInfo('Usted ya cumplió con el proceso de autoregistro, debe iniciar sesión en SICE.');
              this.router.navigateByUrl('/login-administrativo');
                break;
            case 'no registrado':
              this.SpinnerService.hide();
              //this.myModalCompletado.show(); 
              this.notifyService.showError2('Usted no está registrado como personal administrativo, verifique su cédula e intente nuevamente.');
              this.router.navigateByUrl('/login-administrativo');
                break;
            default:
              this.SpinnerService.hide(); 
              this.aspirante = data
              this.administrativoService.datosAspirante = data
              this.administrativoService.materiasAspirante = data.materias
              sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
              this.notifyService.showSuccess('Bienvenido al proceso de autoregistro.');
              this.router.navigateByUrl('/autoregistro');
              break;
          }
          
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });
}
