import { Component } from '@angular/core';
import { LoginService } from './../login/login.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-expiry-modal',
  templateUrl: './session-expiry-modal.component.html',
  styleUrls: ['./session-expiry-modal.component.scss']
})
export class SessionExpiryModalComponent {

  bsModalRef: BsModalRef;
  private timeout: any;

  constructor(public loginService: LoginService,
     public modalRef: BsModalRef ) {}


  ngOnInit() {
    this.setTimeout(); // Iniciar temporizador cuando el modal se abre
  }

  setTimeout() {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.modalRef.hide();
      this.loginService.logoutInactivity(); // Cerrar sesión automáticamente
    }, 10000); // Tiempo en milisegundos (30 segundos en este caso)
  }

  extendSession() {
    this.clearTimeout();
    this.loginService.extendSession(); // Lógica para extender la sesión
    this.modalRef.hide();
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  ngOnDestroy() {
    this.clearTimeout(); // Asegurarse de limpiar el temporizador
  }
}
