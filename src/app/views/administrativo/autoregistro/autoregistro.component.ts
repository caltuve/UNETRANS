import { Component, AfterViewInit, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { AdministrativoService } from '../administrativo.service';
import {MatTableDataSource} from '@angular/material/table';
import { EstadoI, MunicipioI, ParroquiaI } from '../../control-estudios/crear-nuevo/model.interface'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-autoregistro',
  templateUrl: './autoregistro.component.html',
  styleUrls: ['./autoregistro.component.scss']
})
export class AutoregistroComponent {

  estudiante: any;

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
  indresp2: string= ''; 
  indresp3: string= ''; 
  discapacidad: any []= [];
  discapacidad2: string= '';
  tipoconstruccionvalue: string= '';
  pass: string;
  confpass:string;
  usrsice:string;
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
  parentesco: any []= [];
  sectortrab: any []= [];
  questsec: any []= [];
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


  quest1: string;
  quest2: string;
  quest3: string;

  constructor(private _formBuilder: FormBuilder,
    public administrativoService: AdministrativoService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public router: Router,
    ) 
    { 
      this.aspirante = this.administrativoService.datosAspirante;
      sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
      sessionStorage.setItem('materiasAspirante', JSON.stringify(this.administrativoService.materiasAspirante)); 
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
      this.minDate2 = new Date(currentYear - 69, currentMonth, currentDay);
      this.maxDate2 = new Date(currentYear , currentMonth, currentDay);
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
      this.findParentescoEmer();
      this.findSectorTrabajo();
      this.findQuestSec();
      }

      ngAfterViewInit() {
        this.findEstadosNacimiento();
        this.findEstadosResidencia();
        this.findEstadosEducacionMedia();
      }

findNac(){
  this.administrativoService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.administrativoService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}


findEdoCivil(){
  this.administrativoService.getEdoCivil().subscribe(
    (result: any) => {
        this.edocivil = result;
  }
  );
}

findGrupoSan(){
  this.administrativoService.getGrupoSan().subscribe(
    (result: any) => {
        this.gruposan = result;
  }
  );
}

findEtnia(){
  this.administrativoService.getEtnia().subscribe(
    (result: any) => {
        this.etnia = result;
  }
  );
}

findIndResp(){
  this.administrativoService.getIndResp().subscribe(
    (result: any) => {
        this.indresp = result;
  }
  );
}

findDiscapacidad(){
  this.administrativoService.getDiscapacidad().subscribe(
    (result: any) => {
        this.discapacidad = result;
        //console.log(this.discapacidad);
  }
  );
}

private findEstadosNacimiento(){
  this.administrativoService.getEstados().subscribe(data=>{
    this.listEstadosNacimiento = data
  })
}

private findEstadosResidencia(){
  this.administrativoService.getEstados().subscribe(data=>{
    this.listEstadosResidencia = data
  })
}

private findEstadosEducacionMedia(){
  this.administrativoService.getEstados().subscribe(data=>{
    this.listEstadosEducacionMedia = data
  })
}

onEstadoselectedNacimiento(selectedEstadoId: any){
  this.administrativoService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosNacimiento = data
    }
  )
}

onMunicipioselectedNacimiento(selectedMunicipioId: any){
  this.administrativoService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasNacimiento = data
    }
  )
}

onEstadoselectedResidencia(selectedEstadoId: any){
  this.administrativoService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosResidencia = data
    }
  )
}

onMunicipioselectedResidencia(selectedMunicipioId: any){
  this.administrativoService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasResidencia = data
    }
  )
}


onEstadoselectedEducacionMedia(selectedEstadoId: any){
  this.administrativoService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosEducacionMedia = data
    }
  )
}

onMunicipioselectedEducacionMedia(selectedMunicipioId: any){
  this.administrativoService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasEducacionMedia = data
    }
  )
}

onParroquiaselectedEducacionMedia(selectedParroquiaId: any){
  this.administrativoService.getPlantelOfSelectedParroquia(selectedParroquiaId).subscribe(
    data=>{
      //this.dataSource.data = data;
      this.listPlantel = data
      //console.log(data)
    }
  )
}

findTipoVia(){
  this.administrativoService.getTipovia().subscribe(
    (result: any) => {
        this.tipovia = result;
  }
  );
}

findTipoNucleo(){
  this.administrativoService.getTipoNucleo().subscribe(
    (result: any) => {
        this.tiponucleo = result;
  }
  );
}

findTipoConstruccion(){
  this.administrativoService.getTipoConstruccion().subscribe(
    (result: any) => {
        this.tipoconstruccion = result;
  }
  );
}

findCarreras(){
  this.administrativoService.getCarreras().subscribe(
    (result: any) => {
        this.carreras = result;
  }
  );
}

findOperMovil(){
  this.administrativoService.getOperMovil().subscribe(
    (result: any) => {
        this.opermovil = result;
  }
  );
}

findOperRes(){
  this.administrativoService.getOperRes().subscribe(
    (result: any) => {
        this.operres = result;
  }
  );
}

findBachiller(){
  this.administrativoService.getBachiller().subscribe(
    (result: any) => {
        this.bachiller = result;
  }
  );
}

findModIngreso(){
  this.administrativoService.getModIngreso().subscribe(
    (result: any) => {
        this.moding = result;
  }
  );
}

