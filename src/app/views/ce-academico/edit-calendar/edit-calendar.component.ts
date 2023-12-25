import { Component,  EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss']
})
export class EditCalendarComponent {

  @Output() actualizacionCompleta = new EventEmitter<void>();
  calendar: any; // Aquí se almacenan los datos pasados al modal

  constructor(public bsModalRef: BsModalRef,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {
    // Utiliza 'calendar' para precargar los datos en el formulario del modal
  }

  

  guardarCambios() {
    const datosParaEnviar = {
      id: this.calendar.id,
      fec_ini: this.calendar.fec_ini,
      fec_fin: this.calendar.fec_fin
      // Añadir más campos si es necesario
    };
  
    this.controlestudiosService.actualizarFechasProceso(datosParaEnviar).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
              this.bsModalRef.hide(); 
              this.actualizacionCompleta.emit(); // Emite el evento
              break;
        default:
          this.SpinnerService.hide(); 
          this.notifyService.showSuccess('Fechas actualizadas');
          this.bsModalRef.hide();
          this.actualizacionCompleta.emit(); // Emite el evento
          break;
      }
      });
  }
}
