import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { AspiranteService } from '../aspirante.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-autopostulacion',
  templateUrl: './autopostulacion.component.html',
  styleUrls: ['./autopostulacion.component.scss']
})
export class AutopostulacionComponent implements OnInit {

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
  pnf1!: string;
  pnf2!: string;
  pnf3!: string;
  tipoaspirante!: string;

  constructor(private _formBuilder: FormBuilder,
    public aspiranteService: AspiranteService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public router: Router,
    ) 
    { 
      this.aspirante = this.aspiranteService.datosAspirante;
      //this.materias = this.aspiranteService.materiasAspirante;
      sessionStorage.setItem('currentUser', JSON.stringify(this.aspirante)); 
      //sessionStorage.setItem('materiasAspirante', JSON.stringify(this.aspiranteService.materiasAspirante)); 
      //console.log(this.aspiranteService.materiasAspirante);
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
      this.findBachiller();
      this.findCarreras();
      this.findZonaPTransporte();
      this.findOperMovil();
      this.findIndResp();
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


findBachiller(){
  this.aspiranteService.getBachiller().subscribe(
    (result: any) => {
        this.bachiller = result;
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

findIndResp(){
  this.aspiranteService.getIndResp().subscribe(
    (result: any) => {
        this.indresp = result;
  }
  );
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
  this.SpinnerService.show(); 
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;
  const datosStep2 = this.secondFormGroup.value;
  const datosStep3 = this.thirdFormGroup.value;
  const datosStep4 = this.fourthFormGroup.value;

    const datosCompletos = {
      step1: datosStep1 ,
      step2: datosStep2,
      step3: datosStep3,
      step4: datosStep4,
    };

    this.aspiranteService.createPersonAutopostulado(datosCompletos).subscribe(datos => {
      if (datos['resultado']=='OK') {
        this.SpinnerService.hide();
        this.notifyService.showInfo('Se le notificará en los próximos días via correo electrónico el estatus de su proceso de autopostulación.');
        this.notifyService.showSuccess('Proceso de autopostulación finalizado');
        setTimeout(() => {
          this.router.navigateByUrl('/login-aspirante');
        }, 6000); // 6000 milisegundos = 6 segundos
      }else {
        this.SpinnerService.hide();
        this.notifyService.showWarning('Ha ocurrido un error, notifíquelo al correo electrónico: soportesice@unetrans.edu.ve indicando su cédula de identidad.');
        setTimeout(() => {
          this.router.navigateByUrl('/login-aspirante');
        }, 6000); // 6000 milisegundos = 6 segundos  
      }
    });
}


      
    firstFormGroup = this._formBuilder.group({
      nac:['', Validators.required],
      cedula: ['', Validators.required],
      fec_nac: ['', Validators.required],
      primer_nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
      segundo_nombre: [null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
      primer_apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
      segundo_apellido:[null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])] ,
      genero: ['', Validators.required],
      edo_civil: ['', Validators.required],
    });

    secondFormGroup = this._formBuilder.group({
   
      opermovil: ['', Validators.required],
      nummovil: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      emailppal: ['', Validators.compose([Validators.required, Validators.email])  ],
      emailalter: [null, Validators.compose([Validators.nullValidator, Validators.email])  ],
     
    });

 thirdFormGroup = this._formBuilder.group({
  tipoaspirante: ['', Validators.required],
  sniopsu: ['', Validators.required],
  tbachiller: [null, Validators.nullValidator],
  fechagradobachiller: [null, Validators.nullValidator],
  nombreies: [null, Validators.compose([Validators.nullValidator, Validators.minLength(3), Validators.maxLength(10)])],
  tituloies: [null, Validators.nullValidator],
  fechagradoies: [null, Validators.nullValidator],
  mencionies: [null, Validators.nullValidator],
});


fourthFormGroup = this._formBuilder.group({
 pnf1:       ['', Validators.required],
 pnf2:       ['', Validators.nullValidator],
 pnf3:       ['', Validators.nullValidator],
 zonaprocedencia: ['', Validators.required],
 expmotivos: ['', Validators.required], 
});
 

}