findTurnos(){
  this.administrativoService.getTurnos().subscribe(
    (result: any) => {
        this.turnos = result;
  }
  );
}

findTrayectos(){
  this.administrativoService.getTrayectos().subscribe(
    (result: any) => {
        this.trayectos = result;
  }
  );
}

findZonaPTransporte(){
  this.administrativoService.getZonaPTransporte().subscribe(
    (result: any) => {
        this.procedencia = result;
  }
  );
}

findParentescoEmer(){
  this.administrativoService.getParentescoEmer().subscribe(
    (result: any) => {
        this.parentesco = result;
  }
  );
}

findSectorTrabajo(){
  this.administrativoService.getSectorTrabajo().subscribe(
    (result: any) => {
        this.sectortrab = result;
  }
  );
}

findQuestSec(){
  this.administrativoService.getQuestSec().subscribe(
    (result: any) => {
        this.questsec = result;
  }
  );
}

crearPersona(f: any) {
  this.administrativoService.createPerson(f.value).subscribe(datos => {
    if (datos['resultado']=='NOK' || datos['resultado']!=='OK') {
    }else {
     
    }
  });
}


guardar(): void {
  this.SpinnerService.show(); 
      
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;
    const datosStep2 = this.secondFormGroup.value;
    const datosStep5 = this.fiveFormGroup.value;
    //this.administrativoService.materiasAspirante = data.materias
    const materiasSeleccionadas = this.administrativoService.materiasAspirante;

    const datosCompletos = {
      step1: datosStep1,
      step2: datosStep2,
      step5: datosStep5,
      materias: materiasSeleccionadas
    };
    const cedula = datosCompletos.step1.cedula;

    this.administrativoService.createPersonAdministrativo(datosCompletos).subscribe(datos => {
      if (datos['resultado']=='OK') {
        this.notifyService.showSuccess('Proceso de autoregistro finalizado, puede iniciar sesión en SICE');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 10000); // 6000 milisegundos = 6 segundos
        this.SpinnerService.hide();
      }else {
        this.SpinnerService.hide();
        this.notifyService.showWarning('Ha ocurrido un error, notifíquelo al correo: soportesice@unetrans.edu.ve indicando su cédula de identidad.');
        setTimeout(() => {
          this.router.navigateByUrl('/login-administrativo');
        }, 10000); // 6000 milisegundos = 6 segundos
       
      }
    });
}

     
    firstFormGroup = this._formBuilder.group({
      nac:[{value: '', disabled: true}, Validators.required],
      nacpost: ['', Validators.required, ] ,
      cedula: [{value: '', readonly: true}, Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: [{value: '', readonly: true}, Validators.required],
      segundo_nombre: [{value: '', readonly: true}, Validators.nullValidator],
      primer_apellido: [{value: '', readonly: true}, Validators.required],
      segundo_apellido: [{value: '', readonly: true}, Validators.nullValidator],
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
      gruposan: ['', Validators.required],
    });
    
    secondFormGroup = this._formBuilder.group({
  estado: ['', Validators.required],
  municipio: ['', Validators.required],
  parroquia: ['', Validators.required],
  tipovia: ['', Validators.required],
  nombrevia: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],
  tiponucleo: ['', Validators.required],
  nombrenucleo: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],
  tipoconstruccion: ['', Validators.required],
  nombreconstruccion: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],
  piso: [null,Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],
  apto: [null,Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],
  nrocasa: [null,Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]) ],


  opermovil: ['', Validators.required],
  nummovil: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
  operres: [null, Validators.nullValidator],
  numres: [null, Validators.compose([Validators.nullValidator, Validators.minLength(7), Validators.maxLength(7)]) ],
  emailppal: ['', Validators.compose([Validators.required, Validators.email])  ],
  emailalter: [null, Validators.compose([Validators.nullValidator, Validators.email])  ],
 
});

fiveFormGroup = this._formBuilder.group({  
  usrsice:[{value: '', readonly: true}, Validators.required],
  pass:['', Validators.required],
  confpass:['', Validators.required],
  quest1:['', Validators.required],
  quest2:['', Validators.required],
  quest3:['', Validators.required],
  answ1:['', Validators.required],
  answ2:['', Validators.required],
  answ3:['', Validators.required],
 });



  validacion1: boolean;
  validacion2: boolean;
  validacion3: boolean;
  validacion4: boolean;
  validacion5: boolean;
  validacion6: boolean;

  validarContrasena() {
    this.validacion1 = this.pass.length >= 8; // Validar que tenga al menos 8 caracteres
    this.validacion2 = /[+-.!_*$#]/.test(this.pass); // Validar que tenga alguno de los caracteres especiales
    this.validacion4 = /\d/.test(this.pass); // Validar que haya al menos un número
    this.validacion5 = /[A-Z]/.test(this.pass); // Validar que haya al menos una letra mayúscula
    this.validacion6 = !this.pass.includes(this.aspirante.usrsice) && !this.pass.includes(this.aspirante.cedula);  // Validar que la contraseña no sea igual a la cédula de identidad ni el usuario
    this.validarConfirmacion();
  }

  validarConfirmacion() {
    this.validacion3 = this.pass !== null && this.confpass !== null && this.pass === this.confpass;
  }

selectedPlantel = this._formBuilder.group({
  
 });
}
