import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login-aspirante',
  templateUrl: './login-aspirante.component.html',
  styleUrls: ['./login-aspirante.component.scss',
]
})
export class LoginAspiranteComponent {
  @ViewChild('myModalCompletado') public myModalCompletado: ModalDirective;
  cedula!: number;
  resultados: any;
  aspirante: any []= [];

  constructor(private _formBuilder: FormBuilder,
    public aspiranteService: AspiranteService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService
    ) 
    { }

    consultarCedula(){
      this.SpinnerService.show(); 
      const user = {cedula: this.cedula};
      this.aspiranteService.getAspirante(user).subscribe(
        data=>{
          this.aspirante = data;
          //console.log(this.aspirante)
          if (data['estatus']=='apingreso'){
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Usted no es asignado OPSU, si cree que es un error verifique su cédula e intente nuevamente.');
            this.notifyService.showSuccess('Bienvenido al proceso de autopostulación.');
            this.aspirante = data
            this.aspiranteService.datosAspirante = data
            sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
            this.router.navigateByUrl('/autopostulacion');
          }
          else {
            if (data['estatus']=='apregistrado'){
              this.SpinnerService.hide(); 
              this.notifyService.showWarning('Usted ya cumplió con el proceso de autopostulación, debe esperar la notificación por correo.');
              //this.notifyService.showInfo('Usted ya cumplió con el proceso de autopostulación, debe esperar la notificación por correo.');
              this.router.navigateByUrl('/login-aspirante');
            } else {
              if (data['estatus']=='completado'){
                this.SpinnerService.hide();
                this.myModalCompletado.show(); 
                //this.notifyService.showInfo('Usted ya cumplió con el proceso de automatriculación, debe iniciar sesión en SICE.');
                this.router.navigateByUrl('/login-aspirante');
    
                }else{ 
    
              this.SpinnerService.hide(); 
              this.aspirante = data
              this.aspiranteService.datosAspirante = data
              this.aspiranteService.materiasAspirante = data.materias
              sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
              sessionStorage.setItem('materiasAspirante', JSON.stringify(this.aspiranteService.materiasAspirante)); 
              this.notifyService.showSuccess('Bienvenido al proceso de automatriculación.');
              this.router.navigateByUrl('/automatriculacion');
              }
            }
        }
          
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });

}
