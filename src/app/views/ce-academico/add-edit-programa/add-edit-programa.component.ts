import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';

@Component({
  selector: 'app-add-edit-programa',
  templateUrl: './add-edit-programa.component.html',
  styleUrls: ['./add-edit-programa.component.scss']
})
export class AddEditProgramaComponent implements OnInit {

  @Output() actualizacionCompleta = new EventEmitter<void>();
  title: string; // Puedes recibir el título desde el initialState
  departamentos: any []= [];
  situacion: any []= [];
  tprograma: any []= [];
  periodicidad: any []= [];
  tcertificacion: any []= [];
  programaForm: FormGroup;
  mostrarMenciones: boolean = false;

  constructor(private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {

  }

  
  get mencionesFormArray() {
    return this.programaForm.get('menciones') as FormArray;
  }

  get certificacionesFormArray() {
    return this.programaForm.get('certificaciones') as FormArray;
  }

  agregarMencion(): void {
    this.mencionesFormArray.push(this.crearMencion());
  }

  crearMencion(): FormGroup {
    return this.fb.group({
      cod_mencion: '',
      nombre_mencion: '',
      estatus: 'activo',
    });
  }

  agregarCertificacion(): void {
    this.certificacionesFormArray.push(this.crearCertificacion());
  }

  crearCertificacion(): FormGroup {
    return this.fb.group({
      anio: '',
      tipo_certificacion: '',
      titulo_certificacion: ''
    });
  }

  onSubmit() {
    // Recolectar los datos del grupo 'datosPrograma'
  const datosProgramaGroup = this.programaForm.get('datosPrograma');
  if (!datosProgramaGroup) {
    console.error('Error: El grupo de formulario datosPrograma no está disponible.');
    return;
  }
  const datosPrograma = datosProgramaGroup.value;

  // Recolectar las menciones
  const menciones = this.programaForm.get('menciones')?.value || [];

  // Recolectar las certificaciones
  const certificaciones = this.programaForm.get('certificaciones')?.value || [];

  // Estructurar todos los datos en un solo objeto
  const datosFormularioCompleto = {
    datosPrograma,
    menciones,
    certificaciones
  };
  // Enviar todos los datos al backend
  this.enviarDatosPrograma(datosFormularioCompleto);
}

  onCheckboxChange(e: any): void {
    this.mostrarMenciones = e.checked;
    if (!this.mostrarMenciones) {
      // Limpia las menciones existentes cuando se desactiva el checkbox
      while (this.mencionesFormArray.length > 0) {
        this.mencionesFormArray.removeAt(0);
      }
    }
  }

  eliminarMencion(index: number): void {
    this.mencionesFormArray.removeAt(index);
  }

  eliminarCertificacion(index: number): void {
    this.certificacionesFormArray.removeAt(index);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  ngOnInit(): void {
    // Inicializar el formulario reactivo
    this.programaForm = this.fb.group({
      datosPrograma: this.fb.group({
        nombre_programa: [''],
        dpto_adscrito: [''],
        tipo_programa: [''], // Agrega valor por defecto si es necesario
        periodicidad: [''], // Agrega valor por defecto si es necesario
        estatus: [''],   // Usa una cadena para estatus como 'A' o 'I'
        vig_desde: [''],    // Puedes usar new FormControl(new Date()) para la fecha actual
        codigo_opsu: [null],
        vig_hasta: [{ value: '', disabled: false }],
      }),
      menciones: this.fb.array([]),
      certificaciones: this.fb.array([])
    });
  
    // Suscribirse a cambios en el valor de 'estatus' y aplicar la lógica
    const estatusControl = this.programaForm.get('datosPrograma.estatus');
    if (estatusControl) {
      estatusControl.valueChanges.subscribe(estatus => {
        const vigHastaControl = this.programaForm.get('datosPrograma.vig_hasta');
        if (vigHastaControl) {
          if (estatus === 'A') { // Suponiendo que 'A' significa 'Activo'
            vigHastaControl.disable();
          } else {
            vigHastaControl.enable();
          }
        }
      });
  
      // Aplicar la lógica inicialmente en caso de que 'estatus' tenga un valor predeterminado
      this.actualizarEstadoVigHasta(estatusControl.value);
    }
  
    // Cargar datos iniciales
    this.findDepartamentos();
    this.findSituacion();
    this.findTipoPrograma();
    this.findPeriodicidad();
    this.findTipoCertificacion();
  }
  
  // Método para actualizar el estado de 'vig_hasta' basado en 'estatus'
  private actualizarEstadoVigHasta(estatus: string) {
    const vigHastaControl = this.programaForm.get('datosPrograma.vig_hasta');
    if (vigHastaControl) {
      if (estatus === 'A') {
        vigHastaControl.disable();
      } else {
        vigHastaControl.enable();
      }
    }
  }

  findDepartamentos() {
    this.controlestudiosService.getDepartamentos().subscribe(
      (result: any) => {
        this.departamentos = result;
      }
    );
    }

    findSituacion() {
      this.controlestudiosService.getSituacion().subscribe(
        (result: any) => {
          this.situacion = result;
        }
      );
      }

findTipoPrograma() {
      this.controlestudiosService.getTipoPrograma().subscribe(
        (result: any) => {
          this.tprograma = result;
        }
      );
      }

findPeriodicidad() {
      this.controlestudiosService.getPeriodicidad().subscribe(
        (result: any) => {
          this.periodicidad = result;
        }
      );
      }

      findTipoCertificacion() {
        this.controlestudiosService.getTipoCertificacion().subscribe(
          (result: any) => {
            this.tcertificacion = result;
          }
        );
        }


      enviarDatosPrograma(datosPrograma: any) {
        this.SpinnerService.show(); 
        this.controlestudiosService.crearPrograma(datosPrograma).subscribe(
          datos => {
            switch (datos['estatus']) {
              case 'ERROR':
                    this.SpinnerService.hide(); 
                    this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
                    this.bsModalRef.hide();
                    this.actualizacionCompleta.emit(); // Emite el evento
                    break;
              default:
                this.SpinnerService.hide(); 
                this.notifyService.showSuccess('Programa ha sido añadido');
                this.bsModalRef.hide();
                this.actualizacionCompleta.emit(); // Emite el evento
                break;
            }
          });
      }

}
