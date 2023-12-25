import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl   } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-add-unidad-curricular-modal',
  templateUrl: './add-unidad-curricular-modal.component.html',
  styleUrls: ['./add-unidad-curricular-modal.component.scss']
})
export class AddUnidadCurricularModalComponent {

  actualizacionCompleta: EventEmitter<{ completo: boolean; trayectoActual: string; semestreActual: number | null; mencion: string | null }> = new EventEmitter();
  datosPrograma: any; // O un tipo más específico si es posible
  unidadCurricularForm: FormGroup;
  trayectoId: string;
  semestreNumero: number | null;
  codigoPlan: string; // Asegúrate de que el tipo de 'codigoPlan' sea correcto
  mencion: string | null; // Asegúrate de que el tipo de 'codigoPlan' sea correcto

constructor(private fb: FormBuilder, 
            public bsModalRef: BsModalRef,
            public controlestudiosService: ControlEstudiosService,
            private SpinnerService: NgxSpinnerService,
            private notifyService : NotificacionService,) {}

ngOnInit(): void {
  // Inicializar el formulario
  this.unidadCurricularForm = this.fb.group({
    codigo_uc: '',
    nombre_uc: '',
    creditos: '',
    HTA: '',
    HTI: '',
    HTL: '',
    tienePrelaciones: false,
    esElectiva: false,
    prelaciones: this.fb.array([]),
    esProyecto: false,
    nota_min_aprobatoria: 12, // Valor predeterminado para unidades no proyecto
    trayectoId: '', // Añadir estos campos al formulario
    semestreNumero: '',
    mencion: '',
    codigoPlan: ''
  });

  setTimeout(() => {
    if (this.bsModalRef.content) {
      this.trayectoId = this.bsModalRef.content.trayectoId;
      this.semestreNumero = this.bsModalRef.content.semestreNumero;
      this.codigoPlan = this.bsModalRef.content.codigoPlan;
      this.mencion = this.bsModalRef.content.mencionActual;
  
      this.unidadCurricularForm.patchValue({
        trayectoId: this.trayectoId,
        semestreNumero: this.semestreNumero,
        codigoPlan: this.codigoPlan,
        mencion: this.mencion
      });
    }
  }, 0);

  // Suscripciones a cambios en el formulario
  this.subscribeToFormChanges();
}

// Método para suscribirse a cambios en el formulario
subscribeToFormChanges(): void {
  // Observar cambios en 'tienePrelaciones'
  this.unidadCurricularForm.get('tienePrelaciones')?.valueChanges.subscribe(tienePrelaciones => {
    // Lógica para manejar prelaciones
    // ...
  });

  // Observar cambios en 'esProyecto'
  this.unidadCurricularForm.get('esProyecto')?.valueChanges.subscribe(esProyecto => {
    const notaMinima = esProyecto ? 16 : 12;
    this.unidadCurricularForm.get('nota_min_aprobatoria')?.setValue(notaMinima);
  });
}

  // Método para crear un FormGroup para una prelación
crearPrelacionForm(): FormGroup {
  return this.fb.group({
    codigo_uc_prelacion: ''
  });
}

  get prelacionesFormArray(): FormArray {
    return this.unidadCurricularForm.get('prelaciones') as FormArray;
  }

  agregarPrelacion(): void {
    const prelacionFormGroup = this.fb.group({
      codigo_uc_prelacion: ['', Validators.required]
    });
    this.prelacionesFormArray.push(prelacionFormGroup);
  }

  onSubmit(): void {
    if (!this.unidadCurricularForm.valid) {
      console.error('El formulario no es válido.');
      return;
    }
    this.SpinnerService.show(); 
    // Recolectar los datos del formulario
    const datosFormulario = this.unidadCurricularForm.value;
    // Enviar datos al backend
    //console.log(datosFormulario);
  this.controlestudiosService.agregarUnidadCurricular(datosFormulario).subscribe(
    response => {
      
      // Aquí puedes manejar la respuesta, como mostrar un mensaje al usuario
      this.actualizacionCompleta.emit({ completo: true, trayectoActual: this.trayectoId, semestreActual: this.semestreNumero, mencion: this.mencion });
      this.notifyService.showSuccess('Unidad curricular cargada');
    this.bsModalRef.hide(); // Cerrar modal
    this.SpinnerService.hide(); 
    },
    error => {
      console.error('Error al enviar datos al servidor:', error);
      // Manejo de errores, por ejemplo, mostrar un mensaje de error
      this.actualizacionCompleta.emit({ completo: true, trayectoActual: this.trayectoId, semestreActual: this.semestreNumero, mencion: this.mencion });
      this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
    this.bsModalRef.hide(); // Cerrar modal
    this.SpinnerService.hide(); 
    }
  );
  }
}
