import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventserviceService } from '../eventservice.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-modal-detalle-votante',
  templateUrl: './modal-detalle-votante.component.html',
  styleUrls: ['./modal-detalle-votante.component.scss']
})
export class ModalDetalleVotanteComponent {
  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante

  constructor(public modalRef: BsModalRef,
    public eventserviceService: EventserviceService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    ) {}

    registrarVoto(voto: boolean) {
      const votoData = {
        cedula: this.estudianteBase.cedula,
        voto: voto      // Otros datos que desees enviar
      };
  
      this.eventserviceService.saveVoto(votoData).subscribe(
        data => {
          if (data.resultado === 'OK') {
            this.notifyService.showSuccess('Se ha registrado exitosamente su respuesta');
            this.closeModal();
          } else {
            this.notifyService.showError('Ha ocurrido un error al guardar la respuesta');
          }
        },
        error => {
          this.notifyService.showError(`Error al registrar la respuesta: ${error}`);
        }
      );
    }

  closeModal() {
    this.modalRef.hide();
  }

}
