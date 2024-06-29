import { Component, AfterViewInit, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators,FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DocenteService } from '../docente.service';
import {MatTableDataSource} from '@angular/material/table';
import { EstadoI, MunicipioI, ParroquiaI } from '../../control-estudios/crear-nuevo/model.interface'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

export function documentoValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const nac = control.get('nac')?.value;
    const cedula = control.get('cedula')?.value;

    if (!nac || !cedula) {
      // Si alguno de los valores es nulo o indefinido, no aplicar la validación
      return null;
    }

    if (nac === 'V' && (cedula < 100000 || cedula > 40000000)) {
      return { documentoInvalido: true };
    }

    if (nac === 'E' && (cedula < 1 || (cedula > 1999999 && cedula < 80000000) || cedula > 100000000)) {
      return { documentoInvalido: true };
    }

    return null; // Si todo está correcto, retorna null
  };
}

@Component({
  selector: 'app-autoregistro-docente',
  templateUrl: './autoregistro-docente.component.html',
  styleUrls: ['./autoregistro-docente.component.scss']
})
export class AutoregistroDocenteComponent {

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

  questsec1: any []= [];
  questsec2: any []= [];
  questsec3: any []= [];

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
    public DocenteService: DocenteService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public router: Router,
    ) 
    { 
      this.aspirante = this.DocenteService.datosAspirante;
      sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
      sessionStorage.setItem('materiasAspirante', JSON.stringify(this.DocenteService.materiasAspirante)); 
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

      this.fiveFormGroup.get('quest1')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
    
      this.fiveFormGroup.get('quest2')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
    
      this.fiveFormGroup.get('quest3')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
      }

      ngAfterViewInit() {
        this.findEstadosNacimiento();
        this.findEstadosResidencia();
        //this.findEstadosEducacionMedia();
      }

findNac(){
  this.DocenteService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.DocenteService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}


findEdoCivil(){
  this.DocenteService.getEdoCivil().subscribe(
    (result: any) => {
        this.edocivil = result;
  }
  );
}

findGrupoSan(){
  this.DocenteService.getGrupoSan().subscribe(
    (result: any) => {
        this.gruposan = result;
  }
  );
}

findEtnia(){
  this.DocenteService.getEtnia().subscribe(
    (result: any) => {
        this.etnia = result;
  }
  );
}

findIndResp(){
  this.DocenteService.getIndResp().subscribe(
    (result: any) => {
        this.indresp = result;
  }
  );
}

findDiscapacidad(){
  this.DocenteService.getDiscapacidad().subscribe(
    (result: any) => {
        this.discapacidad = result;
        //console.log(this.discapacidad);
  }
  );
}

private findEstadosNacimiento(){
  this.DocenteService.getEstados().subscribe(data=>{
    this.listEstadosNacimiento = data
  })
}

private findEstadosResidencia(){
  this.DocenteService.getEstados().subscribe(data=>{
    this.listEstadosResidencia = data
  })
}

private findEstadosEducacionMedia(){
  this.DocenteService.getEstados().subscribe(data=>{
    this.listEstadosEducacionMedia = data
  })
}

onEstadoselectedNacimiento(selectedEstadoId: any){
  this.DocenteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosNacimiento = data
    }
  )
}

onMunicipioselectedNacimiento(selectedMunicipioId: any){
  this.DocenteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasNacimiento = data
    }
  )
}

onEstadoselectedResidencia(selectedEstadoId: any){
  this.DocenteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosResidencia = data
    }
  )
}

onMunicipioselectedResidencia(selectedMunicipioId: any){
  this.DocenteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasResidencia = data
    }
  )
}


onEstadoselectedEducacionMedia(selectedEstadoId: any){
  this.DocenteService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.listMunicipiosEducacionMedia = data
    }
  )
}

onMunicipioselectedEducacionMedia(selectedMunicipioId: any){
  this.DocenteService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.listParroquiasEducacionMedia = data
    }
  )
}

onParroquiaselectedEducacionMedia(selectedParroquiaId: any){
  this.DocenteService.getPlantelOfSelectedParroquia(selectedParroquiaId).subscribe(
    data=>{
      //this.dataSource.data = data;
      this.listPlantel = data
      //console.log(data)
    }
  )
}

