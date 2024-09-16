import { Component, OnInit, ChangeDetectorRef , EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-modal-post-migracion-planes-estudios',
  templateUrl: './modal-post-migracion-planes-estudios.component.html',
  styleUrls: ['./modal-post-migracion-planes-estudios.component.scss']
})
export class ModalPostMigracionPlanesEstudiosComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  form: FormGroup;
  programa: any;
  usrsice: string;
  carnet: string;
  rol: any[] = [];
  pnfs: any[] = [];
  planes: any[] = [];
  titulaciones: any[] = [];
  estatusHabilitado = false;

  institucion: any = null;
  autoridades: any[] = [];

  mode: 'edit' | 'create' = 'edit'; 

  constructor(public modalRef: BsModalRef,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
      this.obtenerUsuarioActual();
     }

     ngOnInit(): void {
      // Inicializar el formulario
      this.form = this.fb.group({
        carnet: [this.programa?.carnet || '', Validators.required],
        pnf: [this.programa?.pnf || '', Validators.required],
        plan: [{ value: '', disabled: true }, Validators.required],
        titulacion: [{ value: '', disabled: true }, Validators.required],
        estatus: [this.programa?.estatus || '', Validators.required],
        fecha_grado: [''],
        indice_academico: ['', [Validators.required, Validators.min(10), Validators.max(20)]],
        indice_rendimiento: ['', [Validators.required, Validators.min(10), Validators.max(20)]],
        posicion: [''],
        tomo: [''],
        folio: ['']
      });
  
      this.findCarreras();
    if (this.mode === 'create') {
      this.form.reset();  // Reiniciar el formulario si estamos en modo creación
    } else {
      this.initializeFormWithProgramData();
    }



    this.onProgramaChange(this.programa.pnf);
    
    }
  

  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.rol = currentUser.rol;
  }

  onInputChange(event: any, formControlName: string) {
    const input = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    let numericValue = parseFloat(input) / 100; // Move decimal to appropriate place

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    const formattedInput = numericValue.toFixed(2); // Ensure two decimal places
    this.form.patchValue({ [formControlName]: formattedInput }, { emitEvent: false });

    // Set cursor position to the end
    setTimeout(() => {
      event.target.selectionStart = event.target.value.length;
      event.target.selectionEnd = event.target.value.length;
    }, 0);
  }

  closeModal() {
    this.modalRef.hide();
    this.onClose.emit();
    // const data = { 
    //   //cedula: this.estudianteBase.cedula, 
    //   en_gestion: false, 
    //   gestor: null 
    // };
    // this.controlestudiosService.marcarEnGestion(data).subscribe(
    //   () => {
        
       
    //   },
    //   error => {
    //     console.error('Error al desmarcar solicitud como en gestión:', error);
    //     this.modalRef.hide(); // Asegurarse de cerrar el modal incluso si hay un error
    //   }
    // );
  }

  findCarreras(){
    this.aspiranteService.getCarreras().subscribe(
      (result: any) => {
          this.pnfs = result;
    }
    );
  }

  onProgramaChange(programaId: string) {
    this.planes = [];
    this.titulaciones = [];
    this.form.get('plan')?.reset();
    this.form.get('titulacion')?.reset();
    this.form.get('plan')?.disable();
    this.form.get('titulacion')?.disable();
    this.form.get('estatus')?.disable();
    this.estatusHabilitado = false;
  
    this.controlestudiosService.getPlanesByPrograma(programaId).subscribe(
      (planes: any[]) => {
        const carnet = this.form.get('carnet')?.value || this.carnet;
        const isCarnetSucre = carnet.charAt(2).toUpperCase() === 'S';
  
        if (isCarnetSucre) {
          // Filtrar para mostrar solo los planes con afiliación "MS"
          this.planes = planes.filter(plan => plan.afiliacion === 'MS');
        } else {
          // Filtrar para excluir los planes con afiliación "MS"
          this.planes = planes.filter(plan => plan.afiliacion !== 'MS');
        }
  
        this.form.get('plan')?.enable();
      }
    );
  }

  onPlanChange(planId: string) {
    this.titulaciones = [];
    const titulacionControl = this.form.get('titulacion');
  
    //titulacionControl?.reset();
    titulacionControl?.disable();
    this.form.get('estatus')?.disable();
    this.estatusHabilitado = false;
  
    this.controlestudiosService.getTitulacionesByPlan(planId).subscribe(
      (titulaciones: any[]) => {
        this.titulaciones = titulaciones;
        titulacionControl?.enable();
  
        // Verificar las titulaciones obtenidas
        console.log('Titulaciones obtenidas:', this.titulaciones);
  
        // Verificar el valor de titulacion en el formulario
        const titulacionCode = this.form.get('titulacion')?.value;
        const titulacionCode2 = +this.form.get('titulacion')?.value; // Asegúrate de que es un número

        console.log('Código de titulacion en el formulario:', titulacionCode);
        console.log('Código de titulacion2 en el formulario:', titulacionCode2);
  
        // Verificar si el valor de titulacion está en la lista de titulaciones
        const titulacion = this.titulaciones.find(t => t.codelemento === titulacionCode);
        console.log('Titulacion encontrada:', titulacion);
  
        if (titulacion) {
          titulacionControl?.patchValue(titulacionCode);
        } else {
          console.log('La titulacion actual no está en las titulaciones disponibles.');
        }
      },
      (error) => {
        console.error('Error al cargar titulaciones:', error);
      }
    );
  }
 
    

  onTitulacionChange(titulacionId: string) {
    if (titulacionId) {
      this.form.get('estatus')?.enable();
      this.estatusHabilitado = true;
    } else {
      this.form.get('estatus')?.disable();
      this.estatusHabilitado = false;
    }

    // Invocar onEstatusChange con el valor actual de estatus
  const currentEstatus = this.form.get('estatus')?.value;
  if (currentEstatus) {
    this.onEstatusChange(currentEstatus);
  }
  }

  onEstatusChange(estatus: string) {
    if (estatus === 'Egresado') {
      this.form.get('fecha_grado')?.setValidators([Validators.required]);
      this.form.get('indice_academico')?.setValidators([Validators.required]);
      this.form.get('indice_rendimiento')?.setValidators([Validators.required]);
      this.form.get('posicion')?.setValidators([Validators.required]);
      this.form.get('tomo')?.setValidators([Validators.required]);
      this.form.get('folio')?.setValidators([Validators.required]);
    } else {
      this.form.get('fecha_grado')?.clearValidators();
      this.form.get('indice_academico')?.clearValidators();
      this.form.get('indice_rendimiento')?.clearValidators();
      this.form.get('posicion')?.clearValidators();
      this.form.get('tomo')?.clearValidators();
      this.form.get('folio')?.clearValidators();
    }
    this.form.get('fecha_grado')?.updateValueAndValidity();
    this.form.get('indice_academico')?.updateValueAndValidity();
    this.form.get('indice_rendimiento')?.updateValueAndValidity();
    this.form.get('posicion')?.updateValueAndValidity();
    this.form.get('tomo')?.updateValueAndValidity();
    this.form.get('folio')?.updateValueAndValidity();
  }

  onFechaGradoBlur(event: any) {
    const fechaGrado = event.target.value;
    if (fechaGrado) {
      this.obtenerDatosGraduacion(fechaGrado);
    }
  }

  obtenerDatosGraduacion(fechaGrado: string) {
    this.controlestudiosService.getDatosGraduacion(fechaGrado).subscribe(
      (response: any) => {
        if (response.resultado === 'NOK') {
          this.notifyService.showError(`${response.mensaje}`);
          this.form.get('fecha_grado')?.setErrors({ invalidDate: true });
          this.institucion = null;
          this.autoridades = [];
        } else {
          this.institucion = response.institucion[0];
          this.autoridades = response.autoridades;
          this.form.get('fecha_grado')?.setErrors(null);
        }
      },
      error => {
        console.error('Error al obtener datos de graduación: ', error);
        this.notifyService.showError('Error al obtener datos de graduación.');
        this.form.get('fecha_grado')?.setErrors({ invalidDate: true });
        this.institucion = null;
        this.autoridades = [];
      }
    );
}



