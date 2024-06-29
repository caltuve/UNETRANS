import { Component, OnInit, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedDataService } from '../shared-data-service.service';

import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-add-edit-plan',
  templateUrl: './add-edit-plan.component.html',
  styleUrls: ['./add-edit-plan.component.scss']
})
export class AddEditPlanComponent implements OnInit {

  @ViewChild('planModal') planModal!: TemplateRef<any>;
  @ViewChild('cursoModal') cursoModal!: TemplateRef<any>;

  programFormGroup!: FormGroup;
  planFormGroup!: FormGroup;
  cursoFormGroup!: FormGroup;

  departamentos: any[] = [];
  type_programs: any[] = [];
  regimen: any[] = [];
  tipoprograma: any[] = [];
  tipoafiliacion: any[] = [];

  trayectos: string[] = [];

  semestres: string[] = [];

  semestralTrayectos: string[] = [];

  displayedColumns: string[] = ['nombre', 'duracionAnios', 'acciones'];


  usrsice: string;

  rol: any[] = [];

  datosPrograma: any;
  menciones: any;

  isFechaFinEnabled: boolean;

  trayectosFormGroup: FormGroup;
  certificacionesFormGroup: FormGroup;
  resumenFormGroup: FormGroup;

  semestralTrayectosFormGroup: FormGroup;

  codPrograma: number;
  codOpsu: number;
  tipoProg: string;
  departamento: string;
  idDpto: number;
  nomPro: string;
  siglas: string;
  jefe: string;

  afiliacionOptions = ['Alma Mater', 'Misión Sucre', 'Carrera'];
  estatusOptions = ['Activo', 'Cerrado'];
  tipoCertificacionOptions = ['Certificación', 'Titulación'];
  filteredAfiliacionOptions: any[];


  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    public controlestudiosService: ControlEstudiosService,
    private notifyService: NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) {
    this.obtenerUsuarioActual();
  }

  ngOnInit() {
    this.datosPrograma = this.sharedDataService.getDatosPrograma();
    if (this.datosPrograma && this.datosPrograma.length > 0) {
      const programa = this.datosPrograma[0];
      this.codPrograma = programa.cod_programa;
      this.codOpsu = programa.cod_opsu;
      this.tipoProg = programa.tipo_prog;
      this.departamento = programa.departamento;
      this.idDpto = programa.id_dpto;
      this.nomPro = programa.nom_pro;
      this.siglas = programa.siglas;
      this.jefe = programa.jefe;
    }
    console.log(this.datosPrograma);
    this.menciones = this.sharedDataService.getMenciones();

    if (!this.datosPrograma || !this.menciones) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigate([`/ce-academico/programa-academico/gestion-plan-estudios/${id}`]);
      // Si los datos no están disponibles, redirigir de vuelta
    }
    this.programFormGroup = this.formBuilder.group({
      codigo: ['', Validators.required],
      regimen: ['', Validators.required],
      tipo_plan: ['', Validators.required],
      afiliacion: [{ value: '', disabled: true }, Validators.required],
      nombre_plan: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1)]],
      estatus: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: [{ value: '', disabled: true }],
      tieneTransicion: [false],
      tieneMencion: [false],
      nombre_mencion: [''],
      siglas_mencion: ['', [Validators.minLength(3), Validators.maxLength(3)]]
    });

    this.programFormGroup.get('tipo_plan')?.valueChanges.subscribe(value => {
      this.programFormGroup.get('afiliacion')?.enable(); // Habilitar afiliación cuando tipo_plan cambia
      this.filterAfiliacionOptions(value); // Filtrar opciones de afiliación
      this.programFormGroup.get('afiliacion')?.reset(); // Resetear el valor del campo afiliación
    });

    this.programFormGroup.get('tieneMencion')?.valueChanges.subscribe(value => {
      if (value) {
        this.programFormGroup.get('nombre_mencion')?.setValidators([Validators.required]);
        this.programFormGroup.get('siglas_mencion')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
      } else {
        this.programFormGroup.get('nombre_mencion')?.clearValidators();
        this.programFormGroup.get('siglas_mencion')?.clearValidators();
      }
      this.programFormGroup.get('nombre_mencion')?.updateValueAndValidity();
      this.programFormGroup.get('siglas_mencion')?.updateValueAndValidity();
    });

    this.trayectosFormGroup = this.formBuilder.group({
      trayectos: this.formBuilder.array([], Validators.required)
    });

    this.semestralTrayectosFormGroup = this.formBuilder.group({
      semestralTrayectos: this.formBuilder.array([], Validators.required)
    });

    this.certificacionesFormGroup = this.formBuilder.group({
      certificaciones: this.formBuilder.array([], Validators.required)
    });

    this.resumenFormGroup = this.formBuilder.group({});

    this.programFormGroup.get('activo')?.valueChanges.subscribe(value => {
      if (value) {
        this.programFormGroup.get('fecha_fin')?.enable();
      } else {
        this.programFormGroup.get('fecha_fin')?.disable();
      }
    });

    this.programFormGroup.get('estatus')?.valueChanges.subscribe(value => {
      this.onEstatusChange({ value });
    });

    // Llamar a la actualización de validaciones
    this.programFormGroup.get('tipo_plan')?.valueChanges.subscribe(() => {

      this.updateCertificacionesValidations();
    });

    // this.programFormGroup.get('duracion')?.valueChanges.subscribe(() => {
    //     this.addTrayectosAutomatically();
    // });

    // this.programFormGroup.get('tieneTransicion')?.valueChanges.subscribe(() => {
    //     this.addTrayectosAutomatically();
    // });

    // Cargar datos iniciales
    this.findDepartamentos();
    this.findTypePrograms();
    this.findRegimen();
    this.findTipoPrograma();
    this.findAfiliacion();
  }


  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.rol = currentUser.rol;
  }

  findDepartamentos() {
    this.controlestudiosService.getDepartamentos().subscribe(
      (result: any) => {
        this.departamentos = result;
      }
    );
  }

  findTypePrograms() {
    this.controlestudiosService.getTypeProgramasAcademic().subscribe(
      (result: any) => {
        this.type_programs = result;
      }
    );
  }

  findRegimen() {
    this.controlestudiosService.getPeriodicidad().subscribe(
      (result: any) => {
        this.regimen = result;
      }
    );
  }
  findTipoPrograma() {
    this.controlestudiosService.getTipoPrograma().subscribe(
      (result: any) => {
        // Filtrar los resultados según el tipoProg
        if (this.tipoProg === 'PREGRADO') {
          this.tipoprograma = result.filter((programa: any) => programa.codelemento === '01' || programa.codelemento === '02');
        } else {
          this.tipoprograma = result;
        }
      }
    );
}


