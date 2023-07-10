import { Component, AfterViewInit } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import { Router } from '@angular/router';

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
    public router: Router
    ) 
    { }

    consultarCedula(){
      const user = {cedula: this.cedula};
      this.aspiranteService.getAspirante(user).subscribe(
        data=>{
          this.aspirante = data
          this.aspiranteService.datosAspirante = data
          this.aspiranteService.materiasAspirante = data.materias
          console.log(data.materias)
          sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
          this.router.navigateByUrl('/automatriculacion');
        }
      )
    }

  firstFormGroup = this._formBuilder.group({
    identificacion: ['', Validators.required],
  
  });

}