actualizarDatos() {
  if (this.form.invalid) {
    return;
  }

  // Mapeo del estatus
  const estatusMap: { [key: string]: number } = {
    'Activo': 1,
    'Egresado': 2,
    'Inactivo': 3,
    'Retirado': 4,
    'Cambiado': 5
  };

  // Obtener el valor del formulario
  const formValue = this.form.value;

  // Crear el objeto de datos a enviar
  const datosActualizados: any = {
    mode: this.mode,
    carnet: this.programa.carnet,
    id_titulacion: this.programa.id_titulacion,
    estatus: estatusMap[formValue.estatus],
    plan: formValue.plan,
    pnf: formValue.pnf,
    titulacion: formValue.titulacion
  };

  // Si el estatus es "Egresado", agregar los campos adicionales
  if (formValue.estatus === 'Egresado') {
    datosActualizados.fecha_grado = formValue.fecha_grado;
    datosActualizados.indice_academico = formValue.indice_academico;
    datosActualizados.indice_rendimiento = formValue.indice_rendimiento;
    datosActualizados.posicion = formValue.posicion;
    datosActualizados.tomo = formValue.tomo;
    datosActualizados.folio = formValue.folio;
    datosActualizados.institucion_id = this.institucion.id_institucion;
    datosActualizados.autoridades_ids = this.autoridades.map(autoridad => autoridad.id_autoridad);
  }

  console.log('Datos a enviar:', datosActualizados);

  if (this.mode === 'edit') {
    this.controlestudiosService.actualizarDatosAcadPM(datosActualizados).subscribe(
      response => {
        this.notifyService.showSuccess('Datos actualizados correctamente');
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar datos: ', error);
        this.notifyService.showError('Error al actualizar datos');
      }
    );
  } else {
    this.controlestudiosService.asignarNuevoPlan(datosActualizados).subscribe(
      response => {
        this.notifyService.showSuccess('Plan asignado correctamente');
        this.closeModal();
      },
      error => {
        console.error('Error al asignar plan: ', error);
        this.notifyService.showError('Error al asignar plan');
      }
    );
  }
}


