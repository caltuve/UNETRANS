import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import {MatTableDataSource} from '@angular/material/table';
import { EstadoI, MunicipioI, ParroquiaI } from '../../control-estudios/crear-nuevo/model.interface'

@Component({
  selector: 'app-autopostulacion',
  templateUrl: './autopostulacion.component.html',
  styleUrls: ['./autopostulacion.component.scss']
})
export class AutopostulacionComponent implements OnInit, AfterViewInit {

  aspirante: any ;
  minDate1!: Date;
  maxDate1!: Date;
  minDate2!: Date;
  maxDate2!: Date;
  minDate3!: Date;
  maxDate3!: Date;
  nacs: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];
  etnia: any []= [];
  indresp: any []= [];
  discapacidad: any []= [];
  discapacidad2: string= '';
  tipoconstruccionvalue: string= '';
  tipovia: any []= [];
  tiponucleo: any []= [];
  tipoconstruccion: any []= [];
  carreras: any []= [];
  opermovil: any []= [];
  operres: any []= [];
  
  listEstadosNacimiento!: EstadoI[]
  estadoSelectedNacimiento!: string
  listMunicipiosNacimiento!: MunicipioI[]
  municipioSelectedNacimiento!: string
  listParroquiasNacimiento!: ParroquiaI[]
  parroquiaSelectedNacimiento!: string

  listEstadosResidencia!: EstadoI[]
  estadoSelectedResidencia!: string
  listMunicipiosResidencia!: MunicipioI[]
  municipioSelectedResidencia!: string
  listParroquiasResidencia!: ParroquiaI[]
  parroquiaSelectedResidencia!: string


  listEstadosEducacionMedia!: EstadoI[]
  estadoSelectedEducacionMedia!: string
  listMunicipiosEducacionMedia!: MunicipioI[]
  municipioSelectedEducacionMedia!: string
  listParroquiasEducacionMedia!: ParroquiaI[]
  parroquiaSelectedEducacionMedia!: string

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

  annoegreso!: Date;

  /*LISTADO DE VARIABLES PARA ALMANCENAR LOS VALORES EN BD*/
  //STEP 1
  nac!: string;
  cedula!: number;
  fecnac!: Date;
  primer_nombre!: string;
  segundo_nombre!: string;
  primer_apellido!: string;
  segundo_apellido!: string;
  pnf!: string;

  constructor(private _formBuilder: FormBuilder,
    public aspiranteService: AspiranteService,
    ) 
    { 
      //this.aspirante = this.aspiranteService.datosAspirante;
      //this.materias = this.aspiranteService.materiasAspirante;
      //sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
      //sessionStorage.setItem('materiasAspirante', JSON.stringify(this.aspiranteService.materiasAspirante)); 
      //console.log(this.aspiranteService.materiasAspirante);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
      this.minDate2 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate2 = new Date(currentYear - 14, currentMonth, currentDay);
      this.minDate3 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate3 = new Date(currentYear - 14, currentMonth, currentDay);
      
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
      this.findZonaPTransporte();
      }

      ngAfterViewInit() {
        this.findEstadosNacimiento();
        this.findEstadosResidencia();
        this.findEstadosEducacionMedia();
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

private findEstadosNacimiento(){
  this.aspiranteService.getEstados().subscribe(data=>{
    this.listEstadosNacimiento = data
  })
}

private findEstadosResidencia(){
  this.aspiranteService.getEstados().subscribe(data=>{
    this.listEstadosResidencia = data
  })
}

private findEstadosEducacionMedia(){
  this.aspiranteService.getEstados().subscribe(data=>{
    this.listEstadosEducacionMedia = data
  })
}

onEstadoselectedNacimiento(selectedEstadoId: any){
  this.aspiranteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosNacimiento = data
    }
  )
}

onMunicipioselectedNacimiento(selectedMunicipioId: any){
  this.aspiranteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasNacimiento = data
    }
  )
}

onEstadoselectedResidencia(selectedEstadoId: any){
  this.aspiranteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosResidencia = data
    }
  )
}

onMunicipioselectedResidencia(selectedMunicipioId: any){
  this.aspiranteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasResidencia = data
    }
  )
}


onEstadoselectedEducacionMedia(selectedEstadoId: any){
  this.aspiranteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosEducacionMedia = data
    }
  )
}