findAfiliacion() {
  this.controlestudiosService.getAfiliacion().subscribe(
    (result: any) => {
      this.tipoafiliacion = result;
    }
  );
}



filterAfiliacionOptions(tipoPlan: string) {
  if (tipoPlan === '01') {
    this.filteredAfiliacionOptions = this.tipoafiliacion.filter((afiliacion: any) => afiliacion.codelemento === 'CR');
  } else if (tipoPlan === '02') {
    this.filteredAfiliacionOptions = this.tipoafiliacion.filter((afiliacion: any) => 
      afiliacion.codelemento === 'AM' || 
      afiliacion.codelemento === 'MS' || 
      afiliacion.codelemento === 'AS'
    );
  } else {
    this.filteredAfiliacionOptions = [];
  }
}

  getDepartamentoNombre(id_departamento: number): string {
    const dep = this.departamentos.find(d => d.id_departamento === id_departamento);
    return dep ? dep.nombre_departamento : 'N/A';
  }

  getTipoProgramaNombre(codelemento: number): string {
    const tipo = this.type_programs.find(t => t.codelemento === codelemento);
    return tipo ? tipo.descripcion : 'N/A';
  }

  transformToUpperCase(value: string): string {
    return value ? value.toUpperCase() : '';
  }



  onCodOpsuInput() {
    const codOpsuControl = this.programFormGroup.get('codigo_opsu');
    if (codOpsuControl && codOpsuControl.value) {
      codOpsuControl.setValue(codOpsuControl.value.toString().slice(0, 5), { emitEvent: false });
    }
  }


  // Método para finalizar y regresar al componente anterior
  finalizarGestionPlanEstudios(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/ce-academico/programa-academico/gestion-plan-estudios/${id}`]);
  }


  onSubmit(): void {
    if (!this.programFormGroup.valid || !this.trayectosFormGroup.valid || !this.certificacionesFormGroup.valid) {
      return;
    }
    this.SpinnerService.show();

    const formData = {
      ...this.programFormGroup.value,
      cod_programa: this.codPrograma,
      trayectos: this.trayectosFormArray.value,
      semestralTrayectos: this.semestralTrayectosFormArray.value,
      certificaciones: this.certificacionesFormArray.value
    };

    console.log('Form Data:', formData);
    this.controlestudiosService.crearPlanEstudios(formData).subscribe(
      response => {
        if (response.estatus === 'OK') {
          this.notifyService.showSuccess('Plan añadido correctamente');
        } else {
          this.notifyService.showError2('Ha ocurrido un error: ' + response.mensaje);
        }
        this.SpinnerService.hide();
      },
      error => {
        console.error('Error al enviar datos al servidor:', error);
        this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
        this.SpinnerService.hide();
      }
    );

    // Redirigir de vuelta al componente de gestión de planes
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/ce-academico/programa-academico/gestion-plan-estudios/${id}`]);
  }

  get trayectosFormArray(): FormArray {
    return this.trayectosFormGroup.get('trayectos') as FormArray;
  }

  get semestralTrayectosFormArray(): FormArray {
    return this.semestralTrayectosFormGroup.get('semestralTrayectos') as FormArray;
  }

  get certificacionesFormArray(): FormArray {
    return this.certificacionesFormGroup.get('certificaciones') as FormArray;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.trayectos, event.previousIndex, event.currentIndex);
    this.initializeTrayectosFormGroup();
    this.initializeCertificacionesFormGroup();
    console.log('Nuevo orden de trayectos:', this.trayectos);
  }

  addTrayectosAutomatically() {
    const tipoPlan = this.programFormGroup.get('tipo_plan')?.value || '';
    const duracion = this.programFormGroup.get('duracion')?.value || 0;
    const regimen = this.programFormGroup.get('regimen')?.value || '';
    const tieneTransicion = this.programFormGroup.get('tieneTransicion')?.value || false;
  
    this.trayectos = [];
    this.semestralTrayectos = []; // Array adicional para manejar semestres
  
    if (tipoPlan === '02') {
      this.trayectos.push('Trayecto 0');
      if (regimen === '02') {
        this.semestralTrayectos.push('Semestre 0'); // Mantener Semestre 0
      }
    }
  
    let semestreCount = 1; // Comenzar desde 1 para los años normales
  
    for (let i = 1; i <= duracion; i++) {
      this.trayectos.push(`${tipoPlan === '02' ? 'Trayecto' : 'Año'} ${i}`);
      if (regimen === '02') {
        this.semestralTrayectos.push(`Semestre ${semestreCount++}`);
        this.semestralTrayectos.push(`Semestre ${semestreCount++}`);
      }
    }
  
    if (tipoPlan === '02' && tieneTransicion) {
      this.trayectos.push('Transición');
      if (regimen === '02') {
        this.semestralTrayectos.push(`Semestre ${semestreCount++}`);
        this.semestralTrayectos.push(`Semestre ${semestreCount++}`);
      }
    }
  
    this.initializeTrayectosFormGroup();
    this.initializeSemestralTrayectosFormGroup(); // Inicializar los semestres
    console.log('trayectos:', this.trayectos);
    console.log('semestralTrayectos:', this.semestralTrayectos); // Log adicional para ver los semestres generados
  }
  
  initializeTrayectosFormGroup() {
    const trayectosArray = this.trayectosFormArray;
    trayectosArray.clear();
    console.log('Inicializando trayectosFormArray');
  
    this.trayectos.forEach((trayecto, index) => {
      trayectosArray.push(this.formBuilder.group({
        nombre: [trayecto, Validators.required]
      }));
      console.log(`Trayecto ${index}: ${trayecto}`);
    });
  
    this.initializeCertificacionesFormGroup();
    console.log('trayectosFormArray:', this.trayectosFormArray.value);
  }
  
  initializeSemestralTrayectosFormGroup() {
    const semestralTrayectosArray = this.semestralTrayectosFormArray;
    semestralTrayectosArray.clear();
    console.log('Inicializando semestralTrayectosFormArray');
  
    this.semestralTrayectos.forEach((semestre, index) => {
      semestralTrayectosArray.push(this.formBuilder.group({
        nombre: [semestre, Validators.required]
      }));
      console.log(`Semestre ${index}: ${semestre}`);
    });
  
    console.log('semestralTrayectosFormArray:', this.semestralTrayectosFormArray.value);
  }
  

  initializeCertificacionesFormGroup() {
    const certificacionesArray = this.certificacionesFormArray;
    certificacionesArray.clear();
    console.log('Inicializando certificacionesFormArray');

    if (this.programFormGroup.get('tipo_plan')?.value === '01') {
      const lastYear = this.trayectos[this.trayectos.length - 1];
      console.log(lastYear);
      const group = this.formBuilder.group({
        nombre: ['', Validators.required],
        anio: [lastYear, Validators.required],
        tipo: ['Titulación', Validators.required]
      });

      certificacionesArray.push(group);
      console.log(`Añadido control para Carrera: ${lastYear}`);
    } else if (this.programFormGroup.get('tipo_plan')?.value === '02') {
      this.trayectos.forEach((trayecto, index) => {
        if (trayecto !== 'Trayecto 0' && trayecto !== 'Transición') {
          const group = this.formBuilder.group({
            nombre: ['', Validators.required],
            anio: [trayecto, Validators.required],
            tipo: ['', Validators.required],
            mencion: [false]
          });

          group.get('mencion')?.valueChanges.subscribe(() => {
            this.certificacionesFormGroup.updateValueAndValidity();
          });

          certificacionesArray.push(group);
          console.log(`Añadido control para PNF: ${trayecto}`);
        }
      });
    }

    console.log('certificacionesFormArray:', this.certificacionesFormArray.value);
    this.certificacionesFormGroup.updateValueAndValidity();
  }

  onEstatusChange(event: any) {
    const estatus = event.value;
    const fechaFinControl = this.programFormGroup.get('fecha_fin');
    if (estatus === 'Activo') {
      fechaFinControl?.setValue('');
      fechaFinControl?.clearValidators();
      fechaFinControl?.disable();
      this.isFechaFinEnabled = false;
    } else if (estatus === 'Cerrado') {
      fechaFinControl?.enable();
      fechaFinControl?.setValidators([Validators.required]);
      this.isFechaFinEnabled = true;
    } else {
      fechaFinControl?.setValue('');
      fechaFinControl?.clearValidators();
      fechaFinControl?.disable();
      this.isFechaFinEnabled = false;
    }
    fechaFinControl?.updateValueAndValidity();
  }



  updateCertificacionesValidations() {
    const tipoPlan = this.programFormGroup.get('tipo_plan')?.value;
    const certificacionesArray = this.certificacionesFormArray;
    console.log(`Cambio de plan a: ${tipoPlan}`);
    certificacionesArray.clearValidators();

    if (tipoPlan === '01') {
      const lastYear = this.trayectos[this.trayectos.length - 1];
      const group = this.formBuilder.group({
        nombre: ['', Validators.required],
        anio: [lastYear, Validators.required],
        tipo: ['Titulación', Validators.required]
      });
      certificacionesArray.push(group);
    } else if (tipoPlan === '02') {
      this.trayectos.forEach(trayecto => {
        if (trayecto !== 'Trayecto 0' && trayecto !== 'Transición') {
          certificacionesArray.push(this.formBuilder.group({
            nombre: ['', Validators.required],
            anio: [trayecto, Validators.required],
            tipo: ['', Validators.required],
            mencion: [false]
          }));
        }
      });
    }

    this.certificacionesFormGroup.updateValueAndValidity();
  }



  onNextStep(stepper: MatStepper): void {
    this.addTrayectosAutomatically();
    console.log('Pasando al siguiente paso');
    stepper.next();
  }


  validateMencion() {
    if (this.programFormGroup.get('tipo_plan')?.value === '02' && this.programFormGroup.get('tieneMencion')?.value) {
      const atLeastOneMencion = this.certificacionesFormArray.controls.some(control => control.get('mencion')?.value === true);
      return atLeastOneMencion;
    }
    return true;
  }


  isStep3Valid() {
    const formValid = this.certificacionesFormGroup.valid;
    const mencionValid = this.validateMencion();
    console.log(`Form Valid: ${formValid}, Mencion Valid: ${mencionValid}`);
    return formValid && mencionValid;
  }

  onNextStep4(stepper: MatStepper): void {
    console.log('Pasando al último paso');
    stepper.next();
  }

  getRegimenDescripcion(): string {
    const regimenOri = this.programFormGroup.get('regimen')?.value;
    const regimen = this.regimen.find(option => option.codelemento === regimenOri);
    return regimen ? regimen.descripcion : regimenOri;
  }
  
  getTipoPlanDescripcion(): string {
    const tipoPlan = this.programFormGroup.get('tipo_plan')?.value;
    const tipo = this.tipoprograma.find(option => option.codelemento === tipoPlan);
    return tipo ? tipo.descripcion : tipoPlan;
  }
  
  getAfiliacionDescripcion(): string {
    const afiliacion = this.programFormGroup.get('afiliacion')?.value;
    const afiliacionDesc = this.tipoafiliacion.find(option => option.codelemento === afiliacion);
    return afiliacionDesc ? afiliacionDesc.descripcion : afiliacion;
  }
  
  getEstatusDescripcion(): string {
    const estatus = this.programFormGroup.get('estatus')?.value;
    return this.estatusOptions.find(option => option === estatus) || estatus;
  }

  removeCertificacion(index: number) {
    this.certificacionesFormArray.removeAt(index);
    this.certificacionesFormGroup.updateValueAndValidity();
  }


}
