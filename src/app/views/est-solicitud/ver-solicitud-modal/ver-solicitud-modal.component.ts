import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-ver-solicitud-modal',
  templateUrl: './ver-solicitud-modal.component.html',
  styleUrls: ['./ver-solicitud-modal.component.scss']
})
export class VerSolicitudModalComponent implements OnInit {

  documentos: any[] = []; // Array para guardar los documentos solicitados
  solicitud: any; // Solicitud que se pasa al modal

  constructor(
    public bsModalRef: BsModalRef,
    public controlEstudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    // Asegurarse de que la solicitud ha sido pasada correctamente
    if (this.solicitud && this.solicitud.id_solicitud) {
      this.buscarDocumentos(this.solicitud.id_solicitud);
    } else {
      console.error('No se pasó una solicitud válida al modal.');
    }
  }

  // Función para buscar los documentos por el id_solicitud
  buscarDocumentos(idSolicitud: number) {
    this.SpinnerService.show(); // Mostrar spinner mientras se buscan los documentos
    this.controlEstudiosService.getDetalleSolicitud(idSolicitud).subscribe(
      (data: any) => {
        this.documentos = data.datos; // Asegúrate de ajustar según la estructura de datos devuelta por la API
        this.SpinnerService.hide(); // Ocultar el spinner
      },
      error => {
        this.notifyService.showError('Error al obtener los documentos de la solicitud');
        this.SpinnerService.hide(); // Ocultar el spinner en caso de error
        console.error('Error al obtener los documentos de la solicitud:', error);
      }
    );
  }

  close(): void {
    this.bsModalRef.hide(); // Cierra el modal
  }

}