findTipoVia(){
  this.DocenteService.getTipovia().subscribe(
    (result: any) => {
        this.tipovia = result;
  }
  );
}

findTipoNucleo(){
  this.DocenteService.getTipoNucleo().subscribe(
    (result: any) => {
        this.tiponucleo = result;
  }
  );
}

findTipoConstruccion(){
  this.DocenteService.getTipoConstruccion().subscribe(
    (result: any) => {
        this.tipoconstruccion = result;
  }
  );
}

findCarreras(){
  this.DocenteService.getCarreras().subscribe(
    (result: any) => {
        this.carreras = result;
  }
  );
}

findOperMovil(){
  this.DocenteService.getOperMovil().subscribe(
    (result: any) => {
        this.opermovil = result;
  }
  );
}

findOperRes(){
  this.DocenteService.getOperRes().subscribe(
    (result: any) => {
        this.operres = result;
  }
  );
}

findBachiller(){
  this.DocenteService.getBachiller().subscribe(
    (result: any) => {
        this.bachiller = result;
  }
  );
}

findModIngreso(){
  this.DocenteService.getModIngreso().subscribe(
    (result: any) => {
        this.moding = result;
  }
  );
}

findTurnos(){
  this.DocenteService.getTurnos().subscribe(
    (result: any) => {
        this.turnos = result;
  }
  );
}

findTrayectos(){
  this.DocenteService.getTrayectos().subscribe(
    (result: any) => {
        this.trayectos = result;
  }
  );
}

findZonaPTransporte(){
  this.DocenteService.getZonaPTransporte().subscribe(
    (result: any) => {
        this.procedencia = result;
  }
  );
}

findParentescoEmer(){
  this.DocenteService.getParentescoEmer().subscribe(
    (result: any) => {
        this.parentesco = result;
  }
  );
}

findSectorTrabajo(){
  this.DocenteService.getSectorTrabajo().subscribe(
    (result: any) => {
        this.sectortrab = result;
  }
  );
}

findQuestSec() {
  this.DocenteService.getQuestSec().subscribe((result: any) => {
    this.questsec = result;
    this.filterQuestions();
  });
}

filterQuestions() {
  const quest1 = this.fiveFormGroup.get('quest1')?.value;
  const quest2 = this.fiveFormGroup.get('quest2')?.value;

  this.questsec1 = this.questsec;
  this.questsec2 = this.questsec.filter(q => q.descripcion !== quest1);
  this.questsec3 = this.questsec.filter(q => q.descripcion !== quest1 && q.descripcion !== quest2);
}



crearPersona(f: any) {
  this.DocenteService.createPerson(f.value).subscribe(datos => {
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
    //this.DocenteService.materiasAspirante = data.materias
    const materiasSeleccionadas = this.DocenteService.materiasAspirante;

    const datosCompletos = {
      step1: datosStep1,
      step2: datosStep2,
      step5: datosStep5,
      materias: materiasSeleccionadas
    };
    const cedula = datosCompletos.step1.cedula;

    this.DocenteService.createPersonDocente(datosCompletos).subscribe(datos => {
      if (datos['resultado']=='OK') {
        this.notifyService.showSuccess('Proceso de autoregistro finalizado, puede iniciar sesión en SICE');
        this.SpinnerService.hide();
        this.router.navigateByUrl('/login');
      }else {
        this.SpinnerService.hide();
        this.notifyService.showWarning('Ha ocurrido un error, notifíquelo al correo: soportesice@unetrans.edu.ve indicando su cédula de identidad.');
        this.router.navigateByUrl('/login-docente');
       
      }
    });
}


    firstFormGroup = this._formBuilder.group({
      nac: [{value: '', disabled: true}, Validators.required],
      nacpost: ['', Validators.required],
      cedula: [{value: '', readonly: true}, Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: [{value: '', readonly: true}, Validators.required],
      segundo_nombre: [{value: '', readonly: true}, Validators.nullValidator],
      primer_apellido: [{value: '', readonly: true}, Validators.required],
      segundo_apellido: [{value: '', readonly: true}, Validators.nullValidator],
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
      gruposan: ['', Validators.required],
    }, { validators: documentoValidator() });
    
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
  cod_dpto:['', Validators.required],
  jefe:['', Validators.required],
  cod_jefe:[null, Validators.nullValidator],
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
