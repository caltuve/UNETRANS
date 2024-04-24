import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'


interface RespuestaServidor {
  success?: boolean;
  error?: string;
}

@Component({
  selector: 'app-modificar-uc-modal',
  templateUrl: './modificar-uc-modal.component.html',
  styleUrls: ['./modificar-uc-modal.component.scss']
})
export class ModificarUcModalComponent implements OnInit {

  @Output() actualizacionCompleta = new EventEmitter<void>();

  firstFormGroup: FormGroup;
  ucBase: any; // Ajusta según el tipo de dato de tu estudiante
  inscrito: boolean = false;
  inscripcion: any []= [];

  usrsice: string;

  constructor(public modalRef: BsModalRef,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder) {
      this.obtenerUsuarioActual();
     }

  ngOnInit(): void {

    this.firstFormGroup = this.fb.group({
      id_uc: [''],
      codigo_uc: [''],
      nombre_uc: [''], // Inicializa con valores vacíos o predeterminados
      creditos: [''],
      hta: [''],
      hti: [''],
      htl: [''],
      usrsice: [''],
      // Añade aquí otros campos necesarios
    });
    if (this.ucBase) {
      this.firstFormGroup.patchValue({
        id_uc: this.ucBase.id_uc,
        codigo_uc: this.ucBase.codigo_uc,
        nombre_uc: this.ucBase.nombre_uc,
        creditos: this.ucBase.creditos,
        hta: this.ucBase.hta,
        hti: this.ucBase.hti,
        htl: this.ucBase.htl,
        usrsice: this.usrsice
        // Asegúrate de convertir las fechas de string a objetos Date según sea necesario
        // Añade aquí otros campos según corresponda
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }


  enviarDatos() {
    this.SpinnerService.show();
    if (this.firstFormGroup.valid) {
      this.controlestudiosService.actualizarDatosUc(this.firstFormGroup.value).subscribe({
        next: (response: RespuestaServidor) => {
          if (response.success) {
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showSuccess('Datos de la UC han sido actualizados correctamente.');
            this.actualizacionCompleta.emit(); // Emite el evento
            
          } else if (response.error) {
            
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showError(`Error al actualizar los datos: ${response.error}`);
            this.actualizacionCompleta.emit(); // Emite el evento
          }
        },
        error: (error) => {
          this.notifyService.showError('Error al enviar los datos al servidor.');
          this.closeModal();
        }
      });
  }
}

obtenerUsuarioActual() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  this.usrsice = currentUser.usrsice;
}

}
