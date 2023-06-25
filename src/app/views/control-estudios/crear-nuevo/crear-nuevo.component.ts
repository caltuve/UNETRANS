import { EstadoI, MunicipioI, ParroquiaI } from './model.interface';
import {Component, ViewChild,OnInit, OnChanges} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatAccordion} from '@angular/material/expansion';
import { ControlEstudiosService } from '../control-estudios.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


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

  minDate!: Date;
  maxDate!: Date;
  
  condicion: any='';
  nacs: any []= [];
  petro: any []= [];
  persona: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];
  etnia: any []= [];
  indresp: any []= [];
  discapacidad: any []= [];
  discapacidad2: string= '';
  tipovia: any []= [];
  tiponucleo: any []= [];
  tipoconstruccion: any []= [];
  carreras: any []= [];
  opermovil: any []= [];
  operres: any []= [];
  bachiller: any []= [];
  moding: any []= [];
  turnos: any []= [];
  sede: string ='001';

  selectedEstadoId: string= '';
  selectedMunicipioId: string= '';
  
  municipios: MunicipioI[] = [];

  estados: any = [];

  state: any = [];
  city: any = [];

  listEstados!:EstadoI[]
  estadoSelected!: string
  listMunicipios!:MunicipioI[]
  municipioSelected!: string
  listParroquias!:ParroquiaI[]

  constructor(private _formBuilder: FormBuilder,
              public controlestudiosService: ControlEstudiosService) {
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth();
                const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear - 90, currentMonth, currentDay);
    console.log(this.minDate);
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
    console.log(this.maxDate);
              }

 
ngOnInit() {
    this.findNac();
    this.findGen();
    this.findEdoCivil();
    this.findGrupoSan();
    this.findEtnia();
    this.findIndResp();
    this.findDiscapacidad();
    this.findTipoVia();
    this.findTipoNucleo();
    this.findTipoConstruccion();
    this.findCarreras();
    this.findOperMovil();
    this.findOperRes();
    this.findEstados();
    this.findPetro();
    this.findBachiller();
    this.findModIngreso();
    this.findTurnos();
}

findPetro(){
  this.controlestudiosService.obtenerPetro().subscribe(
    (result: any) => {
        this.petro = Object.values(result.data.PTR);
        console.log(this.petro);
  }
  );
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
        //console.log(this.discapacidad);
  }
  );
}

findTipoVia(){
  this.controlestudiosService.getTipovia().subscribe(
    (result: any) => {
        this.tipovia = result;
  }
  );
}

findTipoNucleo(){
  this.controlestudiosService.getTipoNucleo().subscribe(
    (result: any) => {
        this.tiponucleo = result;
  }
  );
}

findTipoConstruccion(){
  this.controlestudiosService.getTipoConstruccion().subscribe(
    (result: any) => {
        this.tipoconstruccion = result;
  }
  );
}

findCarreras(){
  this.controlestudiosService.getCarreras().subscribe(
    (result: any) => {
        this.carreras = result;
  }
  );
}

findOperMovil(){
  this.controlestudiosService.getOperMovil().subscribe(
    (result: any) => {
        this.opermovil = result;
  }
  );
}

findOperRes(){
  this.controlestudiosService.getOperRes().subscribe(
    (result: any) => {
        this.operres = result;
  }
  );
}

private findEstados(){
  this.controlestudiosService.getEstados().subscribe(data=>{
    this.listEstados = data
  })
}

onEstadoselected(selectedEstadoId: any){
  this.controlestudiosService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipios = data
    }
  )
}

onMunicipioselected(selectedMunicipioId: any){
  this.controlestudiosService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquias = data
    }
  )
}

findBachiller(){
  this.controlestudiosService.getBachiller().subscribe(
    (result: any) => {
        this.bachiller = result;
  }
  );
}

findModIngreso(){
  this.controlestudiosService.getModIngreso().subscribe(
    (result: any) => {
        this.moding = result;
  }
  );
}

findTurnos(){
  this.controlestudiosService.getTurnos().subscribe(
    (result: any) => {
        this.turnos = result;
  }
  );
}

firstFormGroup = this._formBuilder.group({
  nac: ['', Validators.required],
  identificacion: ['', Validators.required],
  fec_nac: ['', Validators.required],
  pnombre: ['', Validators.required],
  papellido: ['', Validators.required],
  genero: ['', Validators.required],
  edo_civil: ['', Validators.required],
  gruposan: ['', Validators.required],
  etnia: ['', Validators.required],
  plibertad: ['', Validators.required],
  discapacidad: ['', Validators.required], 

});
secondFormGroup = this._formBuilder.group({
  estado: ['', Validators.required],
  municipio: ['', Validators.required],
  parroquia: ['', Validators.required],
  tipovia: ['', Validators.required],
  nombrevia: ['', Validators.required],
  tiponucleo: ['', Validators.required],
  nombrenucleo: ['', Validators.required],
  tipoconstruccion: ['', Validators.required],
  nombreconstruccion: ['', Validators.required],

  opermovil: ['', Validators.required],
  nummovil: ['', Validators.required],
  emailppal: ['', Validators.required ],
 
});

thirdFormGroup = this._formBuilder.group({
  tbachiller: ['', Validators.required],
  estadoplantel: ['', Validators.required],
  municipioplantel: ['', Validators.required],
  parroquiaplantel: ['', Validators.required],
 
});

fourthFormGroup = this._formBuilder.group({
 turno: ['', Validators.required],
 mingreso: ['', Validators.required],
 pnf: ['', Validators.required],
 trayecto: ['', Validators.required],
 
 
});
 
}

