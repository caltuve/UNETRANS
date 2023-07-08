import { Component } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';

@Component({
  selector: 'app-automatriculacion',
  templateUrl: './automatriculacion.component.html',
  styleUrls: ['./automatriculacion.component.scss']
})
export class AutomatriculacionComponent {

  minDate!: Date;
  maxDate!: Date;
  nacs: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];
  etnia: any []= [];
  indresp: any []= [];
  discapacidad: any []= [];
  discapacidad2: string= '';
  aspirante: any ;

  constructor(private _formBuilder: FormBuilder,
    public aspiranteService: AspiranteService,
    ) 
    { 
      this.aspirante = this.aspiranteService.datosAspirante;
      console.log(this.aspirante);
    }


    firstFormGroup = this._formBuilder.group({
      nac: ['', Validators.required],
      cedula: ['', Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
      gruposan: ['', Validators.required],
      etnia: ['', Validators.required],
      plibertad: ['', Validators.required],
      discapacidad: ['', Validators.required], 
    
    });
}
