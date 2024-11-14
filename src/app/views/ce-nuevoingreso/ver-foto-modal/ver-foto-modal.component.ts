import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NotificacionService } from './../../../notificacion.service'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ver-foto-modal',
  templateUrl: './ver-foto-modal.component.html',
  styleUrls: ['./ver-foto-modal.component.scss']
})
export class VerFotoModalComponent implements OnInit {
  @Input() solicitud: any;
  @Input() foto: string;
  @Output() onAction = new EventEmitter<{ aprobado: boolean; motivo?: string }>();
  @Input() soloVisualizacion: boolean = false; // Indica si es modo de solo visualización

  motivoRechazoForm: FormGroup;  // Agrega el FormGroup para los motivos de rechazo

  usrsice: string;
  nombre_completo: string;
  nombre_corto: string;
  cedula: number;
  email: string;

  // En el archivo TS del componente (ver-foto-modal.component.ts)
motivosList = [
  { controlName: 'sinObjetos', label: 'La fotografía contiene objetos en el rostro o cabeza.' },
  { controlName: 'fondoIncorrecto', label: 'El fondo de la fotografía no es blanco.' },
  { controlName: 'recortada', label: 'La fotografía se encuentra recortada.' },
  { controlName: 'noEsPersona', label: 'La imagen no corresponde a una persona.' },
  { controlName: 'poseIncorrecta', label: 'La persona no está de frente (no debe estar de lado ni en modo selfie).' },
  { controlName: 'cabezaCortada', label: 'La fotografía corta parte de la cabeza.' },
  { controlName: 'fotoReimpresa', label: 'La foto parece una foto de otra fotografía tipo carnet.' }
];


  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    public controlEstudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    // Inicializar el FormGroup con los motivos de rechazo
    this.motivoRechazoForm = this.fb.group({
      sinObjetos: [false],
      fondoIncorrecto: [false],
      recortada: [false],
      noEsPersona: [false],
      poseIncorrecta: [false],
      cabezaCortada: [false],
      fotoReimpresa: [false]
    });
  
    // Monitorizar los cambios para actualizar el estado del botón
    this.motivoRechazoForm.valueChanges.subscribe(() => {
      this.tieneMotivosSeleccionados();
    });
  }
  
  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.nombre_completo = currentUser.nombre_completo;
    this.nombre_corto = currentUser.nombre_corto;
    this.cedula = currentUser.cedula;
    this.email = currentUser.email;
  }

  aprobar(): void {
    this.SpinnerService.show();
    this.controlEstudiosService.actualizarFoto({
      usrsice: this.usrsice,
      codpersona: this.solicitud.codpersona,
      nombre_completo: this.nombre_completo,
      nombre_corto: this.nombre_corto,
      email: this.email,
      estatus: 2,
      motivo_rechazo: null
    }).subscribe(
      () => {
        this.notifyService.showSuccess('Foto aprobada exitosamente.');
        this.onAction.emit({ aprobado: true });
        this.bsModalRef.hide();
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al aprobar la foto:', error);
        this.notifyService.showError('Hubo un error al aprobar la foto. Intente nuevamente.');
      }
    );
  }

  rechazar(): void {
    this.SpinnerService.show();

    // Obtener los labels de los motivos seleccionados
    const motivosSeleccionados = Object.entries(this.motivoRechazoForm.value)
      .filter(([_, seleccionado]) => seleccionado)
      .map(([motivo]) => this.motivosList.find(m => m.controlName === motivo)?.label)
      .join(', ');

    this.controlEstudiosService.actualizarFoto({
      usrsice: this.usrsice,
      codpersona: this.solicitud.codpersona,
      nombre_completo: this.nombre_completo,
      nombre_corto: this.nombre_corto,
      email: this.email,
      estatus: 3,
      motivo_rechazo: motivosSeleccionados
    }).subscribe(
      () => {
        this.notifyService.showWarning('Foto rechazada. Motivo(s): ' + motivosSeleccionados);
        this.onAction.emit({ aprobado: false, motivo: motivosSeleccionados });
        this.bsModalRef.hide();
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al rechazar la foto:', error);
        this.notifyService.showError('Hubo un error al rechazar la foto. Intente nuevamente.');
        this.SpinnerService.hide();
      }
    );
}


  tieneMotivosSeleccionados(): boolean {
    // Verifica si algún motivo de rechazo está seleccionado
    return Object.values(this.motivoRechazoForm.value).some(seleccionado => seleccionado);
  }
  
}
