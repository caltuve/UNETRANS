import { Component, AfterViewInit, OnInit } from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import {MatTableDataSource} from '@angular/material/table';
import { EstadoI, MunicipioI, ParroquiaI } from '../../control-estudios/crear-nuevo/model.interface'
@Component({
  selector: 'app-automatriculacion',
  templateUrl: './automatriculacion.component.html',
  styleUrls: ['./automatriculacion.component.scss']
})
export class AutomatriculacionComponent  implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['nombre'];

  materias = new MatTableDataSource();
  displayedColumnsUniCurricular: string[] = ['seleccion','código', 'nombre', 'créditos'];

  aspirante: any ;
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
  tipovia: any []= [];
  tiponucleo: any []= [];
  tipoconstruccion: any []= [];
  carreras: any []= [];
  opermovil: any []= [];
  operres: any []= [];
  listEstados!:EstadoI[]
  estadoSelected!: string
  listMunicipios!:MunicipioI[]
  municipioSelected!: string
  listParroquias!:ParroquiaI[]
  parroquiaSelected!: string

  bachiller: any []= [];
  moding: any []= [];
  turnos: any []= [];
  trayectos: any []= [];
  procedencia: any []= [];
  sede: string ='001';
  turno: string='X';
  mingresoopsu: string='001';
  mingresopostula: string='011'
  plantel = '';

  listPlantel: any = [];

  selectedValue!: string;

  isDisabled: boolean = false;
  

  constructor(private _formBuilder: FormBuilder,
    public aspiranteService: AspiranteService,
    ) 
    { 
      this.aspirante = this.aspiranteService.datosAspirante;
      this.materias = this.aspiranteService.materiasAspirante;
      sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
      console.log(this.aspirante);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate = new Date(currentYear - 14, currentMonth, currentDay);
    }

    ngOnInit() {
      this.findNac();
      this.findGen();
      this.findEdoCivil();
      this.findGrupoSan();
      this.findEtnia();
      this.findIndResp();
      this.findDiscapacidad();
      //this.findEstados();
      this.findTipoVia();
      this.findTipoNucleo();
      this.findTipoConstruccion();
      this.findCarreras();
      this.findOperMovil();
      this.findOperRes();
      this.findBachiller();
      this.findModIngreso();
      this.findTurnos();
      this.findTrayectos();
      
      }

      ngAfterViewInit() {
        this.findEstados();
      }

findNac(){
  this.aspiranteService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.aspiranteService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}


findEdoCivil(){
  this.aspiranteService.getEdoCivil().subscribe(
    (result: any) => {
        this.edocivil = result;
  }
  );
}

findGrupoSan(){
  this.aspiranteService.getGrupoSan().subscribe(
    (result: any) => {
        this.gruposan = result;
  }
  );
}

findEtnia(){
  this.aspiranteService.getEtnia().subscribe(
    (result: any) => {
        this.etnia = result;
  }
  );
}

findIndResp(){
  this.aspiranteService.getIndResp().subscribe(
    (result: any) => {
        this.indresp = result;
  }
  );
}

findDiscapacidad(){
  this.aspiranteService.getDiscapacidad().subscribe(
    (result: any) => {
        this.discapacidad = result;
        //console.log(this.discapacidad);
  }
  );
}

private findEstados(){
  this.aspiranteService.getEstados().subscribe(data=>{
    this.listEstados = data
  })
}

onEstadoselected(selectedEstadoId: any){
  this.aspiranteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipios = data
    }
  )
}

onMunicipioselected(selectedMunicipioId: any){
  this.aspiranteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquias = data
    }
  )
}

onParroquiaselected(selectedParroquiaId: any){
  this.aspiranteService.getPlantelOfSelectedParroquia(selectedParroquiaId).subscribe(
    data=>{
      this.dataSource.data = data;
      this.listPlantel = data
      //console.log(data)
    }
  )
}

findTipoVia(){
  this.aspiranteService.getTipovia().subscribe(
    (result: any) => {
        this.tipovia = result;
  }
  );
}

findTipoNucleo(){
  this.aspiranteService.getTipoNucleo().subscribe(
    (result: any) => {
        this.tiponucleo = result;
  }
  );
}

findTipoConstruccion(){
  this.aspiranteService.getTipoConstruccion().subscribe(
    (result: any) => {
        this.tipoconstruccion = result;
  }
  );
}

findCarreras(){
  this.aspiranteService.getCarreras().subscribe(
    (result: any) => {
        this.carreras = result;
  }
  );
}

findOperMovil(){
  this.aspiranteService.getOperMovil().subscribe(
    (result: any) => {
        this.opermovil = result;
  }
  );
}

findOperRes(){
  this.aspiranteService.getOperRes().subscribe(
    (result: any) => {
        this.operres = result;
  }
  );
}

findBachiller(){
  this.aspiranteService.getBachiller().subscribe(
    (result: any) => {
        this.bachiller = result;
  }
  );
}

findModIngreso(){
  this.aspiranteService.getModIngreso().subscribe(
    (result: any) => {
        this.moding = result;
  }
  );
}

findTurnos(){
  this.aspiranteService.getTurnos().subscribe(
    (result: any) => {
        this.turnos = result;
  }
  );
}

findTrayectos(){
  this.aspiranteService.getTrayectos().subscribe(
    (result: any) => {
        this.trayectos = result;
        this.procedencia = result;
  }
  );
}
      
    firstFormGroup = this._formBuilder.group({
      nac: [{value: '', disabled: true}, Validators.required, ] ,
      cedula: [{value: '', disabled: true}, Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: [{value: '', disabled: true}, Validators.required],
      primer_apellido: [{value: '', disabled: true}, Validators.required],
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
      gruposan: ['', Validators.required],
      etnia: ['', Validators.required],
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
  nombreplantel: ['', Validators.required],
 
});

fourthFormGroup = this._formBuilder.group({
 turno:     [{value: '', disabled: true}, Validators.required],
 mingreso:  [{value: '', disabled: true}, Validators.required],
 pnf:       [{value: '', disabled: true}, Validators.required],
 trayecto:  [{value: '', disabled: true}, Validators.required],
 seleccionado:  [{value: '', disabled: true}, Validators.required],
 zonaprocedencia: ['', Validators.required],
 
 
});

fiveFormGroup = this._formBuilder.group({  
  
 });

selectedPlantel = this._formBuilder.group({
  
 });
}
