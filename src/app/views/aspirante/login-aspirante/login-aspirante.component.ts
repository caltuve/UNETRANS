import { Component, AfterViewInit } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-login-aspirante',
  templateUrl: './login-aspirante.component.html',
  styleUrls: ['./login-aspirante.component.scss',
]
})
export class LoginAspiranteComponent {
  
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
          if (this.aspirante.length == 0 ){
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Usted no es asignado OPSU, será redireccionado al proceso de autopostulación');
            this.router.navigateByUrl('/autopostulacion');
          }
          else {

            if (data['estatus']=='completado'){
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('Usted ya cumplió con el proceso de automatriculación, debe iniciar sesión en SICE');
            this.router.navigateByUrl('/login-aspirante');

            }else{ 

          this.SpinnerService.hide(); 
          this.aspirante = data
          this.aspiranteService.datosAspirante = data
          this.aspiranteService.materiasAspirante = data.materias
          sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
          sessionStorage.setItem('materiasAspirante', JSON.stringify(this.aspiranteService.materiasAspirante)); 
          this.notifyService.showSuccess('Bienvenido al proceso de automatriculación');
          this.router.navigateByUrl('/automatriculacion');
          }
        }
          
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });

}