private initializeFormWithProgramData3() {
  // Inicializar el formulario con los datos del programa
  this.form.patchValue({
    pnf: this.programa?.pnf || '',
    plan: this.programa?.plan || '',
    titulacion: this.programa?.titulacion || '',
    estatus: this.programa?.estatus || '',
    fecha_grado: this.programa?.fecha_grado || '',
    indice_academico: this.programa?.indice_academico || '',
    indice_rendimiento: this.programa?.indice_rendimiento || '',
    posicion: this.programa?.posicion || '',
    tomo: this.programa?.tomo || '',
    folio: this.programa?.folio || ''
  });
}

initializeFormWithProgramData(): void {
  if (this.programa?.id_titulacion) {
    this.controlestudiosService.getDetallesPlanPM({ id_titulacion: this.programa.id_titulacion }).subscribe(
      (data: any) => {
        console.log('Datos obtenidos:', data);

        // Mapeo para conversión de número a texto
const estatusReverseMap: { [key: number]: string } = {
  1: 'Activo',
  2: 'Egresado',
  3: 'Inactivo',
  4: 'Retirado',
  5: 'Cambiado'
};

const estatusText = estatusReverseMap[data[0]?.estatus] || '';
        
        // Establecer valores en el formulario
        this.form.setValue({
          carnet: data[0]?.carnet || '',
          pnf: data[0]?.pnf || '',
          plan: data[0]?.plan || '',
          titulacion: data[0]?.titulacion || '', // Establecer el valor del código de titulacion
          estatus: estatusText  || '', 
          fecha_grado: data[0]?.fecha_grado || '',
          indice_academico: data[0]?.indice_academico || '',
          indice_rendimiento: data[0]?.indice_rendimiento || '',
          posicion: data[0]?.posicion || '',
          tomo: data[0]?.tomo || '',
          folio: data[0]?.folio || ''
        });
        // Verifica el valor después de establecerlo
        console.log('Valor de titulacion en el formulario después de setValue:', this.form.get('titulacion')?.value);

        setTimeout(() => {
          this.onPlanChange(data[0]?.plan);
        }, 0);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }
}


}
