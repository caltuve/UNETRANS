import {Component, ViewChild,OnInit, OnChanges} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatAccordion} from '@angular/material/expansion';
import { ControlEstudiosService } from '../control-estudios.service';

@Component({
  selector: 'app-crear-nuevo',
  templateUrl: './crear-nuevo.component.html',
  styleUrls: ['./crear-nuevo.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS, 
      useValue: {showError: true},
    },
  ],
})
export class CrearNuevoComponent  implements OnInit {
  
  nacs: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];
  etnia: any []= [];
  indresp: any []= [];
  discapacidad: any []= [];
  municipio!: null;

  constructor(private _formBuilder: FormBuilder,
              public controlestudiosService: ControlEstudiosService) {}
ngOnInit() {
    this.findNac();
    this.findGen();
    this.findEdoCivil();
    this.findGrupoSan();
    this.findEtnia();
    this.findIndResp();
    this.findDiscapacidad();
}

findNac(){
  this.controlestudiosService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.controlestudiosService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}

findEdoCivil(){
  this.controlestudiosService.getEdoCivil().subscribe(
    (result: any) => {
        this.edocivil = result;
  }
  );
}

findGrupoSan(){
  this.controlestudiosService.getGrupoSan().subscribe(
    (result: any) => {
        this.gruposan = result;
  }
  );
}

findEtnia(){
  this.controlestudiosService.getEtnia().subscribe(
    (result: any) => {
        this.etnia = result;
  }
  );
}

findIndResp(){
  this.controlestudiosService.getIndResp().subscribe(
    (result: any) => {
        this.indresp = result;
  }
  );
}

findDiscapacidad(){
  this.controlestudiosService.getDiscapacidad().subscribe(
    (result: any) => {
        this.discapacidad = result;
  }
  );
}
  firstFormGroup = this._formBuilder.group({
    nac: ['', Validators.required],
    identificacion: ['', Validators.required],
    fec_nac: ['', Validators.required],
    fec_nac2: ['', Validators.required],
    pnombre: ['', Validators.required],
    papellido: ['', Validators.required],
    genero: ['', Validators.required],
    edo_civil: ['', Validators.required],
    porcentaje: ['', Validators.required],
    pais: ['', Validators.required],
    estado: ['', Validators.required],
    municipio: ['', Validators.required],
    parroquia: ['', Validators.required], 
    conapdis: ['', Validators.required],

  });
  secondFormGroup = this._formBuilder.group({
    pais: ['', Validators.required],
    estado: ['', Validators.required],
    municipio: ['', Validators.required],
    parroquia: ['', Validators.required],

   
  });

 

             

              
}