onMunicipioselectedEducacionMedia(selectedMunicipioId: any){
  this.aspiranteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasEducacionMedia = data
    }
  )
}

onParroquiaselectedEducacionMedia(selectedParroquiaId: any){
  this.aspiranteService.getPlantelOfSelectedParroquia(selectedParroquiaId).subscribe(
    data=>{
      //this.dataSource.data = data;
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
  }
  );
}

findZonaPTransporte(){
  this.aspiranteService.getZonaPTransporte().subscribe(
    (result: any) => {
        this.procedencia = result;
  }
  );
}

crearPersona(f: any) {
  this.aspiranteService.createPerson(f.value).subscribe(datos => {
    if (datos['resultado']=='NOK' || datos['resultado']!=='OK') {
    }else {
     
    }
  });
}

guardarDatos(event: any): void {
  if (event.selectedIndex === 1) {
    //const datosStep1 = this.firstFormGroup.value;
   // const datosStep2 = this.secondFormGroup.value;
    const datosStep4 = this.fourthFormGroup.value;

    // Aquí puedes enviar los datos al servidor o realizar cualquier otra acción con ellos
  }
}

guardar(): void {
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;
    const datosStep2 = this.secondFormGroup.value;
    const datosStep3 = this.thirdFormGroup.value;
    const datosStep4 = this.fourthFormGroup.value;
    //this.aspiranteService.materiasAspirante = data.materias
    const materiasSeleccionadas = this.aspiranteService.materiasAspirante;

    console.log(materiasSeleccionadas);


    const datosCompletos = {
      step1: datosStep1,
      step2: datosStep2,
      step3: datosStep3,
      step4: datosStep4,
      materias: materiasSeleccionadas
    };

    //console.log(datosCompletos);

    this.aspiranteService.createPerson(datosCompletos).subscribe(datos => {
      if (datos['resultado']=='NOK' || datos['resultado']!=='OK') {
      }else {
       
      }
    });
}


      
    firstFormGroup = this._formBuilder.group({
      nac:['', Validators.required],
      cedula: ['', Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: [{value: '', readonly: true}, Validators.required],
      segundo_nombre: [{value: '', readonly: true}, Validators.nullValidator],
      primer_apellido: [{value: '', readonly: true}, Validators.required],
      segundo_apellido: [{value: '', readonly: true}, Validators.nullValidator],
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
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
  complemento: [null, Validators.nullValidator],


  opermovil: ['', Validators.required],
  nummovil: ['', Validators.required],
  operres: [null, Validators.nullValidator],
  numres: [null, Validators.nullValidator],
  operemer:['', Validators.required],
  numemer:['', Validators.required],
  parenemer:['', Validators.required],
  nombreemer:['', Validators.required],
  emailppal: ['', Validators.compose([Validators.required, Validators.email])  ],
  emailalter: [null, Validators.compose([Validators.nullValidator, Validators.email])  ],
 
});

thirdFormGroup = this._formBuilder.group({
  tbachiller: ['', Validators.required],
  fechagradobachiller: ['', Validators.required],
  sni: ['', Validators.required],
  indbachiller: ['', Validators.required],
  estadoplantel: ['', Validators.required],
  municipioplantel: ['', Validators.required],
  parroquiaplantel: ['', Validators.required],
  nombreplantel: ['',Validators.required],
  nombreies: [null, Validators.nullValidator],
  tituloies: [null, Validators.nullValidator],
  fechagradoies: ['', Validators.nullValidator],
 
});

fourthFormGroup = this._formBuilder.group({
 pnf:       ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
 zonaprocedencia: ['', Validators.required], 
});

fiveFormGroup = this._formBuilder.group({  
  usrsice:[{value: '', disabled: true}, Validators.required],
  pass:['', Validators.required],
  confpass:['', Validators.required],
      nacpost: ['', Validators.required, ] ,
      cedula: [{value: '', readonly: true}, Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: [{value: '', readonly: true}, Validators.required],
      segundo_nombre: [{value: '', readonly: true}, Validators.nullValidator],
      primer_apellido: [{value: '', readonly: true}, Validators.required],
      segundo_apellido: [{value: '', readonly: true}, Validators.nullValidator],
  
 });

selectedPlantel = this._formBuilder.group({
  
 });

}
