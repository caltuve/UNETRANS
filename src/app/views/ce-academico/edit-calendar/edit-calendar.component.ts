import { Component,  EventEmitter, Output,OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss']
})
export class EditCalendarComponent implements OnInit{

  @Output() actualizacionCompleta = new EventEmitter<void>();
  calendar: any; // Datos del calendario
  solicitudesPendientes: any[] = []; // Lista de solicitudes pendientes
  solicitudesEncontradas: boolean = false; // Variable de control
  guardarHabilitado: boolean = true; // Control de habilitación del botón de guardar

  constructor(public bsModalRef: BsModalRef,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {
    // Utiliza 'calendar' para precargar los datos en el formulario del modal
  }

  ngOnInit(): void {
    // Al abrir el modal, verificar si hay solicitudes pendientes
    if (this.calendar.id === 7) {
      this.verificarSolicitudesPendientes();
    }
  }

  verificarSolicitudesPendientes() {
    this.controlestudiosService.verifyTSUPendientes().subscribe(response => {
      if (response.resultado === 'OK' && response.datos && response.datos.length > 0) {
        this.solicitudesPendientes = response.datos;
        this.solicitudesEncontradas = true;
        this.guardarHabilitado = false; // Deshabilitar el botón de guardar si hay solicitudes pendientes
      } else {
        this.solicitudesEncontradas = false;
        this.guardarHabilitado = true; // Habilitar el botón si no hay solicitudes
      }
    }, error => {
      console.error('Error al verificar solicitudes pendientes', error);
      this.notifyService.showError('Error al verificar las solicitudes pendientes.');
    });
  }
  

  guardarCambios() {
    if (this.guardarHabilitado) {
      const datosParaEnviar = {
        id: this.calendar.id,
        fec_ini: this.calendar.fec_ini,
        fec_fin: this.calendar.fec_fin
      };

      this.controlestudiosService.actualizarFechasProceso(datosParaEnviar).subscribe(datos => {
        if (datos.estatus === 'OK') {
          this.notifyService.showSuccess('Fechas actualizadas');
          this.bsModalRef.hide();
          this.actualizacionCompleta.emit(); 
        } else {
          this.notifyService.showError2('Ha ocurrido un error, comuníquese con sistemas.');
          this.actualizacionCompleta.emit(); 
        }
      });
    }
  }

}
