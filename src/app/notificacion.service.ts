import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string | undefined){
    this.toastr.success(message, '¡Proceso exitoso!', {
      progressBar : true,
      progressAnimation : 'decreasing',
      timeOut: 10000
    })
}

showError(message: string | undefined){
    this.toastr.error(message, '¡UPS! Ha ocurrido un error', {
      progressBar : true,
      progressAnimation : 'decreasing',
      timeOut: 10000
    })
}

showInfo(message: string | undefined,){
    this.toastr.info(message, '¡Información!', {
      progressBar : true,
      progressAnimation : 'decreasing',
      timeOut: 10000,
      enableHtml: true,
    })
}

showInfoMtto(message: string | undefined,){
  this.toastr.info(message, '¡Mantenimiento!', {
    progressBar : true,
    progressAnimation : 'decreasing',
    timeOut: 15000
  })
}

showInfoRegDoc(message: string | undefined,){
  this.toastr.info(message, '¡Registro pendiente!', {
    progressBar : true,
    progressAnimation : 'decreasing',
    timeOut: 10000
  })
}

showError3(message: string | undefined,){
  this.toastr.error(message, '¡Proceso no autorizado!', {
    progressBar : true,
    progressAnimation : 'decreasing',
    timeOut: 10000
  })
}

showWarning(message: string | undefined){
    this.toastr.warning(message, '¡Alerta!', {
      progressBar : true,
      progressAnimation : 'decreasing',
      timeOut: 10000
    })
}

showError2(message: string | undefined){
  this.toastr.error(message, '¡Notificación!', {
    progressBar : true,
    progressAnimation : 'decreasing',
    timeOut: 10000
  })
}

}
